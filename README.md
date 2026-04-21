# TurfMate

A full-stack web application for managing turfs (sports fields), matches, and bookings. TurfMate provides a seamless platform for players to discover turfs, book matches, and for turf owners to manage their properties and revenue.

## Features

### For Players 🏃‍♂️
- **Browse & Discover Turfs** - Search and filter available sports fields by location, amenities, and availability
- **Turf Information** - View detailed turf information including photos, pricing, facilities, and real-time availability
- **Ratings & Reviews** - See ratings and read genuine reviews from other players
- **Match Management** - Create new matches, join existing ones, and manage match schedules
- **Player Profiles** - View other players' profiles, statistics, and match history
- **Rating System** - Rate and review turfs and matches to help the community
- **User Authentication** - Secure login/signup with email verification
- **Profile Customization** - Update personal information, profile picture, and preferences
- **Match Notifications** - Get real-time notifications for match updates and bookings
- **Payment Integration** - Secure payment processing for match bookings

### For Turf Owners 🏟️
- **Turf Registration** - Register and list multiple sports facilities with detailed information
- **Inventory Management** - Manage turf availability, pricing, and time slots
- **Booking System** - View and manage all incoming bookings and reservations
- **Earnings Dashboard** - Track revenue, earnings, and financial performance
- **Match Monitoring** - Monitor all matches happening on your turfs
- **Analytics** - View statistics on bookings, popular time slots, and player reviews
- **Profile Management** - Customize owner profile and business information
- **Commission Tracking** - Monitor commissions and platform fees
- **Payment History** - View detailed transaction history and payouts
- **Document Verification** - Upload and manage verification documents for turfs

### For Administrators 🛡️
- **Admin Dashboard** - Comprehensive overview of platform metrics and activities
- **Turf Verification** - Review and approve/reject turf registrations with verification documents
- **Turf Management** - Edit, delete, or suspend turf listings as needed
- **User Management** - Monitor user accounts, handle disputes, and manage user permissions
- **Match Monitoring** - Track all matches, identify issues, and maintain platform quality
- **Payment Processing** - Monitor and process all transactions and payments
- **Revenue Management** - Process revenue splits between platform and turf owners
- **Wallet Management** - Manage user and owner wallets, process refunds
- **Admin Wallet** - Track platform revenue and financial performance
- **Reporting & Analytics** - Generate reports on platform activity, user behavior, and revenue
- **Issue Resolution** - Handle user complaints and disputes effectively

## Project Structure

### Main Directories

#### Frontend (`/frontend`)
The player-facing React application built with Vite and Tailwind CSS.

**Components:**
- `Header.jsx` - Navigation header with logo and main navigation
- `Navbar.jsx` - Top navigation bar with user menu
- `Banner.jsx` - Hero banner section for landing page
- `Footer.jsx` - Application footer
- `TopMatches.jsx` - Display featured/top-rated matches
- `RatingModal.jsx` - Modal for rating turfs and matches
- `StarRating.jsx` - Star rating component

**Pages:**
- `Home.jsx` - Landing page with featured content
- `Matches.jsx` - Browse all available matches
- `MatchDetails.jsx` - Detailed match information page
- `CreateMatch.jsx` - Create new match form
- `MyMatches.jsx` - User's personal matches list
- `About.jsx` - About page
- `Contact.jsx` - Contact/support page
- `Login.jsx` - User authentication page
- `MyProfile.jsx` - User profile management
- `PlayerProfile.jsx` - View other players' profiles
- `Verify.jsx` - Email/account verification page

**Context:**
- `AppContext.jsx` - Global state management for frontend

#### Admin Panel (`/admin`)
Dedicated admin dashboard for platform management.

**Components:**
- `Navbar.jsx` - Admin navigation bar
- `OwnerNavbar.jsx` - Navigation for owner view
- `Sidebar.jsx` - Admin sidebar navigation
- `OwnerSidebar.jsx` - Sidebar for owner management section

