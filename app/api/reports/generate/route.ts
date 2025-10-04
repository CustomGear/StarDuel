import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { reportType, dateRange, format, includeCharts, includeStaffDetails } = await request.json()

    // Calculate date range
    let startDate: Date | undefined
    if (dateRange !== 'all') {
      const days = parseInt(dateRange)
      startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    }

    // Fetch data based on date range (demo mode)
    const whereClause = {
      ...(startDate && { createdAt: { gte: startDate } })
    }

    const [reviews, staff, mentions] = await Promise.all([
      prisma.review.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.staff.findMany({
        where: { 
          isActive: true
        },
        include: {
          mentions: {
            include: {
              review: true
            }
          }
        }
      }),
      prisma.mention.findMany({
        where: {
          ...(startDate && { createdAt: { gte: startDate } })
        },
        include: {
          review: true,
          staff: true
        }
      })
    ])

    // Generate report data
    const reportData = {
      company: { name: 'Demo Company' },
      generatedAt: new Date().toISOString(),
      dateRange: dateRange === 'all' ? 'All time' : `Last ${dateRange} days`,
      reportType,
      summary: {
        totalReviews: reviews.length,
        totalMentions: mentions.length,
        averageRating: reviews.length > 0 
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
          : 0,
        sentimentDistribution: reviews.reduce((acc, review) => {
          const sentiment = review.sentiment || 'NEUTRAL'
          acc[sentiment] = (acc[sentiment] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        sourceDistribution: reviews.reduce((acc, review) => {
          acc[review.source] = (acc[review.source] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      },
      staffPerformance: includeStaffDetails ? staff.map(member => {
        const memberMentions = mentions.filter(m => m.staffId === member.id)
        const memberReviews = memberMentions.map(m => m.review)
        
        const positiveMentions = memberReviews.filter(r => r.sentiment === 'POSITIVE').length
        const negativeMentions = memberReviews.filter(r => r.sentiment === 'NEGATIVE').length
        const averageRating = memberReviews.length > 0 
          ? memberReviews.reduce((sum, r) => sum + r.rating, 0) / memberReviews.length 
          : 0

        return {
          name: member.name,
          position: member.position,
          department: member.department,
          totalMentions: memberMentions.length,
          positiveMentions,
          negativeMentions,
          averageRating,
          sentimentScore: memberMentions.length > 0 
            ? Math.round((positiveMentions / memberMentions.length) * 100) 
            : 0
        }
      }).sort((a, b) => b.totalMentions - a.totalMentions) : [],
      recentReviews: reviews.slice(0, 20),
      includeCharts
    }

    // Generate report based on format
    if (format === 'csv') {
      const csv = generateCSVReport(reportData)
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="review-report-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    } else if (format === 'excel') {
      // For Excel format, we'll return JSON for now
      // In a real implementation, you'd use a library like xlsx
      return NextResponse.json({
        message: 'Excel format not yet implemented',
        data: reportData
      })
    } else {
      // PDF format - return JSON for now
      // In a real implementation, you'd use a library like puppeteer or jsPDF
      return NextResponse.json({
        message: 'PDF format not yet implemented',
        data: reportData
      })
    }
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateCSVReport(data: any): string {
  const headers = [
    'Report Type',
    'Generated At',
    'Date Range',
    'Total Reviews',
    'Total Mentions',
    'Average Rating',
    'Positive Sentiment %',
    'Neutral Sentiment %',
    'Negative Sentiment %'
  ]

  const totalSentiment = Object.values(data.summary.sentimentDistribution).reduce((sum: number, count: any) => sum + count, 0)
  const sentimentPercentages = {
    positive: totalSentiment > 0 ? Math.round((data.summary.sentimentDistribution.POSITIVE || 0) / totalSentiment * 100) : 0,
    neutral: totalSentiment > 0 ? Math.round((data.summary.sentimentDistribution.NEUTRAL || 0) / totalSentiment * 100) : 0,
    negative: totalSentiment > 0 ? Math.round((data.summary.sentimentDistribution.NEGATIVE || 0) / totalSentiment * 100) : 0
  }

  const summaryRow = [
    data.reportType,
    data.generatedAt,
    data.dateRange,
    data.summary.totalReviews,
    data.summary.totalMentions,
    data.summary.averageRating.toFixed(1),
    sentimentPercentages.positive,
    sentimentPercentages.neutral,
    sentimentPercentages.negative
  ]

  let csv = headers.join(',') + '\n'
  csv += summaryRow.join(',') + '\n\n'

  // Add staff performance data
  if (data.staffPerformance.length > 0) {
    csv += 'Staff Performance\n'
    csv += 'Name,Position,Department,Total Mentions,Positive Mentions,Negative Mentions,Average Rating,Sentiment Score\n'
    
    data.staffPerformance.forEach((staff: any) => {
      const row = [
        staff.name,
        staff.position || '',
        staff.department || '',
        staff.totalMentions,
        staff.positiveMentions,
        staff.negativeMentions,
        staff.averageRating.toFixed(1),
        staff.sentimentScore
      ]
      csv += row.join(',') + '\n'
    })
    csv += '\n'
  }

  // Add recent reviews
  if (data.recentReviews.length > 0) {
    csv += 'Recent Reviews\n'
    csv += 'Date,Source,Author,Rating,Sentiment,Title,Content\n'
    
    data.recentReviews.forEach((review: any) => {
      const row = [
        review.createdAt,
        review.source,
        review.authorName || 'Anonymous',
        review.rating,
        review.sentiment || 'NEUTRAL',
        review.title || '',
        review.content.replace(/,/g, ';') // Replace commas to avoid CSV issues
      ]
      csv += row.join(',') + '\n'
    })
  }

  return csv
}
