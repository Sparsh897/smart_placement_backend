# Smart Placement API - Test Commands

This file contains curl commands for testing all API endpoints. You can copy these commands and use them in Postman or terminal.

**Base URL:** `http://localhost:5000`

## Authentication Logic

### Login Type Separation:
- **Email Users**: Can only login with email/password
- **Google Users**: Can only login via Google OAuth
- **Cross-login Prevention**: System prevents mixing login types for the same email

### Error Messages:
- `GOOGLE_USER_EXISTS`: Email already registered with Google (during email registration)
- `EMAIL_USER_EXISTS`: Email already registered with email/password (during Google OAuth)
- `GOOGLE_USER`: Trying to login with email/password for Google account
- `USER_EXISTS`: General user exists error

### Default Values:
- **Google Users**: Get default password "admin@12345" (hashed, not usable for login)
- **Phone**: Optional for all users, null by default for Google users
- **Firebase UID**: Optional, stored for Firebase integration

---

## 1. Authentication Endpoints

### 1.1 Register User (Email/Password)
```bash
curl -X POST "http://localhost:5000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "SecurePass123"
  }'
```

**Note:** 
- Phone number is optional during registration
- Email addresses are stored exactly as entered (no normalization)
- If email is already registered with Google, you'll get a specific error message

### 1.2 Login User (Email/Password)
```bash
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123"
  }'
```

### 1.3 Google OAuth Mobile Login
```bash
curl -X POST "http://localhost:5000/api/auth/google/mobile" \
  -H "Content-Type: application/json" \
  -d '{
    "googleToken": "google-access-token-here",
    "userInfo": {
      "email": "john.doe@gmail.com",
      "name": "John Doe",
      "picture": "https://lh3.googleusercontent.com/a/profile-pic-url",
      "sub": "google-user-id-12345"
    },
    "firebaseUid": "firebase-user-id-optional"
  }'
```

**Note:** 
- Google users automatically get password set to "admin@12345" (hashed)
- Google users cannot login with email/password, only via Google OAuth
- firebaseUid is optional and used for Firebase integration
- Phone number is set to null initially for Google users
- If email is already registered with email/password, you'll get a specific error message

### 1.4 Get Current User Info (Protected)
```bash
curl -X GET "http://localhost:5000/api/auth/me" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 1.5 Change Password (Protected)
```bash
curl -X POST "http://localhost:5000/api/auth/change-password" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "SecurePass123",
    "newPassword": "NewSecurePass456"
  }'
```

### 1.6 Logout User (Protected)
```bash
curl -X POST "http://localhost:5000/api/auth/logout" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 1.7 Delete Account (Protected)
```bash
curl -X DELETE "http://localhost:5000/api/auth/account" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 2. User Profile Management

### 2.1 Get User Profile (Protected)
```bash
curl -X GET "http://localhost:5000/api/users/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 2.2 Update User Profile (Protected)
```bash
curl -X PUT "http://localhost:5000/api/users/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "phone": "9876543211",
    "location": {
      "city": "Bangalore",
      "state": "Karnataka",
      "country": "India"
    },
    "profile": {
      "educationLevel": "Graduate",
      "course": "B.Tech / B.E",
      "specialization": "CSE",
      "summary": "Passionate software developer with expertise in full-stack development",
      "currentSalary": 800000,
      "visibility": true
    },
    "preferences": {
      "desiredJobTitles": ["Software Engineer", "Full Stack Developer"],
      "jobTypes": ["Full-time", "Remote"],
      "workSchedule": {
        "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "shifts": ["Day shift"],
        "schedules": ["Flexible"]
      },
      "minimumSalary": 600000,
      "preferredLocations": ["Bangalore", "Hyderabad", "Remote"],
      "remoteWork": true
    }
  }'
```

---

## 3. Work Experience Management

### 3.1 Add Work Experience (Protected)
```bash
curl -X POST "http://localhost:5000/api/users/work-experience" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "jobTitle": "Software Engineer",
    "company": "Tech Solutions Pvt Ltd",
    "location": "Bangalore, Karnataka",
    "employmentType": "Full-time",
    "startDate": "2022-06-01",
    "endDate": "2024-05-31",
    "isCurrent": false,
    "noticePeriod": "2 months",
    "description": "Developed and maintained web applications using React.js and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions."
  }'
```

