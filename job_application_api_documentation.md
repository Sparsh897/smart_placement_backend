# Job Application API Documentation

This document provides comprehensive information about the Job Application APIs including request/response formats, curl commands, and Flutter integration examples.

**Base URL:** `https://smart-placement-backend.onrender.com`

---

## Overview

The Job Application system provides:
- ✅ **Modular Design**: Separate JobApplication collection with foreign keys
- ✅ **Performance Optimized**: Indexed fields for fast queries
- ✅ **Duplicate Prevention**: Unique constraint on userId + jobId
- ✅ **Applied Job Filtering**: Exclude applied jobs from job listings
- ✅ **Comprehensive Data**: Contact info, resume, employer questions, experience
- ✅ **Status Tracking**: Application status with employer actions history

---

## 1. Apply to Job API

### Endpoint
```
POST /api/job-applications
```

### Description
Submit a job application with all required information including contact details, resume, employer questions, and relevant experience.

### Authentication
**Required:** Bearer Token in Authorization header

### Request Headers
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Content-Type: application/json
Accept: application/json
```

### Request Body Schema
```json
{
  "jobId": "string (required) - MongoDB ObjectId",
  "contactInfo": {
    "fullName": "string (required)",
    "email": "string (required)",
    "phone": "string (required)",
    "location": {
      "city": "string (optional)",
      "state": "string (optional)",
      "country": "string (optional)"
    }
  },
  "resume": {
    "fileName": "string (required)",
    "fileUrl": "string (required)",
    "uploadedAt": "date (optional, defaults to now)"
  },
  "employerQuestions": [
    {
      "question": "string (required)",
      "answer": "mixed (required) - string, number, boolean, or array",
      "questionType": "string (optional) - text|number|boolean|select|multiselect"
    }
  ],
  "relevantExperience": [
    {
      "jobTitle": "string (optional)",
      "company": "string (optional)",
      "duration": "string (optional)",
      "description": "string (optional)"
    }
  ],
  "supportingDocuments": [
    {
      "fileName": "string (optional)",
      "fileUrl": "string (optional)",
      "documentType": "string (optional) - cover_letter|portfolio|certificate|other"
    }
  ],
  "coverLetter": "string (optional, max 2000 chars)",
  "jobAlertPreferences": {
    "emailUpdates": "boolean (optional)",
    "location": "string (optional)",
    "jobTitle": "string (optional)"
  }
}
```

### Example Request
```bash
curl -X POST "https://smart-placement-backend.onrender.com/api/job-applications" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "contactInfo": {
      "fullName": "Sparsh Chauhan",
      "email": "sparsh.chauhan@srhsoftwares.com",
      "phone": "+91 74530 07269",
      "location": {
        "city": "Kashipur",
        "state": "Uttarakhand",
        "country": "India"
      }
    },
    "resume": {
      "fileName": "Sparsh_resume (3).pdf",
      "fileUrl": "https://ik.imagekit.io/0ujkgjyyb/resumes/sample-local-pdf_lOeWhibQz.pdf"
    },
    "employerQuestions": [
      {
        "question": "Do you speak English?",
        "answer": "Yes",
        "questionType": "boolean"
      },
      {
        "question": "How many years of Trading experience do you have?",
        "answer": 6,
        "questionType": "number"
      },
      {
        "question": "How many years of Python experience do you have?",
        "answer": 5,
        "questionType": "number"
      },
      {
        "question": "Will you be able to reliably commute or relocate to HITEC City, Hyderabad, Telangana for this job?",
        "answer": "Yes, I can make the commute",
        "questionType": "text"
      }
    ],
    "relevantExperience": [
      {
        "jobTitle": "Flutter Developer",
        "company": "Codenia Technologies LLP",
        "duration": "2 years",
        "description": "Developed mobile applications using Flutter framework"
      }
    ],
    "coverLetter": "I am very interested in this Quantitative Developer position...",
    "jobAlertPreferences": {
      "emailUpdates": true,
      "location": "Hyderabad, Telangana",
      "jobTitle": "Quantitative Developer"
    }
  }'
