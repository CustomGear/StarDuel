import { NextRequest, NextResponse } from 'next/server'
import { GoogleOAuthService } from '@/lib/google-oauth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/integrations?error=access_denied`
      )
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/integrations?error=no_code`
      )
    }

    const googleOAuthService = new GoogleOAuthService()
    const tokens = await googleOAuthService.getTokens(code)

    // In a real implementation, you would:
    // 1. Store the tokens securely (encrypted in database)
    // 2. Associate them with the user account
    // 3. Redirect to a success page

    // For now, redirect to dashboard with success message
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/integrations?google_connected=true`
    )
  } catch (error) {
    console.error('Google OAuth callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/integrations?error=oauth_failed`
    )
  }
}
