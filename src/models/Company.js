const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
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
      required: true,
      minlength: 8
    },
    // Company Details
    description: {
      type: String,
      maxlength: 1000
    },
    website: {
      type: String,
      trim: true
    },
    logo: {
      type: String // URL to company logo
    },
    industry: {
      type: String,
      trim: true
    },
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+']
    },
    founded: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear()
    },
    // Contact Information
    contactInfo: {
      phone: String,
      address: {
        street: String,
        city: String,
        state: String,
        country: { type: String, default: 'India' },
        pincode: String
      }
    },
    // HR/Recruiter Details
    hrContact: {
      name: String,
      email: String,
      phone: String,
      designation: String
    },
    // Account Status
    isVerified: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    },
    // Statistics
    totalJobsPosted: {
      type: Number,
      default: 0
    },
    activeJobs: {
      type: Number,
      default: 0
    },
    lastLogin: Date
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

// Index for unique email
CompanySchema.index({ email: 1 }, { unique: true });

// Index for company name (for search)
CompanySchema.index({ name: 'text' });

// Hash password before saving
CompanySchema.pre('save', async function(next) {
  // Only hash password if it's modified
  if (!this.isModified('password')) {
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
CompanySchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update last login
CompanySchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// Update job statistics
CompanySchema.methods.updateJobStats = async function() {
  const Job = mongoose.model('Job');
  const totalJobs = await Job.countDocuments({ companyId: this._id });
  const activeJobs = await Job.countDocuments({ companyId: this._id, isActive: true });
  
  this.totalJobsPosted = totalJobs;
  this.activeJobs = activeJobs;
  return this.save();
};

module.exports = mongoose.model('Company', CompanySchema);