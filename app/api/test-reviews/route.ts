import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Get the demo company
    const company = await prisma.company.findUnique({
      where: { id: 'demo-company' },
      include: {
        reviews: true,
        staff: true,
        _count: {
          select: {
            reviews: true,
            staff: true
          }
        }
      }
    })

    if (!company) {
      return NextResponse.json({ error: 'Demo company not found' }, { status: 404 })
    }

    // Get recent reviews with mentions
    const recentReviews = await prisma.review.findMany({
      where: { companyId: company.id },
      include: {
        mentions: {
          include: {
            staff: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    })

    // Calculate some stats
    const totalReviews = company._count.reviews
    const totalStaff = company._count.staff
    const averageRating = company.reviews.length > 0 
      ? company.reviews.reduce((sum, review) => sum + review.rating, 0) / company.reviews.length 
      : 0

    const sentimentCounts = company.reviews.reduce((acc, review) => {
      acc[review.sentiment || 'NEUTRAL'] = (acc[review.sentiment || 'NEUTRAL'] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      company: {
        id: company.id,
        name: company.name,
        description: company.description,
        address: company.address,
        googlePlaceId: company.googlePlaceId,
        website: company.website,
        industry: company.industry
      },
      stats: {
        totalReviews,
        totalStaff,
        averageRating: Math.round(averageRating * 10) / 10,
        sentimentCounts
      },
      recentReviews: recentReviews.map(review => ({
        id: review.id,
        title: review.title,
        content: review.content,
        rating: review.rating,
        source: review.source,
        authorName: review.authorName,
        sentiment: review.sentiment,
        createdAt: review.createdAt,
        mentions: review.mentions.map(mention => ({
          id: mention.id,
          staffName: mention.staff.name,
          context: mention.context,
          sentiment: mention.sentiment
        }))
      }))
    })

  } catch (error) {
    console.error('Error fetching demo data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
