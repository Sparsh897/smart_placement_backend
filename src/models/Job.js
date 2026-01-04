const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    domain: { type: String, required: true },
    salary: { type: String },
    description: { type: String },
    eligibility: { type: String },
    // These fields map to what the Flutter app is using for filtering
    educationLevel: { type: String, required: true }, // e.g. "10th", "12th", "Diploma", "Undergraduate", "Postgraduate"
    course: { type: String, required: true },         // e.g. "Science", "Engineering", etc.
    specialization: { type: String, required: true },  // e.g. "Physics", "Computer Science", etc.
    skills: [{ type: String }],
    applyLink: { type: String },
    
    // Company Reference (for company-posted jobs)
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null // null for admin-posted jobs, ObjectId for company-posted jobs
    },
    
    // Job Status
    isActive: {
      type: Boolean,
      default: true
    },
    
    // Application tracking
    totalApplications: {
      type: Number,
      default: 0
    },
    
    // Job posting metadata
    postedBy: {
      type: String,
      enum: ['admin', 'company'],
      default: 'admin'
    },
    
    // Expiry date for job posting
    expiresAt: {
      type: Date,
      default: function() {
        // Default expiry: 30 days from creation
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }
    }
  },
  { timestamps: true }
);

// Index for company jobs
JobSchema.index({ companyId: 1 });

// Index for active jobs
JobSchema.index({ isActive: 1 });

// Index for expiry
JobSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Job', JobSchema);
