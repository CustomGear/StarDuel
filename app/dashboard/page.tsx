import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import DashboardStats from '@/components/DashboardStats'
import RecentReviews from '@/components/RecentReviews'
import TopStaff from '@/components/TopStaff'
import ReviewTrends from '@/components/ReviewTrends'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  
  // Demo mode - allow access without company check
  // if (!session?.user?.companyId) {
  //   return <div>No company found</div>
  // }

  // Fetch dashboard data
  const [
    totalReviews,
    totalMentions,
    recentReviews,
    staffWithMentions,
    reviewTrends
  ] = await Promise.all([
    prisma.review.count({
      // where: { companyId: session.user.companyId } // Demo mode
    }),
    prisma.mention.count({
      // where: { 
      //   review: { companyId: session.user.companyId } // Demo mode
      // }
    }),
    prisma.review.findMany({
      // where: { companyId: session.user.companyId }, // Demo mode
      include: {
        staff: true,
        mentions: {
          include: {
            staff: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
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
    prisma.review.findMany({
      where: { 
        // companyId: session.user.companyId, // Demo mode
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      select: {
        rating: true,
        sentiment: true,
        createdAt: true
      }
    })
  ])

  // Calculate average rating
  const averageRating = recentReviews.length > 0 
    ? recentReviews.reduce((sum, review) => sum + review.rating, 0) / recentReviews.length 
    : 0

  // Calculate sentiment distribution
  const sentimentCounts = recentReviews.reduce((acc, review) => {
    const sentiment = review.sentiment || 'NEUTRAL'
    acc[sentiment] = (acc[sentiment] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalSentiment = Object.values(sentimentCounts).reduce((sum, count) => sum + count, 0)
  const positiveSentiment = totalSentiment > 0 ? Math.round((sentimentCounts.POSITIVE || 0) / totalSentiment * 100) : 0
  const negativeSentiment = totalSentiment > 0 ? Math.round((sentimentCounts.NEGATIVE || 0) / totalSentiment * 100) : 0
  const neutralSentiment = totalSentiment > 0 ? Math.round((sentimentCounts.NEUTRAL || 0) / totalSentiment * 100) : 0

  // Calculate top staff by mentions
  const topStaff = staffWithMentions
    .map(staff => ({
      staff,
      mentionCount: staff.mentions.length,
      averageRating: staff.mentions.length > 0 
        ? staff.mentions.reduce((sum, mention) => sum + mention.review.rating, 0) / staff.mentions.length
        : 0
    }))
    .sort((a, b) => b.mentionCount - a.mentionCount)
    .slice(0, 5)

  const dashboardData = {
    totalReviews,
    totalMentions,
    averageRating,
    positiveSentiment,
    negativeSentiment,
    neutralSentiment,
    recentReviews,
    topStaff,
    reviewTrends
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Review Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track staff mentions and analyze review performance across all platforms
        </p>
      </div>

      <DashboardStats data={dashboardData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentReviews reviews={recentReviews} />
        <TopStaff staff={topStaff} />
      </div>

      <ReviewTrends trends={reviewTrends} />
    </div>
  )
}
