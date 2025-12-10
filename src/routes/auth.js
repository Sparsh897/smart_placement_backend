const express = require('express');
const passport = require('../config/passport');
const User = require('../models/User');
const { generateTokensForUser } = require('../utils/jwt');
const { authenticateToken } = require('../middleware/auth');
const { 
  validateRegistration, 
  validateLogin, 
  validatePasswordChange 
} = require('../middleware/validation');

const router = express.Router();

// POST /api/auth/register - Email/Password Registration
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // Check if user registered with Google
      if (existingUser.loginType === 'google') {
        return res.status(409).json({
          success: false,
          error: {
            code: 'GOOGLE_USER_EXISTS',
            message: 'This email is already registered with Google. Please use Google Sign-In instead.'
          }
        });
      }
      
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists'
        }
      });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone: phone || null, // Make phone optional
      loginType: 'email',
      googleId: null,
      firebaseUid: null,
      lastLogin: new Date()
    });
    
    await user.save();
    
    // Generate tokens
    const tokens = generateTokensForUser(user);
    
    res.status(201).json({
      success: true,
      data: {
        user: user.toJSON(),
        tokens
      },
      message: 'User registered successfully'
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists'
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Registration failed'
      }
    });
  }
});

// POST /api/auth/login - Email/Password Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }
    
    // Check if user registered with Google
    if (user.loginType === 'google') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'GOOGLE_USER',
          message: 'This account was created with Google. Please use Google Sign-In instead.'
        }
      });
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
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
    await user.updateLastLogin();
    
    // Generate tokens
    const tokens = generateTokensForUser(user);
    
    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        tokens
      },
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Login failed'
      }
    });
  }
});

// GET /api/auth/google - Initiate Google OAuth
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// GET /api/auth/google/callback - Google OAuth Callback
router.get('/google/callback', 
  passport.authenticate('google', { session: false }),
  async (req, res) => {
    try {
      const user = req.user;
      
      // Generate tokens
      const tokens = generateTokensForUser(user);
      
      // Redirect to frontend with tokens
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectURL = `${frontendURL}/auth/callback?token=${tokens.accessToken}&success=true`;
      
      res.redirect(redirectURL);
      
    } catch (error) {
      console.error('Google callback error:', error);
      const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
      const redirectURL = `${frontendURL}/auth/callback?success=false&error=authentication_failed`;
      res.redirect(redirectURL);
    }
  }
);

// POST /api/auth/google/mobile - Google OAuth for Mobile
router.post('/google/mobile', async (req, res) => {
  try {
    const { googleToken, userInfo, firebaseUid } = req.body;
    
    if (!googleToken || !userInfo) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_DATA',
          message: 'Google token and user info are required'
        }
      });
    }
    
    const { email, name, picture, sub: googleId } = userInfo;
    
    if (!email || !name || !googleId) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_USER_INFO',
          message: 'Invalid user information from Google'
        }
      });
    }
    
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId });
    
    if (user) {
      // Update Firebase UID if provided and not already set
      if (firebaseUid && !user.firebaseUid) {
        user.firebaseUid = firebaseUid;
        await user.save();
      }
      // Update last login and return existing user
      await user.updateLastLogin();
    } else {
      // Check if user exists with same email but different login type
      user = await User.findOne({ email });
      
      if (user && user.loginType === 'email') {
        return res.status(409).json({
          success: false,
          error: {
            code: 'EMAIL_USER_EXISTS',
            message: 'This email is already registered with email/password. Please login with your password instead.'
          }
        });
      }
      
      if (user) {
        // Link Google account to existing user
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin@12345', 12);
        
        user.googleId = googleId;
        user.loginType = 'google';
        user.isEmailVerified = true;
        user.password = hashedPassword; // Set hashed default password for Google users
        user.firebaseUid = firebaseUid || null;
        
        if (!user.profilePicture && picture) {
          user.profilePicture = picture;
        }
        
        await user.save();
        await user.updateLastLogin();
      } else {
        // Create new user with hashed default password
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin@12345', 12);
        
        user = new User({
          name,
          email,
          password: hashedPassword, // Set hashed default password for Google users
          googleId,
          firebaseUid: firebaseUid || null,
          loginType: 'google',
          isEmailVerified: true,
          profilePicture: picture || null,
          phone: null, // No phone for Google users initially
          lastLogin: new Date()
        });
        
        await user.save();
      }
    }
    
    // Generate tokens
    const tokens = generateTokensForUser(user);
    
    res.json({
      success: true,
      data: {
        user: user.toJSON(),
        tokens
      },
      message: 'Google authentication successful'
    });
    
  } catch (error) {
    console.error('Google mobile auth error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Google authentication failed'
      }
    });
  }
});

// GET /api/auth/me - Get Current User
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to get user information'
      }
    });
  }
});

// POST /api/auth/logout - Logout (Client-side token removal)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a stateless JWT system, logout is handled client-side by removing the token
    // We can optionally log this event or add token blacklisting here
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Logout failed'
      }
    });
  }
});

// POST /api/auth/change-password - Change Password
router.post('/change-password', authenticateToken, validatePasswordChange, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    
    // Check if user uses email login
    if (user.loginType !== 'email') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_OPERATION',
          message: 'Password change is only available for email accounts'
        }
      });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_PASSWORD',
          message: 'Current password is incorrect'
        }
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Password change failed'
      }
    });
  }
});

// DELETE /api/auth/account - Delete Account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    
    // Soft delete - mark as inactive
    user.isActive = false;
    user.email = `deleted_${Date.now()}_${user.email}`;
    await user.save();
    
    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Account deletion failed'
      }
    });
  }
});

module.exports = router;