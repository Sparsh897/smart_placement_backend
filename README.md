# Smart Placement Backend

Backend API for the Smart Placement app built with Node.js, Express, and MongoDB.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and other settings

# 3. Populate database with sample data
npm run populate-expanded

# 4. Start the development server
npm run dev
```

The API will be available at `http://localhost:5000`

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure your settings:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/smart_placement
PORT=5000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Session Configuration
SESSION_SECRET=your-session-secret-change-in-production

# Google OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### Google OAuth Setup (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (for development)
   - `https://yourdomain.com/api/auth/google/callback` (for production)
6. Copy Client ID and Client Secret to your `.env` file

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For macOS with Homebrew
brew services start mongodb-community

# For Ubuntu/Linux
sudo systemctl start mongod

# For Windows
net start MongoDB
```

### 4. Populate Database with Job Data
Run the population script to add sample job data:
```bash
npm run populate
```

### 4a. Populate with Expanded Dataset (Recommended)
For a more comprehensive dataset with jobs across different specializations:
```bash
npm run populate-expanded
```

This will add 18 jobs across 14 domains:
- AI / ML (2 jobs)
- Data Science (2 jobs) 
- Web Development (2 jobs)
- Digital Marketing (2 jobs)
- Financial Analysis (1 job)
- Software Development (1 job)
- Cloud Computing (1 job)
- Cybersecurity (1 job)
- Design Engineering (1 job)
- Construction Management (1 job)
- Power Systems (1 job)
- Business Intelligence (1 job)
- HR Operations (1 job)
- Investment Banking (1 job)

**Education Level Distribution:**
- Graduate: 10 jobs
- Post Graduate: 8 jobs

**Specialization Coverage:**
- CSE: 5 jobs
- Marketing: 2 jobs
- Finance: 2 jobs
- Mathematics, Data Science, Web Development, Cloud Computing, Mechanical, Civil, Electrical, Business Analytics, HR: 1 job each

### 5. Verify Data
Check if the data was inserted correctly:
```bash
npm run verify
```

### 6. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Jobs
- `GET /api/jobs` - Get all jobs with filtering and pagination
- `GET /api/jobs/:id` - Get job by ID
- `GET /api/jobs/meta/domains` - Get available job domains
- `GET /api/jobs/meta/locations` - Get available job locations
- `GET /api/jobs/meta/companies` - Get available companies

### Authentication
- `POST /api/auth/register` - Register with email/password
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/google` - Initiate Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/auth/google/mobile` - Google OAuth for mobile apps
- `GET /api/auth/me` - Get current user (requires authentication)
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/change-password` - Change password (requires authentication)
- `DELETE /api/auth/account` - Delete account (requires authentication)

### User Profile
- `GET /api/users/profile` - Get user profile (requires authentication)
- `PUT /api/users/profile` - Update user profile (requires authentication)
- `POST /api/users/work-experience` - Add work experience (requires authentication)
- `PUT /api/users/work-experience/:id` - Update work experience (requires authentication)
- `DELETE /api/users/work-experience/:id` - Delete work experience (requires authentication)
- `POST /api/users/education` - Add education (requires authentication)
- `PUT /api/users/education/:id` - Update education (requires authentication)
- `DELETE /api/users/education/:id` - Delete education (requires authentication)
- `POST /api/users/skills` - Add skills (requires authentication)
- `PUT /api/users/skills/:id` - Update skill (requires authentication)
- `DELETE /api/users/skills/:id` - Delete skill (requires authentication)
- `POST /api/users/certifications` - Add certification (requires authentication)
- `PUT /api/users/certifications/:id` - Update certification (requires authentication)
- `DELETE /api/users/certifications/:id` - Delete certification (requires authentication)

### Education Data
- `GET /api/education/levels` - Get education levels (Graduate, Post Graduate)
- `GET /api/education/courses?level=Graduate` - Get courses by education level
- `GET /api/education/specializations?course=B.Tech / B.E` - Get specializations by course
- `GET /api/education/domains?specialization=CSE` - Get domains by specialization
- `GET /api/education/all` - Get complete education hierarchy

### Available Query Parameters for `/api/jobs`:
- `educationLevel` - Filter by education level (Graduate, Post Graduate)
- `course` - Filter by course (B.Tech / B.E, B.Sc, BBA, BCA, B.Com, etc.)
- `specialization` - Filter by specialization (CSE, Mechanical, Civil, etc.)
- `domain` - Filter by job domain (AI / ML, Data Science, Web Development, etc.)
- `location` - Filter by location (partial match, case-insensitive)
- `search` - Search in title, company, description, domain
- `page` - Page number for pagination (default: 1)
- `limit` - Number of jobs per page (default: 20)

## Job Data Structure

Each job contains:
- **title** - Job title
- **company** - Company name
- **location** - Job location
- **salary** - Salary range
- **domain** - Job domain/category
- **description** - Detailed job description (enhanced with responsibilities, skills, growth opportunities)
- **eligibility** - Eligibility criteria
- **educationLevel** - Required education level
- **course** - Required course background
- **specialization** - Required specialization
- **skills** - Array of required skills
- **applyLink** - Application URL

## Database Schema

The application uses MongoDB with Mongoose ODM. The Job model includes all necessary fields for filtering and searching based on user preferences.

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with auto-reload
- `npm run populate` - Populate database with basic job data (12 jobs)
- `npm run populate-expanded` - Populate database with expanded job data (18 jobs)
- `npm run verify` - Verify database contents

## Testing & Documentation

### API Testing Files
- **`api_test_commands.md`** - Complete curl commands for all endpoints (70+ commands)
- **`Smart_Placement_API.postman_collection.json`** - Postman collection with automatic token management
- **`Smart_Placement_Environment.postman_environment.json`** - Postman environment variables
- **`POSTMAN_SETUP.md`** - Complete Postman setup and testing guide
- **`curl_commands.sh`** - Bash script for automated API testing

