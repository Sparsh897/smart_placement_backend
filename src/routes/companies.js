const express = require('express');
const mongoose = require('mongoose');
const Company = require('../models/Company');
const Job = require('../models/Job');
const { generateTokensForCompany } = require('../utils/jwt');
const { authenticateCompanyToken } = require('../middleware/companyAuth');
const { 
  validateCompanyRegistration, 
  validateCompanyLogin,
  validateJobCreation,
  validateCompanyProfileUpdate,
  validateApplicationStatusUpdate,
  validateBulkApplicationAction
} = require('../middleware/validation');

const router = express.Router();

// POST /api/companies/register - Company Registration
router.post('/register', validateCompanyRegistration, async (req, res) => {
  try {
    const { name, email, password, description, website, industry } = req.body;
    
    // Check if company already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'COMPANY_EXISTS',
          message: 'Company with this email already exists'
        }
      });
    }
    
    // Create new company
    const company = new Company({
      name,
      email,
      password,
      description: description || null,
      website: website || null,
      industry: industry || null,
      lastLogin: new Date()
    });
    
    await company.save();
    
    // Generate tokens
    const tokens = generateTokensForCompany(company);
    
    res.status(201).json({
      success: true,
      data: {
        company: company.toJSON(),
        tokens
      },
      message: 'Company registered successfully'
    });
    
  } catch (error) {
    console.error('Company registration error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'COMPANY_EXISTS',
          message: 'Company with this email already exists'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Company registration failed'
      }
    });
  }
});

// POST /api/companies/login - Company Login
router.post('/login', validateCompanyLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find company by email
    const company = await Company.findOne({ email, isActive: true });
    if (!company) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }
    
    // Verify password
    const isPasswordValid = await company.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }
    
    // Update last login
    await company.updateLastLogin();
    
    // Generate tokens
    const tokens = generateTokensForCompany(company);
    
    res.json({
      success: true,
      data: {
        company: company.toJSON(),
        tokens
      },
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Company login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Login failed'
      }
    });
  }
});

// GET /api/companies/me - Get Current Company Info
router.get('/me', authenticateCompanyToken, async (req, res) => {
  try {
    // Update job statistics
    await req.company.updateJobStats();
    
    res.json({
      success: true,
      data: {
        company: req.company.toJSON()
      }
    });
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to get company information'
      }
    });
  }
});

// PUT /api/companies/profile - Update Company Profile
router.put('/profile', authenticateCompanyToken, validateCompanyProfileUpdate, async (req, res) => {
  try {
    const updates = req.body;
    const company = req.company;
    
    // Update allowed fields
    const allowedUpdates = [
      'name', 'description', 'website', 'logo', 'industry', 'size', 'founded',
      'contactInfo', 'hrContact'
    ];
    
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        if (field === 'contactInfo' || field === 'hrContact') {
          // Handle nested objects
          if (company[field]) {
            Object.keys(updates[field]).forEach(nestedKey => {
              if (field === 'contactInfo' && nestedKey === 'address') {
                // Handle nested address object
                if (!company[field][nestedKey]) {
                  company[field][nestedKey] = {};
                }
                Object.keys(updates[field][nestedKey]).forEach(addressKey => {
                  company[field][nestedKey][addressKey] = updates[field][nestedKey][addressKey];
                });
              } else {
                company[field][nestedKey] = updates[field][nestedKey];
              }
            });
          } else {
            company[field] = updates[field];
          }
        } else {
          company[field] = updates[field];
        }
      }
    });
    
    await company.save();
    
    res.json({
      success: true,
      data: {
        company: company.toJSON()
      },
      message: 'Company profile updated successfully'
    });
  } catch (error) {
    console.error('Update company profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update company profile'
      }
    });
  }
});

// POST /api/companies/jobs - Create Job Posting
router.post('/jobs', authenticateCompanyToken, validateJobCreation, async (req, res) => {
  try {
    const {
      title,
      location,
      domain,
      salary,
      description,
      eligibility,
      educationLevel,
      course,
      specialization,
      skills,
      applyLink
    } = req.body;
    
    // Create new job
    const job = new Job({
      title,
      company: req.company.name, // Use company name from authenticated company
      location,
      domain,
      salary: salary || null,
      description,
      eligibility,
      educationLevel,
      course,
      specialization,
      skills,
      applyLink,
      companyId: req.companyId, // Reference to company
      postedBy: 'company'
    });
    
    await job.save();
    
    // Update company job statistics
    await req.company.updateJobStats();
    
    res.status(201).json({
      success: true,
      data: {
        job: job.toJSON()
      },
      message: 'Job posted successfully'
    });
    
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to create job posting'
      }
    });
  }
});