### 3.2 Update Work Experience (Protected)
```bash
curl -X PUT "http://localhost:5000/api/users/work-experience/WORK_EXPERIENCE_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "jobTitle": "Senior Software Engineer",
    "company": "Tech Solutions Pvt Ltd",
    "location": "Bangalore, Karnataka",
    "employmentType": "Full-time",
    "startDate": "2022-06-01",
    "endDate": null,
    "isCurrent": true,
    "noticePeriod": "3 months",
    "description": "Lead developer for multiple web applications. Mentored junior developers and implemented best practices for code quality and performance."
  }'
```

### 3.3 Delete Work Experience (Protected)
```bash
curl -X DELETE "http://localhost:5000/api/users/work-experience/WORK_EXPERIENCE_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 4. Education Management

### 4.1 Add Education (Protected)
```bash
curl -X POST "http://localhost:5000/api/users/education" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "degree": "Bachelor of Technology",
    "institution": "Indian Institute of Technology",
    "location": "Bangalore, Karnataka",
    "startDate": "2018-08-01",
    "endDate": "2022-05-31",
    "isCurrent": false,
    "grade": "8.5 CGPA"
  }'
```

### 4.2 Update Education (Protected)
```bash
curl -X PUT "http://localhost:5000/api/users/education/EDUCATION_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "degree": "Bachelor of Technology in Computer Science",
    "institution": "Indian Institute of Technology",
    "location": "Bangalore, Karnataka",
    "startDate": "2018-08-01",
    "endDate": "2022-05-31",
    "isCurrent": false,
    "grade": "8.7 CGPA"
  }'
```

### 4.3 Delete Education (Protected)
```bash
curl -X DELETE "http://localhost:5000/api/users/education/EDUCATION_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 5. Skills Management

### 5.1 Add Skills (Protected)
```bash
curl -X POST "http://localhost:5000/api/users/skills" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "skills": [
      {
        "name": "JavaScript",
        "proficiency": "Advanced",
        "source": "Professional Experience"
      },
      {
        "name": "React.js",
        "proficiency": "Advanced",
        "source": "Professional Experience"
      },
      {
        "name": "Node.js",
        "proficiency": "Intermediate",
        "source": "Professional Experience"
      },
      {
        "name": "Python",
        "proficiency": "Intermediate",
        "source": "Self-taught"
      },
      {
        "name": "MongoDB",
        "proficiency": "Intermediate",
        "source": "Professional Experience"
      }
    ]
  }'
```

### 5.2 Update Skill (Protected)
```bash
curl -X PUT "http://localhost:5000/api/users/skills/SKILL_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JavaScript",
    "proficiency": "Expert",
    "source": "Professional Experience"
  }'
```

### 5.3 Delete Skill (Protected)
```bash
curl -X DELETE "http://localhost:5000/api/users/skills/SKILL_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 6. Jobs API

### 6.1 Get All Jobs (Public)
```bash
curl -X GET "http://localhost:5000/api/jobs"
```

### 6.2 Get Jobs with Filtering (Public)
```bash
curl -X GET "http://localhost:5000/api/jobs?educationLevel=Graduate&specialization=CSE&domain=Web%20Development&page=1&limit=5"
```

### 6.3 Search Jobs (Public)
```bash
curl -X GET "http://localhost:5000/api/jobs?search=software%20engineer&location=Bangalore"
```

### 6.4 Get Job by ID (Public)
```bash
curl -X GET "http://localhost:5000/api/jobs/JOB_ID_HERE"
```

### 6.5 Get Available Domains (Public)
```bash
curl -X GET "http://localhost:5000/api/jobs/meta/domains"
```

### 6.6 Get Available Locations (Public)
```bash
curl -X GET "http://localhost:5000/api/jobs/meta/locations"
```

### 6.7 Get Available Companies (Public)
```bash
curl -X GET "http://localhost:5000/api/jobs/meta/companies"
```

---

## 7. Education Data API

### 7.1 Get Education Levels (Public)
```bash
curl -X GET "http://localhost:5000/api/education/levels"
```

### 7.2 Get Courses by Education Level (Public)
```bash
curl -X GET "http://localhost:5000/api/education/courses?level=Graduate"
```

### 7.3 Get Specializations by Course (Public)
```bash
curl -X GET "http://localhost:5000/api/education/specializations?course=B.Tech%20/%20B.E"
```

### 7.4 Get Domains by Specialization (Public)
```bash
curl -X GET "http://localhost:5000/api/education/domains?specialization=CSE"
```

### 7.5 Get Complete Education Hierarchy (Public)
```bash
curl -X GET "http://localhost:5000/api/education/all"
```

---

## 8. Certifications Management

### 8.1 Add Certification (Protected)
```bash
curl -X POST "http://localhost:5000/api/users/certifications" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AWS Certified Solutions Architect",
    "issuer": "Amazon Web Services",
    "issueDate": "2023-06-15",
    "expiryDate": "2026-06-15",
    "credentialId": "AWS-CSA-12345",
    "url": "https://aws.amazon.com/certification/verify/12345"
  }'