### Flutter Integration
The `api_test_commands.md` file includes:
- Complete Flutter integration examples
- Dart code snippets for HTTP services
- Error handling patterns
- Token management examples
- Production deployment notes

## Features

### Job Management
- ✅ Enhanced job descriptions (~200 words each) with detailed responsibilities and growth opportunities
- ✅ Comprehensive skill sets for each job
- ✅ Hierarchical education structure (Education Level → Course → Specialization → Domain)
- ✅ 18 jobs across 14 different domains and 12 specializations
- ✅ Advanced filtering by education level, course, specialization, domain, location
- ✅ Search functionality across job titles, companies, descriptions
- ✅ Pagination support for large datasets

### Authentication & User Management
- ✅ **Dual Login System**: Email/Password + Google OAuth with login type separation
- ✅ **JWT-based authentication** with secure token management (7-day expiration)
- ✅ **User registration and login** with comprehensive input validation
- ✅ **Google OAuth integration** for web and mobile (with Firebase UID support)
- ✅ **Password security** with bcrypt hashing and strength validation
- ✅ **Cross-login prevention** with specific error messages for each scenario
- ✅ **Profile management** with comprehensive user data and preferences
- ✅ **Work experience, education, skills, and certifications** management
- ✅ **Account security** with password change and account deletion
- ✅ **Optional phone number** during registration (can be added later)

### Technical Features
- ✅ Structured API responses with success/error handling
- ✅ Education data API endpoints for dynamic filtering
- ✅ MongoDB integration with Mongoose
- ✅ RESTful API endpoints with proper HTTP status codes
- ✅ Input validation and sanitization
- ✅ CORS configuration for frontend integration
- ✅ Session management for OAuth flows
- ✅ Data population and verification scripts
- ✅ Environment configuration support

## Authentication Logic

### Login Type Separation
The API enforces strict separation between login types to prevent security issues:

- **Email Users**: Can only login with email/password
- **Google Users**: Can only login via Google OAuth
- **Cross-login Prevention**: System prevents mixing login types for the same email

### Error Handling
The API provides specific error codes for different scenarios:

- `GOOGLE_USER_EXISTS`: Email already registered with Google (during email registration)
- `EMAIL_USER_EXISTS`: Email already registered with email/password (during Google OAuth)
- `GOOGLE_USER`: Trying to login with email/password for Google account
- `USER_EXISTS`: General user exists error
- `VALIDATION_ERROR`: Input validation failures with detailed field errors

### Default Values
- **Google Users**: Get default password "admin@12345" (hashed, not usable for login)
- **Phone**: Optional for all users, null by default for Google users
- **Firebase UID**: Optional, stored for Firebase integration

## API Response Examples

### Authentication

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Note:** Phone number is now optional during registration.

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "loginType": "email",
      "profile": {...},
      "preferences": {...}
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "tokenType": "Bearer",
      "expiresIn": "7d"
    }
  },
  "message": "User registered successfully"
}
```

#### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Google OAuth (Mobile)
```bash
POST /api/auth/google/mobile
Content-Type: application/json

{
  "googleToken": "google-access-token",
  "userInfo": {
    "email": "john@gmail.com",
    "name": "John Doe",
    "picture": "https://...",
    "sub": "google-user-id"
  },
  "firebaseUid": "firebase-uid-optional"
}
```

**Note:** 
- Google users get default password "admin@12345" (hashed, not usable for login)
- firebaseUid is optional for Firebase integration
- Google users can only login via Google OAuth, not email/password

#### Protected Route Example
```bash
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Get Jobs with Filtering
```bash
GET /api/jobs?educationLevel=Graduate&specialization=CSE&page=1&limit=5
```

Response:
```json
{
  "success": true,
  "data": {
    "jobs": [...],
    "pagination": {
      "current_page": 1,
      "total_pages": 2,
      "total_jobs": 5,
      "has_next": true,
      "has_prev": false,
      "per_page": 5
    }
  }
}
```

### Get Education Hierarchy
```bash
GET /api/education/courses?level=Graduate
```

Response:
```json
{
  "success": true,
  "data": [
    "B.Tech / B.E",
    "B.Sc",
    "BBA",
    "BCA",
    "B.Com",
    "Others (BA, B.Pharm, etc.)"
  ]
}
```

## Project Structure

```
smart_placement_backend/
├── src/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── passport.js           # Passport OAuth configuration
│   ├── data/
│   │   └── educationData.js      # Education hierarchy data
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication middleware
│   │   └── validation.js         # Input validation middleware
│   ├── models/
│   │   ├── Job.js                # Job model schema
│   │   └── User.js               # User model schema
│   ├── routes/
│   │   ├── auth.js               # Authentication endpoints
│   │   ├── education.js          # Education data endpoints
│   │   ├── jobs.js               # Job-related endpoints
│   │   └── users.js              # User profile endpoints
│   ├── utils/
│   │   └── jwt.js                # JWT utility functions
│   └── index.js                  # Main application entry point
├── scripts/
│   ├── populateJobs.js           # Basic job data population
│   ├── populateExpandedJobs.js   # Expanded job data population
│   └── verifyJobs.js             # Database verification script
├── api_test_commands.md          # Complete API testing guide
├── Smart_Placement_API.postman_collection.json
├── Smart_Placement_Environment.postman_environment.json
├── POSTMAN_SETUP.md              # Postman setup guide
├── curl_commands.sh              # Automated testing script
├── .env.example                  # Environment variables template
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Passport.js (Google OAuth)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Session Management**: express-session
- **CORS**: cors middleware

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.