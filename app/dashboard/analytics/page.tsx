import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import SentimentTrends from '@/components/SentimentTrends'
import StaffPerformance from '@/components/StaffPerformance'

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  
  // Demo mode - allow access without company check
  // if (!session?.user?.companyId) {
  //   return <div>No company found</div>
  // }

  // Fetch analytics data
  const [
    reviews,
    staff,
    mentions
  ] = await Promise.all([
    prisma.review.findMany({
      // where: { companyId: session.user.companyId }, // Demo mode
      orderBy: { createdAt: 'desc' }
    }),
    prisma.staff.findMany({
      where: { 
        // companyId: session.user.companyId, // Demo mode
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
      // where: {
      //   review: { companyId: session.user.companyId } // Demo mode
      // },
      include: {
        review: true,
        staff: true
      }
    })
  ])

  // Calculate analytics
  const totalReviews = reviews.length
  const totalMentions = mentions.length
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0

  // Sentiment distribution
  const sentimentCounts = reviews.reduce((acc, review) => {
    const sentiment = review.sentiment || 'NEUTRAL'
    acc[sentiment] = (acc[sentiment] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalSentiment = Object.values(sentimentCounts).reduce((sum, count) => sum + count, 0)
  const sentimentDistribution = {
    positive: totalSentiment > 0 ? Math.round((sentimentCounts.POSITIVE || 0) / totalSentiment * 100) : 0,
    neutral: totalSentiment > 0 ? Math.round((sentimentCounts.NEUTRAL || 0) / totalSentiment * 100) : 0,
    negative: totalSentiment > 0 ? Math.round((sentimentCounts.NEGATIVE || 0) / totalSentiment * 100) : 0
  }

  // Source distribution
  const sourceCounts = reviews.reduce((acc, review) => {
    acc[review.source] = (acc[review.source] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Staff performance
  const staffPerformance = staff.map(member => {
    const memberMentions = mentions.filter(m => m.staffId === member.id)
    const memberReviews = memberMentions.map(m => m.review)
    
    const positiveMentions = memberReviews.filter(r => r.sentiment === 'POSITIVE').length
    const negativeMentions = memberReviews.filter(r => r.sentiment === 'NEGATIVE').length
    const averageRating = memberReviews.length > 0 
      ? memberReviews.reduce((sum, r) => sum + r.rating, 0) / memberReviews.length 
      : 0

    return {
      staff: member,
      totalMentions: memberMentions.length,
      positiveMentions,
      negativeMentions,
      averageRating,
      sentimentScore: memberMentions.length > 0 
        ? Math.round((positiveMentions / memberMentions.length) * 100) 
        : 0
    }
  }).sort((a, b) => b.totalMentions - a.totalMentions)

  // Time-based trends (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const recentReviews = reviews.filter(r => r.createdAt >= thirtyDaysAgo)
  
  const dailyTrends = recentReviews.reduce((acc, review) => {
    const date = review.createdAt.toISOString().split('T')[0]
    if (!acc[date]) {
      acc[date] = { date, reviews: 0, averageRating: 0, positive: 0, negative: 0, neutral: 0 }
    }
    acc[date].reviews += 1
    acc[date].averageRating += review.rating
    
    if (review.sentiment === 'POSITIVE') acc[date].positive += 1
    else if (review.sentiment === 'NEGATIVE') acc[date].negative += 1
    else acc[date].neutral += 1
    
    return acc
  }, {} as Record<string, any>)

  // Calculate average ratings for each day
  Object.values(dailyTrends).forEach((day: any) => {
    day.averageRating = day.reviews > 0 ? (day.averageRating / day.reviews).toFixed(1) : 0
  })

  const analyticsData = {
    totalReviews,
    totalMentions,
    averageRating,
    sentimentDistribution,
    sourceDistribution: sourceCounts,
    staffPerformance,
    dailyTrends: Object.values(dailyTrends).slice(-7) // Last 7 days
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Detailed insights into your review performance and staff mentions
        </p>
      </div>

      <AnalyticsDashboard data={analyticsData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentTrends trends={analyticsData.dailyTrends} />
        <StaffPerformance staff={analyticsData.staffPerformance} />
      </div>
    </div>
  )
}
