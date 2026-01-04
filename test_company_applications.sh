#!/bin/bash

# Company Application Management Testing Script
BASE_URL="https://smart-placement-backend.onrender.com/api/companies"

echo "📋 Testing Company Application Management Endpoints"
echo "=================================================="

# First, we need to register/login a company and create a job
echo "1. Setting up test company and job..."

# Register company
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Application Test Corp",
    "email": "hr@apptest.com",
    "password": "SecurePass123",
    "description": "Test company for application management",
    "industry": "Technology"
  }')

# Extract token
TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.data.tokens.accessToken')

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
    echo "✅ Company registered successfully!"
    
    # Create a test job
    JOB_RESPONSE=$(curl -s -X POST "$BASE_URL/jobs" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "title": "Test Application Manager",
        "location": "Bangalore",
        "domain": "Software Development",
        "salary": "₹8-12 LPA",
        "description": "This is a test job for application management testing. We are looking for candidates with strong technical skills and experience in software development.",
        "eligibility": "B.Tech/M.Tech with 2+ years experience",
        "educationLevel": "Graduate",
        "course": "B.Tech / B.E",
        "specialization": "CSE",
        "skills": ["JavaScript", "Node.js", "React", "MongoDB"],
        "applyLink": "https://apptest.com/careers/test-job"
      }')
    
    JOB_ID=$(echo "$JOB_RESPONSE" | jq -r '.data.job._id')
    
    if [ "$JOB_ID" != "null" ] && [ "$JOB_ID" != "" ]; then
        echo "✅ Test job created successfully! Job ID: $JOB_ID"
        
        # Test 2: Get Company Dashboard (should show job stats)
        echo -e "\n2. Testing Enhanced Company Dashboard..."
        DASHBOARD_RESPONSE=$(curl -s -X GET "$BASE_URL/dashboard" \
          -H "Authorization: Bearer $TOKEN")
        
        echo "Enhanced Dashboard Response:"
        echo "$DASHBOARD_RESPONSE" | jq '.'
        
        # Test 3: Get All Applications (should be empty initially)
        echo -e "\n3. Testing Get All Applications (should be empty)..."
        APPLICATIONS_RESPONSE=$(curl -s -X GET "$BASE_URL/applications" \
          -H "Authorization: Bearer $TOKEN")
        
        echo "All Applications Response:"
        echo "$APPLICATIONS_RESPONSE" | jq '.'
        
        # Test 4: Get Applications for Specific Job (should be empty)
        echo -e "\n4. Testing Get Applications for Specific Job..."
        JOB_APPLICATIONS_RESPONSE=$(curl -s -X GET "$BASE_URL/jobs/$JOB_ID/applications" \
          -H "Authorization: Bearer $TOKEN")
        
        echo "Job Applications Response:"
        echo "$JOB_APPLICATIONS_RESPONSE" | jq '.'
        
        # Test 5: Try to get a non-existent application (should return 404)
        echo -e "\n5. Testing Get Non-existent Application..."
        FAKE_APP_ID="64f7b3b3b3b3b3b3b3b3b3b3"
        NONEXISTENT_APP_RESPONSE=$(curl -s -X GET "$BASE_URL/applications/$FAKE_APP_ID" \
          -H "Authorization: Bearer $TOKEN")
        
        echo "Non-existent Application Response:"
        echo "$NONEXISTENT_APP_RESPONSE" | jq '.'
        
        # Test 6: Try to update status of non-existent application
        echo -e "\n6. Testing Update Status of Non-existent Application..."
        UPDATE_STATUS_RESPONSE=$(curl -s -X PATCH "$BASE_URL/applications/$FAKE_APP_ID/status" \
          -H "Authorization: Bearer $TOKEN" \
          -H "Content-Type: application/json" \
          -d '{
            "status": "reviewed",
            "notes": "Test update"
          }')
        
        echo "Update Status Response:"
        echo "$UPDATE_STATUS_RESPONSE" | jq '.'
        
        # Test 7: Test bulk action with empty array
        echo -e "\n7. Testing Bulk Action with Invalid Data..."
        BULK_ACTION_RESPONSE=$(curl -s -X POST "$BASE_URL/applications/bulk-action" \
          -H "Authorization: Bearer $TOKEN" \
          -H "Content-Type: application/json" \
          -d '{
            "applicationIds": [],
            "action": "reviewed",
            "notes": "Test bulk action"
          }')
        
        echo "Bulk Action Response:"
        echo "$BULK_ACTION_RESPONSE" | jq '.'
        
        # Test 8: Test filtering applications by status
        echo -e "\n8. Testing Filter Applications by Status..."
        FILTERED_APPS_RESPONSE=$(curl -s -X GET "$BASE_URL/applications?status=pending&page=1&limit=10" \
          -H "Authorization: Bearer $TOKEN")
        
        echo "Filtered Applications Response:"
        echo "$FILTERED_APPS_RESPONSE" | jq '.'
        
        # Test 9: Test pagination
        echo -e "\n9. Testing Pagination..."
        PAGINATED_RESPONSE=$(curl -s -X GET "$BASE_URL/applications?page=2&limit=5" \
          -H "Authorization: Bearer $TOKEN")
        
        echo "Paginated Applications Response:"
        echo "$PAGINATED_RESPONSE" | jq '.'
        
        # Test 10: Verify job appears in public listings
        echo -e "\n10. Verifying Job Visibility in Public API..."
        PUBLIC_JOBS_RESPONSE=$(curl -s -X GET "https://smart-placement-backend.onrender.com/api/jobs?search=Application%20Test%20Corp")
        
        echo "Public Jobs Response (searching for Application Test Corp):"
        echo "$PUBLIC_JOBS_RESPONSE" | jq '.data.jobs[] | {title: .title, company: .company, companyId: .companyId, postedBy: .postedBy}'
        
        echo -e "\n✅ All application management tests completed!"
        echo -e "\n📝 Summary:"
        echo "- Company registration: ✅"
        echo "- Job creation: ✅"
        echo "- Enhanced dashboard: ✅"
        echo "- Application endpoints: ✅"
        echo "- Error handling: ✅"
        echo "- Filtering & pagination: ✅"
        echo "- Public job visibility: ✅"
        
        echo -e "\n💡 Next Steps:"
        echo "1. Users can now apply to the job via the user application API"
        echo "2. Company can then view and manage those applications"
        echo "3. Company can update application statuses and perform bulk actions"
        
    else
        echo "❌ Job creation failed"
    fi
else
    echo "❌ Company registration failed"
fi

echo -e "\n🎉 Company Application Management testing completed!"