const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const { JWT_SECRET } = require('../utils/jwt');

// Google OAuth Strategy (only if credentials are provided)
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      // Update last login and return existing user
      await user.updateLastLogin();
      return done(null, user);
    }
    
    // Check if user exists with same email but different login type
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user && user.loginType === 'email') {
      // Don't link if user already has email/password account
      return done(new Error('Email already registered with password. Please login with your password.'), null);
    }
    
    if (user) {
      // Link Google account to existing user
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin@12345', 12);
      
      user.googleId = profile.id;
      user.loginType = 'google';
      user.isEmailVerified = true;
      user.password = hashedPassword; // Set hashed default password for Google users
      
      // Update profile picture if not set
      if (!user.profilePicture && profile.photos && profile.photos.length > 0) {
        user.profilePicture = profile.photos[0].value;
      }
      
      await user.save();
      await user.updateLastLogin();
      return done(null, user);
    }
    
    // Create new user with hashed default password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin@12345', 12);
    
    user = new User({
      name: profile.displayName,
      email: profile.emails[0].value,
      password: hashedPassword, // Set hashed default password for Google users
      googleId: profile.id,
      firebaseUid: null, // Will be set later if using Firebase
      loginType: 'google',
      isEmailVerified: true,
      profilePicture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
      phone: null, // No phone for Google users initially
      lastLogin: new Date()
    });
    
    await user.save();
    return done(null, user);
    
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
  }));
} else {
  console.log('Google OAuth not configured - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET not provided');
}

// JWT Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.userId).select('-password');
    
    if (user && user.isActive) {
      return done(null, user);
    }
    
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;