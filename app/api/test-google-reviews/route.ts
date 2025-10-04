import { NextRequest, NextResponse } from 'next/server'
import { GoogleReviewsService } from '@/lib/google-reviews'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const placeId = searchParams.get('placeId') || 'ChIJN1t_tDeuEmsRUsoyG83frY4' // Default to The French Laundry
    
    // Check if we have a Google API key
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    
    if (!apiKey || apiKey === 'your-google-places-api-key-here') {
      return NextResponse.json({
        success: false,
        message: 'No Google Places API key found. Using mock data.',
        mockData: {
          placeId,
          placeName: 'The French Laundry',
          address: '6640 Washington St, Yountville, CA 94599',
          reviews: [
            {
              id: 'mock-review-1',
              authorName: 'John Doe',
              rating: 5,
              text: 'Exceptional dining experience. The service was impeccable and the food was outstanding.',
              time: '2 weeks ago',
              sentiment: 'POSITIVE'
            },
            {
              id: 'mock-review-2', 
              authorName: 'Jane Smith',
              rating: 4,
              text: 'Great atmosphere and delicious food. A bit pricey but worth it for special occasions.',
              time: '1 month ago',
              sentiment: 'POSITIVE'
            }
          ]
        }
      })
    }
    
    // Use real Google Reviews API
    const googleReviewsService = new GoogleReviewsService(apiKey)
    
    try {
      const placeDetails = await googleReviewsService.getPlaceDetails(placeId)
      
      if (!placeDetails) {
        return NextResponse.json({
          success: false,
          message: 'Place not found or API error'
        })
      }
      
      const reviews = placeDetails.reviews?.map(review => ({
        id: `google_${placeId}_${review.time}`,
        authorName: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.relative_time_description,
        sentiment: googleReviewsService['analyzeSentiment'](review.text)
      })) || []
      
      return NextResponse.json({
        success: true,
        message: 'Real Google Reviews data retrieved',
        data: {
          placeId: placeDetails.place_id,
          placeName: placeDetails.name,
          address: placeDetails.formatted_address,
          rating: placeDetails.rating,
          totalReviews: placeDetails.user_ratings_total,
          reviews
        }
      })
      
    } catch (apiError) {
      console.error('Google API error:', apiError)
      return NextResponse.json({
        success: false,
        message: 'Google API error: ' + (apiError as Error).message,
        fallback: 'Using mock data instead'
      })
    }
    
  } catch (error) {
    console.error('Test endpoint error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