**Pages:**
- `Login.jsx` - Admin login page
- `Admin/Dashboard.jsx` - Main admin dashboard with KPIs
- `Admin/AllMatches.jsx` - View and manage all platform matches
- `Admin/VerifyTurfs.jsx` - Review and verify turf applications
- `Admin/TurfManagement.jsx` - Manage turf listings
- `Admin/Payments.jsx` - Monitor and manage payments
- `Admin/ProcessRevenue.jsx` - Process revenue splits and payouts
- `Admin/AdminWallet.jsx` - Track admin/platform wallet
- `Owner/OwnerDashboard.jsx` - Dashboard for turf owner view
- `Owner/OwnerMatches.jsx` - Matches on owner's turfs
- `Owner/OwnerEarnings.jsx` - Owner earnings and analytics
- `Owner/OwnerProfile.jsx` - Owner profile management
- `Owner/TurfManagement.jsx` - Owner's turf management

**Context:**
- `AdminContext.jsx` - State management for admin panel

#### Backend (`/backend`)
Node.js/Express API server handling all business logic and data operations.

**Controllers:**
- `userController.js` - Handles user authentication and profile operations
- `turfController.js` - Manages turf CRUD operations and queries
- `matchController.js` - Handles match creation, booking, and management
- `adminController.js` - Admin-specific operations like verification and reporting

**Models:**
- `userModel.js` - User schema including authentication info and profile data
- `turfModel.js` - Turf/field schema with amenities, pricing, and availability
- `matchModel.js` - Match schema with booking details, players, and pricing

**Routes:**
- `userRoute.js` - User authentication and profile endpoints
- `ownerRoute.js` - Turf owner operations endpoints
- `adminRoute.js` - Admin management endpoints

**Middleware:**
- `authUser.js` - JWT verification for user requests
- `authAdmin.js` - JWT verification and admin role checking
- `multer.js` - File upload handling for images and documents

**Config:**
- `mongodb.js` - MongoDB connection configuration
- `cloudinary.js` - Cloudinary API configuration for image storage

#### Scripts (`/scripts`)
Utility scripts for development and maintenance.

- `create_placeholders.js` - Generate placeholder images for development
- `optimize_images.js` - Image optimization script for production

## Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks and context API
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Context API** - Lightweight state management (no Redux needed)
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

### Admin Panel
- **React 18** - Same as frontend for consistency
- **Vite** - Same build tools
- **Tailwind CSS** - Consistent styling across applications
- **Context API** - Separate admin state management
- **Chart Libraries** - For analytics and reporting

### Backend
- **Node.js** - JavaScript runtime for server-side code
- **Express.js** - Lightweight web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - ODM (Object Document Mapper) for MongoDB
- **Bcrypt** - Password hashing library
- **JWT (jsonwebtoken)** - Token-based authentication
- **Cloudinary** - Cloud-based image storage and optimization
- **Multer** - Middleware for file uploads
- **Cors** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

### Infrastructure & Deployment
- **Vercel** - Serverless platform for frontend and admin deployment
- **MongoDB Atlas** - Cloud MongoDB hosting
- **Cloudinary** - Image storage and CDN
- **Git** - Version control

## Installation

### Prerequisites
- **Node.js** v14 or higher (v16+ recommended)
- **npm** v6 or higher (or yarn/pnpm)
- **MongoDB** database (MongoDB Atlas for cloud, or local MongoDB)
- **Cloudinary** account (free tier available at cloudinary.com)
- **Git** for version control
- **Text Editor** (VS Code recommended)

### Verify Prerequisites
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Ensure Git is installed
git --version
```

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/turfmate.git
cd turfmate
```

### Step 2: Backend Setup

Navigate to backend directory:
```bash
cd backend
npm install
```

Create `.env` file in `backend/` directory with:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/turfmate?retryWrites=true&w=majority
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=1234567890
CLOUDINARY_API_SECRET=your_api_secret_here
PORT=5000
NODE_ENV=development
JWT_SECRET=your_very_secure_random_secret_key_min_32_chars
JWT_EXPIRE=24h
```

Start the backend server:
```bash
npm start
# or with auto-reload
npm run dev
```

Backend will run at `http://localhost:5000`

### Step 3: Frontend Setup

In a new terminal, navigate to frontend:
```bash
cd frontend
npm install
```

