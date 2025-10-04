import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import StaffList from '@/components/StaffList'
import AddStaffForm from '@/components/AddStaffForm'

export default async function StaffPage() {
  const session = await getServerSession(authOptions)
  
  // Demo mode - allow access without company check
  // if (!session?.user?.companyId) {
  //   return <div>No company found</div>
  // }

  // Fetch staff with mention statistics (demo mode)
  const staff = await prisma.staff.findMany({
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
    },
    orderBy: { name: 'asc' }
  })

  // Calculate statistics for each staff member
  const staffWithStats = staff.map(member => {
    const mentions = member.mentions
    const totalMentions = mentions.length
    const positiveMentions = mentions.filter(m => m.review.sentiment === 'POSITIVE').length
    const negativeMentions = mentions.filter(m => m.review.sentiment === 'NEGATIVE').length
    const averageRating = mentions.length > 0 
      ? mentions.reduce((sum, m) => sum + m.review.rating, 0) / mentions.length 
      : 0

    return {
      ...member,
      stats: {
        totalMentions,
        positiveMentions,
        negativeMentions,
        averageRating
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Staff Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your team members and track their performance in reviews
          </p>
        </div>
      </div>

      <AddStaffForm />

      <StaffList staff={staffWithStats} />
    </div>
  )
}
