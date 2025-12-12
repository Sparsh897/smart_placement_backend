const mongoose = require('mongoose');

const JobApplicationSchema = new mongoose.Schema(
  {
    // Foreign Keys
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true // Index for faster queries
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true // Index for faster queries
    },
    
    // Application Details
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired', 'withdrawn'],
      default: 'pending',
      index: true // Index for status-based queries
    },
    
    // Contact Information (captured at application time)
    contactInfo: {
      fullName: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      location: {
        city: String,
        state: String,
        country: String
      }
    },
    
    // Resume Information
    resume: {
      fileName: {
        type: String,
        required: true
      },
      fileUrl: {
        type: String,
        required: true
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    },
    
    // Employer Questions & Answers
    employerQuestions: [{
      question: {
        type: String,
        required: true
      },
      answer: {
        type: mongoose.Schema.Types.Mixed, // Can be string, number, boolean, array
        required: true
      },
      questionType: {
        type: String,
        enum: ['text', 'number', 'boolean', 'select', 'multiselect'],
        default: 'text'
      }
    }],
    
    // Relevant Experience
    relevantExperience: [{
      jobTitle: String,
      company: String,
      duration: String,
      description: String
    }],
    
    // Supporting Documents
    supportingDocuments: [{
      fileName: String,
      fileUrl: String,
      documentType: String, // 'cover_letter', 'portfolio', 'certificate', 'other'
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    
    // Cover Letter
    coverLetter: {
      type: String,
      maxlength: 2000
    },
    
    // Job Alert Preferences (if user opts in)
    jobAlertPreferences: {
      emailUpdates: {
        type: Boolean,
        default: false
      },
      location: String,
      jobTitle: String
    },
    
    // Application Metadata
    applicationSource: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'mobile'
    },
    
    // Employer Actions
    employerActions: [{
      action: {
        type: String,
        enum: ['viewed', 'shortlisted', 'rejected', 'contacted', 'hired']
      },
      actionDate: {
        type: Date,
        default: Date.now
      },
      notes: String,
      actionBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // If you have employer users
      }
    }],
    
    // Timestamps
    appliedAt: {
      type: Date,
      default: Date.now,
      index: true // Index for date-based queries
    },
    
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        // Remove sensitive information if needed
        return ret;
      }
    }
  }
);

// Compound Indexes for Performance
JobApplicationSchema.index({ userId: 1, appliedAt: -1 }); // User's applications by date
JobApplicationSchema.index({ jobId: 1, appliedAt: -1 }); // Job applications by date
JobApplicationSchema.index({ userId: 1, status: 1 }); // User's applications by status
JobApplicationSchema.index({ userId: 1, jobId: 1 }, { unique: true }); // Prevent duplicate applications

// Pre-save middleware to update lastUpdated
JobApplicationSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Static method to check if user has applied to a job
JobApplicationSchema.statics.hasUserApplied = async function(userId, jobId) {
  const application = await this.findOne({ userId, jobId });
  return !!application;
};

// Static method to get user's applied job IDs (for filtering)
JobApplicationSchema.statics.getUserAppliedJobIds = async function(userId) {
  const applications = await this.find({ userId }).select('jobId');
  return applications.map(app => app.jobId);
};

// Instance method to update status
JobApplicationSchema.methods.updateStatus = function(newStatus, notes = '', actionBy = null) {
  this.status = newStatus;
  this.employerActions.push({
    action: newStatus,
    actionDate: new Date(),
    notes,
    actionBy
  });
  return this.save();
};

module.exports = mongoose.model('JobApplication', JobApplicationSchema);