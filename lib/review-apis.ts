import axios from 'axios'

export interface ReviewData {
  id: string
  title?: string
  content: string
  rating: number
  authorName?: string
  authorEmail?: string
  sourceUrl?: string
  createdAt: Date
}

export interface GooglePlacesReview extends ReviewData {
  source: 'GOOGLE'
}

export interface YelpReview extends ReviewData {
  source: 'YELP'
}

export interface TrustpilotReview extends ReviewData {
  source: 'TRUSTPILOT'
}

// Google Places API integration
export class GooglePlacesAPI {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async getPlaceReviews(placeId: string): Promise<GooglePlacesReview[]> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${this.apiKey}`
      )

      if (response.data.status !== 'OK') {
        throw new Error(`Google Places API error: ${response.data.status}`)
      }

      const reviews = response.data.result.reviews || []
      
      return reviews.map((review: any) => ({
        id: review.time?.toString() || Math.random().toString(),
        title: undefined,
        content: review.text || '',
        rating: review.rating || 0,
        authorName: review.author_name,
        authorEmail: undefined,
        sourceUrl: review.author_url,
        createdAt: new Date(review.time * 1000),
        source: 'GOOGLE' as const
      }))
    } catch (error) {
      console.error('Error fetching Google Places reviews:', error)
      return []
    }
  }

  async searchPlaces(query: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${this.apiKey}`
      )

      if (response.data.status !== 'OK') {
        throw new Error(`Google Places API error: ${response.data.status}`)
      }

      return response.data.results || []
    } catch (error) {
      console.error('Error searching Google Places:', error)
      return []
    }
  }
}

// Yelp API integration
export class YelpAPI {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async getBusinessReviews(businessId: string): Promise<YelpReview[]> {
    try {
      const response = await axios.get(
        `https://api.yelp.com/v3/businesses/${businessId}/reviews`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      )

      const reviews = response.data.reviews || []
      
      return reviews.map((review: any) => ({
        id: review.id,
        title: undefined,
        content: review.text || '',
        rating: review.rating || 0,
        authorName: review.user.name,
        authorEmail: undefined,
        sourceUrl: review.url,
        createdAt: new Date(review.time_created),
        source: 'YELP' as const
      }))
    } catch (error) {
      console.error('Error fetching Yelp reviews:', error)
      return []
    }
  }

  async searchBusinesses(query: string, location?: string): Promise<any[]> {
    try {
      const params = new URLSearchParams({
        term: query,
        ...(location && { location })
      })

      const response = await axios.get(
        `https://api.yelp.com/v3/businesses/search?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      )

      return response.data.businesses || []
    } catch (error) {
      console.error('Error searching Yelp businesses:', error)
      return []
    }
  }
}

// Trustpilot API integration
export class TrustpilotAPI {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async getBusinessReviews(businessId: string): Promise<TrustpilotReview[]> {
    try {
      const response = await axios.get(
        `https://api.trustpilot.com/v1/business-units/${businessId}/reviews`,
        {
          headers: {
            'apikey': this.apiKey
          }
        }
      )

      const reviews = response.data.reviews || []
      
      return reviews.map((review: any) => ({
        id: review.id,
        title: review.title,
        content: review.text || '',
        rating: review.stars || 0,
        authorName: review.consumer?.displayName,
        authorEmail: undefined,
        sourceUrl: review.links?.self?.href,
        createdAt: new Date(review.createdAt),
        source: 'TRUSTPILOT' as const
      }))
    } catch (error) {
      console.error('Error fetching Trustpilot reviews:', error)
      return []
    }
  }

  async searchBusinesses(query: string): Promise<any[]> {
    try {
      const response = await axios.get(
        `https://api.trustpilot.com/v1/business-units/search`,
        {
          headers: {
            'apikey': this.apiKey
          },
          params: {
            name: query
          }
        }
      )

      return response.data.businessUnits || []
    } catch (error) {
      console.error('Error searching Trustpilot businesses:', error)
      return []
    }
  }
}

// Review collection service
export class ReviewCollectionService {
  private googlePlaces: GooglePlacesAPI
  private yelp: YelpAPI
  private trustpilot: TrustpilotAPI

  constructor(apiKeys: {
    googlePlaces?: string
    yelp?: string
    trustpilot?: string
  }) {
    this.googlePlaces = apiKeys.googlePlaces ? new GooglePlacesAPI(apiKeys.googlePlaces) : null as any
    this.yelp = apiKeys.yelp ? new YelpAPI(apiKeys.yelp) : null as any
    this.trustpilot = apiKeys.trustpilot ? new TrustpilotAPI(apiKeys.trustpilot) : null as any
  }

  async collectReviews(businessInfo: {
    name: string
    googlePlaceId?: string
    yelpBusinessId?: string
    trustpilotBusinessId?: string
  }): Promise<ReviewData[]> {
    const allReviews: ReviewData[] = []

    try {
      // Collect from Google Places
      if (businessInfo.googlePlaceId && this.googlePlaces) {
        const googleReviews = await this.googlePlaces.getPlaceReviews(businessInfo.googlePlaceId)
        allReviews.push(...googleReviews)
      }

      // Collect from Yelp
      if (businessInfo.yelpBusinessId && this.yelp) {
        const yelpReviews = await this.yelp.getBusinessReviews(businessInfo.yelpBusinessId)
        allReviews.push(...yelpReviews)
      }

      // Collect from Trustpilot
      if (businessInfo.trustpilotBusinessId && this.trustpilot) {
        const trustpilotReviews = await this.trustpilot.getBusinessReviews(businessInfo.trustpilotBusinessId)
        allReviews.push(...trustpilotReviews)
      }
    } catch (error) {
      console.error('Error collecting reviews:', error)
    }

    return allReviews
  }

  async searchBusinesses(query: string, location?: string): Promise<{
    google?: any[]
    yelp?: any[]
    trustpilot?: any[]
  }> {
    const results: any = {}

    try {
      if (this.googlePlaces) {
        results.google = await this.googlePlaces.searchPlaces(query)
      }

      if (this.yelp) {
        results.yelp = await this.yelp.searchBusinesses(query, location)
      }

      if (this.trustpilot) {
        results.trustpilot = await this.trustpilot.searchBusinesses(query)
      }
    } catch (error) {
      console.error('Error searching businesses:', error)
    }

    return results
  }
}
