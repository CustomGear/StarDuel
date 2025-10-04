# ReviewDuel Clone

A comprehensive SaaS platform for tracking and analyzing staff mentions in customer reviews across multiple platforms.

## Features

- **Review Collection**: Automatically collect reviews from Google, Yelp, Trustpilot, and other platforms
- **Staff Mention Tracking**: Detect and track when staff members are mentioned in reviews
- **Sentiment Analysis**: Analyze the sentiment of reviews and mentions
- **Analytics Dashboard**: Comprehensive insights into review performance and staff metrics
- **Reporting System**: Generate detailed reports in multiple formats
- **Notification System**: Real-time alerts for new reviews and mentions
- **Admin Panel**: Manage staff, users, and company settings

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Icons**: Heroicons
- **Styling**: Tailwind CSS with custom components

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- API keys for Google Places, Yelp, and Trustpilot (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd reviewduel-clone
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/reviewduel"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Email (optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@reviewduel.com"

# API Keys (optional)
GOOGLE_PLACES_API_KEY="your-google-places-api-key"
YELP_API_KEY="your-yelp-api-key"
TRUSTPILOT_API_KEY="your-trustpilot-api-key"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
reviewduel-clone/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility functions and services
├── prisma/                # Database schema and migrations
└── public/                # Static assets
```

## Key Components

### Authentication
- User registration and login
- Company-based multi-tenancy
- Role-based access control

### Dashboard
- Overview of key metrics
- Recent reviews and staff mentions
- Performance trends and analytics

### Review Management
- Collect reviews from multiple platforms
- Filter and search functionality
- Sentiment analysis and categorization

### Staff Tracking
- Add and manage staff members
- Track mentions across reviews
- Performance metrics and insights

### Analytics
- Comprehensive reporting
- Sentiment trends over time
- Staff performance comparisons

### Notifications
- Real-time alerts for new reviews
- Email notifications
- In-app notification center

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Reviews
- `POST /api/reviews/collect` - Collect reviews from external platforms
- `POST /api/reviews/search-businesses` - Search for businesses

### Staff
- `GET /api/staff` - Get staff members
- `POST /api/staff` - Add new staff member

### Analytics
- `GET /api/analytics` - Get analytics data
- `POST /api/sentiment/analyze` - Analyze sentiment

### Reports
- `POST /api/reports/generate` - Generate reports

### Notifications
- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/[id]/read` - Mark notification as read

## Database Schema

The application uses PostgreSQL with the following main entities:

- **Users**: Company users with roles
- **Companies**: Multi-tenant company data
- **Staff**: Staff members to track
- **Reviews**: Collected reviews from external platforms
- **Mentions**: Staff mentions within reviews
- **Notifications**: User notifications
- **Analytics**: Performance metrics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
