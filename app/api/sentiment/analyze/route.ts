import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SentimentAnalysisService } from '@/lib/sentiment-analysis'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { reviewId, text } = await request.json()

    if (!text) {
      return NextResponse.json(
        { message: 'Text is required' },
        { status: 400 }
      )
    }

    const sentimentService = new SentimentAnalysisService()
    const result = sentimentService.analyzeSentiment(text)

    // If reviewId is provided, update the review with sentiment
    if (reviewId) {
      await prisma.review.update({
        where: { id: reviewId },
        data: { sentiment: result.sentiment }
      })
    }

    return NextResponse.json({
      message: 'Sentiment analyzed successfully',
      result
    })
  } catch (error) {
    console.error('Sentiment analysis error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const batch = searchParams.get('batch') === 'true'

    if (batch) {
      // Analyze all reviews for the company
      const reviews = await prisma.review.findMany({
        where: { 
          sentiment: null // Only analyze reviews without sentiment
        },
        select: {
          id: true,
          content: true
        }
      })

      const sentimentService = new SentimentAnalysisService()
      const texts = reviews.map(r => r.content)
      const results = sentimentService.analyzeBatch(texts)

      // Update reviews with sentiment
      for (let i = 0; i < reviews.length; i++) {
        await prisma.review.update({
          where: { id: reviews[i].id },
          data: { sentiment: results.individual[i].sentiment }
        })
      }

      return NextResponse.json({
        message: 'Batch sentiment analysis completed',
        results
      })
    }

    return NextResponse.json({
      message: 'Sentiment analysis service ready'
    })
  } catch (error) {
    console.error('Sentiment analysis error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