Create `.env` file in `frontend/` directory:
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=TurfMate
```

Start development server:
```bash
npm run dev
```

Frontend will run at `http://localhost:5173` (or next available port)

### Step 4: Admin Panel Setup

In a new terminal, navigate to admin:
```bash
cd admin
npm install
```

Create `.env` file in `admin/` directory:
```
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_NAME=TurfMate Admin
```

Start admin panel:
```bash
npm run dev
```

Admin will run at `http://localhost:5174` (or next available port)

### Verify Installation
- Frontend accessible at http://localhost:5173
- Admin panel at http://localhost:5174
- Backend API at http://localhost:5000/api
- Test with: `curl http://localhost:5000/api/health`

## Getting Started

### First-Time Setup Checklist
- [ ] Clone repository
- [ ] Install dependencies in all three directories
- [ ] Create `.env` files in backend, frontend, and admin
- [ ] Start MongoDB (local or verify MongoDB Atlas connection)
- [ ] Create Cloudinary account and get credentials
- [ ] Start backend server
- [ ] Start frontend development server
- [ ] Start admin panel
- [ ] Create test user account via signup
- [ ] Test core functionality

### Quick Test
1. **User Registration**: Sign up on frontend with test account
2. **Turf Owner Registration**: Register as turf owner on admin panel
3. **Create Turf**: Add a test turf listing
4. **Admin Verification**: Approve turf in admin dashboard
5. **Create Match**: Create a test match on frontend
6. **View Dashboard**: Check all dashboards for data

## Available Scripts

### Frontend & Admin Panel
```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (if configured)
npm run lint
```

### Backend
```bash
# Start production server
npm start

# Start with nodemon (auto-reload on file changes)
npm run dev

# Run tests (if configured)
npm test
```

## API Routes

### User Routes (`/api/user`)
Player authentication and profile management endpoints.

**Authentication:**
- `POST /register` - Create new player account
- `POST /login` - Player login
- `POST /verify-email` - Verify email address
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password

**Profile:**
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile
- `GET /profile/:userId` - Get another player's profile
- `POST /profile/picture` - Upload profile picture

**Matches:**
- `GET /matches` - Get all available matches (with filters)
- `GET /matches/:matchId` - Get match details
- `POST /matches/create` - Create new match
- `POST /matches/:matchId/join` - Join a match
- `GET /my-matches` - Get user's matches
- `POST /matches/:matchId/rate` - Rate a match

**Turfs:**
- `GET /turfs` - Get all turfs with filters
- `GET /turfs/:turfId` - Get turf details
- `GET /turfs/:turfId/availability` - Check turf availability
- `POST /turfs/:turfId/rate` - Rate a turf

### Owner Routes (`/api/owner`)
Turf owner management and analytics endpoints.

**Authentication:**
- `POST /register` - Register as turf owner
- `POST /login` - Owner login
- `GET /profile` - Get owner profile
- `PUT /profile` - Update owner profile

**Turf Management:**
- `POST /turfs/create` - Create new turf listing
- `GET /turfs` - Get owner's turfs
- `GET /turfs/:turfId` - Get specific turf details
- `PUT /turfs/:turfId` - Update turf information
- `DELETE /turfs/:turfId` - Delete turf listing
- `POST /turfs/:turfId/images` - Upload turf images

**Analytics:**
- `GET /dashboard` - Owner dashboard with stats
- `GET /earnings` - View earnings summary
- `GET /earnings/detail` - Detailed earnings breakdown
- `GET /bookings` - View all bookings on owner's turfs
- `GET /matches` - View all matches on owner's turfs

### Admin Routes (`/api/admin`)
Administrative operations and platform management endpoints.

**Authentication:**
- `POST /login` - Admin login

**Dashboard:**
- `GET /dashboard` - Admin dashboard with KPIs
- `GET /stats` - Platform statistics

**Turf Management:**
- `GET /turfs` - Get all turfs
- `GET /turfs/pending` - Get pending verification turfs
- `POST /turfs/:turfId/verify` - Approve turf verification
- `POST /turfs/:turfId/reject` - Reject turf verification
- `PUT /turfs/:turfId/status` - Update turf status
- `DELETE /turfs/:turfId` - Delete/suspend turf

