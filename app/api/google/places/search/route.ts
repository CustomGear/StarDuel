import { NextRequest, NextResponse } from 'next/server'
import { GoogleReviewsService } from '@/lib/google-reviews'

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()
    
    if (!query || query.length < 2) {
      return NextResponse.json({ 
        success: false, 
        error: 'Query must be at least 2 characters long' 
      }, { status: 400 })
    }

    // Check if we have a Google Places API key
    const apiKey = process.env.GOOGLE_PLACES_API_KEY
    
    if (!apiKey || apiKey === 'your-google-places-api-key') {
      // Return comprehensive mock data for demo purposes
      const mockPlaces = [
        // Fine Dining
        {
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          name: 'The French Laundry',
          formatted_address: '6640 Washington St, Yountville, CA 94599, USA',
          rating: 4.5,
          user_ratings_total: 1250,
          business_status: 'OPERATIONAL'
        },
        {
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          name: 'Eleven Madison Park',
          formatted_address: '11 Madison Ave, New York, NY 10010, USA',
          rating: 4.3,
          user_ratings_total: 890,
          business_status: 'OPERATIONAL'
        },
        {
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          name: 'Noma',
          formatted_address: 'Refshalevej 96, 1432 København, Denmark',
          rating: 4.7,
          user_ratings_total: 2100,
          business_status: 'OPERATIONAL'
        },
        // Casual Dining
        {
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          name: 'McDonald\'s',
          formatted_address: '123 Main St, New York, NY 10001, USA',
          rating: 3.8,
          user_ratings_total: 450,
          business_status: 'OPERATIONAL'
        },
        {
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          name: 'Starbucks Coffee',
          formatted_address: '456 Broadway, New York, NY 10013, USA',
          rating: 4.1,
          user_ratings_total: 320,
          business_status: 'OPERATIONAL'
        },
        {
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          name: 'Pizza Hut',
          formatted_address: '789 5th Ave, New York, NY 10022, USA',
          rating: 3.9,
          user_ratings_total: 280,
          business_status: 'OPERATIONAL'
        },
        // Local Restaurants
        {
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          name: 'Tony\'s Italian Restaurant',
          formatted_address: '321 Mulberry St, New York, NY 10012, USA',
          rating: 4.2,
          user_ratings_total: 180,
          business_status: 'OPERATIONAL'
        },
        {
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          name: 'Sushi Zen',
          formatted_address: '654 Lexington Ave, New York, NY 10016, USA',
          rating: 4.4,
          user_ratings_total: 220,
          business_status: 'OPERATIONAL'
        },
        {
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          name: 'Burger Palace',
          formatted_address: '987 3rd Ave, New York, NY 10017, USA',
          rating: 4.0,
          user_ratings_total: 150,
          business_status: 'OPERATIONAL'
        },
        // Numbered Restaurants
        {
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          name: 'Restaurant 18',
          formatted_address: '18 York St, New York, NY 10013, USA',
          rating: 4.2,
          user_ratings_total: 340,
          business_status: 'OPERATIONAL'
        },
        {
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          name: '18 Restaurant Row',
          formatted_address: '18 Restaurant Row, New York, NY 10010, USA',
          rating: 4.0,
          user_ratings_total: 156,
          business_status: 'OPERATIONAL'
        },
        {
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          name: 'Eighteen',
          formatted_address: '18 East 81st Street, New York, NY 10028, USA',
          rating: 4.4,
          user_ratings_total: 420,
          business_status: 'OPERATIONAL'
        },
        {
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          name: 'Restaurant E18hteen',
          formatted_address: '18 York Street, Ottawa, ON K1N 5T2, Canada',
          rating: 4.1,
          user_ratings_total: 89,
          business_status: 'OPERATIONAL'
        },
        // International
        {
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          name: 'Le Bernardin',
          formatted_address: '155 W 51st St, New York, NY 10019, USA',
          rating: 4.6,
          user_ratings_total: 1200,
          business_status: 'OPERATIONAL'
        },
        {
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          name: 'Per Se',
          formatted_address: '10 Columbus Cir, New York, NY 10019, USA',
          rating: 4.5,
          user_ratings_total: 980,
          business_status: 'OPERATIONAL'
        },
        {
          place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
          name: 'Momofuku Ko',
          formatted_address: '8 Extra Pl, New York, NY 10003, USA',
          rating: 4.3,
          user_ratings_total: 650,
          business_status: 'OPERATIONAL'
        }
      ]

      // Enhanced search logic for any business
      const queryWords = query.toLowerCase().split(' ').filter((word: string) => word.length > 0)
      
      const filteredPlaces = mockPlaces.filter(place => {
        const searchText = `${place.name} ${place.formatted_address}`.toLowerCase()
        
        // Check if all query words are found in the search text
        return queryWords.every((word: string) => searchText.includes(word))
      })

      // Sort by relevance (exact matches first, then partial matches)
      const sortedPlaces = filteredPlaces.sort((a, b) => {
        const aText = `${a.name} ${a.formatted_address}`.toLowerCase()
        const bText = `${b.name} ${b.formatted_address}`.toLowerCase()
        
        const aExactMatch = aText.includes(query.toLowerCase())
        const bExactMatch = bText.includes(query.toLowerCase())
        
        if (aExactMatch && !bExactMatch) return -1
        if (!aExactMatch && bExactMatch) return 1
        
        // If both or neither are exact matches, sort by rating
        return (b.rating || 0) - (a.rating || 0)
      })

      return NextResponse.json({
        success: true,
        places: sortedPlaces,
        usingMockData: true,
        message: 'Using demo data. Add GOOGLE_PLACES_API_KEY to .env.local for real Google search.'
      })
    }

    // Use real Google Places API
    const googleReviewsService = new GoogleReviewsService(apiKey)
    const places = await googleReviewsService.searchPlaces(query)
    
    return NextResponse.json({
      success: true,
      places,
      usingMockData: false,
      message: 'Using real Google Places API'
    })
  } catch (error) {
    console.error('Error searching places:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to search places' 
    }, { status: 500 })
  }
}