```

### 8.2 Update Certification (Protected)
```bash
curl -X PUT "http://localhost:5000/api/users/certifications/CERTIFICATION_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AWS Certified Solutions Architect - Professional",
    "issuer": "Amazon Web Services",
    "issueDate": "2023-06-15",
    "expiryDate": "2026-06-15",
    "credentialId": "AWS-CSA-PRO-12345",
    "url": "https://aws.amazon.com/certification/verify/12345"
  }'
```

### 8.3 Delete Certification (Protected)
```bash
curl -X DELETE "http://localhost:5000/api/users/certifications/CERTIFICATION_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 9. Job Application Management (Future Implementation)

### 9.1 Apply to Job (Protected)
```bash
curl -X POST "http://localhost:5000/api/jobs/JOB_ID/apply" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "coverLetter": "I am very interested in this position...",
    "resumeUrl": "https://example.com/resume.pdf"
  }'
```

### 9.2 Get User Applications (Protected)
```bash
curl -X GET "http://localhost:5000/api/applications" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 9.3 Get Application Details (Protected)
```bash
curl -X GET "http://localhost:5000/api/applications/APPLICATION_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 10. Saved Jobs Management (Future Implementation)

### 10.1 Save Job (Protected)
```bash
curl -X POST "http://localhost:5000/api/jobs/JOB_ID/save" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 10.2 Unsave Job (Protected)
```bash
curl -X DELETE "http://localhost:5000/api/jobs/JOB_ID/save" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 10.3 Get Saved Jobs (Protected)
```bash
curl -X GET "http://localhost:5000/api/saved-jobs" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 11. Resume Management (Future Implementation)

### 11.1 Upload Resume (Protected)
```bash
curl -X POST "http://localhost:5000/api/users/resume/upload" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -F "resume=@/path/to/resume.pdf"
```

### 11.2 Delete Resume (Protected)
```bash
curl -X DELETE "http://localhost:5000/api/users/resume" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 12. Admin Endpoints (Future Implementation)

### 12.1 Create Job (Admin Protected)
```bash
curl -X POST "http://localhost:5000/api/jobs" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Software Engineer",
    "company": "Tech Innovations Ltd",
    "location": "Bangalore",
    "salary": "₹15-20 LPA",
    "domain": "Software Development",
    "description": "We are looking for a senior software engineer...",
    "eligibility": "B.Tech/M.Tech with 5+ years experience",
    "educationLevel": "Graduate",
    "course": "B.Tech / B.E",
    "specialization": "CSE",
    "skills": ["Java", "Spring Boot", "Microservices", "AWS"],
    "applyLink": "https://company.com/careers/apply/123"
  }'
```

### 12.2 Update Job (Admin Protected)
```bash
curl -X PUT "http://localhost:5000/api/jobs/JOB_ID" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Software Engineer - Updated",
    "salary": "₹18-25 LPA"
  }'
```

### 12.3 Delete Job (Admin Protected)
```bash
curl -X DELETE "http://localhost:5000/api/jobs/JOB_ID" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN_HERE"
```

---

## 13. Error Testing

### 8.1 Test Invalid Registration
```bash
curl -X POST "http://localhost:5000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "A",
    "email": "invalid-email",
    "password": "weak"
  }'
```

### 8.2 Test Registration with Google User Email
```bash
# First register with Google, then try to register with same email
curl -X POST "http://localhost:5000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "google.user@gmail.com",
    "password": "SecurePass123"
  }'
```