**User Management:**
- `GET /users` - Get all users
- `GET /users/:userId` - Get user details
- `PUT /users/:userId` - Update user (admin)
- `DELETE /users/:userId` - Deactivate user

**Match Management:**
- `GET /matches` - Get all matches
- `GET /matches/:matchId` - Get match details
- `PUT /matches/:matchId` - Update match status
- `DELETE /matches/:matchId` - Cancel/delete match

**Payment & Revenue:**
- `GET /payments` - View all transactions
- `GET /payments/:paymentId` - Get payment details
- `POST /process-revenue` - Process owner payouts
- `GET /revenue/summary` - Revenue summary

**Wallet Management:**
- `GET /admin-wallet` - Get admin wallet balance
- `GET /user/:userId/wallet` - Get user wallet
- `POST /wallet/refund` - Process refunds

## Authentication & Security

### JWT (JSON Web Token) Authentication
The application uses JWT for stateless authentication across all user roles.

**User Registration & Login Flow:**
1. User submits email and password
2. Password is hashed using bcrypt
3. User account is created in MongoDB
4. On login, password is verified against stored hash
5. JWT token is generated with user ID and role
6. Token is stored in client localStorage/cookies
7. Token is sent with each API request in Authorization header

**Token Structure:**
```
{
  "userId": "user_id_here",
  "role": "user|owner|admin",
  "email": "user@example.com",
  "iat": 1639654321,
  "exp": 1639740721  // 24 hour expiry
}
```

**Middleware Protection:**
- `authUser.js` - Verifies JWT and ensures user role
- `authAdmin.js` - Verifies JWT and ensures admin role
- All protected routes require valid token in Authorization header

### Password Security
- Passwords are hashed with bcrypt (salt rounds: 10)
- Passwords never stored in plain text
- Password reset tokens are time-limited
- Email verification required for new accounts

## Environment Variables

### Backend (.env)
```
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/turfmate

# Cloudinary (Image Storage)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=24h

# Email Service (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=TurfMate
```

### Admin Panel (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_NAME=TurfMate Admin
```

## Database Models

### User Model
Stores player account information and authentication details.
```
- _id: ObjectId
- email: String (unique)
- password: String (hashed)
- name: String
- phone: String
- profilePicture: String (Cloudinary URL)
- location: String
- bio: String
- ratings: Number (average rating)
- matchesPlayed: Number
- matchHistory: Array[ObjectId] (references to matches)
- createdAt: Date
- updatedAt: Date
```

### Turf Model
Represents sports field listings with details and pricing.
```
- _id: ObjectId
- name: String
- description: String
- owner: ObjectId (reference to User)
- location: String (address)
- coordinates: Object (latitude, longitude for map)
- images: Array[String] (Cloudinary URLs)
- amenities: Array[String] (WiFi, Parking, Lights, etc.)
- pricePerHour: Number
- maxPlayers: Number
- currentBookings: Array[Object]
  - date: Date
  - startTime: String
  - endTime: String
- ratings: Number (average)
- reviews: Array[Object]
  - userId: ObjectId
  - rating: Number
  - comment: String
  - date: Date