```

### Success Response (201 Created)
```json
{
  "success": true,
  "data": {
    "application": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "userId": "693b077698c85c19d3d0ecaf",
      "jobId": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "title": "Quantitative Developer",
        "company": "Shah Equity - HITEC City, Hyderabad, Telangana",
        "location": "Hyderabad",
        "salary": "₹8-12 LPA",
        "domain": "Finance"
      },
      "status": "pending",
      "contactInfo": {
        "fullName": "Sparsh Chauhan",
        "email": "sparsh.chauhan@srhsoftwares.com",
        "phone": "+91 74530 07269",
        "location": {
          "city": "Kashipur",
          "state": "Uttarakhand",
          "country": "India"
        }
      },
      "resume": {
        "fileName": "Sparsh_resume (3).pdf",
        "fileUrl": "https://ik.imagekit.io/0ujkgjyyb/resumes/sample-local-pdf_lOeWhibQz.pdf",
        "uploadedAt": "2023-12-12T10:18:00.000Z"
      },
      "employerQuestions": [
        {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
          "question": "Do you speak English?",
          "answer": "Yes",
          "questionType": "boolean"
        },
        {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j4",
          "question": "How many years of Trading experience do you have?",
          "answer": 6,
          "questionType": "number"
        }
      ],
      "relevantExperience": [
        {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j5",
          "jobTitle": "Flutter Developer",
          "company": "Codenia Technologies LLP",
          "duration": "2 years",
          "description": "Developed mobile applications using Flutter framework"
        }
      ],
      "supportingDocuments": [],
      "coverLetter": "I am very interested in this Quantitative Developer position...",
      "jobAlertPreferences": {
        "emailUpdates": true,
        "location": "Hyderabad, Telangana",
        "jobTitle": "Quantitative Developer"
      },
      "applicationSource": "mobile",
      "employerActions": [],
      "appliedAt": "2023-12-12T10:18:00.000Z",
      "lastUpdated": "2023-12-12T10:18:00.000Z",
      "createdAt": "2023-12-12T10:18:00.000Z",
      "updatedAt": "2023-12-12T10:18:00.000Z"
    }
  },
  "message": "Job application submitted successfully"
}
```

### Error Responses

#### 400 Missing Required Fields
```json
{
  "success": false,
  "error": {
    "code": "MISSING_REQUIRED_FIELDS",
    "message": "Job ID, contact info, and resume are required"
  }
}
```

#### 404 Job Not Found
```json
{
  "success": false,
  "error": {
    "code": "JOB_NOT_FOUND",
    "message": "Job not found"
  }
}
```

#### 409 Already Applied
```json
{
  "success": false,
  "error": {
    "code": "ALREADY_APPLIED",
    "message": "You have already applied to this job"
  }
}
```

---

## 2. Get User's Job Applications API

### Endpoint
```
GET /api/job-applications
```

### Description
Retrieve all job applications submitted by the authenticated user with pagination, filtering, and sorting options.

### Authentication
**Required:** Bearer Token in Authorization header

### Query Parameters
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `status` (optional): Filter by status (pending|reviewed|shortlisted|rejected|hired|withdrawn)
- `sortBy` (optional): Sort field (default: appliedAt)
- `sortOrder` (optional): Sort order (asc|desc, default: desc)

### Example Request
```bash
curl -X GET "https://smart-placement-backend.onrender.com/api/job-applications?page=1&limit=10&status=pending&sortBy=appliedAt&sortOrder=desc" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
        "userId": "693b077698c85c19d3d0ecaf",
        "jobId": {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
          "title": "Quantitative Developer",
          "company": "Shah Equity - HITEC City, Hyderabad, Telangana",
          "location": "Hyderabad",
          "salary": "₹8-12 LPA",
          "domain": "Finance",
          "description": "We are looking for a skilled Quantitative Developer...",
          "eligibility": "Bachelor's degree in Finance, Mathematics, or related field",
          "educationLevel": "Graduate",
          "course": "B.Tech / B.E",
          "specialization": "CSE",
          "skills": ["Python", "Trading", "Quantitative Analysis"],
          "applyLink": "https://company.com/apply/123",
          "createdAt": "2023-12-10T08:00:00.000Z"
        },
        "status": "pending",
        "contactInfo": {
          "fullName": "Sparsh Chauhan",
          "email": "sparsh.chauhan@srhsoftwares.com",
          "phone": "+91 74530 07269",
          "location": {
            "city": "Kashipur",
            "state": "Uttarakhand",
            "country": "India"
          }
        },
        "resume": {
          "fileName": "Sparsh_resume (3).pdf",
          "fileUrl": "https://ik.imagekit.io/0ujkgjyyb/resumes/sample-local-pdf_lOeWhibQz.pdf",
          "uploadedAt": "2023-12-12T10:18:00.000Z"
        },
        "employerQuestions": [
          {
            "_id": "64f1a2b3c4d5e6f7g8h9i0j3",
            "question": "Do you speak English?",
            "answer": "Yes",
            "questionType": "boolean"
          }
        ],
        "relevantExperience": [
          {
            "_id": "64f1a2b3c4d5e6f7g8h9i0j5",
            "jobTitle": "Flutter Developer",
            "company": "Codenia Technologies LLP",
            "duration": "2 years",
            "description": "Developed mobile applications using Flutter framework"
          }
        ],
        "supportingDocuments": [],
        "coverLetter": "I am very interested in this position...",
        "jobAlertPreferences": {
          "emailUpdates": true,
          "location": "Hyderabad, Telangana",
          "jobTitle": "Quantitative Developer"
        },
        "applicationSource": "mobile",
        "employerActions": [],
        "appliedAt": "2023-12-12T10:18:00.000Z",
        "lastUpdated": "2023-12-12T10:18:00.000Z",
        "createdAt": "2023-12-12T10:18:00.000Z",
        "updatedAt": "2023-12-12T10:18:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_applications": 25,
      "has_next": true,
      "has_prev": false,
      "per_page": 10
    },
    "summary": {
      "total": 25,
      "statusCounts": {
        "pending": 15,
        "reviewed": 5,
        "shortlisted": 3,
        "rejected": 2,
        "hired": 0,
        "withdrawn": 0
      }
    }
  }
}
```

---

## 3. Get Specific Job Application API

### Endpoint
```
GET /api/job-applications/:id
```

### Description
Retrieve details of a specific job application by its ID.

### Authentication
**Required:** Bearer Token in Authorization header

### Path Parameters
- `id` (required): Job application ID

### Example Request
```bash
curl -X GET "https://smart-placement-backend.onrender.com/api/job-applications/64f1a2b3c4d5e6f7g8h9i0j2" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "application": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "userId": "693b077698c85c19d3d0ecaf",
      "jobId": {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "title": "Quantitative Developer",
        "company": "Shah Equity - HITEC City, Hyderabad, Telangana",
        "location": "Hyderabad",
        "salary": "₹8-12 LPA",
        "domain": "Finance"
      },
      "status": "pending",
      "contactInfo": { /* ... */ },
      "resume": { /* ... */ },
      "employerQuestions": [ /* ... */ ],
      "relevantExperience": [ /* ... */ ],
      "supportingDocuments": [ /* ... */ ],
      "coverLetter": "I am very interested in this position...",
      "jobAlertPreferences": { /* ... */ },
      "applicationSource": "mobile",
      "employerActions": [],
      "appliedAt": "2023-12-12T10:18:00.000Z",
      "lastUpdated": "2023-12-12T10:18:00.000Z"
    }
  }
}
```

---

## 4. Withdraw Job Application API

### Endpoint
```
PUT /api/job-applications/:id/withdraw
```

### Description
Withdraw a job application. Only applications with status 'pending', 'reviewed', or 'shortlisted' can be withdrawn.

### Authentication
**Required:** Bearer Token in Authorization header

### Path Parameters
- `id` (required): Job application ID

### Example Request
```bash
curl -X PUT "https://smart-placement-backend.onrender.com/api/job-applications/64f1a2b3c4d5e6f7g8h9i0j2/withdraw" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "application": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "status": "withdrawn",
      "employerActions": [
        {
          "_id": "64f1a2b3c4d5e6f7g8h9i0j6",
          "action": "withdrawn",
          "actionDate": "2023-12-12T11:30:00.000Z",
          "notes": "Application withdrawn by candidate"
        }
      ],
      "lastUpdated": "2023-12-12T11:30:00.000Z"
    }
  },
  "message": "Job application withdrawn successfully"
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "CANNOT_WITHDRAW",
    "message": "Cannot withdraw application with current status"
  }
}
```

---

## 5. Check Application Status API

### Endpoint
```
GET /api/job-applications/check/:jobId
```

### Description
Check if the authenticated user has already applied to a specific job.

### Authentication
**Required:** Bearer Token in Authorization header

### Path Parameters
- `jobId` (required): Job ID to check

### Example Request
```bash
curl -X GET "https://smart-placement-backend.onrender.com/api/job-applications/check/64f1a2b3c4d5e6f7g8h9i0j1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "hasApplied": true,
    "jobId": "64f1a2b3c4d5e6f7g8h9i0j1"
  }
}
```

---

## 6. Get Applied Job IDs API

### Endpoint
```
GET /api/job-applications/applied-jobs/ids
```

### Description
Get list of job IDs that the user has applied to. Useful for filtering job listings.

### Authentication
**Required:** Bearer Token in Authorization header

### Example Request
```bash
curl -X GET "https://smart-placement-backend.onrender.com/api/job-applications/applied-jobs/ids" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "appliedJobIds": [
      "64f1a2b3c4d5e6f7g8h9i0j1",
      "64f1a2b3c4d5e6f7g8h9i0j7",
      "64f1a2b3c4d5e6f7g8h9i0j8"
    ]
  }
}
```

---

## 7. Enhanced Jobs API (Exclude Applied Jobs)

### Endpoint
```
GET /api/jobs?excludeApplied=true
```

### Description
Get job listings with option to exclude jobs the user has already applied to.

### Authentication
**Optional:** Bearer Token in Authorization header (required only if excludeApplied=true)

### Query Parameters
- `excludeApplied` (optional): Set to 'true' to exclude applied jobs (default: 'false')
- All other existing job filter parameters

### Example Request
```bash
curl -X GET "https://smart-placement-backend.onrender.com/api/jobs?excludeApplied=true&educationLevel=Graduate&specialization=CSE&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j9",
        "title": "Software Engineer",
        "company": "Tech Solutions Pvt Ltd",
        "location": "Bangalore",
        "salary": "₹6-10 LPA",
        "domain": "Software Development",
        "description": "We are looking for a skilled software engineer...",
        "eligibility": "B.Tech/B.E in Computer Science",
        "educationLevel": "Graduate",
        "course": "B.Tech / B.E",
        "specialization": "CSE",
        "skills": ["JavaScript", "React", "Node.js"],
        "applyLink": "https://company.com/apply/456",
        "createdAt": "2023-12-11T08:00:00.000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_jobs": 47,
      "has_next": true,
      "has_prev": false,
      "per_page": 10
    }
  }
}
```

---

## 8. Flutter Integration Examples

### 8.1 Job Application Service Class
```dart
class JobApplicationService {
  final String baseUrl = 'https://smart-placement-backend.onrender.com';
  