### 8.3 Test Google Login with Email User
```bash
curl -X POST "http://localhost:5000/api/auth/google/mobile" \
  -H "Content-Type: application/json" \
  -d '{
    "googleToken": "google-token",
    "userInfo": {
      "email": "email.user@example.com",
      "name": "Email User",
      "picture": "https://example.com/pic.jpg",
      "sub": "google-id-123"
    }
  }'
```

### 8.4 Test Invalid Login
```bash
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "wrongpassword"
  }'
```

### 8.5 Test Unauthorized Access
```bash
curl -X GET "http://localhost:5000/api/auth/me" \
  -H "Authorization: Bearer invalid_token"
```

### 13.6 Test Missing Authorization Header
```bash
curl -X GET "http://localhost:5000/api/users/profile"
```

---

## 14. Additional Utility Endpoints

### 14.1 Health Check
```bash
curl -X GET "http://localhost:5000/"
```

### 14.2 Get All Jobs with Pagination
```bash
curl -X GET "http://localhost:5000/api/jobs?page=2&limit=10"
```

### 14.3 Get Jobs by Multiple Filters
```bash
curl -X GET "http://localhost:5000/api/jobs?educationLevel=Graduate&course=B.Tech%20/%20B.E&specialization=CSE&domain=AI%20/%20ML&location=Bangalore&search=machine%20learning&page=1&limit=5"
```

### 14.4 Get User Profile with Specific Fields (if implemented)
```bash
curl -X GET "http://localhost:5000/api/users/profile?fields=name,email,profile,preferences" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### 14.5 Update User Preferences Only
```bash
curl -X PUT "http://localhost:5000/api/users/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "desiredJobTitles": ["Flutter Developer", "Mobile App Developer"],
      "jobTypes": ["Full-time", "Remote", "Part-time"],
      "minimumSalary": 500000,
      "preferredLocations": ["Remote", "Bangalore", "Hyderabad"],
      "remoteWork": true
    }
  }'
```

### 14.6 Update User Location Only
```bash
curl -X PUT "http://localhost:5000/api/users/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "location": {
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India"
    }
  }'
```

### 14.7 Add Phone Number Later
```bash
curl -X PUT "http://localhost:5000/api/users/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210"
  }'
```

---

## 15. Flutter Integration Examples

### 15.1 Complete User Onboarding Flow
```bash
# Step 1: Register
curl -X POST "http://localhost:5000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Flutter User",
    "email": "flutter.user@example.com",
    "password": "FlutterPass123"
  }'

# Step 2: Update Profile with Education
curl -X PUT "http://localhost:5000/api/users/profile" \
  -H "Authorization: Bearer JWT_TOKEN_FROM_STEP_1" \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "educationLevel": "Graduate",
      "course": "B.Tech / B.E",
      "specialization": "CSE"
    }
  }'

# Step 3: Set Job Preferences
curl -X PUT "http://localhost:5000/api/users/profile" \
  -H "Authorization: Bearer JWT_TOKEN_FROM_STEP_1" \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "desiredJobTitles": ["Flutter Developer"],
      "jobTypes": ["Full-time"],
      "minimumSalary": 600000,
      "preferredLocations": ["Bangalore"],
      "remoteWork": true
    }
  }'

# Step 4: Get Recommended Jobs
curl -X GET "http://localhost:5000/api/jobs?specialization=CSE&domain=App%20Development"
```

### 15.2 Google OAuth Integration Flow
```bash
# Step 1: Google OAuth Login
curl -X POST "http://localhost:5000/api/auth/google/mobile" \
  -H "Content-Type: application/json" \
  -d '{
    "googleToken": "GOOGLE_ACCESS_TOKEN_FROM_FLUTTER",
    "userInfo": {
      "email": "user@gmail.com",
      "name": "Google User",
      "picture": "https://lh3.googleusercontent.com/a/profile-pic",
      "sub": "google-user-id"
    },
    "firebaseUid": "firebase-uid-from-flutter"
  }'

# Step 2: Complete Profile
curl -X PUT "http://localhost:5000/api/users/profile" \
  -H "Authorization: Bearer JWT_TOKEN_FROM_GOOGLE_LOGIN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "9876543210",
    "location": {
      "city": "Bangalore",
      "state": "Karnataka"
    },
    "profile": {
      "educationLevel": "Graduate",
      "course": "B.Tech / B.E",
      "specialization": "CSE"
    }
  }'
