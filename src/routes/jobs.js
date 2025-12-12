const express = require('express');
const Job = require('../models/Job');
const User = require('../models/User');
const JobApplication = require('../models/JobApplication');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/jobs
// Optional query params: educationLevel, course, specialization, domain, location, salary_min, salary_max, page, limit, search, excludeApplied
router.get('/', async (req, res) => {
  try {
    const { 
      educationLevel, 
      course, 
      specialization, 
      domain, 
      location, 
      salary_min, 
      salary_max, 
      page = 1, 
      limit = 20, 
      search,
      excludeApplied = 'false'
    } = req.query;

    // Build filter object
    const filter = {};
    if (educationLevel) filter.educationLevel = educationLevel;
    if (course) filter.course = course;
    if (specialization) filter.specialization = specialization;
    if (domain) filter.domain = domain;
    if (location) filter.location = { $regex: location, $options: 'i' };
    
    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { domain: { $regex: search, $options: 'i' } }
      ];
    }

    // Exclude applied jobs if user is authenticated and requests it
    let appliedJobIds = [];
    if (excludeApplied === 'true') {
      // Try to get user from token (optional authentication)
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const jwt = require('jsonwebtoken');
          const token = authHeader.substring(7);
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const userId = decoded.userId;
          
          // Get user's applied job IDs
          appliedJobIds = await JobApplication.getUserAppliedJobIds(userId);
          if (appliedJobIds.length > 0) {
            filter._id = { $nin: appliedJobIds };
          }
        } catch (tokenError) {
          // Invalid token, continue without filtering
          console.log('Invalid token for job filtering:', tokenError.message);
        }
      }
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const totalJobs = await Job.countDocuments(filter);
    const totalPages = Math.ceil(totalJobs / limitNum);

    // Get jobs with pagination
    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch jobs'
      }
    });
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ 
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Job not found'
        }
      });
    }
    res.json({
      success: true,
      data: job
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch job details'
      }
    });
  }
});

// POST /api/jobs
router.post('/', async (req, res) => {
  try {
    const job = new Job(req.body);
    const saved = await job.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid job data', error: err.message });
  }
});

// PUT /api/jobs/:id
router.put('/:id', async (req, res) => {
  try {
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid job data', error: err.message });
  }
});

// DELETE /api/jobs/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Job.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/jobs/meta/domains - Get available job domains
router.get('/meta/domains', async (req, res) => {
  try {
    const domains = await Job.distinct('domain');
    res.json({
      success: true,
      data: domains.sort()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch domains'
      }
    });
  }
});

// GET /api/jobs/meta/locations - Get available job locations
router.get('/meta/locations', async (req, res) => {
  try {
    const locations = await Job.distinct('location');
    res.json({
      success: true,
      data: locations.sort()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch locations'
      }
    });
  }
});

// GET /api/jobs/meta/companies - Get available companies
router.get('/meta/companies', async (req, res) => {
  try {
    const companies = await Job.distinct('company');
    res.json({
      success: true,
      data: companies.sort()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch companies'
      }
    });
  }
});

// POST /api/jobs/:id/save - Save a job (Protected)
router.post('/:id/save', authenticateToken, async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user._id;

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

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Check if job is already saved
    const isAlreadySaved = user.savedJobs.some(
      savedJob => savedJob.jobId.toString() === jobId
    );

    if (isAlreadySaved) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'JOB_ALREADY_SAVED',
          message: 'Job is already saved'
        }
      });
    }

    // Add job to saved jobs
    user.savedJobs.push({
      jobId: jobId,
      savedAt: new Date()
    });

    await user.save();

    res.status(201).json({
      success: true,
      data: {
        jobId: jobId,
        savedAt: new Date(),
        totalSavedJobs: user.savedJobs.length
      },
      message: 'Job saved successfully'
    });

  } catch (err) {
    console.error('Save job error:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to save job'
      }
    });
  }
});

// DELETE /api/jobs/:id/save - Unsave a job (Protected)
router.delete('/:id/save', authenticateToken, async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user._id;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Check if job is saved
    const savedJobIndex = user.savedJobs.findIndex(
      savedJob => savedJob.jobId.toString() === jobId
    );

    if (savedJobIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'JOB_NOT_SAVED',
          message: 'Job is not in your saved jobs'
        }
      });
    }

    // Remove job from saved jobs
    user.savedJobs.splice(savedJobIndex, 1);
    await user.save();

    res.json({
      success: true,
      data: {
        jobId: jobId,
        totalSavedJobs: user.savedJobs.length
      },
      message: 'Job removed from saved jobs'
    });

  } catch (err) {
    console.error('Unsave job error:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to unsave job'
      }
    });
  }
});

module.exports = router;
