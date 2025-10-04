import { NextResponse } from 'next/server'
// Force dynamic rendering
export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    const companyCount = await prisma.company.count()
    
    // Check if demo user exists
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@starduel.ca' }
    })

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        userCount,
        companyCount,
        demoUserExists: !!demoUser,
        demoUser: demoUser ? {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          role: demoUser.role
        } : null
      }
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