```

---

## 16. Postman Collection Variables

When using these commands in Postman, you can set up the following variables:

- `baseUrl`: `http://localhost:5000`
- `authToken`: Set this after login/register from the response
- `userId`: User ID from auth response
- `workExperienceId`: ID from work experience creation
- `educationId`: ID from education creation
- `skillId`: ID from skill creation
- `jobId`: Any job ID from jobs list
- `certificationId`: ID from certification creation
- `applicationId`: ID from job application

### Example Postman Pre-request Script for Auth Token:
```javascript
// Set auth token from login response
if (pm.response.json().success && pm.response.json().data.tokens) {
    pm.environment.set("authToken", pm.response.json().data.tokens.accessToken);
}
```

---

## 17. Testing Workflow

### Complete User Journey Test:
1. **Register** a new user
2. **Login** with the registered user
3. **Update profile** with education and preferences
4. **Add work experience**
5. **Add education**
6. **Add skills**
7. **Get filtered jobs** based on profile
8. **Get user profile** to verify all data
9. **Change password**
10. **Logout**

### Google OAuth Test (Mobile):
1. Get Google access token from Google OAuth flow
2. Use **Google mobile login** endpoint
3. **Get user profile** to verify Google data integration
4. **Update profile** to add additional information

---

## Notes for Postman Testing:

1. **Environment Setup**: Create a Postman environment with `baseUrl` variable
2. **Authorization**: Use Bearer Token type with `{{authToken}}` variable
3. **Content-Type**: Set to `application/json` for POST/PUT requests
4. **Response Handling**: Save tokens and IDs from responses for subsequent requests
5. **Error Testing**: Test various error scenarios to ensure proper error handling

Replace `YOUR_JWT_TOKEN_HERE`, `WORK_EXPERIENCE_ID`, `EDUCATION_ID`, `SKILL_ID`, `CERTIFICATION_ID`, and `JOB_ID_HERE` with actual values from your API responses.

---

## 18. Flutter Developer Integration Guide

### 18.1 Base Configuration
```dart
class ApiConfig {
  static const String baseUrl = 'http://localhost:5000'; // Change for production
  static const String apiVersion = '/api';
  
  // Endpoints
  static const String auth = '$apiVersion/auth';
  static const String users = '$apiVersion/users';
  static const String jobs = '$apiVersion/jobs';
  static const String education = '$apiVersion/education';
}
```

### 18.2 HTTP Headers
```dart
Map<String, String> getHeaders({String? token}) {
  final headers = {
    'Content-Type': 'application/json',
  };
  
  if (token != null) {
    headers['Authorization'] = 'Bearer $token';
  }
  
  return headers;
}
```

### 18.3 Response Models
```dart
class ApiResponse<T> {
  final bool success;
  final T? data;
  final String? message;
  final ApiError? error;
  
  ApiResponse({
    required this.success,
    this.data,
    this.message,
    this.error,
  });
}

class ApiError {
  final String code;
  final String message;
  final Map<String, List<String>>? details;
  
  ApiError({
    required this.code,
    required this.message,
    this.details,
  });
}
```

### 18.4 Authentication Service Example
```dart
class AuthService {
  // Register with email/password
  Future<ApiResponse<AuthData>> register({
    required String name,
    required String email,
    required String password,
    String? phone,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.auth}/register'),
      headers: getHeaders(),
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
        if (phone != null) 'phone': phone,
      }),
    );
    
    // Handle response...
  }
  
  // Google OAuth login
  Future<ApiResponse<AuthData>> googleLogin({
    required String googleToken,
    required GoogleUserInfo userInfo,
    String? firebaseUid,
  }) async {
    final response = await http.post(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.auth}/google/mobile'),
      headers: getHeaders(),
      body: jsonEncode({
        'googleToken': googleToken,
        'userInfo': userInfo.toJson(),
        if (firebaseUid != null) 'firebaseUid': firebaseUid,
      }),
    );
    
    // Handle response...
  }
}
```

### 18.5 Error Handling
```dart
void handleApiError(ApiError error) {
  switch (error.code) {
    case 'GOOGLE_USER_EXISTS':
      // Show "Use Google Sign-In instead" message
      break;
    case 'EMAIL_USER_EXISTS':
      // Show "Use email/password login instead" message
      break;
    case 'GOOGLE_USER':
      // Show "This account uses Google Sign-In" message
      break;
    case 'VALIDATION_ERROR':
      // Show validation errors from error.details
      break;
    case 'UNAUTHORIZED':
      // Redirect to login screen
      break;
    default:
      // Show generic error message
      break;
  }
}
```

