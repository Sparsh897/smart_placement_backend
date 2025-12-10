const express = require('express');
const router = express.Router();
const {
  educationLevels,
  coursesByLevel,
  specializationsByCourse,
  domainsBySpecialization
} = require('../data/educationData');

// GET /api/education/levels
router.get('/levels', (req, res) => {
  try {
    res.json({
      success: true,
      data: educationLevels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch education levels'
      }
    });
  }
});

// GET /api/education/courses?level=Graduate
router.get('/courses', (req, res) => {
  try {
    const { level } = req.query;
    
    if (!level) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Education level is required'
        }
      });
    }
    
    const courses = coursesByLevel[level];
    if (!courses) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Education level not found'
        }
      });
    }
    
    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch courses'
      }
    });
  }
});

// GET /api/education/specializations?course=B.Tech / B.E
router.get('/specializations', (req, res) => {
  try {
    const { course } = req.query;
    
    if (!course) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Course is required'
        }
      });
    }
    
    const specializations = specializationsByCourse[course];
    if (!specializations) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Course not found'
        }
      });
    }
    
    res.json({
      success: true,
      data: specializations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch specializations'
      }
    });
  }
});

// GET /api/education/domains?specialization=CSE
router.get('/domains', (req, res) => {
  try {
    const { specialization } = req.query;
    
    if (!specialization) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Specialization is required'
        }
      });
    }
    
    const domains = domainsBySpecialization[specialization];
    if (!domains) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Specialization not found'
        }
      });
    }
    
    res.json({
      success: true,
      data: domains
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch domains'
      }
    });
  }
});

// GET /api/education/all - Get complete hierarchy
router.get('/all', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        educationLevels,
        coursesByLevel,
        specializationsByCourse,
        domainsBySpecialization
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch education data'
      }
    });
  }
});

module.exports = router;