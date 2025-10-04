import { NextRequest, NextResponse } from 'next/server'
import { GoogleReviewsService } from '@/lib/google-reviews'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { placeId, placeName, placeAddress } = await request.json()
    
    console.log('Import request:', { placeId, placeName, placeAddress })
    
    if (!placeId || !placeName) {
      return NextResponse.json({ 
        success: false, 
        error: 'Place ID and name are required' 
      }, { status: 400 })
    }

    // Check if we have a Google Places API key
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    console.log('API Key present:', !!apiKey, 'Key starts with:', apiKey?.substring(0, 10))
    
    let reviews = []
    
    if (!apiKey || apiKey === 'your-google-places-api-key' || apiKey === 'your-actual-api-key-here') {
      // Return mock reviews for demo purposes
      reviews = [
        {
          author_name: 'John Smith',
          author_url: 'https://www.google.com/maps/contrib/123456789',
          language: 'en',
          profile_photo_url: 'https://via.placeholder.com/50',
          rating: 5,
          relative_time_description: '2 weeks ago',
          text: 'Exceptional dining experience. Sarah was an incredible manager who made sure our experience was perfect. The food was outstanding and Mike was very attentive to our needs throughout the evening.',
          time: 1705334400
        },
        {
          author_name: 'Sarah Johnson',
          author_url: 'https://www.google.com/maps/contrib/987654321',
          language: 'en',
          profile_photo_url: 'https://via.placeholder.com/50',
          rating: 4,
          relative_time_description: '1 month ago',
          text: 'Great atmosphere and delicious food. Mike was very friendly and helpful. The restaurant has a nice vibe and the food was good. Emily in the kitchen did a wonderful job.',
          time: 1702598400
        },
        {
          author_name: 'Mike Chen',
          author_url: 'https://www.google.com/maps/contrib/456789123',
          language: 'en',
          profile_photo_url: 'https://via.placeholder.com/50',
          rating: 3,
          relative_time_description: '2 months ago',
          text: 'The food was okay but the service was slow. Emily seemed overwhelmed in the kitchen and Sarah was not very helpful when we had issues.',
          time: 1699862400
        },
        {
          author_name: 'Maria Garcia',
          author_url: 'https://www.google.com/maps/contrib/789123456',
          language: 'en',
          profile_photo_url: 'https://via.placeholder.com/50',
          rating: 5,
          relative_time_description: '3 months ago',
          text: 'Sarah and her team did an outstanding job. The food was exceptional and the service was top-notch. Mike was very professional and Emily\'s cooking was amazing.',
          time: 1697126400
        },
        {
          author_name: 'Robert Taylor',
          author_url: 'https://www.google.com/maps/contrib/321654987',
          language: 'en',
          profile_photo_url: 'https://via.placeholder.com/50',
          rating: 2,
          relative_time_description: '4 months ago',
          text: 'The food was cold and Mike was not very helpful. Would not recommend. Sarah was nowhere to be found when we needed assistance.',
          time: 1694390400
        }
      ]
    } else {
      // Use real Google Places API
      const googleReviewsService = new GoogleReviewsService(apiKey)
      reviews = await googleReviewsService.getPlaceReviews(placeId)
    }

    // Create or update company in database
    let company = await prisma.company.findUnique({
      where: { googlePlaceId: placeId }
    })

    if (!company) {
      company = await prisma.company.create({
        data: {
          name: placeName,
          address: placeAddress,
          googlePlaceId: placeId,
        }
      })
    } else {
      company = await prisma.company.update({
        where: { id: company.id },
        data: {
          name: placeName,
          address: placeAddress,
        }
      })
    }

    // Import reviews to database
    const importedReviews = []
    for (const review of reviews) {
      try {
        const existingReview = await prisma.review.findUnique({
          where: { sourceId: `${placeId}-${review.time}` }
        })

        let importedReview
        if (!existingReview) {
          importedReview = await prisma.review.create({
            data: {
              sourceId: `${placeId}-${review.time}`,
              content: review.text || '',
              rating: review.rating,
              authorName: review.author_name,
              sourceUrl: review.author_url,
              createdAt: new Date(review.time * 1000),
              source: 'google',
              companyId: company.id
            }
          })
        } else {
          importedReview = await prisma.review.update({
            where: { id: existingReview.id },
            data: {
              content: review.text || '',
              rating: review.rating,
              authorName: review.author_name,
              sourceUrl: review.author_url,
              createdAt: new Date(review.time * 1000),
              source: 'google'
            }
          })
        }
        importedReviews.push(importedReview)
      } catch (error) {
        console.error('Error importing review:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${importedReviews.length} reviews for ${placeName}`,
      company: {
        id: company.id,
        name: company.name,
        address: company.address
      },
      reviews: {
        imported: importedReviews.length,
        total: reviews.length
      }
    })
  } catch (error) {
    console.error('Error importing reviews:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to import reviews',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
