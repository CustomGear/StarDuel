import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'

export interface GoogleBusinessProfile {
  name: string
  placeId: string
  address: string
  phoneNumber?: string
  website?: string
  rating?: number
  reviewCount?: number
}

export interface GoogleReview {
  reviewId: string
  reviewer: {
    displayName: string
    profilePhotoUrl?: string
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

export class GoogleOAuthService {
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
   * Generate Google OAuth URL for authentication
   */
  getAuthUrl(): string {
    const scopes = [
      'https://www.googleapis.com/auth/business.manage',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ]

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    })
  }

  /**
   * Exchange authorization code for tokens
   */
  async getTokens(code: string) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code)
      this.oauth2Client.setCredentials(tokens)
      return tokens
    } catch (error) {
      console.error('Error getting tokens:', error)
      throw error
    }
  }

  /**
   * Set access tokens for API calls
   */
  setCredentials(tokens: any) {
    this.oauth2Client.setCredentials(tokens)
  }

  /**
   * Get user's Google My Business accounts
   */
  async getBusinessAccounts(): Promise<GoogleBusinessProfile[]> {
    try {
      // Note: Google My Business API has been deprecated
      // This is a mock implementation showing the structure
      // In production, you'd use the new Google Business Profile API
      
      const mockAccounts: GoogleBusinessProfile[] = [
        {
          name: 'The French Laundry',
          placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          address: '6640 Washington St, Yountville, CA 94599',
          phoneNumber: '+1 (707) 944-2380',
          website: 'https://thomaskeller.com/tfl',
          rating: 4.5,
          reviewCount: 1250
        },
        {
          name: 'Eleven Madison Park',
          placeId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          address: '11 Madison Ave, New York, NY 10010',
          phoneNumber: '+1 (212) 889-0905',
          website: 'https://elevenmadisonpark.com',
          rating: 4.3,
          reviewCount: 890
        }
      ]

      return mockAccounts
    } catch (error) {
      console.error('Error getting business accounts:', error)
      return []
    }
  }

  /**
   * Get reviews for a specific business location
   */
  async getBusinessReviews(placeId: string): Promise<GoogleReview[]> {
    try {
      // Mock implementation - in production, use Google Business Profile API
      const mockReviews: GoogleReview[] = [
        {
          reviewId: 'review_1',
          reviewer: {
            displayName: 'John Smith',
            profilePhotoUrl: 'https://via.placeholder.com/50'
          },
          starRating: 'FIVE',
          comment: 'Exceptional dining experience. The service was impeccable and the food was outstanding. Highly recommend for special occasions.',
          createTime: '2024-01-15T10:30:00Z',
          updateTime: '2024-01-15T10:30:00Z'
        },
        {
          reviewId: 'review_2',
          reviewer: {
            displayName: 'Sarah Johnson',
            profilePhotoUrl: 'https://via.placeholder.com/50'
          },
          starRating: 'FOUR',
          comment: 'Great atmosphere and delicious food. A bit pricey but worth it for the experience. The staff was very professional.',
          createTime: '2024-01-10T14:20:00Z',
          updateTime: '2024-01-10T14:20:00Z'
        },
        {
          reviewId: 'review_3',
          reviewer: {
            displayName: 'Mike Chen',
            profilePhotoUrl: 'https://via.placeholder.com/50'
          },
          starRating: 'THREE',
          comment: 'The food was good but the service was slow. Had to wait quite a while for our order. The ambiance is nice though.',
          createTime: '2024-01-05T19:45:00Z',
          updateTime: '2024-01-05T19:45:00Z'
        }
      ]

      return mockReviews
    } catch (error) {
      console.error('Error getting business reviews:', error)
      return []
    }
  }

  /**
   * Reply to a review
   */
  async replyToReview(placeId: string, reviewId: string, replyText: string): Promise<boolean> {
    try {
      // Mock implementation - in production, use Google Business Profile API
      console.log(`Replying to review ${reviewId} for place ${placeId}: ${replyText}`)
      return true
    } catch (error) {
      console.error('Error replying to review:', error)
      return false
    }
  }

  /**
   * Convert Google review to our format
   */
  convertGoogleReview(googleReview: GoogleReview, placeId: string, placeName: string) {
    const ratingMap = {
      'ONE': 1,
      'TWO': 2,
      'THREE': 3,
      'FOUR': 4,
      'FIVE': 5
    }

    return {
      id: `google_${placeId}_${googleReview.reviewId}`,
      title: null,
      content: googleReview.comment || '',
      rating: ratingMap[googleReview.starRating],
      source: 'GOOGLE',
      sourceId: googleReview.reviewId,
      sourceUrl: null,
      authorName: googleReview.reviewer.displayName,
      authorEmail: null,
      sentiment: this.analyzeSentiment(googleReview.comment || ''),
      createdAt: new Date(googleReview.createTime),
      reply: googleReview.reviewReply?.comment || null
    }
  }

  /**
   * Simple sentiment analysis
   */
  private analyzeSentiment(text: string): string {
    const positiveWords = ['excellent', 'amazing', 'wonderful', 'great', 'good', 'awesome', 'love', 'best', 'perfect', 'outstanding', 'exceptional', 'impeccable']
    const negativeWords = ['terrible', 'awful', 'horrible', 'bad', 'worst', 'hate', 'disappointing', 'poor', 'disgusting', 'slow', 'overpriced']
    
    const lowerText = text.toLowerCase()
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length
    
    if (positiveCount > negativeCount) return 'POSITIVE'
    if (negativeCount > positiveCount) return 'NEGATIVE'
    return 'NEUTRAL'
  }
}
