const mongoose = require('mongoose');
const Job = require('../src/models/Job');
const connectDB = require('../src/config/db');

async function verifyJobs() {
  try {
    // Connect to database
    await connectDB();
    
    // Get total count
    const totalJobs = await Job.countDocuments();
    console.log(`Total jobs in database: ${totalJobs}`);
    
    // Get jobs by domain
    const jobsByDomain = await Job.aggregate([
      {
        $group: {
          _id: '$domain',
          count: { $sum: 1 },
          jobs: { $push: { title: '$title', company: '$company', location: '$location' } }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    console.log('\nJobs by Domain:');
    console.log('================');
    
    jobsByDomain.forEach(domain => {
      console.log(`\n${domain._id} (${domain.count} jobs):`);
      domain.jobs.forEach(job => {
        console.log(`  • ${job.title} at ${job.company}, ${job.location}`);
      });
    });
    
    // Sample job details
    const sampleJob = await Job.findOne().limit(1);
    if (sampleJob) {
      console.log('\nSample Job Details:');
      console.log('==================');
      console.log(`Title: ${sampleJob.title}`);
      console.log(`Company: ${sampleJob.company}`);
      console.log(`Domain: ${sampleJob.domain}`);
      console.log(`Location: ${sampleJob.location}`);
      console.log(`Salary: ${sampleJob.salary}`);
      console.log(`Education Level: ${sampleJob.educationLevel}`);
      console.log(`Course: ${sampleJob.course}`);
      console.log(`Specialization: ${sampleJob.specialization}`);
      console.log(`Skills: ${sampleJob.skills.join(', ')}`);
      console.log(`Description Length: ${sampleJob.description.length} characters`);
    }
    
    console.log('\nVerification completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error verifying database:', error);
    process.exit(1);
  }
}

// Run the script
verifyJobs();