- verified: Boolean (admin verification)
- documents: Array[String] (verification documents)
- createdAt: Date
- updatedAt: Date
```

### Match Model
Records match/booking information with player details.
```
- _id: ObjectId
- turf: ObjectId (reference to Turf)
- createdBy: ObjectId (reference to User - match creator)
- players: Array[ObjectId] (references to Users)
- date: Date
- startTime: String
- endTime: String
- skillLevel: String (beginner/intermediate/advanced)
- spotsAvailable: Number
- totalSpots: Number
- price: Number (per player)
- status: String (pending/active/completed/cancelled)
- ratings: Array[Object] (player ratings for the match)
- createdAt: Date
- updatedAt: Date
```

## Deployment

### Production Build

#### Build Frontend
```bash
cd frontend
npm run build
# Creates dist/ directory with optimized files
```

#### Build Admin
```bash
cd admin
npm run build
# Creates dist/ directory with optimized files
```

#### Build Backend
Backend is typically run as-is on server (no build step needed)

### Vercel Deployment

#### Frontend & Admin Deployment
1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Deployment ready"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to vercel.com
   - Click "New Project"
   - Import GitHub repository
   - Select frontend or admin folder as root directory

3. **Configure Environment Variables**
   - Add `VITE_API_URL` in Vercel project settings
   - Point to production backend URL

4. **Deploy**
   - Vercel automatically deploys on git push
   - Each commit creates a new deployment

#### Backend Deployment Options

**Option 1: Heroku (Deprecated - Use alternatives)**
**Option 2: Vercel (Serverless)**
- Create `api/` folder with serverless functions
- Or use Vercel's backend runtime

**Option 3: Railway/Render (Recommended)**
1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy automatically

**Option 4: Self-Hosted (VPS)**
1. Rent VPS (AWS, DigitalOcean, Linode)
2. Install Node.js and MongoDB
3. Clone repository
4. Set environment variables
5. Start with PM2 for process management
   ```bash
   npm install -g pm2
   pm2 start server.js --name "turfmate-api"
   pm2 save
   ```
6. Set up Nginx as reverse proxy
7. Configure SSL with Let's Encrypt

### Environment Variables for Production

**Backend Production .env:**
```
MONGODB_URI=production_mongodb_uri
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
NODE_ENV=production
JWT_SECRET=very_long_random_secret_key_min_64_chars
JWT_EXPIRE=7d
FRONTEND_URL=https://turfmate.com
ADMIN_URL=https://admin.turfmate.com
```

**Frontend/Admin Production .env:**
```
VITE_API_URL=https://api.turfmate.com
VITE_APP_NAME=TurfMate
```

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] No console errors or warnings
- [ ] Environment variables configured
- [ ] Database backups taken
- [ ] API endpoints tested
- [ ] Responsive design verified
- [ ] Performance optimized
- [ ] Security headers configured
- [ ] Error handling implemented
- [ ] Logging configured

### Post-Deployment Monitoring
- Monitor error logs
- Track performance metrics
- Set up uptime monitoring
- Configure alerts for failures
- Regular database backups
- Security patches applied promptly

## Key User Workflows

### Player Workflow
1. **Registration** - Create account, verify email
2. **Browse Turfs** - Search, filter by location/amenities/price
3. **View Details** - Check turf info, photos, reviews, availability
4. **Create/Join Match** - Start new match or join existing ones
5. **Rate & Review** - Leave feedback after match
6. **Track History** - View past matches and statistics

### Turf Owner Workflow
1. **Registration** - Sign up as owner
2. **Add Turfs** - Create turf listing with details, photos, pricing
3. **Submit Verification** - Upload required documents
4. **Wait for Approval** - Admin reviews and verifies turf
5. **Monitor Bookings** - Track incoming matches
6. **Manage Availability** - Update pricing, time slots, amenities
7. **Track Earnings** - Monitor revenue and analytics
8. **Receive Payouts** - Get commissions after admin processes revenue

### Admin Workflow
1. **Login** - Access admin panel
2. **Review Dashboard** - Check platform metrics and statistics
3. **Verify Turfs** - Review pending turf applications
4. **Manage Users** - Monitor accounts and handle issues
5. **Monitor Matches** - Track platform activity
6. **Process Payments** - Manage transactions and revenue splits
7. **Generate Reports** - Create analytics and reports

## Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB URI is correct in .env
- Check network access in MongoDB Atlas
- Verify IP whitelist includes your machine

**Cloudinary Upload Failed**
- Verify Cloudinary credentials in .env
- Check image size and format
- Ensure API key has upload permissions

**CORS Error**
- Add frontend URL to backend CORS configuration
- Check if running on correct ports (3000, 3001, 5000)

**JWT Token Expired**
- Clear browser localStorage
- Re-login to get new token
- Extend token expiry in .env if needed

**Port Already in Use**
- Change PORT in .env or kill process using the port
- Windows: `netstat -ano | findstr :5000`
- Linux/Mac: `lsof -i :5000`

### Development Tips
- Use browser DevTools for debugging React components
- Enable verbose logging in .env with `DEBUG=*`
- Use MongoDB Compass for database inspection
- Clear cache if experiencing hot reload issues

## Project Configuration

### Vite Configuration
The project uses Vite for fast development and optimized builds.

**Build Optimization:**
- Code splitting for better caching
- Tree-shaking for smaller bundle sizes
- CSS minification and extraction
- Image asset optimization

### Tailwind CSS
Tailwind is configured for both frontend and admin panels with custom theme settings.

### PostCSS
PostCSS processes Tailwind directives and optimizes CSS output.

## Contributing

Contributions are welcome! We appreciate your effort to improve TurfMate.

### Development Workflow

1. **Fork the repository**
   ```bash
   # On GitHub, click "Fork" button
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/turfmate.git
   cd turfmate
   ```

3. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Test thoroughly

5. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: Add amazing feature"
   # Use conventional commits: feat, fix, docs, style, refactor, test, chore
   ```

