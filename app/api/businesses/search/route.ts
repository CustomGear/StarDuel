import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GoogleReviewsService } from '@/lib/google-reviews'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Allow public access for business search
    // if (!session?.user) {
    //   return NextResponse.json(
    //     { message: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const { query, location } = await request.json()

    if (!query || query.length < 3) {
      return NextResponse.json(
        { message: 'Query must be at least 3 characters' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GOOGLE_PLACES_API_KEY

    if (!apiKey || apiKey === 'demo-google-places-api-key') {
      // Return mock results for demo
      const mockResults = [
        {
          place_id: 'demo-1',
          name: 'Demo Restaurant',
          formatted_address: '123 Main St, New York, NY 10001',
          rating: 4.5,
          user_ratings_total: 150,
          types: ['restaurant', 'food', 'establishment'],
          geometry: {
            location: { lat: 40.7128, lng: -74.0060 }
          }
        },
        {
          place_id: 'demo-2',
          name: 'Sample Cafe',
          formatted_address: '456 Oak Ave, Los Angeles, CA 90210',
          rating: 4.2,
          user_ratings_total: 89,
          types: ['cafe', 'food', 'establishment'],
          geometry: {
            location: { lat: 34.0522, lng: -118.2437 }
          }
        },
        {
          place_id: 'demo-3',
          name: 'Local Bistro',
          formatted_address: '789 Pine St, Chicago, IL 60601',
          rating: 4.7,
          user_ratings_total: 203,
          types: ['restaurant', 'food', 'establishment'],
          geometry: {
            location: { lat: 41.8781, lng: -87.6298 }
          }
        }
      ]

      const filteredResults = mockResults.filter(business =>
        business.name.toLowerCase().includes(query.toLowerCase()) ||
        business.formatted_address.toLowerCase().includes(query.toLowerCase())
      )

      return NextResponse.json({
        results: filteredResults,
        source: 'mock'
      })
    }

    // Use real Google Places API
    const googleService = new GoogleReviewsService(apiKey)
    const results = await googleService.searchPlaces(query, location)

    return NextResponse.json({
      results: results.map(place => ({
        place_id: place.place_id,
        name: place.name,
        formatted_address: place.formatted_address,
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        types: place.types,
        geometry: place.geometry
      })),
      source: 'google'
    })
  } catch (error) {
    console.error('Business search error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
