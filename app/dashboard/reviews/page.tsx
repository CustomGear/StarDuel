import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ReviewsList from '@/components/ReviewsList'
import ReviewFilters from '@/components/ReviewFilters'

export default async function ReviewsPage() {
  const session = await getServerSession(authOptions)
  
  // Demo mode - allow access without company check
  // if (!session?.user?.companyId) {
  //   return <div>No company found</div>
  // }

  // Fetch reviews with filters (demo mode)
  const reviews = await prisma.review.findMany({
    // where: { companyId: session.user.companyId }, // Demo mode
    include: {
      staff: true,
      mentions: {
        include: {
          staff: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // Get unique sources for filtering
  const sources = Array.from(new Set(reviews.map(review => review.source)))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reviews</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and analyze customer reviews across all platforms
          </p>
        </div>
      </div>

      <ReviewFilters sources={sources} />

      <ReviewsList reviews={reviews} />
    </div>
  )
}
