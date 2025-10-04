import { User, Company, Staff, Review, Mention, Campaign, Analytics } from '@prisma/client'

export type ExtendedUser = User & {
  company?: Company
}

export type ExtendedStaff = Staff & {
  company: Company
  mentions: Mention[]
}

export type ExtendedReview = Review & {
  company: Company
  staff?: Staff
  mentions: Mention[]
}

export type ExtendedMention = Mention & {
  review: Review
  staff: Staff
}

export type ExtendedCampaign = Campaign & {
  company: Company
}

export type DashboardStats = {
  totalReviews: number
  totalMentions: number
  averageRating: number
  positiveSentiment: number
  negativeSentiment: number
  neutralSentiment: number
  recentReviews: ExtendedReview[]
  topStaff: Array<{
    staff: ExtendedStaff
    mentionCount: number
    averageRating: number
  }>
}

export type ReviewSource = 'GOOGLE' | 'YELP' | 'TRUSTPILOT' | 'FACEBOOK' | 'TRIPADVISOR' | 'GLASSDOOR' | 'CUSTOM'

export type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE'

export type CampaignType = 'REVIEW_COLLECTION' | 'MENTION_TRACKING' | 'SENTIMENT_ANALYSIS'

export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED'

export type Role = 'USER' | 'ADMIN' | 'SUPER_ADMIN'