  Future<ApiResponse<JobApplication>> applyToJob({
    required String token,
    required String jobId,
    required Map<String, dynamic> contactInfo,
    required Map<String, dynamic> resume,
    List<Map<String, dynamic>>? employerQuestions,
    List<Map<String, dynamic>>? relevantExperience,
    List<Map<String, dynamic>>? supportingDocuments,
    String? coverLetter,
    Map<String, dynamic>? jobAlertPreferences,
  }) async {
    try {
      final body = {
        'jobId': jobId,
        'contactInfo': contactInfo,
        'resume': resume,
        if (employerQuestions != null) 'employerQuestions': employerQuestions,
        if (relevantExperience != null) 'relevantExperience': relevantExperience,
        if (supportingDocuments != null) 'supportingDocuments': supportingDocuments,
        if (coverLetter != null) 'coverLetter': coverLetter,
        if (jobAlertPreferences != null) 'jobAlertPreferences': jobAlertPreferences,
      };
      
      final response = await http.post(
        Uri.parse('$baseUrl/api/job-applications'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonEncode(body),
      );
      
      final data = jsonDecode(response.body);
      
      if (response.statusCode == 201 && data['success']) {
        return ApiResponse.success(JobApplication.fromJson(data['data']['application']));
      } else {
        return ApiResponse.error(data['error']['message']);
      }
    } catch (e) {
      return ApiResponse.error('Network error: $e');
    }
  }
  
  Future<ApiResponse<JobApplicationList>> getUserApplications({
    required String token,
    int page = 1,
    int limit = 20,
    String? status,
    String sortBy = 'appliedAt',
    String sortOrder = 'desc',
  }) async {
    try {
      final queryParams = {
        'page': page.toString(),
        'limit': limit.toString(),
        'sortBy': sortBy,
        'sortOrder': sortOrder,
      };
      
      if (status != null) queryParams['status'] = status;
      
      final uri = Uri.parse('$baseUrl/api/job-applications')
          .replace(queryParameters: queryParams);
      
      final response = await http.get(
        uri,
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );
      
      final data = jsonDecode(response.body);
      
      if (response.statusCode == 200 && data['success']) {
        return ApiResponse.success(JobApplicationList.fromJson(data['data']));
      } else {
        return ApiResponse.error(data['error']['message']);
      }
    } catch (e) {
      return ApiResponse.error('Network error: $e');
    }
  }
  
  Future<ApiResponse<bool>> hasAppliedToJob({
    required String token,
    required String jobId,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/job-applications/check/$jobId'),
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );
      
      final data = jsonDecode(response.body);
      
      if (response.statusCode == 200 && data['success']) {
        return ApiResponse.success(data['data']['hasApplied']);
      } else {
        return ApiResponse.error(data['error']['message']);
      }
    } catch (e) {
      return ApiResponse.error('Network error: $e');
    }
  }
  
