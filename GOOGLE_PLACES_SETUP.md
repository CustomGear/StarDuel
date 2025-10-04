# Google Places API Setup Guide

To enable real business search functionality, you need to set up Google Places API.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable billing (required for Places API)

## Step 2: Enable Places API

1. Go to "APIs & Services" > "Library"
2. Search for "Places API"
3. Click "Places API" and enable it
4. Also enable "Places API (New)" for better functionality

## Step 3: Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key
4. (Optional) Restrict the key to Places API only

## Step 4: Add to Environment

Replace `your-actual-api-key-here` in your `.env.local` file with your real API key:

```
GOOGLE_PLACES_API_KEY="AIzaSyBvOkBw-1234567890abcdefghijklmnopqrstuvwxyz"
```

## Step 5: Restart Dev Server

```bash
npm run dev
```

## Step 6: Test the Integration

1. Go to: http://localhost:3000/dashboard/integrations
2. Click Google → Public Access
3. Search for any real business:
   - "starbucks times square"
   - "mcdonalds manhattan"
   - "pizza hut brooklyn"
   - Any real business name

## Pricing

- Places API Text Search: $32 per 1,000 requests
- Places API Autocomplete: $2.83 per 1,000 requests
- Places API Details: $17 per 1,000 requests

Google provides $200 free credit monthly, which covers thousands of searches.

## Security Note

Never commit your API key to version control. Always use environment variables.

## Troubleshooting

- **"Using demo data" message**: API key not set or invalid
- **No results**: Check if Places API is enabled
- **Quota exceeded**: Check billing and usage limits