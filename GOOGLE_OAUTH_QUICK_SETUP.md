# Google OAuth Quick Setup Guide

## 🚀 Fix the 400 Error

The 400 error you're seeing is because Google OAuth credentials are not properly configured. Here's how to fix it:

## 📋 Step-by-Step Setup

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Create or Select Project
- Create a new project or select existing one
- Note your project ID

### 3. Enable Required APIs
Go to **APIs & Services** → **Library** and enable:
- **Places API**
- **Google My Business API** (if available)
- **Google Business Profile API** (newer)

### 4. Configure OAuth Consent Screen
Go to **APIs & Services** → **OAuth consent screen**:
- Choose **External** user type
- Fill in required information:
  - App name: "ReviewDuel"
  - User support email: your email
  - Developer contact: your email
- Add scopes:
  - `https://www.googleapis.com/auth/business.manage`
  - `https://www.googleapis.com/auth/userinfo.email`
  - `https://www.googleapis.com/auth/userinfo.profile`

### 5. Create OAuth Credentials
Go to **APIs & Services** → **Credentials**:
- Click **Create Credentials** → **OAuth 2.0 Client ID**
- Choose **Web application**
- Add authorized redirect URIs:
  - `http://localhost:3000/api/auth/google/callback`
  - `https://yourdomain.com/api/auth/google/callback` (for production)

### 6. Update Environment Variables
Edit your `.env.local` file:

```env
# Replace these with your actual credentials
GOOGLE_CLIENT_ID="your-actual-client-id-here"
GOOGLE_CLIENT_SECRET="your-actual-client-secret-here"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
```

### 7. Restart the Server
```bash
npm run dev
```

## 🧪 Test the Integration

1. **Sign in** to your app: http://localhost:3000/auth/signin
   - Email: `admin@demo.com`
   - Password: `demo123`

2. **Go to Integrations**: http://localhost:3000/dashboard/integrations

3. **Click Google card** - it should now work without 400 error

4. **Complete OAuth flow** - you'll be redirected to Google

5. **Grant permissions** - check all the boxes

6. **Return to app** - you'll see "Google account connected successfully!"

## 🎯 What You'll Get

After successful setup:
- ✅ Connect to Google My Business
- ✅ Import historical reviews (1-5 years)
- ✅ Analyze staff mentions
- ✅ Sentiment analysis
- ✅ Staff performance metrics

## 🔍 Test the Analysis

1. **Go to Google Analysis**: http://localhost:3000/dashboard/google-analysis
2. **Select location** (The French Laundry)
3. **Add staff names** (Sarah, Mike, Emily)
4. **Choose time period** (2 years)
5. **Click "Run Analysis"**

## 🆘 Troubleshooting

### Still getting 400 error?
- Check that your Client ID and Secret are correct
- Ensure redirect URI matches exactly
- Make sure APIs are enabled
- Check that OAuth consent screen is configured

### "Access denied" error?
- Check OAuth consent screen configuration
- Ensure required scopes are added
- Verify redirect URI is correct

### "No businesses found"?
- User may not have Google My Business listings
- Check if business is verified
- Verify API permissions

## 🎉 Success!

Once configured, you'll be able to:
- Import real Google My Business reviews
- Analyze staff mentions with sentiment
- Track performance over time
- Generate reports and insights

The system is now ready to work with real Google My Business data!