  Future<ApiResponse<List<String>>> getAppliedJobIds({
    required String token,
  }) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/job-applications/applied-jobs/ids'),
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );
      
      final data = jsonDecode(response.body);
      
      if (response.statusCode == 200 && data['success']) {
        return ApiResponse.success(List<String>.from(data['data']['appliedJobIds']));
      } else {
        return ApiResponse.error(data['error']['message']);
      }
    } catch (e) {
      return ApiResponse.error('Network error: $e');
    }
  }
  
  Future<ApiResponse<JobApplication>> withdrawApplication({
    required String token,
    required String applicationId,
  }) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/api/job-applications/$applicationId/withdraw'),
        headers: {
          'Authorization': 'Bearer $token',
          'Accept': 'application/json',
        },
      );
      
      final data = jsonDecode(response.body);
      
      if (response.statusCode == 200 && data['success']) {
        return ApiResponse.success(JobApplication.fromJson(data['data']['application']));
      } else {
        return ApiResponse.error(data['error']['message']);
      }
    } catch (e) {
      return ApiResponse.error('Network error: $e');
    }
  }
}
```

### 8.2 Enhanced Job Service (with applied job filtering)
```dart
class JobService {
  final String baseUrl = 'https://smart-placement-backend.onrender.com';
  
  Future<ApiResponse<JobList>> getJobs({
    String? token,
    bool excludeApplied = false,
    String? educationLevel,
    String? course,
    String? specialization,
    String? domain,
    String? location,
    String? search,
    int page = 1,
    int limit = 20,
  }) async {
    try {
      final queryParams = {
        'page': page.toString(),
        'limit': limit.toString(),
        'excludeApplied': excludeApplied.toString(),
      };
      
      if (educationLevel != null) queryParams['educationLevel'] = educationLevel;
      if (course != null) queryParams['course'] = course;
      if (specialization != null) queryParams['specialization'] = specialization;
      if (domain != null) queryParams['domain'] = domain;
      if (location != null) queryParams['location'] = location;
      if (search != null) queryParams['search'] = search;
      
      final uri = Uri.parse('$baseUrl/api/jobs')
          .replace(queryParameters: queryParams);
      
      final headers = {'Accept': 'application/json'};
      if (token != null && excludeApplied) {
        headers['Authorization'] = 'Bearer $token';
      }
      
      final response = await http.get(uri, headers: headers);
      
      final data = jsonDecode(response.body);
      
      if (response.statusCode == 200 && data['success']) {
        return ApiResponse.success(JobList.fromJson(data['data']));
      } else {
        return ApiResponse.error(data['error']['message']);
      }
    } catch (e) {
      return ApiResponse.error('Network error: $e');
    }
  }
}
```

### 8.3 Job Application Flow Example
```dart
class JobApplicationScreen extends StatefulWidget {
  final Job job;
  
