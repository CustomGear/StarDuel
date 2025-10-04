import { NextRequest, NextResponse } from 'next/server'
// Force dynamic rendering
export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, description, website, industry } = await request.json()

    if (!name?.trim()) {
      return NextResponse.json(
        { message: 'Company name is required' },
        { status: 400 }
      )
    }

    // Find user's company (assuming first company for demo)
    const userCompany = await prisma.company.findFirst()
    
    if (!userCompany) {
      return NextResponse.json(
        { message: 'No company found' },
        { status: 404 }
      )
    }

    // Update company
    const company = await prisma.company.update({
      where: { id: userCompany.id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        website: website?.trim() || null,
        industry: industry?.trim() || null
      }
    })

    return NextResponse.json({
      message: 'Company updated successfully',
      company
    })
  } catch (error) {
    console.error('Company update error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