### 18.6 Job Filtering Example
```dart
class JobService {
  Future<ApiResponse<JobsData>> getJobs({
    String? educationLevel,
    String? course,
    String? specialization,
    String? domain,
    String? location,
    String? search,
    int page = 1,
    int limit = 20,
  }) async {
    final queryParams = <String, String>{
      'page': page.toString(),
      'limit': limit.toString(),
    };
    
    if (educationLevel != null) queryParams['educationLevel'] = educationLevel;
    if (course != null) queryParams['course'] = course;
    if (specialization != null) queryParams['specialization'] = specialization;
    if (domain != null) queryParams['domain'] = domain;
    if (location != null) queryParams['location'] = location;
    if (search != null) queryParams['search'] = search;
    
    final uri = Uri.parse('${ApiConfig.baseUrl}${ApiConfig.jobs}')
        .replace(queryParameters: queryParams);
    
    final response = await http.get(uri, headers: getHeaders());
    
    // Handle response...
  }
}
```

### 18.7 Profile Management Example
```dart
class ProfileService {
  Future<ApiResponse<User>> updateProfile({
    required String token,
    String? name,
    String? phone,
    Location? location,
    Profile? profile,
    Preferences? preferences,
  }) async {
    final body = <String, dynamic>{};
    
    if (name != null) body['name'] = name;
    if (phone != null) body['phone'] = phone;
    if (location != null) body['location'] = location.toJson();
    if (profile != null) body['profile'] = profile.toJson();
    if (preferences != null) body['preferences'] = preferences.toJson();
    
    final response = await http.put(
      Uri.parse('${ApiConfig.baseUrl}${ApiConfig.users}/profile'),
      headers: getHeaders(token: token),
      body: jsonEncode(body),
    );
    
    // Handle response...
  }
}
```

### 18.8 Token Management
```dart
class TokenManager {
  static const String _tokenKey = 'auth_token';
  
  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
  }
  
  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }
  
  static Future<void> clearToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
  }
  
  static Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }
}
```

### 18.9 Network Interceptor (for automatic token handling)
```dart
class ApiInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await TokenManager.getToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }
  
  @override
  void onError(DioError err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      // Token expired, redirect to login
      TokenManager.clearToken();
      // Navigate to login screen
    }
    handler.next(err);
  }
}
```

### 18.10 Complete User Flow Example
```dart
// 1. Registration/Login
final authResult = await AuthService().register(
  name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePass123',
);

if (authResult.success) {
  await TokenManager.saveToken(authResult.data!.tokens.accessToken);
  
  // 2. Update profile
  await ProfileService().updateProfile(
    token: authResult.data!.tokens.accessToken,
    profile: Profile(
      educationLevel: 'Graduate',
      course: 'B.Tech / B.E',
      specialization: 'CSE',
    ),
  );
  
  // 3. Get recommended jobs
  final jobsResult = await JobService().getJobs(
    educationLevel: 'Graduate',
    specialization: 'CSE',
    domain: 'Web Development',
  );
  
  // 4. Display jobs in UI
  if (jobsResult.success) {
    displayJobs(jobsResult.data!.jobs);
  }
}
```

---

## 19. Production Deployment Notes

### 19.1 Environment Variables for Production
```bash
# Update these for production deployment
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart_placement
JWT_SECRET=your-production-jwt-secret-very-long-and-random
SESSION_SECRET=your-production-session-secret-very-long-and-random
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
FRONTEND_URL=https://yourapp.com
NODE_ENV=production
PORT=5000
```

### 19.2 Base URL Changes for Flutter
```dart
// Development
static const String baseUrl = 'http://localhost:5000';

// Production
static const String baseUrl = 'https://your-api-domain.com';
```

### 19.3 HTTPS Requirements
- All production APIs should use HTTPS
- Update CORS settings for production domain
- Update Google OAuth redirect URLs for production

---

This comprehensive API documentation includes all endpoints currently implemented and provides complete examples for Flutter integration. The Flutter developer can use these curl commands to understand the API structure and implement the corresponding HTTP calls in the Flutter app.