  const JobApplicationScreen({Key? key, required this.job}) : super(key: key);
  
  @override
  _JobApplicationScreenState createState() => _JobApplicationScreenState();
}

class _JobApplicationScreenState extends State<JobApplicationScreen> {
  final JobApplicationService _applicationService = JobApplicationService();
  final _formKey = GlobalKey<FormState>();
  
  // Form controllers
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _coverLetterController = TextEditingController();
  
  // Form data
  Map<String, dynamic> _employerQuestions = {};
  List<Map<String, dynamic>> _relevantExperience = [];
  String? _resumeUrl;
  String? _resumeFileName;
  bool _emailUpdates = false;
  bool _isSubmitting = false;
  
  @override
  void initState() {
    super.initState();
    _loadUserProfile();
  }
  
  Future<void> _loadUserProfile() async {
    // Pre-fill form with user profile data
    final token = await TokenManager.getToken();
    if (token != null) {
      final profileService = ProfileService();
      final result = await profileService.getProfile(token);
      
      if (result.success && result.data != null) {
        final user = result.data!;
        setState(() {
          _fullNameController.text = user.name ?? '';
          _emailController.text = user.email ?? '';
          _phoneController.text = user.phone ?? '';
          _resumeUrl = user.profile?.resumeUrl;
        });
      }
    }
  }
  
