// Test script to add multiple locations and test Google Reviews integration
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Popular restaurants with known Google Place IDs for testing
const testLocations = [
  {
    name: 'The French Laundry',
    description: 'A world-renowned restaurant in Yountville, California',
    website: 'https://thomaskeller.com/tfl',
    industry: 'Restaurant',
    address: '6640 Washington St, Yountville, CA 94599',
    googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4'
  },
  {
    name: 'Eleven Madison Park',
    description: 'Fine dining restaurant in New York City',
    website: 'https://elevenmadisonpark.com',
    industry: 'Restaurant',
    address: '11 Madison Ave, New York, NY 10010',
    googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4' // Using same ID for demo
  },
  {
    name: 'Noma',
    description: 'Renowned restaurant in Copenhagen, Denmark',
    website: 'https://noma.dk',
    industry: 'Restaurant',
    address: 'Refshalevej 96, 1432 København, Denmark',
    googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4' // Using same ID for demo
  }
]

async function addTestLocations() {
  console.log('🏢 Adding test locations...')
  
  try {
    // Delete existing test companies (keep demo-company)
    await prisma.company.deleteMany({
      where: {
        id: {
          not: 'demo-company'
        }
      }
    })
    
    // Add new test locations
    for (let i = 0; i < testLocations.length; i++) {
      const location = testLocations[i]
      const companyId = `test-company-${i + 1}`
      
      const company = await prisma.company.create({
        data: {
          id: companyId,
          name: location.name,
          description: location.description,
          website: location.website,
          industry: location.industry,
          address: location.address,
          googlePlaceId: location.googlePlaceId
        }
      })
      
      console.log(`✅ Added: ${company.name}`)
      
      // Add some staff for each location
      const staff = await prisma.staff.create({
        data: {
          name: `Staff Member ${i + 1}`,
          email: `staff${i + 1}@${location.name.toLowerCase().replace(/\s+/g, '')}.com`,
          position: 'Manager',
          department: 'Management',
          companyId: company.id
        }
      })
      
      // Add some sample reviews
      const reviews = await Promise.all([
        prisma.review.create({
          data: {
            title: `Great experience at ${location.name}`,
            content: `The staff was excellent and the food was outstanding. Highly recommend!`,
            rating: 5,
            source: 'GOOGLE',
            sourceId: `google-${companyId}-1`,
            authorName: 'John Doe',
            companyId: company.id,
            sentiment: 'POSITIVE',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          }
        }),
        prisma.review.create({
          data: {
            title: `Good but expensive`,
            content: `The food was good but quite pricey. The service was professional.`,
            rating: 4,
            source: 'YELP',
            sourceId: `yelp-${companyId}-1`,
            authorName: 'Jane Smith',
            companyId: company.id,
            sentiment: 'POSITIVE',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
          }
        })
      ])
      
      // Add mentions
      await prisma.mention.create({
        data: {
          reviewId: reviews[0].id,
          staffId: staff.id,
          context: 'The staff was excellent and the food was outstanding.',
          sentiment: 'POSITIVE'
        }
      })
      
      console.log(`   📝 Added ${reviews.length} reviews and 1 mention`)
    }
    
    console.log('\n🎉 Test locations added successfully!')
    console.log('\n📊 Summary:')
    
    // Get summary
    const companies = await prisma.company.findMany({
      include: {
        _count: {
          select: {
            reviews: true,
            staff: true
          }
        }
      }
    })
    
    companies.forEach(company => {
      console.log(`   ${company.name}: ${company._count.reviews} reviews, ${company._count.staff} staff`)
    })
    
    console.log('\n🔗 Test URLs:')
    console.log('   Demo data: http://localhost:3000/api/test-reviews')
    console.log('   Google Reviews: http://localhost:3000/api/test-google-reviews')
    console.log('   Dashboard: http://localhost:3000/dashboard')
    
  } catch (error) {
    console.error('❌ Error adding test locations:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addTestLocations()
