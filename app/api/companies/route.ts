import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const companies = await prisma.company.findMany({
      include: {
        _count: {
          select: {
            reviews: true,
            staff: true
          }
        },
        reviews: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: {
            mentions: {
              include: {
                staff: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedCompanies = companies.map(company => ({
      id: company.id,
      name: company.name,
      description: company.description,
      address: company.address,
      googlePlaceId: company.googlePlaceId,
      website: company.website,
      industry: company.industry,
      stats: {
        totalReviews: company._count.reviews,
        totalStaff: company._count.staff,
        averageRating: company.reviews.length > 0 
          ? Math.round((company.reviews.reduce((sum, review) => sum + review.rating, 0) / company.reviews.length) * 10) / 10
          : 0
      },
      recentReviews: company.reviews.map(review => ({
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
    }))

    return NextResponse.json({
      success: true,
      count: companies.length,
      companies: formattedCompanies
    })

  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
