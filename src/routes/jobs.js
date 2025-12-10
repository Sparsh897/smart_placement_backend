const express = require('express');
const Job = require('../models/Job');

const router = express.Router();

// GET /api/jobs
// Optional query params: educationLevel, course, specialization, domain, location, salary_min, salary_max, page, limit, search
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
      search 
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

module.exports = router;
