# Google OAuth Integration Setup

## 🚀 Overview

This guide shows you how to set up Google OAuth integration to connect your Google My Business account and import reviews directly from Google.

## 🔧 Setup Steps

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - **Google My Business API** (deprecated, but still works)
   - **Google Business Profile API** (new)
   - **Google+ API** (for user info)

### 2. Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in required information:
   - App name: "ReviewDuel"
   - User support email: your email
   - Developer contact: your email
4. Add scopes:
   - `https://www.googleapis.com/auth/business.manage`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`

### 3. Create OAuth Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application**
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback`
   - `https://yourdomain.com/api/auth/google/callback` (for production)
5. Copy the **Client ID** and **Client Secret**

### 4. Update Environment Variables

Add to your `.env.local` file:

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
```

### 5. Restart the Server

```bash
npm run dev
```

## 🎯 How It Works

### Login Access vs Public Access

**Login Access:**
- User logs in with their Google account
- Accesses their own Google My Business listings
- Can import reviews and respond to them
- Full management capabilities

**Public Access:**
- No login required
- Can view public business information
- Limited to publicly available data
- Good for monitoring competitors

### OAuth Flow

1. User clicks "Log in with Google"
2. Redirected to Google OAuth consent screen
3. User grants permissions
4. Google redirects back with authorization code
5. App exchanges code for access tokens
6. Tokens stored securely for API calls
7. User can now import reviews and manage responses

## 🔍 Testing the Integration

### 1. Visit the Integration Page

Go to: http://localhost:3000/google-integration

### 2. Connect Google Account

1. Click "Connect Google Account"
2. Choose "Login Access" or "Public Access"
3. Click "Log in with Google"
4. Complete OAuth flow

### 3. View Your Businesses

After connecting, you'll see:
- List of your Google My Business listings
- Business details (name, address, rating, review count)
- Ability to select and view reviews

### 4. Import Reviews

1. Select a business from the list
2. View imported reviews
3. See review details and responses
4. Analyze sentiment and staff mentions

## 📊 Features

### Review Management
- Import reviews from Google My Business
- View review details and ratings
- See existing responses
- Respond to reviews directly

### Analytics
- Review sentiment analysis
- Staff mention detection
- Rating trends over time
- Response time tracking

### Notifications
- New review alerts
- Response reminders
- Performance insights

## 🛠️ API Endpoints

### OAuth Flow
```
GET /api/auth/google - Start OAuth flow
GET /api/auth/google/callback - OAuth callback
```

### Business Data
```
GET /api/google/businesses - Get user's businesses
GET /api/google/reviews?placeId=PLACE_ID - Get business reviews
```

## 🔒 Security Considerations

### Token Storage
- Access tokens stored encrypted in database
- Refresh tokens for long-term access
- Automatic token refresh when expired

### Permissions
- Minimal required scopes
- User can revoke access anytime
- Secure token handling

### Data Privacy
- Only access user's own business data
- No data sharing with third parties
- GDPR compliant data handling

## 🚨 Important Notes

### Google My Business API Deprecation
- Google My Business API is deprecated
- New Google Business Profile API available
- Migration required for long-term support

### Rate Limits
- Google API has rate limits
- Implement proper error handling
- Consider caching for performance

### Costs
- Google API calls may incur costs
- Monitor usage in Google Cloud Console
- Set up billing alerts

## 🆘 Troubleshooting

### Common Issues

1. **"Access denied" error**
   - Check OAuth consent screen configuration
   - Verify redirect URI matches exactly
   - Ensure required scopes are added

2. **"Invalid client" error**
   - Verify Client ID and Secret are correct
   - Check environment variables
   - Ensure OAuth credentials are active

3. **"No businesses found"**
   - User may not have Google My Business listings
   - Check if business is verified
   - Verify API permissions

4. **"Reviews not loading"**
   - Some businesses may not have reviews
   - Check if place has Google My Business profile
   - Verify API access permissions

### Debug Steps

1. Check browser console for errors
2. Verify environment variables
3. Test OAuth flow step by step
4. Check Google Cloud Console for API status
5. Review API quotas and billing

## 📈 Next Steps

1. **Set up OAuth credentials**
2. **Test with your Google account**
3. **Import your business reviews**
4. **Configure staff members**
5. **Set up notifications**
6. **Generate reports**

## 🎉 You're Ready!

Your Google OAuth integration is now set up! You can import reviews, respond to customers, and get insights from your Google My Business profile directly in the ReviewDuel platform.
