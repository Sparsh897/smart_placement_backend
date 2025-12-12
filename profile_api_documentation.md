# User Profile API Documentation

This document provides comprehensive information about the User Profile APIs including request/response formats, curl commands, and Flutter integration examples.

**Base URL:** `https://smart-placement-backend.onrender.com`

---

## 1. GET User Profile API

### Endpoint
```
GET /api/users/profile
```

### Description
Retrieves the current user's complete profile information including personal details, educational background, job preferences, work experience, education, skills, and certifications.

### Authentication
**Required:** Bearer Token in Authorization header

### Request Headers
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Accept: application/json
```

### Request Parameters
None

### Curl Command
```bash
curl -X GET "https://smart-placement-backend.onrender.com/api/users/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "693b077698c85c19d3d0ecaf",
      "name": "Sparsh Chauhan",
      "email": "sparsh.chauhan@srhsoftwares.com",
      "phone": null,
      "profilePicture": "https://lh3.googleusercontent.com/a/ACg8ocIZ6bdsJAC79D_mppGEtnMcSUgMnPiVpePF69W6aBC-aL4N-A=s96-c",
      "loginType": "google",
      "isEmailVerified": false,
      "location": {
        "country": "India"
      },
      "profile": {
        "educationLevel": "Graduate",
        "course": "B.Tech / B.E",
        "specialization": "CSE",
        "summary": "Passionate software developer with expertise in full-stack development",
        "currentSalary": 800000,
        "resumeUrl": "https://example.com/resumes/user-resume.pdf",
        "visibility": true
      },
      "preferences": {
        "desiredJobTitles": ["Software Engineer", "Full Stack Developer"],
        "jobTypes": ["Full-time", "Fresher"],
        "workSchedule": {
          "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "shifts": ["Day shift"],
          "schedules": ["Flexible"]
        },
        "minimumSalary": 600000,
        "preferredLocations": ["Bangalore", "Hyderabad", "Remote"],
        "remoteWork": true
      },
      "workExperience": [
        {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
          "jobTitle": "Software Engineer",
          "company": "Tech Solutions Pvt Ltd",
          "location": "Bangalore, Karnataka",
          "employmentType": "Full-time",
          "startDate": "2022-06-01T00:00:00.000Z",
          "endDate": "2024-05-31T00:00:00.000Z",
          "isCurrent": false,
          "noticePeriod": "2 months",
          "description": "Developed and maintained web applications using React.js and Node.js."
        }
      ],
      "education": [
        {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
          "degree": "Bachelor of Technology",
          "institution": "Indian Institute of Technology",
          "location": "Bangalore, Karnataka",
          "startDate": "2018-08-01T00:00:00.000Z",
          "endDate": "2022-05-31T00:00:00.000Z",
          "isCurrent": false,
          "grade": "8.5 CGPA"
        }
      ],
      "skills": [
        {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
          "name": "JavaScript",
          "proficiency": "Advanced",
          "source": "Professional Experience"
        },
        {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
          "name": "React.js",
          "proficiency": "Advanced",
          "source": "Professional Experience"
        }
      ],
      "certifications": [
        {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j5",
          "name": "AWS Certified Solutions Architect",
          "issuer": "Amazon Web Services",
          "issueDate": "2023-06-15T00:00:00.000Z",
          "expiryDate": "2026-06-15T00:00:00.000Z",
          "credentialId": "AWS-CSA-12345",
          "url": "https://aws.amazon.com/certification/verify/12345"
        }
      ],
      "savedJobs": [],
      "resume": {
        "fileUrl": "https://example.com/resumes/resume.pdf",
        "fileName": "resume.pdf",
        "uploadedAt": "2023-12-01T10:30:00.000Z"
      },
      "lastLogin": "2023-12-11T10:39:00.000Z",
      "isActive": true,
      "createdAt": "2023-12-11T04:47:00.000Z",
      "updatedAt": "2023-12-11T10:39:00.000Z"
    }
  }
}
```

### Error Responses

#### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Access token is required"
  }
}
```

#### 404 User Not Found
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```

#### 500 Server Error
```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "Failed to get user profile"
  }
}
```

---

## 2. PUT Update User Profile API

### Endpoint
```
PUT /api/users/profile
```

### Description
Updates the user's profile information. Supports partial updates - you can update specific fields without affecting others. Handles nested objects like profile, preferences, and location.

### Authentication
**Required:** Bearer Token in Authorization header

### Request Headers
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json
Accept: application/json
```

