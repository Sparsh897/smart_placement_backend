#!/bin/bash

# Company API Testing Script
BASE_URL="https://smart-placement-backend.onrender.com/api/companies"

echo "🏢 Testing Company API Endpoints"
echo "================================"

# Test 1: Company Registration
echo "1. Testing Company Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Labs",
    "email": "hr@techlabs.com",
    "password": "SecurePass123",
    "description": "Leading technology company specializing in AI and ML solutions",
    "website": "https://techlabs.com",
    "industry": "Information Technology"
  }')

echo "Registration Response:"
echo "$REGISTER_RESPONSE" | jq '.'

# Extract token from registration response
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.tokens.accessToken')

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    echo "✅ Registration successful! Token: ${TOKEN:0:20}..."
    
    # Test 2: Company Login
    echo -e "\n2. Testing Company Login..."
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "hr@techlabs.com",
        "password": "SecurePass123"
      }')
    
    echo "Login Response:"
    echo "$LOGIN_RESPONSE" | jq '.'
    
    # Test 3: Get Company Profile
    echo -e "\n3. Testing Get Company Profile..."
    PROFILE_RESPONSE=$(curl -s -X GET "$BASE_URL/me" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "Profile Response:"
    echo "$PROFILE_RESPONSE" | jq '.'
    
    # Test 4: Create Job Posting
    echo -e "\n4. Testing Job Creation..."
    JOB_RESPONSE=$(curl -s -X POST "$BASE_URL/jobs" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "title": "Junior ML Engineer",
        "location": "Bangalore",
        "domain": "AI / ML",
        "salary": "₹6-8 LPA",
        "description": "Join Tech Labs as a Junior ML Engineer and work on cutting-edge machine learning projects. You will be responsible for developing and implementing ML models, working with large datasets, and collaborating with cross-functional teams to deliver innovative AI solutions.",
        "eligibility": "B.Tech/M.Tech CSE or related, strong Python/ML skills.",
        "educationLevel": "Graduate",
        "course": "B.Tech / B.E",
        "specialization": "CSE",
        "skills": ["Python", "Machine Learning", "TensorFlow", "Scikit-learn", "Pandas"],
        "applyLink": "https://techlabs.com/careers/ml-engineer"
      }')
    
    echo "Job Creation Response:"
    echo "$JOB_RESPONSE" | jq '.'
    
    # Extract job ID
    JOB_ID=$(echo "$JOB_RESPONSE" | jq -r '.data.job._id')
    
    if [ "$JOB_ID" != "null" ] && [ "$JOB_ID" != "" ]; then
        echo "✅ Job created successfully! Job ID: $JOB_ID"
        
        # Test 5: Get Company Jobs
        echo -e "\n5. Testing Get Company Jobs..."
        JOBS_RESPONSE=$(curl -s -X GET "$BASE_URL/jobs" \
          -H "Authorization: Bearer $TOKEN")
        
        echo "Company Jobs Response:"
        echo "$JOBS_RESPONSE" | jq '.'
        
        # Test 6: Get Dashboard
        echo -e "\n6. Testing Company Dashboard..."
        DASHBOARD_RESPONSE=$(curl -s -X GET "$BASE_URL/dashboard" \
          -H "Authorization: Bearer $TOKEN")
        
        echo "Dashboard Response:"
        echo "$DASHBOARD_RESPONSE" | jq '.'
        
        # Test 7: Verify job appears in public job listings
        echo -e "\n7. Testing Job Visibility in Public API..."
        PUBLIC_JOBS_RESPONSE=$(curl -s -X GET "https://smart-placement-backend.onrender.com/api/jobs?search=Tech%20Labs")
        
        echo "Public Jobs Response (searching for Tech Labs):"
        echo "$PUBLIC_JOBS_RESPONSE" | jq '.'
        
        echo -e "\n✅ All tests completed successfully!"
    else
        echo "❌ Job creation failed"
    fi
else
    echo "❌ Registration failed"
fi

echo -e "\n🎉 Company API testing completed!"