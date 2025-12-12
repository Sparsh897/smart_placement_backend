const express = require('express');
const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/job-applications - Apply to a job
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      jobId,
      contactInfo,
      resume,
      employerQuestions,
      relevantExperience,
      supportingDocuments,
      coverLetter,
      jobAlertPreferences
    } = req.body;

    // Validate required fields
    if (!jobId || !contactInfo || !resume) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_REQUIRED_FIELDS',
          message: 'Job ID, contact info, and resume are required'
        }
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'JOB_NOT_FOUND',
          message: 'Job not found'
        }
      });
    }

    // Check if user has already applied
    const existingApplication = await JobApplication.findOne({ userId, jobId });
    if (existingApplication) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'ALREADY_APPLIED',
          message: 'You have already applied to this job'
        }
      });
    }

    // Create job application
    const jobApplication = new JobApplication({
      userId,
      jobId,
      contactInfo,
      resume,
      employerQuestions: employerQuestions || [],
      relevantExperience: relevantExperience || [],
      supportingDocuments: supportingDocuments || [],
      coverLetter,
      jobAlertPreferences: jobAlertPreferences || {},
      applicationSource: 'mobile'
    });

    await jobApplication.save();

    // Populate job details for response
    await jobApplication.populate('jobId', 'title company location salary domain');

    res.status(201).json({
      success: true,
      data: {
        application: jobApplication
      },
      message: 'Job application submitted successfully'
    });

  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to submit job application'
      }
    });
  }
});

// GET /api/job-applications - Get user's job applications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      page = 1, 
      limit = 20, 
      status,
      sortBy = 'appliedAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { userId };
    if (status) {
      query.status = status;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get applications with job details
    const applications = await JobApplication.find(query)
      .populate({
        path: 'jobId',
        select: 'title company location salary domain description eligibility educationLevel course specialization skills applyLink createdAt',
        match: { isActive: { $ne: false } } // Only populate if job is still active
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Filter out applications where job was deleted
    const validApplications = applications.filter(app => app.jobId !== null);

    // Get total count for pagination
    const totalApplications = await JobApplication.countDocuments(query);
    const totalPages = Math.ceil(totalApplications / limitNum);

    // Group applications by status for summary
    const statusSummary = await JobApplication.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusCounts = {};
    statusSummary.forEach(item => {
      statusCounts[item._id] = item.count;
    });

    res.json({
      success: true,
      data: {
        applications: validApplications,
        pagination: {
          current_page: pageNum,
          total_pages: totalPages,
          total_applications: totalApplications,
          has_next: pageNum < totalPages,
          has_prev: pageNum > 1,
          per_page: limitNum
        },
        summary: {
          total: totalApplications,
          statusCounts
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

// GET /api/job-applications/:id - Get specific job application
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const applicationId = req.params.id;

    const application = await JobApplication.findOne({ 
      _id: applicationId, 
      userId 
    }).populate({
      path: 'jobId',
      select: 'title company location salary domain description eligibility educationLevel course specialization skills applyLink createdAt'
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'APPLICATION_NOT_FOUND',
          message: 'Job application not found'
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
    console.error('Get job application error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch job application'
      }
    });
  }
});

// PUT /api/job-applications/:id/withdraw - Withdraw job application
router.put('/:id/withdraw', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const applicationId = req.params.id;

    const application = await JobApplication.findOne({ 
      _id: applicationId, 
      userId 
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'APPLICATION_NOT_FOUND',
          message: 'Job application not found'
        }
      });
    }

    // Check if application can be withdrawn
    if (['rejected', 'hired'].includes(application.status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'CANNOT_WITHDRAW',
          message: 'Cannot withdraw application with current status'
        }
      });
    }

    // Update status to withdrawn (we can add this to enum)
    application.status = 'withdrawn';
    application.employerActions.push({
      action: 'withdrawn',
      actionDate: new Date(),
      notes: 'Application withdrawn by candidate'
    });

    await application.save();

    res.json({
      success: true,
      data: {
        application
      },
      message: 'Job application withdrawn successfully'
    });

  } catch (error) {
    console.error('Withdraw job application error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to withdraw job application'
      }
    });
  }
});

// GET /api/job-applications/check/:jobId - Check if user has applied to a job
router.get('/check/:jobId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.jobId;

    const hasApplied = await JobApplication.hasUserApplied(userId, jobId);

    res.json({
      success: true,
      data: {
        hasApplied,
        jobId
      }
    });

  } catch (error) {
    console.error('Check application error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to check application status'
      }
    });
  }
});

// GET /api/job-applications/applied-jobs - Get list of applied job IDs (for filtering)
router.get('/applied-jobs/ids', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const appliedJobIds = await JobApplication.getUserAppliedJobIds(userId);

    res.json({
      success: true,
      data: {
        appliedJobIds: appliedJobIds.map(id => id.toString())
      }
    });

  } catch (error) {
    console.error('Get applied job IDs error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch applied job IDs'
      }
    });
  }
});

module.exports = router;