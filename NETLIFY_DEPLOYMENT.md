# Netlify Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Upload to Netlify
1. Go to [Netlify](https://netlify.com) and sign in
2. Drag and drop the `socialup-reviews-deploy.zip` file to the deploy area
3. Or click "New site from Git" and connect your repository

### 2. Configure Build Settings
In Netlify dashboard, go to **Site settings > Build & deploy > Build settings**:

- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: `18.x` (in Environment variables)

### 3. Set Environment Variables
Go to **Site settings > Environment variables** and add:

```
NEXTAUTH_URL=https://your-site-name.netlify.app
NEXTAUTH_SECRET=your-super-secret-jwt-key-change-this-in-production
DATABASE_URL=your-production-database-url
GOOGLE_PLACES_API_KEY=your-google-places-api-key
```

### 4. Database Setup
For production, you'll need a real database. Recommended options:

**Option A: PlanetScale (MySQL)**
1. Create account at [planetscale.com](https://planetscale.com)
2. Create a new database
3. Copy the connection string to `DATABASE_URL`

**Option B: Supabase (PostgreSQL)**
1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the connection string to `DATABASE_URL`

**Option C: Railway**
1. Create account at [railway.app](https://railway.app)
2. Deploy a PostgreSQL database
3. Copy the connection string to `DATABASE_URL`

### 5. Run Database Migrations
After setting up the database, run:
```bash
npx prisma migrate deploy
npx prisma db seed
```

### 6. Custom Domain Setup
1. In Netlify, go to **Domain settings**
2. Add your custom domain (e.g., `starduel.ca`)
3. Configure DNS records as instructed by Netlify

## 🔧 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_URL` | Your site URL | ✅ |
| `NEXTAUTH_SECRET` | Random secret for JWT | ✅ |
| `DATABASE_URL` | Database connection string | ✅ |
| `GOOGLE_PLACES_API_KEY` | Google Places API key | ❌ (for demo mode) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ❌ (for OAuth features) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ❌ (for OAuth features) |

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version is set to 18.x
- Ensure all environment variables are set
- Check build logs for specific errors

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure database allows connections from Netlify IPs
- Run migrations: `npx prisma migrate deploy`

### Authentication Issues
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure callback URLs are configured correctly

## 📝 Post-Deployment

1. **Test the application** by visiting your Netlify URL
2. **Set up Google APIs** (optional) using the guides in:
   - `GOOGLE_PLACES_SETUP.md`
   - `GOOGLE_OAUTH_SETUP.md`
3. **Configure auto-responses** (future feature)
4. **Set up monitoring** and analytics

## 🎯 Next Steps

- [ ] Deploy to production database
- [ ] Set up Google APIs for full functionality
- [ ] Configure custom domain
- [ ] Set up monitoring
- [ ] Implement auto-response feature
