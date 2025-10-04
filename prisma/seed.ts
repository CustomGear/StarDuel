import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Delete existing demo data first
  await prisma.mention.deleteMany({})
  await prisma.review.deleteMany({})
  await prisma.notification.deleteMany({})
  await prisma.staff.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.company.deleteMany({})

  // Create demo company
  const company = await prisma.company.create({
    data: {
      id: 'demo-company',
      name: 'The French Laundry',
      description: 'A world-renowned restaurant in Yountville, California',
      website: 'https://thomaskeller.com/tfl',
      industry: 'Restaurant',
      address: '6640 Washington St, Yountville, CA 94599',
      googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4' // Real Google Place ID for The French Laundry
    }
  })

  // Create demo admin user
  const hashedPassword = await bcrypt.hash('demo123', 12)
  const adminUser = await prisma.user.create({
    data: {
      id: 'demo-admin',
      email: 'admin@demo.com',
      name: 'Demo Admin',
      password: hashedPassword,
      role: 'ADMIN',
      companyId: company.id
    }
  })

  // Create demo staff members
  const staff = await Promise.all([
    prisma.staff.create({
      data: {
        id: 'staff-1',
        name: 'Sarah Johnson',
        email: 'sarah@demo.com',
        position: 'Manager',
        department: 'Management',
        companyId: company.id
      }
    }),
    prisma.staff.create({
      data: {
        id: 'staff-2',
        name: 'Mike Chen',
        email: 'mike@demo.com',
        position: 'Server',
        department: 'Front of House',
        companyId: company.id
      }
    }),
    prisma.staff.create({
      data: {
        id: 'staff-3',
        name: 'Emily Rodriguez',
        email: 'emily@demo.com',
        position: 'Chef',
        department: 'Back of House',
        companyId: company.id
      }
    })
  ])

  // Create demo reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        id: 'review-1',
        title: 'Amazing food and service!',
        content: 'Sarah was an incredible manager. She made sure our experience was perfect. The food was delicious and Mike was very attentive to our needs.',
        rating: 5,
        source: 'GOOGLE',
        sourceId: 'google-review-1',
        authorName: 'John Smith',
        companyId: company.id,
        sentiment: 'POSITIVE',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    }),
    prisma.review.create({
      data: {
        id: 'review-2',
        title: 'Great atmosphere',
        content: 'Mike was very friendly and helpful. The restaurant has a nice vibe and the food was good.',
        rating: 4,
        source: 'YELP',
        sourceId: 'yelp-review-1',
        authorName: 'Lisa Brown',
        companyId: company.id,
        sentiment: 'POSITIVE',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      }
    }),
    prisma.review.create({
      data: {
        id: 'review-3',
        title: 'Could be better',
        content: 'The food was okay but the service was slow. Emily seemed overwhelmed in the kitchen.',
        rating: 3,
        source: 'TRUSTPILOT',
        sourceId: 'trustpilot-review-1',
        authorName: 'David Wilson',
        companyId: company.id,
        sentiment: 'NEUTRAL',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      }
    }),
    prisma.review.create({
      data: {
        id: 'review-4',
        title: 'Excellent experience',
        content: 'Sarah and her team did an outstanding job. The food was exceptional and the service was top-notch.',
        rating: 5,
        source: 'GOOGLE',
        sourceId: 'google-review-2',
        authorName: 'Maria Garcia',
        companyId: company.id,
        sentiment: 'POSITIVE',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
      }
    }),
    prisma.review.create({
      data: {
        id: 'review-5',
        title: 'Not impressed',
        content: 'The food was cold and Mike was not very helpful. Would not recommend.',
        rating: 2,
        source: 'YELP',
        sourceId: 'yelp-review-2',
        authorName: 'Robert Taylor',
        companyId: company.id,
        sentiment: 'NEGATIVE',
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000) // 12 days ago
      }
    })
  ])

  // Create demo mentions
  await Promise.all([
    prisma.mention.create({
      data: {
        id: 'mention-1',
        reviewId: 'review-1',
        staffId: 'staff-1',
        context: 'Sarah was an incredible manager. She made sure our experience was perfect.',
        sentiment: 'POSITIVE'
      }
    }),
    prisma.mention.create({
      data: {
        id: 'mention-2',
        reviewId: 'review-1',
        staffId: 'staff-2',
        context: 'Mike was very attentive to our needs.',
        sentiment: 'POSITIVE'
      }
    }),
    prisma.mention.create({
      data: {
        id: 'mention-3',
        reviewId: 'review-2',
        staffId: 'staff-2',
        context: 'Mike was very friendly and helpful.',
        sentiment: 'POSITIVE'
      }
    }),
    prisma.mention.create({
      data: {
        id: 'mention-4',
        reviewId: 'review-3',
        staffId: 'staff-3',
        context: 'Emily seemed overwhelmed in the kitchen.',
        sentiment: 'NEGATIVE'
      }
    }),
    prisma.mention.create({
      data: {
        id: 'mention-5',
        reviewId: 'review-4',
        staffId: 'staff-1',
        context: 'Sarah and her team did an outstanding job.',
        sentiment: 'POSITIVE'
      }
    }),
    prisma.mention.create({
      data: {
        id: 'mention-6',
        reviewId: 'review-5',
        staffId: 'staff-2',
        context: 'Mike was not very helpful.',
        sentiment: 'NEGATIVE'
      }
    })
  ])

  // Create demo notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        id: 'notification-1',
        type: 'NEW_REVIEW',
        title: 'New Review Received',
        message: 'A new 5-star review has been received from Google.',
        userId: adminUser.id,
        companyId: company.id,
        isRead: false,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      }
    }),
    prisma.notification.create({
      data: {
        id: 'notification-2',
        type: 'NEW_MENTION',
        title: 'Staff Member Mentioned',
        message: 'Sarah Johnson was mentioned in a 5-star review.',
        userId: adminUser.id,
        companyId: company.id,
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    })
  ])

  console.log('✅ Database seeded successfully!')
  console.log('📧 Demo account: admin@demo.com')
  console.log('🔑 Demo password: demo123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
