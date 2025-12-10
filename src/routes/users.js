const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { validateProfileUpdate } = require('../middleware/validation');

const router = express.Router();

// GET /api/users/profile - Get User Profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    res.json({
      success: true,
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to get user profile'
      }
    });
  }
});

// PUT /api/users/profile - Update User Profile
router.put('/profile', authenticateToken, validateProfileUpdate, async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    // Update allowed fields
    const allowedUpdates = [
      'name', 'phone', 'location', 'profile', 'preferences'
    ];
    
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        if (field === 'location' || field === 'profile' || field === 'preferences') {
          // Merge nested objects
          user[field] = { ...user[field], ...updates[field] };
        } else {
          user[field] = updates[field];
        }
      }
    });
    
    await user.save();
    
    res.json({
      success: true,
      data: {
        user: user.toJSON()
      },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update profile'
      }
    });
  }
});

// POST /api/users/work-experience - Add Work Experience
router.post('/work-experience', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    user.workExperience.push(req.body);
    await user.save();
    
    res.status(201).json({
      success: true,
      data: {
        workExperience: user.workExperience[user.workExperience.length - 1]
      },
      message: 'Work experience added successfully'
    });
  } catch (error) {
    console.error('Add work experience error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to add work experience'
      }
    });
  }
});

// PUT /api/users/work-experience/:id - Update Work Experience
router.put('/work-experience/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    const experience = user.workExperience.id(req.params.id);
    if (!experience) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EXPERIENCE_NOT_FOUND',
          message: 'Work experience not found'
        }
      });
    }
    
    Object.assign(experience, req.body);
    await user.save();
    
    res.json({
      success: true,
      data: {
        workExperience: experience
      },
      message: 'Work experience updated successfully'
    });
  } catch (error) {
    console.error('Update work experience error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update work experience'
      }
    });
  }
});

// DELETE /api/users/work-experience/:id - Delete Work Experience
router.delete('/work-experience/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    const experience = user.workExperience.id(req.params.id);
    if (!experience) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EXPERIENCE_NOT_FOUND',
          message: 'Work experience not found'
        }
      });
    }
    
    experience.deleteOne();
    await user.save();
    
    res.json({
      success: true,
      message: 'Work experience deleted successfully'
    });
  } catch (error) {
    console.error('Delete work experience error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to delete work experience'
      }
    });
  }
});

// POST /api/users/education - Add Education
router.post('/education', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    user.education.push(req.body);
    await user.save();
    
    res.status(201).json({
      success: true,
      data: {
        education: user.education[user.education.length - 1]
      },
      message: 'Education added successfully'
    });
  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to add education'
      }
    });
  }
});

// PUT /api/users/education/:id - Update Education
router.put('/education/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    const education = user.education.id(req.params.id);
    if (!education) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EDUCATION_NOT_FOUND',
          message: 'Education not found'
        }
      });
    }
    
    Object.assign(education, req.body);
    await user.save();
    
    res.json({
      success: true,
      data: {
        education: education
      },
      message: 'Education updated successfully'
    });
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update education'
      }
    });
  }
});

// DELETE /api/users/education/:id - Delete Education
router.delete('/education/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    const education = user.education.id(req.params.id);
    if (!education) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'EDUCATION_NOT_FOUND',
          message: 'Education not found'
        }
      });
    }
    
    education.deleteOne();
    await user.save();
    
    res.json({
      success: true,
      message: 'Education deleted successfully'
    });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to delete education'
      }
    });
  }
});

// POST /api/users/skills - Add Skills
router.post('/skills', authenticateToken, async (req, res) => {
  try {
    const { skills } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_DATA',
          message: 'Skills must be an array'
        }
      });
    }
    
    user.skills.push(...skills);
    await user.save();
    
    res.status(201).json({
      success: true,
      data: {
        skills: user.skills
      },
      message: 'Skills added successfully'
    });
  } catch (error) {
    console.error('Add skills error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to add skills'
      }
    });
  }
});

// PUT /api/users/skills/:id - Update Skill
router.put('/skills/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    const skill = user.skills.id(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SKILL_NOT_FOUND',
          message: 'Skill not found'
        }
      });
    }
    
    Object.assign(skill, req.body);
    await user.save();
    
    res.json({
      success: true,
      data: {
        skill: skill
      },
      message: 'Skill updated successfully'
    });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update skill'
      }
    });
  }
});

// DELETE /api/users/skills/:id - Delete Skill
router.delete('/skills/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    const skill = user.skills.id(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SKILL_NOT_FOUND',
          message: 'Skill not found'
        }
      });
    }
    
    skill.deleteOne();
    await user.save();
    
    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to delete skill'
      }
    });
  }
});

// POST /api/users/certifications - Add Certification
router.post('/certifications', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    user.certifications.push(req.body);
    await user.save();
    
    res.status(201).json({
      success: true,
      data: {
        certification: user.certifications[user.certifications.length - 1]
      },
      message: 'Certification added successfully'
    });
  } catch (error) {
    console.error('Add certification error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to add certification'
      }
    });
  }
});

// PUT /api/users/certifications/:id - Update Certification
router.put('/certifications/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    const certification = user.certifications.id(req.params.id);
    if (!certification) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CERTIFICATION_NOT_FOUND',
          message: 'Certification not found'
        }
      });
    }
    
    Object.assign(certification, req.body);
    await user.save();
    
    res.json({
      success: true,
      data: {
        certification: certification
      },
      message: 'Certification updated successfully'
    });
  } catch (error) {
    console.error('Update certification error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to update certification'
      }
    });
  }
});

// DELETE /api/users/certifications/:id - Delete Certification
router.delete('/certifications/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }
    
    const certification = user.certifications.id(req.params.id);
    if (!certification) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'CERTIFICATION_NOT_FOUND',
          message: 'Certification not found'
        }
      });
    }
    
    certification.deleteOne();
    await user.save();
    
    res.json({
      success: true,
      message: 'Certification deleted successfully'
    });
  } catch (error) {
    console.error('Delete certification error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to delete certification'
      }
    });
  }
});

module.exports = router;