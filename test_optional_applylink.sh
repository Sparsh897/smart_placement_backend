#!/bin/bash

# Test Optional ApplyLink
BASE_URL="https://smart-placement-backend.onrender.com/api/companies"

echo "🔗 Testing Optional ApplyLink in Job Creation"
echo "============================================="

# Register company
echo "1. Registering test company..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ApplyLink Test Corp",
    "email": "hr@applylinktest.com",
    "password": "SecurePass123",
    "description": "Testing optional applyLink functionality"
  }')

TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.tokens.accessToken')

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    echo "✅ Company registered successfully!"
    
    # Test 1: Create job WITH applyLink
    echo -e "\n2. Testing job creation WITH applyLink..."
    JOB_WITH_LINK_RESPONSE=$(curl -s -X POST "$BASE_URL/jobs" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "title": "Job WITH ApplyLink",
        "location": "Bangalore",
        "domain": "Software Development",
        "salary": "₹8-12 LPA",
        "description": "This job has an external apply link for testing purposes.",
        "eligibility": "B.Tech/M.Tech with experience",
        "educationLevel": "Graduate",
        "course": "B.Tech / B.E",
        "specialization": "CSE",
        "skills": ["JavaScript", "React"],
        "applyLink": "https://company.com/careers/apply"
      }')
    
    echo "Job WITH ApplyLink Response:"
    echo "$JOB_WITH_LINK_RESPONSE" | jq '.data.job | {title: .title, applyLink: .applyLink}'
    
    # Test 2: Create job WITHOUT applyLink
    echo -e "\n3. Testing job creation WITHOUT applyLink..."
    JOB_WITHOUT_LINK_RESPONSE=$(curl -s -X POST "$BASE_URL/jobs" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "title": "Job WITHOUT ApplyLink",
        "location": "Mumbai",
        "domain": "Data Science",
        "salary": "₹10-15 LPA",
        "description": "This job uses the platform built-in application system.",
        "eligibility": "B.Tech/M.Tech with data science experience",
        "educationLevel": "Graduate",
        "course": "B.Tech / B.E",
        "specialization": "CSE",
        "skills": ["Python", "Machine Learning"]
      }')
    
    echo "Job WITHOUT ApplyLink Response:"
    echo "$JOB_WITHOUT_LINK_RESPONSE" | jq '.data.job | {title: .title, applyLink: .applyLink}'
    
    # Test 3: Create job with empty applyLink (should fail validation)
    echo -e "\n4. Testing job creation with empty applyLink..."
    JOB_EMPTY_LINK_RESPONSE=$(curl -s -X POST "$BASE_URL/jobs" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "title": "Job with Empty ApplyLink",
        "location": "Delhi",
        "domain": "Web Development",
        "salary": "₹6-10 LPA",
        "description": "This job has an empty apply link which should fail validation.",
        "eligibility": "B.Tech/M.Tech",
        "educationLevel": "Graduate",
        "course": "B.Tech / B.E",
        "specialization": "CSE",
        "skills": ["HTML", "CSS"],
        "applyLink": ""
      }')
    
    echo "Job with Empty ApplyLink Response:"
    echo "$JOB_EMPTY_LINK_RESPONSE" | jq '.'
    
    # Test 4: Create job with invalid applyLink (should fail validation)
    echo -e "\n5. Testing job creation with invalid applyLink..."
    JOB_INVALID_LINK_RESPONSE=$(curl -s -X POST "$BASE_URL/jobs" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "title": "Job with Invalid ApplyLink",
        "location": "Chennai",
        "domain": "Mobile Development",
        "salary": "₹7-11 LPA",
        "description": "This job has an invalid apply link which should fail validation.",
        "eligibility": "B.Tech/M.Tech",
        "educationLevel": "Graduate",
        "course": "B.Tech / B.E",
        "specialization": "CSE",
        "skills": ["Flutter", "Dart"],
        "applyLink": "not-a-valid-url"
      }')
    
    echo "Job with Invalid ApplyLink Response:"
    echo "$JOB_INVALID_LINK_RESPONSE" | jq '.'
    
    # Test 5: Get all company jobs to verify both were created
    echo -e "\n6. Getting all company jobs..."
    ALL_JOBS_RESPONSE=$(curl -s -X GET "$BASE_URL/jobs" \
      -H "Authorization: Bearer $TOKEN")
    
    echo "All Company Jobs:"
    echo "$ALL_JOBS_RESPONSE" | jq '.data.jobs[] | {title: .title, applyLink: .applyLink}'
    
    echo -e "\n✅ ApplyLink testing completed!"
    echo -e "\n📝 Test Results:"
    echo "- Job with applyLink: ✅ Should work"
    echo "- Job without applyLink: ✅ Should work"
    echo "- Job with empty applyLink: ❌ Should fail validation"
    echo "- Job with invalid applyLink: ❌ Should fail validation"
    
else
    echo "❌ Company registration failed"
fi

echo -e "\n🎉 Optional ApplyLink testing completed!"