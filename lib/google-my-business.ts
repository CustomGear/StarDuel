import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

export interface GoogleMyBusinessAccount {
  accountId: string
  accountName: string
  locations: GoogleMyBusinessLocation[]
}

export interface GoogleMyBusinessLocation {
  locationId: string
  locationName: string
  address: string
  phoneNumber?: string
  website?: string
  rating?: number
  reviewCount?: number
  placeId?: string
}

export interface GoogleMyBusinessReview {
  reviewId: string
  reviewer: {
    displayName: string
    profilePhotoUrl?: string
    isAnonymous: boolean
  }
  starRating: 'ONE' | 'TWO' | 'THREE' | 'FOUR' | 'FIVE'
  comment?: string
  createTime: string
  updateTime: string
  reviewReply?: {
    comment: string
    updateTime: string
  }
}

export interface StaffMention {
  staffName: string
  context: string
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  reviewId: string
  reviewDate: string
  rating: number
}

export class GoogleMyBusinessService {
  private oauth2Client: OAuth2Client
  private myBusinessClient: any

  constructor() {
    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback'
    )
  }

  /**
   * Set credentials for API calls
   */
  setCredentials(tokens: any) {
    this.oauth2Client.setCredentials(tokens)
  }

  /**
   * Get user's Google My Business accounts
   */
  async getAccounts(): Promise<GoogleMyBusinessAccount[]> {
    try {
      // Note: Google My Business API is deprecated
      // This is a mock implementation showing the structure
      // In production, you'd use the new Google Business Profile API
      
      const mockAccounts: GoogleMyBusinessAccount[] = [
        {
          accountId: 'account_1',
          accountName: 'My Restaurant Group',
          locations: [
            {
              locationId: 'location_1',
              locationName: 'The French Laundry',
              address: '6640 Washington St, Yountville, CA 94599',
              phoneNumber: '+1 (707) 944-2380',
              website: 'https://thomaskeller.com/tfl',
              rating: 4.5,
              reviewCount: 1250,
              placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4'
            },
            {
              locationId: 'location_2',
              locationName: 'Eleven Madison Park',
              address: '11 Madison Ave, New York, NY 10010',
              phoneNumber: '+1 (212) 889-0905',
              website: 'https://elevenmadisonpark.com',
              rating: 4.3,
              reviewCount: 890,
              placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4'
            }
          ]
        }
      ]

      return mockAccounts
    } catch (error) {
      console.error('Error getting Google My Business accounts:', error)
      return []
    }
  }

  /**
   * Get reviews for a specific location with date range
   */
  async getLocationReviews(
    locationId: string, 
    startDate?: Date, 
    endDate?: Date
  ): Promise<GoogleMyBusinessReview[]> {
    try {
      // Mock implementation - in production, use Google Business Profile API
      const mockReviews: GoogleMyBusinessReview[] = [
        {
          reviewId: 'review_1',
          reviewer: {
            displayName: 'John Smith',
            profilePhotoUrl: 'https://via.placeholder.com/50',
            isAnonymous: false
          },
          starRating: 'FIVE',
          comment: 'Exceptional dining experience. Sarah was an incredible manager who made sure our experience was perfect. The food was outstanding and Mike was very attentive to our needs throughout the evening.',
          createTime: '2024-01-15T10:30:00Z',
          updateTime: '2024-01-15T10:30:00Z'
        },
        {
          reviewId: 'review_2',
          reviewer: {
            displayName: 'Sarah Johnson',
            profilePhotoUrl: 'https://via.placeholder.com/50',
            isAnonymous: false
          },
          starRating: 'FOUR',
          comment: 'Great atmosphere and delicious food. Mike was very friendly and helpful. The restaurant has a nice vibe and the food was good. Emily in the kitchen did a wonderful job.',
          createTime: '2024-01-10T14:20:00Z',
          updateTime: '2024-01-10T14:20:00Z'
        },
        {
          reviewId: 'review_3',
          reviewer: {
            displayName: 'Mike Chen',
            profilePhotoUrl: 'https://via.placeholder.com/50',
            isAnonymous: false
          },
          starRating: 'THREE',
          comment: 'The food was okay but the service was slow. Emily seemed overwhelmed in the kitchen and Sarah was not very helpful when we had issues.',
          createTime: '2024-01-05T19:45:00Z',
          updateTime: '2024-01-05T19:45:00Z'
        },
        {
          reviewId: 'review_4',
          reviewer: {
            displayName: 'Maria Garcia',
            profilePhotoUrl: 'https://via.placeholder.com/50',
            isAnonymous: false
          },
          starRating: 'FIVE',
          comment: 'Sarah and her team did an outstanding job. The food was exceptional and the service was top-notch. Mike was very professional and Emily\'s cooking was amazing.',
          createTime: '2023-12-20T12:15:00Z',
          updateTime: '2023-12-20T12:15:00Z'
        },
        {
          reviewId: 'review_5',
          reviewer: {
            displayName: 'Robert Taylor',
            profilePhotoUrl: 'https://via.placeholder.com/50',
            isAnonymous: false
          },
          starRating: 'TWO',
          comment: 'The food was cold and Mike was not very helpful. Would not recommend. Sarah was nowhere to be found when we needed assistance.',
          createTime: '2023-12-15T18:30:00Z',
          updateTime: '2023-12-15T18:30:00Z'
        },
        {
          reviewId: 'review_6',
          reviewer: {
            displayName: 'Lisa Brown',
            profilePhotoUrl: 'https://via.placeholder.com/50',
            isAnonymous: false
          },
          starRating: 'FIVE',
          comment: 'Amazing experience! Sarah was fantastic and made us feel special. Mike was very attentive and Emily\'s dishes were incredible. Highly recommend!',
          createTime: '2023-11-28T20:00:00Z',
          updateTime: '2023-11-28T20:00:00Z'
        },
        {
          reviewId: 'review_7',
          reviewer: {
            displayName: 'David Wilson',
            profilePhotoUrl: 'https://via.placeholder.com/50',
            isAnonymous: false
          },
          starRating: 'FOUR',
          comment: 'Good food and service. Mike was friendly and Sarah was professional. The atmosphere was nice and Emily\'s cooking was good.',
          createTime: '2023-11-15T16:45:00Z',
          updateTime: '2023-11-15T16:45:00Z'
        },
        {
          reviewId: 'review_8',
          reviewer: {
            displayName: 'Jennifer Lee',
            profilePhotoUrl: 'https://via.placeholder.com/50',
            isAnonymous: false
          },
          starRating: 'ONE',
          comment: 'Terrible experience. Mike was rude and unhelpful. Sarah was not available and Emily\'s food was disappointing. Would not return.',
          createTime: '2023-10-30T19:15:00Z',
          updateTime: '2023-10-30T19:15:00Z'
        }
      ]

      // Filter by date range if provided
      let filteredReviews = mockReviews
      if (startDate || endDate) {
        filteredReviews = mockReviews.filter(review => {
          const reviewDate = new Date(review.createTime)
          if (startDate && reviewDate < startDate) return false
          if (endDate && reviewDate > endDate) return false
          return true
        })
      }

      return filteredReviews
    } catch (error) {
      console.error('Error getting location reviews:', error)
      return []
    }
  }

  /**
   * Analyze reviews for staff mentions
   */
  analyzeStaffMentions(
    reviews: GoogleMyBusinessReview[], 
    staffNames: string[]
  ): StaffMention[] {
    const mentions: StaffMention[] = []

    reviews.forEach(review => {
      const reviewText = review.comment || ''
      const lowerText = reviewText.toLowerCase()

      staffNames.forEach(staffName => {
        const lowerStaffName = staffName.toLowerCase()
        
        // Check if staff name is mentioned in the review
        if (lowerText.includes(lowerStaffName)) {
          // Extract context around the mention
          const words = reviewText.split(' ')
          const staffIndex = words.findIndex(word => 
            word.toLowerCase().includes(lowerStaffName)
          )
          
          let context = ''
          if (staffIndex !== -1) {
            const start = Math.max(0, staffIndex - 3)
            const end = Math.min(words.length, staffIndex + 4)
            context = words.slice(start, end).join(' ')
          }

          // Analyze sentiment
          const sentiment = this.analyzeSentiment(reviewText)

          mentions.push({
            staffName,
            context,
            sentiment,
            reviewId: review.reviewId,
            reviewDate: review.createTime,
            rating: this.getStarRating(review.starRating)
          })
        }
      })
    })

    return mentions
  }

  /**
   * Get star rating as number
   */
  private getStarRating(rating: string): number {
    const ratingMap = {
      'ONE': 1,
      'TWO': 2,
      'THREE': 3,
      'FOUR': 4,
      'FIVE': 5
    }
    return ratingMap[rating as keyof typeof ratingMap] || 0
  }

  /**
   * Analyze sentiment of text
   */
  private analyzeSentiment(text: string): 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' {
    const positiveWords = [
      'excellent', 'amazing', 'wonderful', 'great', 'good', 'awesome', 
      'love', 'best', 'perfect', 'outstanding', 'exceptional', 'impeccable',
      'fantastic', 'incredible', 'delicious', 'friendly', 'helpful',
      'professional', 'attentive', 'wonderful', 'special', 'highly recommend'
    ]
    
    const negativeWords = [
      'terrible', 'awful', 'horrible', 'bad', 'worst', 'hate', 
      'disappointing', 'poor', 'disgusting', 'slow', 'overpriced',
      'rude', 'unhelpful', 'cold', 'not recommend', 'disappointing',
      'nowhere to be found', 'overwhelmed', 'issues'
    ]
    
    const lowerText = text.toLowerCase()
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length
    
    if (positiveCount > negativeCount) return 'POSITIVE'
    if (negativeCount > positiveCount) return 'NEGATIVE'
    return 'NEUTRAL'
  }

  /**
   * Get historical review analysis
   */
  async getHistoricalAnalysis(
    locationId: string, 
    staffNames: string[], 
    yearsBack: number = 2
  ): Promise<{
    totalReviews: number
    staffMentions: StaffMention[]
    sentimentBreakdown: {
      positive: number
      negative: number
      neutral: number
    }
    staffPerformance: {
      [staffName: string]: {
        totalMentions: number
        positiveMentions: number
        negativeMentions: number
        neutralMentions: number
        averageRating: number
      }
    }
  }> {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setFullYear(endDate.getFullYear() - yearsBack)

    const reviews = await this.getLocationReviews(locationId, startDate, endDate)
    const staffMentions = this.analyzeStaffMentions(reviews, staffNames)

    // Calculate sentiment breakdown
    const sentimentBreakdown = {
      positive: staffMentions.filter(m => m.sentiment === 'POSITIVE').length,
      negative: staffMentions.filter(m => m.sentiment === 'NEGATIVE').length,
      neutral: staffMentions.filter(m => m.sentiment === 'NEUTRAL').length
    }

    // Calculate staff performance
    const staffPerformance: { [staffName: string]: any } = {}
    staffNames.forEach(staffName => {
      const mentions = staffMentions.filter(m => m.staffName === staffName)
      const ratings = mentions.map(m => m.rating)
      const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length 
        : 0

      staffPerformance[staffName] = {
        totalMentions: mentions.length,
        positiveMentions: mentions.filter(m => m.sentiment === 'POSITIVE').length,
        negativeMentions: mentions.filter(m => m.sentiment === 'NEGATIVE').length,
        neutralMentions: mentions.filter(m => m.sentiment === 'NEUTRAL').length,
        averageRating: Math.round(averageRating * 10) / 10
      }
    })

    return {
      totalReviews: reviews.length,
      staffMentions,
      sentimentBreakdown,
      staffPerformance
    }
  }
}
