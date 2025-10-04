import { NextRequest, NextResponse } from 'next/server'
// Force dynamic rendering
export const dynamic = 'force-dynamic'
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

    const { name, email, position, department } = await request.json()

    if (!name?.trim()) {
      return NextResponse.json(
        { message: 'Name is required' },
        { status: 400 }
      )
    }

    // Check if staff member already exists
    const existingStaff = await prisma.staff.findFirst({
      where: {
        name: name.trim(),
        // companyId: session.user.companyId // Demo mode
      }
    })

    if (existingStaff) {
      return NextResponse.json(
        { message: 'Staff member with this name already exists' },
        { status: 400 }
      )
    }

    // Create staff member
    const staff = await prisma.staff.create({
      data: {
        name: name.trim(),
        email: email?.trim() || null,
        position: position?.trim() || null,
        department: department?.trim() || null,
        company: { connect: { id: 'demo-company-id' } } // Demo mode
      }
    })

    return NextResponse.json({
      message: 'Staff member created successfully',
      staff
    }, { status: 201 })
  } catch (error) {
    console.error('Staff creation error:', error)
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

    const staff = await prisma.staff.findMany({
      where: {
        // companyId: session.user.companyId // Demo mode,
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

    return NextResponse.json({ staff })
  } catch (error) {
    console.error('Staff fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