  Future<void> _submitApplication() async {
    if (!_formKey.currentState!.validate()) return;
    if (_resumeUrl == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please upload your resume')),
      );
      return;
    }
    
    setState(() {
      _isSubmitting = true;
    });
    
    try {
      final token = await TokenManager.getToken();
      if (token == null) {
        throw Exception('Authentication required');
      }
      
      // Prepare application data
      final contactInfo = {
        'fullName': _fullNameController.text,
        'email': _emailController.text,
        'phone': _phoneController.text,
        'location': {
          'city': 'Kashipur',
          'state': 'Uttarakhand',
          'country': 'India'
        }
      };
      
      final resume = {
        'fileName': _resumeFileName ?? 'resume.pdf',
        'fileUrl': _resumeUrl!,
      };
      
      final employerQuestions = _employerQuestions.entries.map((entry) => {
        'question': entry.key,
        'answer': entry.value,
        'questionType': _getQuestionType(entry.value),
      }).toList();
      
      final jobAlertPreferences = {
        'emailUpdates': _emailUpdates,
        'location': widget.job.location,
        'jobTitle': widget.job.title,
      };
      
      // Submit application
      final result = await _applicationService.applyToJob(
        token: token,
        jobId: widget.job.id,
        contactInfo: contactInfo,
        resume: resume,
        employerQuestions: employerQuestions,
        relevantExperience: _relevantExperience,
        coverLetter: _coverLetterController.text.isNotEmpty 
            ? _coverLetterController.text 
            : null,
        jobAlertPreferences: jobAlertPreferences,
      );
      
      if (result.success) {
        // Show success message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Application submitted successfully!'),
            backgroundColor: Colors.green,
          ),
        );
        
