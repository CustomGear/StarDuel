import { NextRequest, NextResponse } from 'next/server'
// Force dynamic rendering
export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
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

    const { reviewId } = await request.json()

    if (!reviewId) {
      return NextResponse.json(
        { message: 'Review ID is required' },
        { status: 400 }
      )
    }

    const mentionService = new MentionDetectionService()
    // For demo purposes, use a default company ID
    await mentionService.processReview(reviewId, 'demo-company-id')

    return NextResponse.json({
      message: 'Mentions processed successfully'
    })
  } catch (error) {
    console.error('Mention processing error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
