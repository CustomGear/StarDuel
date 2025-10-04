// Test script to fetch real Google Reviews for The French Laundry
import { GoogleReviewsService } from './lib/google-reviews.js';

async function testGoogleReviews() {
  console.log('🧪 Testing Google Reviews integration...');
  
  // Check if we have a Google API key
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  
  if (!apiKey || apiKey === 'your-google-places-api-key-here') {
    console.log('❌ No Google Places API key found.');
    console.log('💡 The app will use mock data instead.');
    console.log('   To test with real data, set up your API key in .env.local');
    return;
  }
  
  const googleReviewsService = new GoogleReviewsService(apiKey);
  
  // Test with The French Laundry's Google Place ID
  const placeId = 'ChIJN1t_tDeuEmsRUsoyG83frY4';
  
  try {
    console.log('📍 Fetching reviews for The French Laundry...');
    const reviews = await googleReviewsService.getPlaceReviews(placeId);
    
    console.log(`✅ Found ${reviews.length} reviews:`);
    reviews.forEach((review, index) => {
      console.log(`\n${index + 1}. Rating: ${review.rating}/5`);
      console.log(`   Author: ${review.author_name}`);
      console.log(`   Text: ${review.text.substring(0, 100)}...`);
      console.log(`   Date: ${review.relative_time_description}`);
    });
    
  } catch (error) {
    console.log('❌ Error fetching reviews:', error.message);
    console.log('💡 This might be due to API key issues or rate limits.');
  }
}

testGoogleReviews();
