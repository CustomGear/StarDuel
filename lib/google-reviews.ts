import { Client } from '@googlemaps/google-maps-services-js'

export interface GoogleReview {
  author_name: string
  author_url?: string
  language: string
  profile_photo_url?: string
  rating: number
  relative_time_description: string
  text: string
  time: number
}

export interface GooglePlaceDetails {
  place_id: string
  name: string
  formatted_address: string
  rating?: number
  user_ratings_total?: number
  reviews?: GoogleReview[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
}

export class GoogleReviewsService {
  private client: Client
  private apiKey: string

  constructor(apiKey: string) {
    this.client = new Client({})
    this.apiKey = apiKey
  }

  /**
   * Search for places using text search
   */
  async searchPlaces(query: string, location?: string): Promise<any[]> {
    try {
      const response = await this.client.textSearch({
        params: {
          query,
          key: this.apiKey,
          ...(location && { location }),
          type: 'establishment' as any
        }
      })

      return response.data.results || []
    } catch (error) {
      console.error('Google Places search error:', error)
      return []
    }
  }

  /**
   * Get place details including reviews
   */
  async getPlaceDetails(placeId: string): Promise<GooglePlaceDetails | null> {
    try {
      const response = await this.client.placeDetails({
        params: {
          place_id: placeId,
          key: this.apiKey,
          fields: [
            'place_id',
            'name',
            'formatted_address',
            'rating',
            'user_ratings_total',
            'reviews',
            'geometry'
          ]
        }
      })

      const place = response.data.result
      if (!place) return null

      return {
        place_id: place.place_id || '',
        name: place.name || '',
        formatted_address: place.formatted_address || '',
        rating: place.rating,
        user_ratings_total: place.user_ratings_total,
        reviews: (place.reviews || []) as unknown as GoogleReview[],
        geometry: place.geometry as any
      }
    } catch (error) {
      console.error('Google Places details error:', error)
      return null
    }
  }

  /**
   * Get reviews for a specific place
   */
  async getPlaceReviews(placeId: string): Promise<GoogleReview[]> {
    const placeDetails = await this.getPlaceDetails(placeId)
    return placeDetails?.reviews || []
  }

  /**
   * Convert Google review to our review format
   */
  convertGoogleReview(googleReview: GoogleReview, placeId: string, placeName: string) {
    return {
      id: `google_${placeId}_${googleReview.time}`,
      title: null,
      content: googleReview.text,
      rating: googleReview.rating,
      source: 'GOOGLE',
      sourceId: googleReview.time.toString(),
      sourceUrl: googleReview.author_url,
      authorName: googleReview.author_name,
      authorEmail: null,
      sentiment: this.analyzeSentiment(googleReview.text),
      createdAt: new Date(googleReview.time * 1000)
    }
  }

  /**
   * Simple sentiment analysis
   */
  private analyzeSentiment(text: string): string {
    const positiveWords = ['excellent', 'amazing', 'wonderful', 'great', 'good', 'awesome', 'love', 'best', 'perfect', 'outstanding']
    const negativeWords = ['terrible', 'awful', 'horrible', 'bad', 'worst', 'hate', 'disappointing', 'poor', 'disgusting']
    
    const lowerText = text.toLowerCase()
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length
    
    if (positiveCount > negativeCount) return 'POSITIVE'
    if (negativeCount > positiveCount) return 'NEGATIVE'
    return 'NEUTRAL'
  }

  /**
   * Search and get reviews for a business
   */
  async searchAndGetReviews(businessName: string, location?: string): Promise<{
    place: GooglePlaceDetails | null
    reviews: any[]
  }> {
    // First search for the place
    const searchResults = await this.searchPlaces(businessName, location)
    
    if (searchResults.length === 0) {
      return { place: null, reviews: [] }
    }

    // Get the first result (most relevant)
    const place = searchResults[0]
    
    // Get detailed information including reviews
    const placeDetails = await this.getPlaceDetails(place.place_id)
    
    if (!placeDetails) {
      return { place: null, reviews: [] }
    }

    // Convert reviews to our format
    const reviews = placeDetails.reviews?.map(review => 
      this.convertGoogleReview(review, placeDetails.place_id, placeDetails.name)
    ) || []

    return {
      place: placeDetails,
      reviews
    }
  }
}
