import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Mark all notifications as read (demo mode)
    await prisma.notification.updateMany({
      where: {
        isRead: false
      },
      data: { isRead: true }
    })

    return NextResponse.json({
      message: 'All notifications marked as read'
    })
  } catch (error) {
    console.error('Mark all notifications as read error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
