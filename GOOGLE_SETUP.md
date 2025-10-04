# Google Reviews Integration Setup

## 🚀 Quick Start

The application is now running at **http://localhost:3000**

### Demo Account
- **Email**: `admin@demo.com`
- **Password**: `demo123`

## 🔧 Google Reviews API Setup

To pull real Google Reviews data, you need to set up a Google Places API key:

### 1. Get Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Places API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

### 2. Configure Environment

Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google Places API
GOOGLE_PLACES_API_KEY="your-actual-google-places-api-key"

# Email (optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@reviewduel.com"
```

### 3. Restart the Server

```bash
npm run dev
```

## 🎯 How It Works

### Without API Key (Demo Mode)
- Uses mock data for business search
- Generates sample reviews with staff mentions
- Perfect for testing and demonstration

### With API Key (Production Mode)
- Real Google Places search results
- Actual Google Reviews data
- Live business information and ratings

## 🔍 Testing the Integration

1. **Sign in** with the demo account
2. **Go to Reviews** → **Add Business**
3. **Search for a real business** (e.g., "McDonald's", "Starbucks")
4. **Select the business** from Google Places results
5. **Collect reviews** to see real Google Reviews data

## 📊 Features

### Business Search
- Real-time autocomplete with Google Places
- Business details (rating, address, review count)
- Keyboard navigation support

### Review Collection
- Pulls actual Google Reviews
- Automatic sentiment analysis
- Staff mention detection
- Duplicate prevention

### Analytics
- Real review data visualization
- Sentiment trends over time
- Staff performance metrics
- Export capabilities

## 🛠️ API Endpoints

### Business Search
```
POST /api/businesses/search
{
  "query": "business name",
  "location": "city, state" // optional
}
```

### Review Collection
```
POST /api/reviews/collect
{
  "businessInfo": {
    "name": "Business Name",
    "googlePlaceId": "place_id_from_google",
    "address": "Business Address"
  }
}
```

## 🔒 Security Notes

- Keep your API key secure
- Set up API key restrictions in Google Cloud Console
- Monitor API usage and costs
- Use environment variables for sensitive data

## 📈 Next Steps

1. **Set up your Google Places API key**
2. **Test with real businesses**
3. **Add your staff members**
4. **Collect and analyze reviews**
5. **Generate reports**

## 🆘 Troubleshooting

### Common Issues

1. **"No businesses found"**
   - Check your API key is correct
   - Ensure Places API is enabled
   - Verify API key has proper permissions

2. **"Reviews not loading"**
   - Some businesses may not have reviews
   - Check if the place has a Google My Business listing
   - Verify the place_id is correct

3. **"API quota exceeded"**
   - Check your Google Cloud billing
   - Monitor API usage in Google Cloud Console
   - Consider upgrading your quota

### Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your API key configuration
3. Test with different business names
4. Check Google Cloud Console for API status

## 🎉 You're Ready!

Your ReviewDuel clone is now ready to pull real Google Reviews data. Start by adding your business and collecting reviews to see the full system in action!