// GET /api/companies/jobs - Get Company's Job Postings
router.get('/jobs', authenticateCompanyToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'all' } = req.query;
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Build query
    const query = { companyId: req.companyId };
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    
    // Get jobs with pagination
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limitNum);
    
    res.json({
      success: true,
      data: {
        jobs,
        pagination: {
          current_page: pageNum,
          total_pages: totalPages,
          total_jobs: totalJobs,
          has_next: pageNum < totalPages,
          has_prev: pageNum > 1,
          per_page: limitNum
        }
      }
    });
    
  } catch (error) {
    console.error('Get company jobs error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch job postings'
      }
    });
  }
});

// GET /api/companies/jobs/:id - Get Specific Job
router.get('/jobs/:id', authenticateCompanyToken, async (req, res) => {
  try {
    const job = await Job.findOne({ 
      _id: req.params.id, 
      companyId: req.companyId 
    });
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'JOB_NOT_FOUND',
          message: 'Job not found'
        }
      });
    }
    
    res.json({
      success: true,
      data: {
        job: job.toJSON()
      }
    });
    
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch job'
      }
    });
  }
});

// PUT /api/companies/jobs/:id - Update Job Posting
router.put('/jobs/:id', authenticateCompanyToken, validateJobCreation, async (req, res) => {
  try {
    const job = await Job.findOne({ 
      _id: req.params.id, 
      companyId: req.companyId 
    });
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'JOB_NOT_FOUND',
          message: 'Job not found'
        }
      });
    }
    
    // Update job fields
    const allowedUpdates = [
      'title', 'location', 'domain', 'salary', 'description', 'eligibility',
      'educationLevel', 'course', 'specialization', 'skills', 'applyLink'
    ];
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });
    
    await job.save();
    
    res.json({
      success: true,
      data: {
        job: job.toJSON()
      },
      message: 'Job updated successfully'
    });
    
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update job'
      }
    });
  }
});

// DELETE /api/companies/jobs/:id - Delete Job Posting
router.delete('/jobs/:id', authenticateCompanyToken, async (req, res) => {
  try {
    const job = await Job.findOne({ 
      _id: req.params.id, 
      companyId: req.companyId 
    });
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'JOB_NOT_FOUND',
          message: 'Job not found'
        }
      });
    }
    
    await Job.findByIdAndDelete(req.params.id);
    
    // Update company job statistics
    await req.company.updateJobStats();
    
    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to delete job'
      }
    });
  }
});

// PATCH /api/companies/jobs/:id/toggle-status - Toggle Job Active Status
router.patch('/jobs/:id/toggle-status', authenticateCompanyToken, async (req, res) => {
  try {
    const job = await Job.findOne({ 
      _id: req.params.id, 
      companyId: req.companyId 
    });
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'JOB_NOT_FOUND',
          message: 'Job not found'
        }
      });
    }
    
    job.isActive = !job.isActive;
    await job.save();
    
    // Update company job statistics
    await req.company.updateJobStats();
    
    res.json({
      success: true,
      data: {
        job: job.toJSON()
      },
      message: `Job ${job.isActive ? 'activated' : 'deactivated'} successfully`
    });
    
  } catch (error) {
    console.error('Toggle job status error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to toggle job status'
      }
    });
  }
});

