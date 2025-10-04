import { NextRequest, NextResponse } from 'next/server'
// Force dynamic rendering
export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ReviewCollectionService } from '@/lib/review-apis'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { query, location } = await request.json()

    if (!query) {
      return NextResponse.json(
        { message: 'Search query is required' },
        { status: 400 }
      )
    }

    // Initialize review collection service
    const reviewService = new ReviewCollectionService({
      googlePlaces: process.env.GOOGLE_PLACES_API_KEY,
      yelp: process.env.YELP_API_KEY,
      trustpilot: process.env.TRUSTPILOT_API_KEY,
    })

    // Search businesses across all platforms
    const results = await reviewService.searchBusinesses(query, location)

    return NextResponse.json({
      message: 'Business search completed',
      results
    })
  } catch (error) {
    console.error('Business search error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