### Updatable Fields
- `name` - User's full name
- `phone` - Phone number
- `location` - Location object (city, state, country)
- `profile` - Profile object (education, summary, salary, resumeUrl, visibility)
- `preferences` - Job preferences object (job titles, types, locations, salary, remote work)

### Request Body Schema
```json
{
  "name": "string (optional)",
  "phone": "string (optional)",
  "location": {
    "city": "string (optional)",
    "state": "string (optional)", 
    "country": "string (optional)"
  },
  "profile": {
    "educationLevel": "string (Graduate|Post Graduate)",
    "course": "string (optional)",
    "specialization": "string (optional)",
    "summary": "string (optional)",
    "currentSalary": "number (optional)",
    "resumeUrl": "string (optional, must be valid URL)",
    "visibility": "boolean (optional)"
  },
  "preferences": {
    "desiredJobTitles": ["string array (optional)"],
    "jobTypes": ["string array (optional)"],
    "workSchedule": {
      "days": ["string array (optional)"],
      "shifts": ["string array (optional)"],
      "schedules": ["string array (optional)"]
    },
    "minimumSalary": "number (optional)",
    "preferredLocations": ["string array (optional)"],
    "remoteWork": "boolean (optional)"
  }
}
```

### Example Requests

#### 1. Complete Profile Update
```bash
curl -X PUT "https://smart-placement-backend.onrender.com/api/users/profile" \
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
      "resumeUrl": "https://example.com/resumes/john-doe-resume.pdf",
      "visibility": true
    },
    "preferences": {
      "desiredJobTitles": ["Software Engineer", "Full Stack Developer"],
      "jobTypes": ["Full-time", "Fresher"],
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

#### 2. Update Only Educational Preferences
```bash
curl -X PUT "https://smart-placement-backend.onrender.com/api/users/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "educationLevel": "Graduate",
      "course": "B.Tech / B.E",
      "specialization": "CSE"
    }
  }'
```

#### 3. Update Only Job Preferences
```bash
curl -X PUT "https://smart-placement-backend.onrender.com/api/users/profile" \
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

#### 4. Update Only Resume URL
```bash
curl -X PUT "https://smart-placement-backend.onrender.com/api/users/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "resumeUrl": "https://ik.imagekit.io/0ujkgjyyb/resumes/updated-resume.pdf"
    }
  }'
```

#### 5. Update Only Personal Info
```bash
curl -X PUT "https://smart-placement-backend.onrender.com/api/users/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "9876543210",
    "location": {
      "city": "Mumbai",
      "state": "Maharashtra",
      "country": "India"
    }
  }'
```

### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "693b077698c85c19d3d0ecaf",
      "name": "John Doe Updated",
      "email": "john.doe@example.com",
      "phone": "9876543211",
      "profilePicture": "https://example.com/profile-pic.jpg",
      "loginType": "email",
      "isEmailVerified": true,
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
        "resumeUrl": "https://example.com/resumes/john-doe-resume.pdf",
        "visibility": true
      },
      "preferences": {
        "desiredJobTitles": ["Software Engineer", "Full Stack Developer"],
        "jobTypes": ["Full-time", "Fresher"],
        "workSchedule": {
          "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "shifts": ["Day shift"],
          "schedules": ["Flexible"]
        },
        "minimumSalary": 600000,
        "preferredLocations": ["Bangalore", "Hyderabad", "Remote"],
        "remoteWork": true
      },
      "workExperience": [],
      "education": [],
      "skills": [],
      "certifications": [],
      "savedJobs": [],
      "resume": {
        "fileUrl": null,
        "fileName": null,
        "uploadedAt": null
      },
      "lastLogin": "2023-12-11T10:39:00.000Z",
      "isActive": true,
      "createdAt": "2023-12-11T04:47:00.000Z",
      "updatedAt": "2023-12-11T11:15:00.000Z"
    }
  },
  "message": "Profile updated successfully"
}
```

### Error Responses

#### 400 Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "profile.educationLevel": ["Education level must be Graduate or Post Graduate"],
      "profile.resumeUrl": ["Resume URL must be a valid URL"],
      "phone": ["Please provide a valid Indian phone number"]
    }
  }
}
```

#### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Access token is required"
  }
}
```

#### 404 User Not Found
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```