// GET /api/companies/dashboard - Company Dashboard Stats
router.get('/dashboard', authenticateCompanyToken, async (req, res) => {
  try {
    const companyId = req.companyId;
    
    // Get job statistics
    const totalJobs = await Job.countDocuments({ companyId });
    const activeJobs = await Job.countDocuments({ companyId, isActive: true });
    const inactiveJobs = totalJobs - activeJobs;
    
    // Get recent jobs (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentJobs = await Job.countDocuments({ 
      companyId, 
      createdAt: { $gte: thirtyDaysAgo } 
    });
    
    // Get application statistics
    const JobApplication = require('../models/JobApplication');
    const companyJobIds = await Job.find({ companyId }).select('_id');
    const jobIds = companyJobIds.map(job => job._id);
    
    const totalApplications = await JobApplication.countDocuments({ jobId: { $in: jobIds } });
    const pendingApplications = await JobApplication.countDocuments({ 
      jobId: { $in: jobIds }, 
      status: 'pending' 
    });
    const shortlistedApplications = await JobApplication.countDocuments({ 
      jobId: { $in: jobIds }, 
      status: 'shortlisted' 
    });
    const hiredApplications = await JobApplication.countDocuments({ 
      jobId: { $in: jobIds }, 
      status: 'hired' 
    });
    
    // Get recent applications (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentApplications = await JobApplication.countDocuments({ 
      jobId: { $in: jobIds }, 
      appliedAt: { $gte: sevenDaysAgo } 
    });
    
    // Get jobs by domain
    const jobsByDomain = await Job.aggregate([
      { $match: { companyId: req.companyId } },
      { $group: { _id: '$domain', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get jobs by education level
    const jobsByEducation = await Job.aggregate([
      { $match: { companyId: req.companyId } },
      { $group: { _id: '$educationLevel', count: { $sum: 1 } } }
    ]);
    
    // Get applications by status
    const applicationsByStatus = await JobApplication.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      data: {
        statistics: {
          totalJobs,
          activeJobs,
          inactiveJobs,
          recentJobs,
          totalApplications,
          pendingApplications,
          shortlistedApplications,
          hiredApplications,
          recentApplications
        },
        charts: {
          jobsByDomain,
          jobsByEducation,
          applicationsByStatus
        }
      }
    });
    
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch dashboard data'
      }
    });
  }
});

// GET /api/companies/applications - Get All Applications for Company Jobs
router.get('/applications', authenticateCompanyToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'all', jobId } = req.query;
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Get company's job IDs
    let jobQuery = { companyId: req.companyId };
    if (jobId) {
      jobQuery._id = jobId;
    }
    
    const companyJobs = await Job.find(jobQuery).select('_id');
    const jobIds = companyJobs.map(job => job._id);
    
    if (jobIds.length === 0) {
      return res.json({
        success: true,
        data: {
          applications: [],
          pagination: {
            current_page: pageNum,
            total_pages: 0,
            total_applications: 0,
            has_next: false,
            has_prev: false,
            per_page: limitNum
          }
        }
      });
    }
    
    // Build application query
    const JobApplication = require('../models/JobApplication');
    let applicationQuery = { jobId: { $in: jobIds } };
    
    if (status !== 'all') {
      applicationQuery.status = status;
    }
    
    // Get applications with user and job details
    const applications = await JobApplication.find(applicationQuery)
      .populate({
        path: 'userId',
        select: 'name email phone profilePicture profile location skills workExperience education'
      })
      .populate({
        path: 'jobId',
        select: 'title company location domain salary educationLevel course specialization'
      })
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const totalApplications = await JobApplication.countDocuments(applicationQuery);
    const totalPages = Math.ceil(totalApplications / limitNum);
    
    res.json({
      success: true,
      data: {
        applications,
        pagination: {
          current_page: pageNum,
          total_pages: totalPages,
          total_applications: totalApplications,
          has_next: pageNum < totalPages,
          has_prev: pageNum > 1,
          per_page: limitNum
        }
      }
    });
    
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch applications'
      }
    });
  }
});

// GET /api/companies/applications/:id - Get Specific Application Details
router.get('/applications/:id', authenticateCompanyToken, async (req, res) => {
  try {
    const JobApplication = require('../models/JobApplication');
    
    // Get application with full details
    const application = await JobApplication.findById(req.params.id)
      .populate({
        path: 'userId',
        select: 'name email phone profilePicture profile location skills workExperience education certifications'
      })
      .populate({
        path: 'jobId',
        select: 'title company location domain salary educationLevel course specialization skills description eligibility'
      });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'APPLICATION_NOT_FOUND',
          message: 'Application not found'
        }
      });
    }
    
    // Verify the job belongs to this company
    const job = await Job.findOne({ _id: application.jobId._id, companyId: req.companyId });
    if (!job) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You can only view applications for your own job postings'
        }
      });
    }
    
    res.json({
      success: true,
      data: {
        application
      }
    });
    
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch application'
      }
    });
  }
});

