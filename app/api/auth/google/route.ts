import { NextRequest, NextResponse } from 'next/server'
import { GoogleOAuthService } from '@/lib/google-oauth'

export async function GET(request: NextRequest) {
  try {
    // Check if Google OAuth is properly configured
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    
    if (!clientId || !clientSecret || 
        clientId === 'your-google-client-id' || 
        clientSecret === 'your-google-client-secret') {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/integrations?error=google_not_configured`
      )
    }

    const googleOAuthService = new GoogleOAuthService()
    const authUrl = googleOAuthService.getAuthUrl()
    
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('Google OAuth error:', error)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/integrations?error=oauth_failed`
    )
  }
}