#### 500 Server Error
```json
{
  "success": false,
  "error": {
    "code": "SERVER_ERROR",
    "message": "Failed to update profile"
  }
}
```

---

## 3. Flutter Integration Examples

### 3.1 Profile Service Class
```dart
class ProfileService {
  final String baseUrl = 'https://smart-placement-backend.onrender.com';
  
  Future<ApiResponse<User>> getProfile(String token) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/users/profile'),
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );
      
      final data = jsonDecode(response.body);
      
      if (response.statusCode == 200 && data['success']) {
        return ApiResponse.success(User.fromJson(data['data']['user']));
      } else {
        return ApiResponse.error(data['error']['message']);
      }
    } catch (e) {
      return ApiResponse.error('Network error: $e');
    }
  }
  
  Future<ApiResponse<User>> updateProfile({
    required String token,
    String? name,
    String? phone,
    Map<String, dynamic>? location,
    Map<String, dynamic>? profile,
    Map<String, dynamic>? preferences,
  }) async {
    try {
      final body = <String, dynamic>{};
      
      if (name != null) body['name'] = name;
      if (phone != null) body['phone'] = phone;
      if (location != null) body['location'] = location;
      if (profile != null) body['profile'] = profile;
      if (preferences != null) body['preferences'] = preferences;
      
      final response = await http.put(
        Uri.parse('$baseUrl/api/users/profile'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode(body),
      );
      
      final data = jsonDecode(response.body);
      
      if (response.statusCode == 200 && data['success']) {
        return ApiResponse.success(User.fromJson(data['data']['user']));
      } else {
        return ApiResponse.error(data['error']['message']);
      }
    } catch (e) {
      return ApiResponse.error('Network error: $e');
    }
  }
}
```

### 3.2 Check if Preferences are Complete
```dart
class PreferenceChecker {
  static bool areEducationalPreferencesComplete(User user) {
    final profile = user.profile;
    return profile?.educationLevel != null &&
           profile?.course != null &&
           profile?.specialization != null;
  }
  
  static bool areJobPreferencesComplete(User user) {
    final preferences = user.preferences;
    return preferences?.desiredJobTitles?.isNotEmpty == true &&
           preferences?.jobTypes?.isNotEmpty == true &&
           preferences?.preferredLocations?.isNotEmpty == true &&
           preferences?.minimumSalary != null;
  }
  
  static bool areAllPreferencesComplete(User user) {
    return areEducationalPreferencesComplete(user) && 
           areJobPreferencesComplete(user);
  }
}
```

