const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { 
      type: String,
      required: function() {
        return this.loginType === 'email';
      }
    },
    phone: { 
      type: String,
      trim: true
    },
    profilePicture: {
      type: String
    },
    loginType: {
      type: String,
      enum: ['email', 'google'],
      default: 'email'
    },
    googleId: {
      type: String,
      sparse: true // Allows multiple null values but unique non-null values
    },
    firebaseUid: {
      type: String,
      sparse: true // For Firebase authentication integration
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    location: {
      city: String,
      state: String,
      country: { type: String, default: 'India' }
    },
    profile: {
      educationLevel: {
        type: String,
        enum: ['Graduate', 'Post Graduate']
      },
      course: String,
      specialization: String,
      summary: String,
      currentSalary: Number,
      resumeUrl: String,
      visibility: { type: Boolean, default: true }
    },
    preferences: {
      desiredJobTitles: [String],
      jobTypes: [String], // ['Fresher', 'Full-time', 'Part-time', 'Internship']
      workSchedule: {
        days: [String],
        shifts: [String],
        schedules: [String]
      },
      minimumSalary: Number,
      preferredLocations: [String],
      remoteWork: { type: Boolean, default: false }
    },
    workExperience: [{
      jobTitle: String,
      company: String,
      location: String,
      employmentType: String,
      startDate: Date,
      endDate: Date,
      isCurrent: { type: Boolean, default: false },
      noticePeriod: String,
      description: String
    }],
    education: [{
      degree: String,
      institution: String,
      location: String,
      startDate: Date,
      endDate: Date,
      isCurrent: { type: Boolean, default: false },
      grade: String
    }],
    skills: [{
      name: String,
      proficiency: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Intermediate'
      },
      source: { type: String, default: 'Added manually' }
    }],
    certifications: [{
      name: String,
      issuer: String,
      issueDate: Date,
      expiryDate: Date,
      credentialId: String,
      url: String
    }],
    savedJobs: [{
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
      },
      savedAt: {
        type: Date,
        default: Date.now
      }
    }],
    resume: {
      fileUrl: String,
      fileName: String,
      uploadedAt: Date
    },
    lastLogin: Date,
    isActive: { type: Boolean, default: true }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        delete ret.googleId;
        delete ret.firebaseUid;
        return ret;
      }
    }
  }
);

// Index for unique email
UserSchema.index({ email: 1 }, { unique: true });

// Index for Google ID (sparse to allow nulls)
UserSchema.index({ googleId: 1 }, { sparse: true, unique: true });

// Index for Firebase UID (sparse to allow nulls)
UserSchema.index({ firebaseUid: 1 }, { sparse: true, unique: true });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash password if it's modified and login type is email
  if (!this.isModified('password') || this.loginType !== 'email') {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (this.loginType !== 'email' || !this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// Update last login
UserSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

module.exports = mongoose.model('User', UserSchema);