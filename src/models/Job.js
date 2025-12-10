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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