### 3.3 Usage Example
```dart
class ProfileScreen extends StatefulWidget {
  @override
  _ProfileScreenState createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final ProfileService _profileService = ProfileService();
  User? _user;
  bool _isLoading = true;
  
  @override
  void initState() {
    super.initState();
    _loadProfile();
  }
  
  Future<void> _loadProfile() async {
    final token = await TokenManager.getToken();
    if (token != null) {
      final result = await _profileService.getProfile(token);
      
      if (result.success) {
        setState(() {
          _user = result.data;
          _isLoading = false;
        });
        
        // Check if preferences are complete
        if (!PreferenceChecker.areAllPreferencesComplete(_user!)) {
          // Navigate to preference setup screen
          Navigator.pushNamed(context, '/preferences');
        }
      } else {
        setState(() {
          _isLoading = false;
        });
        // Handle error
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(result.error ?? 'Failed to load profile')),
        );
      }
    }
  }
  
  Future<void> _updateEducationalPreferences({
    required String educationLevel,
    required String course,
    required String specialization,
  }) async {
    final token = await TokenManager.getToken();
    if (token != null) {
      final result = await _profileService.updateProfile(
        token: token,
        profile: {
          'educationLevel': educationLevel,
          'course': course,
          'specialization': specialization,
        },
      );
      
      if (result.success) {
        setState(() {
          _user = result.data;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Educational preferences updated successfully')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(result.error ?? 'Failed to update preferences')),
        );
      }
    }
  }
  
  Future<void> _updateJobPreferences({
    required List<String> desiredJobTitles,
    required List<String> jobTypes,
    required List<String> preferredLocations,
    required int minimumSalary,
    required bool remoteWork,
  }) async {
    final token = await TokenManager.getToken();
    if (token != null) {
      final result = await _profileService.updateProfile(
        token: token,
        preferences: {
          'desiredJobTitles': desiredJobTitles,
          'jobTypes': jobTypes,
          'preferredLocations': preferredLocations,
          'minimumSalary': minimumSalary,
          'remoteWork': remoteWork,
        },
      );
      
      if (result.success) {
        setState(() {
          _user = result.data;
        });
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Job preferences updated successfully')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(result.error ?? 'Failed to update preferences')),
        );
      }
    }
  }
  
  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }
    
    return Scaffold(
      appBar: AppBar(title: Text('Profile')),
      body: _user != null ? _buildProfileContent() : _buildErrorContent(),
    );
  }
  
  Widget _buildProfileContent() {
    return SingleChildScrollView(
      padding: EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Profile information display
          Text('Name: ${_user!.name}'),
          Text('Email: ${_user!.email}'),
          if (_user!.phone != null) Text('Phone: ${_user!.phone}'),
          
          // Educational preferences
          if (PreferenceChecker.areEducationalPreferencesComplete(_user!))
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Education Level: ${_user!.profile?.educationLevel}'),
                Text('Course: ${_user!.profile?.course}'),
                Text('Specialization: ${_user!.profile?.specialization}'),
              ],
            )
          else
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, '/educational-preferences'),
              child: Text('Complete Educational Preferences'),
            ),
          
          // Job preferences
          if (PreferenceChecker.areJobPreferencesComplete(_user!))
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Desired Job Titles: ${_user!.preferences?.desiredJobTitles?.join(", ")}'),
                Text('Job Types: ${_user!.preferences?.jobTypes?.join(", ")}'),
                Text('Preferred Locations: ${_user!.preferences?.preferredLocations?.join(", ")}'),
                Text('Minimum Salary: ₹${_user!.preferences?.minimumSalary}'),
              ],
            )
          else
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(context, '/job-preferences'),
              child: Text('Complete Job Preferences'),
            ),
        ],
      ),
    );
  }
  
  Widget _buildErrorContent() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text('Failed to load profile'),
          ElevatedButton(
            onPressed: _loadProfile,
            child: Text('Retry'),
          ),
        ],
      ),
    );
  }
}
```

---

## 4. Validation Rules

### Profile Fields Validation:
- `name`: 2-50 characters, required
- `phone`: Valid Indian mobile number format
- `profile.educationLevel`: Must be "Graduate" or "Post Graduate"
- `profile.currentSalary`: Must be a number
- `profile.resumeUrl`: Must be a valid URL format

### Preferences Fields Validation:
- `preferences.desiredJobTitles`: Array of strings
- `preferences.jobTypes`: Array of strings
- `preferences.preferredLocations`: Array of strings
- `preferences.minimumSalary`: Must be a number
- `preferences.remoteWork`: Must be boolean

---

## 5. Common Use Cases

### 5.1 First-time User Setup Flow
1. User registers/logs in
2. Call GET `/api/users/profile` to check current state
3. If educational preferences incomplete → Show educational preference screen
4. If job preferences incomplete → Show job preference screen
5. If all complete → Fetch jobs based on preferences

### 5.2 Profile Update Flow
1. User opens profile screen
2. Call GET `/api/users/profile` to get current data
3. User modifies fields
4. Call PUT `/api/users/profile` with only changed fields
5. Update UI with response data

### 5.3 Resume Upload Flow
1. User uploads resume to file storage (ImageKit, AWS S3, etc.)
2. Get the public URL of uploaded file
3. Call PUT `/api/users/profile` with `{"profile": {"resumeUrl": "URL"}}`
4. Resume URL is saved in user profile

---

## 6. Error Handling Best Practices

### In Flutter:
```dart
try {
  final result = await profileService.updateProfile(/* params */);
  
  if (result.success) {
    // Handle success
    showSuccessMessage('Profile updated successfully');
  } else {
    // Handle API error
    showErrorMessage(result.error ?? 'Update failed');
  }
} catch (e) {
  // Handle network/parsing errors
  showErrorMessage('Network error occurred');
}
```

### Common Error Scenarios:
1. **Token Expired (401)**: Redirect to login screen
2. **Validation Error (400)**: Show field-specific error messages
3. **Network Error**: Show retry option
4. **Server Error (500)**: Show generic error message

---

This documentation provides everything needed to implement profile management in your Flutter app with proper error handling and validation.