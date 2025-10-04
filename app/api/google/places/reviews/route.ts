import { NextRequest, NextResponse } from 'next/server'
import { GoogleReviewsService } from '@/lib/google-reviews'

export async function POST(request: NextRequest) {
  try {
    const { placeId, limit = 20 } = await request.json()
    
    if (!placeId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Place ID is required' 
      }, { status: 400 })
    }

    // Check if we have a Google Places API key
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    
    if (!apiKey || apiKey === 'your-google-places-api-key') {
      // Return mock reviews for demo purposes
      const mockReviews = [
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

      return NextResponse.json({
        success: true,
        reviews: mockReviews.slice(0, limit),
        total: mockReviews.length
      })
    }

    // Use real Google Places API
    const googleReviewsService = new GoogleReviewsService(apiKey)
    const reviews = await googleReviewsService.getPlaceReviews(placeId)
    
    return NextResponse.json({
      success: true,
      reviews: reviews,
      total: reviews.length
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch reviews' 
    }, { status: 500 })
  }
}
