import { NextRequest, NextResponse } from 'next/server'
import { GoogleOAuthService } from '@/lib/google-oauth'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const placeId = searchParams.get('placeId')
    
    if (!placeId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Place ID is required' 
      }, { status: 400 })
    }

    const googleOAuthService = new GoogleOAuthService()
    
    // In a real implementation, you would:
    // 1. Get the user's stored tokens from the database
    // 2. Set the credentials on the service
    // 3. Fetch real reviews from Google My Business
    
    // For demo purposes, return mock data
    const reviews = await googleOAuthService.getBusinessReviews(placeId)
    
    return NextResponse.json({
      success: true,
      reviews: reviews
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch reviews' 
    }, { status: 500 })
  }
}