        // Navigate back or to applications screen
        Navigator.of(context).pushReplacementNamed('/applications');
      } else {
        // Show error message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(result.error ?? 'Failed to submit application'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: $e'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      setState(() {
        _isSubmitting = false;
      });
    }
  }
  
  String _getQuestionType(dynamic value) {
    if (value is bool) return 'boolean';
    if (value is num) return 'number';
    if (value is List) return 'multiselect';
    return 'text';
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Apply to ${widget.job.title}'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Cancel', style: TextStyle(color: Colors.blue)),
          ),
        ],
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Job info section
              _buildJobInfoSection(),
              
              SizedBox(height: 24),
              
              // Contact information section
              _buildContactInfoSection(),
              
              SizedBox(height: 24),
              
              // Resume section
              _buildResumeSection(),
              
              SizedBox(height: 24),
              
              // Employer questions section
              _buildEmployerQuestionsSection(),
              
              SizedBox(height: 24),
              
              // Relevant experience section
              _buildRelevantExperienceSection(),
              
              SizedBox(height: 24),
              
              // Cover letter section
              _buildCoverLetterSection(),
              
              SizedBox(height: 24),
              
              // Job alerts section
              _buildJobAlertsSection(),
              
              SizedBox(height: 32),
              
              // Submit button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isSubmitting ? null : _submitApplication,
                  style: ElevatedButton.styleFrom(
                    padding: EdgeInsets.symmetric(vertical: 16),
                    backgroundColor: Colors.blue,
                  ),
                  child: _isSubmitting
                      ? CircularProgressIndicator(color: Colors.white)
                      : Text(
                          'Submit Application',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
  
  Widget _buildJobInfoSection() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.job.title,
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 4),
            Text(
              widget.job.company,
              style: TextStyle(fontSize: 14, color: Colors.grey[600]),
            ),
            SizedBox(height: 4),
            Text(
              widget.job.location,
              style: TextStyle(fontSize: 14, color: Colors.grey[600]),
            ),
          ],
        ),
      ),
    );
  }
  
  Widget _buildContactInfoSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Contact Information',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 12),
        TextFormField(
          controller: _fullNameController,
          decoration: InputDecoration(
            labelText: 'Full Name',
            border: OutlineInputBorder(),
          ),
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Full name is required';
            }
            return null;
          },
        ),
        SizedBox(height: 12),
        TextFormField(
          controller: _emailController,
          decoration: InputDecoration(
            labelText: 'Email Address',
            border: OutlineInputBorder(),
          ),
          keyboardType: TextInputType.emailAddress,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Email is required';
            }
            if (!value.contains('@')) {
              return 'Please enter a valid email';
            }
            return null;
          },
        ),
        SizedBox(height: 12),
        TextFormField(
          controller: _phoneController,
          decoration: InputDecoration(
            labelText: 'Phone Number',
            border: OutlineInputBorder(),
          ),
          keyboardType: TextInputType.phone,
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Phone number is required';
            }
            return null;
          },
        ),
      ],
    );
  }
  
  Widget _buildResumeSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Resume',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 12),
        if (_resumeUrl != null)
          Card(
            child: ListTile(
              leading: Icon(Icons.description, color: Colors.blue),
              title: Text(_resumeFileName ?? 'Resume'),
              subtitle: Text('Uploaded'),
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    icon: Icon(Icons.visibility),
                    onPressed: () {
                      // Open resume URL
                    },
                  ),
                  IconButton(
                    icon: Icon(Icons.edit),
                    onPressed: () {
                      // Upload new resume
                    },
                  ),
                ],
              ),
            ),
          )
        else
          ElevatedButton.icon(
            onPressed: () {
              // Upload resume
            },
            icon: Icon(Icons.upload_file),
            label: Text('Upload Resume'),
          ),
      ],
    );
  }
  
  Widget _buildEmployerQuestionsSection() {
    // This would be dynamically generated based on job requirements
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Employer Questions',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 12),
        
        // Example questions (these would come from job data)
        _buildBooleanQuestion('Do you speak English?'),
        SizedBox(height: 12),
        _buildNumberQuestion('How many years of Trading experience do you have?'),
        SizedBox(height: 12),
        _buildTextQuestion('Will you be able to reliably commute or relocate to HITEC City, Hyderabad, Telangana for this job?'),
      ],
    );
  }
  
  Widget _buildBooleanQuestion(String question) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(question),
        SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: RadioListTile<bool>(
                title: Text('Yes'),
                value: true,
                groupValue: _employerQuestions[question],
                onChanged: (value) {
                  setState(() {
                    _employerQuestions[question] = value;
                  });
                },
              ),
            ),
            Expanded(
              child: RadioListTile<bool>(
                title: Text('No'),
                value: false,
                groupValue: _employerQuestions[question],
                onChanged: (value) {
                  setState(() {
                    _employerQuestions[question] = value;
                  });
                },
              ),
            ),
          ],
        ),
      ],
    );
  }
  
  Widget _buildNumberQuestion(String question) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(question),
        SizedBox(height: 8),
        TextFormField(
          decoration: InputDecoration(
            border: OutlineInputBorder(),
            hintText: 'Enter number of years',
          ),
          keyboardType: TextInputType.number,
          onChanged: (value) {
            final number = int.tryParse(value);
            if (number != null) {
              _employerQuestions[question] = number;
            }
          },
        ),
      ],
    );
  }
  
  Widget _buildTextQuestion(String question) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(question),
        SizedBox(height: 8),
        TextFormField(
          decoration: InputDecoration(
            border: OutlineInputBorder(),
            hintText: 'Your answer',
          ),
          maxLines: 3,
          onChanged: (value) {
            _employerQuestions[question] = value;
          },
        ),
      ],
    );
  }
  
  Widget _buildRelevantExperienceSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Relevant Experience',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 12),
        // This would show user's work experience from profile
        // and allow them to select relevant ones
        Text(
          'Select relevant experience from your profile or add new ones.',
          style: TextStyle(color: Colors.grey[600]),
        ),
      ],
    );
  }
  
  Widget _buildCoverLetterSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Cover Letter (Optional)',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        SizedBox(height: 12),
        TextFormField(
          controller: _coverLetterController,
          decoration: InputDecoration(
            border: OutlineInputBorder(),
            hintText: 'Write a brief cover letter...',
          ),
          maxLines: 5,
          maxLength: 2000,
        ),
      ],
    );
  }
  
  Widget _buildJobAlertsSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CheckboxListTile(
          title: Text('Get email updates for similar jobs'),
          subtitle: Text('Receive notifications for similar positions in ${widget.job.location}'),
          value: _emailUpdates,
          onChanged: (value) {
            setState(() {
              _emailUpdates = value ?? false;
            });
          },
        ),
      ],
    );
  }
}
```

---

## 9. Database Schema & Performance

### Collection Structure
```javascript
// JobApplication Collection
{
  _id: ObjectId,
  userId: ObjectId (indexed, ref: User),
  jobId: ObjectId (indexed, ref: Job),
  status: String (indexed),
  contactInfo: Object,
  resume: Object,
  employerQuestions: Array,
  relevantExperience: Array,
  supportingDocuments: Array,
  coverLetter: String,
  jobAlertPreferences: Object,
  applicationSource: String,
  employerActions: Array,
  appliedAt: Date (indexed),
  lastUpdated: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes for Performance
```javascript
// Compound indexes
{ userId: 1, appliedAt: -1 }     // User's applications by date
{ jobId: 1, appliedAt: -1 }      // Job applications by date  
{ userId: 1, status: 1 }         // User's applications by status
{ userId: 1, jobId: 1 }          // Unique constraint + fast lookup

// Single field indexes
{ userId: 1 }                    // User queries
{ jobId: 1 }                     // Job queries
{ status: 1 }                    // Status filtering
{ appliedAt: 1 }                 // Date sorting
```

### Performance Benefits
- ✅ **Fast Queries**: All common query patterns are indexed
- ✅ **Duplicate Prevention**: Unique constraint on userId + jobId
- ✅ **Efficient Filtering**: Applied jobs excluded from job listings without N+1 queries
- ✅ **Scalable**: Separate collection allows independent scaling
- ✅ **Analytics Ready**: Easy to generate reports and statistics

---

## 10. Common Use Cases & Workflows

### 10.1 Job Application Flow
1. User views job details
2. Check if already applied: `GET /api/job-applications/check/:jobId`
3. If not applied, show "Apply" button
4. User fills application form
5. Submit application: `POST /api/job-applications`
6. Show success message and redirect

### 10.2 Job Listing with Applied Filter
1. User opens job listings
2. Get applied job IDs: `GET /api/job-applications/applied-jobs/ids`
3. Fetch jobs excluding applied ones: `GET /api/jobs?excludeApplied=true`
4. Display jobs with "Applied" status for applied jobs

### 10.3 Application Management
1. User opens "My Applications" screen
2. Fetch applications: `GET /api/job-applications`
3. Show applications grouped by status
4. Allow filtering by status, sorting by date
5. Allow withdrawal of pending applications

### 10.4 Application Status Tracking
1. Employer updates application status (future feature)
2. User receives notification (future feature)
3. Status reflected in user's application list
4. History maintained in employerActions array

---

This comprehensive job application system provides all the functionality needed for a complete job application flow with optimal performance and user experience.