// PATCH /api/companies/applications/:id/status - Update Application Status
router.patch('/applications/:id/status', authenticateCompanyToken, validateApplicationStatusUpdate, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STATUS',
          message: 'Invalid application status'
        }
      });
    }
    
    const JobApplication = require('../models/JobApplication');
    
    // Get application
    const application = await JobApplication.findById(req.params.id)
      .populate('jobId', 'companyId title');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'APPLICATION_NOT_FOUND',
          message: 'Application not found'
        }
      });
    }
    
    // Verify the job belongs to this company
    if (application.jobId.companyId.toString() !== req.companyId.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'You can only update applications for your own job postings'
        }
      });
    }
    
    // Update application status
    await application.updateStatus(status, notes || '', req.companyId);
    
    // Reload application with populated data
    const updatedApplication = await JobApplication.findById(req.params.id)
      .populate({
        path: 'userId',
        select: 'name email phone'
      })
      .populate({
        path: 'jobId',
        select: 'title company'
      });
    
    res.json({
      success: true,
      data: {
        application: updatedApplication
      },
      message: `Application status updated to ${status}`
    });
    
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update application status'
      }
    });
  }
});

// GET /api/companies/jobs/:jobId/applications - Get Applications for Specific Job
router.get('/jobs/:jobId/applications', authenticateCompanyToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status = 'all' } = req.query;
    const jobId = req.params.jobId;
    
    // Verify job belongs to company
    const job = await Job.findOne({ _id: jobId, companyId: req.companyId });
    if (!job) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'JOB_NOT_FOUND',
          message: 'Job not found or does not belong to your company'
        }
      });
    }
    
    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Build query
    const JobApplication = require('../models/JobApplication');
    let query = { jobId };
    
    if (status !== 'all') {
      query.status = status;
    }
    
    // Get applications
    const applications = await JobApplication.find(query)
      .populate({
        path: 'userId',
        select: 'name email phone profilePicture profile location skills workExperience education'
      })
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limitNum);
    
    const totalApplications = await JobApplication.countDocuments(query);
    const totalPages = Math.ceil(totalApplications / limitNum);
    
    // Get application statistics for this job
    const applicationStats = await JobApplication.aggregate([
      { $match: { jobId: mongoose.Types.ObjectId(jobId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      data: {
        job: {
          _id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          domain: job.domain
        },
        applications,
        statistics: applicationStats,
        pagination: {
          current_page: pageNum,
          total_pages: totalPages,
          total_applications: totalApplications,
          has_next: pageNum < totalPages,
          has_prev: pageNum > 1,
          per_page: limitNum
        }
      }
    });
    
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch job applications'
      }
    });
  }
});

// POST /api/companies/applications/:id/bulk-action - Bulk Action on Applications
router.post('/applications/bulk-action', authenticateCompanyToken, validateBulkApplicationAction, async (req, res) => {
  try {
    const { applicationIds, action, notes } = req.body;
    
    // Validate input
    if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Application IDs array is required'
        }
      });
    }
    
    const validActions = ['reviewed', 'shortlisted', 'rejected'];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ACTION',
          message: 'Invalid bulk action'
        }
      });
    }
    
    const JobApplication = require('../models/JobApplication');
    
    // Get applications and verify they belong to company jobs
    const applications = await JobApplication.find({ 
      _id: { $in: applicationIds } 
    }).populate('jobId', 'companyId');
    
    // Filter applications that belong to this company
    const validApplications = applications.filter(app => 
      app.jobId.companyId.toString() === req.companyId.toString()
    );
    
    if (validApplications.length === 0) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'No valid applications found for your company'
        }
      });
    }
    
    // Update all valid applications
    const updatePromises = validApplications.map(app => 
      app.updateStatus(action, notes || '', req.companyId)
    );
    
    await Promise.all(updatePromises);
    
    res.json({
      success: true,
      data: {
        updatedCount: validApplications.length,
        totalRequested: applicationIds.length
      },
      message: `${validApplications.length} applications updated to ${action}`
    });
    
  } catch (error) {
    console.error('Bulk action error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to perform bulk action'
      }
    });
  }
});

module.exports = router;