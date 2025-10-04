import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import NotificationsList from '@/components/NotificationsList'

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions)
  
  // Demo mode - allow access without user check
  // if (!session?.user?.id) {
  //   return <div>No user found</div>
  // }

  // Fetch notifications (demo mode)
  const notifications = await prisma.notification.findMany({
    // where: { userId: session.user.id }, // Demo mode
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  // Count unread notifications (demo mode)
  const unreadCount = await prisma.notification.count({
    where: { 
      // userId: session.user.id, // Demo mode
      isRead: false
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Stay updated on new reviews, staff mentions, and important alerts
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {unreadCount} unread
            </span>
          </div>
        )}
      </div>

      <NotificationsList notifications={notifications} />
    </div>
  )
}
