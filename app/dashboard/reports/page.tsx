import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ReportsList from '@/components/ReportsList'
import GenerateReportForm from '@/components/GenerateReportForm'

export default async function ReportsPage() {
  const session = await getServerSession(authOptions)
  
  // Demo mode - allow access without company check
  // if (!session?.user?.companyId) {
  //   return <div>No company found</div>
  // }

  // Fetch reports data
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

  // Calculate report data
  const reportData = {
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
    }, {} as Record<string, number>),
    staffPerformance: staff.map(member => {
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
    }).sort((a, b) => b.totalMentions - a.totalMentions),
    recentReviews: reviews.slice(0, 10),
    topPerformingStaff: staff
      .map(member => {
        const memberMentions = mentions.filter(m => m.staffId === member.id)
        const memberReviews = memberMentions.map(m => m.review)
        const positiveMentions = memberReviews.filter(r => r.sentiment === 'POSITIVE').length
        const averageRating = memberReviews.length > 0 
          ? memberReviews.reduce((sum, r) => sum + r.rating, 0) / memberReviews.length 
          : 0

        return {
          staff: member,
          totalMentions: memberMentions.length,
          positiveMentions,
          averageRating,
          sentimentScore: memberMentions.length > 0 
            ? Math.round((positiveMentions / memberMentions.length) * 100) 
            : 0
        }
      })
      .sort((a, b) => b.sentimentScore - a.sentimentScore)
      .slice(0, 5)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate and download comprehensive reports on your review performance
          </p>
        </div>
      </div>

      <GenerateReportForm />

      <ReportsList data={reportData} />
    </div>
  )
}