6. **Push to fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Create Pull Request**
   - Go to original repository
   - Click "New Pull Request"
   - Select your branch
   - Add detailed description
   - Wait for review

### Code Style Guidelines
- Use consistent indentation (2 spaces)
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep functions small and focused
- Follow project structure conventions

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** feat, fix, docs, style, refactor, test, chore
**Example:** `feat(auth): Add password reset functionality`

### Reporting Issues
- Check existing issues first
- Provide clear description
- Include error messages
- Add steps to reproduce
- Attach screenshots if applicable

## FAQ

**Q: What's the difference between frontend and admin folders?**
A: Frontend is for regular players to book turfs and play matches. Admin is a separate dashboard for platform administrators and turf owners to manage listings and revenue.

**Q: Can I use this project for my own platform?**
A: Yes! This is open source. You can fork, modify, and deploy it. Please give credit and follow the license.

**Q: Do I need to pay for MongoDB and Cloudinary?**
A: No, both offer free tiers. MongoDB Atlas has free tier (512MB) and Cloudinary has free tier (25GB bandwidth).

**Q: How do I add more features?**
A: Follow the existing code structure. Create components in `/components`, pages in `/pages`, and API routes in backend `/routes`.

**Q: How are payments handled?**
A: Currently, payments are managed through match pricing. You can integrate Stripe/PayPal by:
1. Installing payment SDK
2. Creating payment endpoints
3. Adding payment UI component
4. Storing transaction records in database

**Q: Can multiple turf owners manage one turf?**
A: Currently no. You can modify the Turf model to have multiple owners array.

**Q: How do I backup my MongoDB data?**
A: Use MongoDB Atlas automated backups or `mongodump` command:
```bash
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/turfmate"
```

**Q: How do I reset the database?**
A: **Warning: This deletes all data!**
```bash
# Connect to MongoDB and run:
db.dropDatabase()
```

## Support & Community

- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/turfmate/issues)
- **Discussions**: Join community discussions on GitHub
- **Email**: support@turfmate.com
- **Documentation**: Check README and code comments
- **Stack Overflow**: Tag questions with `#turfmate`

## Resources & Links

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Express.js](https://expressjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [JWT Guide](https://jwt.io)

## Performance Tips

1. **Lazy load components** - Use React.lazy() for route-based splitting
2. **Optimize images** - Use Cloudinary transformations
3. **Caching** - Implement Redis for frequently accessed data
4. **Database indexing** - Add indexes to MongoDB for faster queries
5. **CDN** - Use Vercel's built-in CDN for assets

## Security Considerations

1. **Never commit secrets** - Use .env and .gitignore
2. **Validate input** - Sanitize all user inputs
3. **Rate limiting** - Prevent abuse with rate limits
4. **HTTPS only** - Always use HTTPS in production
5. **CORS properly** - Only allow trusted origins
6. **SQL Injection** - Use Mongoose to prevent NoSQL injection
7. **XSS Protection** - Sanitize HTML in user inputs

## License

This project is licensed under the MIT License - see the LICENSE file for details.

**MIT License Summary:**
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

## Acknowledgments

- React and Vite communities for excellent tools
- MongoDB for reliable database
- Cloudinary for image management
- Vercel for hosting platform
- All contributors who help improve this project
