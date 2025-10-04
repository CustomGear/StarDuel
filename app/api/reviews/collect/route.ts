import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { GoogleReviewsService } from '@/lib/google-reviews'
import { MentionDetectionService } from '@/lib/mention-detection'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { businessInfo } = await request.json()

    if (!businessInfo) {
      return NextResponse.json(
        { message: 'Business information is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    let reviews = []

    if (apiKey && apiKey !== 'demo-google-places-api-key' && businessInfo.googlePlaceId) {
      // Use real Google Reviews API
      const googleService = new GoogleReviewsService(apiKey)
      const googleReviews = await googleService.getPlaceReviews(businessInfo.googlePlaceId)
      
      reviews = googleReviews.map(review => 
        googleService.convertGoogleReview(review, businessInfo.googlePlaceId, businessInfo.name)
      )
    } else {
      // Generate mock reviews for demo
      reviews = [
        {
          id: `mock_${Date.now()}_1`,
          title: 'Great experience!',
          content: 'Sarah was an amazing manager. She made sure our experience was perfect. The food was delicious and Mike was very attentive to our needs.',
          rating: 5,
          source: 'GOOGLE',
          sourceId: `mock_${Date.now()}_1`,
          sourceUrl: null,
          authorName: 'John Smith',
          authorEmail: null,
          sentiment: 'POSITIVE',
          createdAt: new Date()
        },
        {
          id: `mock_${Date.now()}_2`,
          title: 'Good food, friendly staff',
          content: 'Mike was very friendly and helpful. The restaurant has a nice atmosphere and the food was good.',
          rating: 4,
          source: 'GOOGLE',
          sourceId: `mock_${Date.now()}_2`,
          sourceUrl: null,
          authorName: 'Lisa Brown',
          authorEmail: null,
          sentiment: 'POSITIVE',
          createdAt: new Date()
        },
        {
          id: `mock_${Date.now()}_3`,
          title: 'Could be better',
          content: 'The food was okay but the service was slow. Emily seemed overwhelmed in the kitchen.',
          rating: 3,
          source: 'GOOGLE',
          sourceId: `mock_${Date.now()}_3`,
          sourceUrl: null,
          authorName: 'David Wilson',
          authorEmail: null,
          sentiment: 'NEUTRAL',
          createdAt: new Date()
        }
      ]
    }

    // Save reviews to database
    const savedReviews = []
    for (const review of reviews) {
      try {
        // Check if review already exists (demo mode)
        const existingReview = await prisma.review.findFirst({
          where: {
            sourceId: review.id,
            source: review.source
          }
        })

        if (!existingReview) {
          const savedReview = await prisma.review.create({
            data: {
              title: review.title,
              content: review.content,
              rating: review.rating,
              source: review.source,
              sourceId: review.id,
              sourceUrl: review.sourceUrl,
              authorName: review.authorName,
              authorEmail: review.authorEmail,
              sentiment: review.sentiment,
              company: { connect: { id: 'demo-company-id' } }, // Demo mode
              createdAt: review.createdAt
            }
          })
          savedReviews.push(savedReview)

          // Process mentions for this review (demo mode)
          const mentionService = new MentionDetectionService()
          await mentionService.processReview(savedReview.id, 'demo-company-id')
        }
      } catch (error) {
        console.error('Error saving review:', error)
      }
    }

    return NextResponse.json({
      message: 'Reviews collected successfully',
      collected: reviews.length,
      saved: savedReviews.length,
      reviews: savedReviews,
      source: apiKey && apiKey !== 'demo-google-places-api-key' ? 'google' : 'mock'
    })
  } catch (error) {
    console.error('Review collection error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
