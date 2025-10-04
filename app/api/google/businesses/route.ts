import { NextRequest, NextResponse } from 'next/server'
import { GoogleOAuthService } from '@/lib/google-oauth'

export async function GET(request: NextRequest) {
  try {
    const googleOAuthService = new GoogleOAuthService()
    
    // In a real implementation, you would:
    // 1. Get the user's stored tokens from the database
    // 2. Set the credentials on the service
    // 3. Fetch real business accounts
    
    // For demo purposes, return mock data
    const businessAccounts = await googleOAuthService.getBusinessAccounts()
    
    return NextResponse.json({
      success: true,
      businesses: businessAccounts
    })
  } catch (error) {
    console.error('Error fetching business accounts:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch business accounts' 
    }, { status: 500 })
  }
}
