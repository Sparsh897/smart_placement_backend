const educationLevels = ['Graduate', 'Post Graduate'];

const coursesByLevel = {
  'Graduate': [
    'B.Tech / B.E',
    'B.Sc',
    'BBA',
    'BCA',
    'B.Com',
    'Others (BA, B.Pharm, etc.)'
  ],
  'Post Graduate': [
    'M.Tech / M.E',
    'M.Sc',
    'MBA',
    'MCA',
    'M.Com',
    'Others (MA, MSW, M.Ed, etc.)'
  ]
};

const specializationsByCourse = {
  // Graduate Courses
  'B.Tech / B.E': [
    'CSE',
    'Mechanical',
    'Civil',
    'Electrical',
    'Electronics & Communication',
    'Chemical Engineering'
  ],
  'B.Sc': [
    'Computer Science',
    'Physics',
    'Chemistry',
    'Mathematics',
    'Biology',
    'Biotechnology'
  ],
  'BBA': [
    'Marketing',
    'Finance',
    'HR',
    'International Business',
    'Entrepreneurship'
  ],
  'BCA': [
    'Software Development',
    'Web Development',
    'Data Science',
    'Networking'
  ],
  'B.Com': [
    'Accounting',
    'Finance',
    'Banking',
    'Taxation'
  ],
  'Others (BA, B.Pharm, etc.)': [
    'General',
    'Specialized'
  ],
  // Post Graduate Courses
  'M.Tech / M.E': [
    'CSE',
    'Mechanical',
    'Civil',
    'Electrical',
    'Electronics & Communication',
    'Chemical Engineering'
  ],
  'M.Sc': [
    'Computer Science',
    'Physics',
    'Chemistry',
    'Mathematics',
    'Biology',
    'Data Science'
  ],
  'MBA': [
    'Marketing',
    'Finance',
    'HR',
    'Operations',
    'Business Analytics'
  ],
  'MCA': [
    'Software Development',
    'Web Development',
    'Data Science',
    'Cloud Computing'
  ],
  'M.Com': [
    'Accounting',
    'Finance',
    'Banking',
    'Taxation'
  ],
  'Others (MA, MSW, M.Ed, etc.)': [
    'General',
    'Specialized'
  ]
};

const domainsBySpecialization = {
  // Engineering Specializations
  'CSE': [
    'AI / ML',
    'Data Science',
    'Web Development',
    'App Development',
    'Cybersecurity',
    'Cloud Computing',
    'Software Testing',
    'DevOps / Networking'
  ],
  'Mechanical': [
    'Design Engineering',
    'Production',
    'Automotive',
    'CAD/CAM',
    'Robotics / Mechatronics'
  ],
  'Civil': [
    'Construction Management',
    'Structural Engineering',
    'Urban Planning',
    'Transportation Engineering'
  ],
  'Electrical': [
    'Power Systems',
    'Control Systems',
    'Electronics',
    'Renewable Energy'
  ],
  'Electronics & Communication': [
    'VLSI Design',
    'Embedded Systems',
    'Telecommunications',
    'Signal Processing'
  ],
  'Chemical Engineering': [
    'Process Engineering',
    'Petrochemicals',
    'Pharmaceuticals',
    'Environmental Engineering'
  ],
  // Science Specializations
  'Computer Science': [
    'Software Development',
    'Data Science',
    'AI / ML',
    'Cybersecurity'
  ],
  'Physics': [
    'Research & Development',
    'Teaching',
    'Data Analysis',
    'Technical Writing'
  ],
  'Chemistry': [
    'Pharmaceuticals',
    'Quality Control',
    'Research & Development',
    'Chemical Analysis'
  ],
  'Mathematics': [
    'Data Analysis',
    'Actuarial Science',
    'Teaching',
    'Research'
  ],
  'Biology': [
    'Biotechnology',
    'Research',
    'Healthcare',
    'Environmental Science'
  ],
  'Biotechnology': [
    'Pharmaceutical',
    'Research & Development',
    'Quality Control',
    'Bioinformatics'
  ],
  'Data Science': [
    'Data Analytics',
    'Machine Learning',
    'Business Intelligence',
    'Big Data'
  ],
  // Business Specializations
  'Marketing': [
    'Digital Marketing',
    'Brand Management',
    'Market Research',
    'Product Strategy'
  ],
  'Finance': [
    'Investment Banking',
    'Financial Analysis',
    'Corporate Finance',
    'Risk Management'
  ],
  'HR': [
    'Talent Acquisition',
    'Training & Development',
    'HR Operations',
    'Compensation & Benefits'
  ],
  'Operations': [
    'Supply Chain Management',
    'Operations Management',
    'Quality Management',
    'Project Management'
  ],
  'Business Analytics': [
    'Data Analytics',
    'Business Intelligence',
    'Predictive Analytics',
    'Market Analytics'
  ],
  'International Business': [
    'Export/Import',
    'Global Marketing',
    'International Finance',
    'Cross-border Operations'
  ],
  'Entrepreneurship': [
    'Startup Management',
    'Business Development',
    'Innovation Management',
    'Venture Capital'
  ],
  // Computer Applications
  'Software Development': [
    'Full Stack Development',
    'Backend Development',
    'Frontend Development',
    'Mobile Development'
  ],
  'Web Development': [
    'Frontend Development',
    'Backend Development',
    'Full Stack Development',
    'UI/UX Design'
  ],
  'Networking': [
    'Network Administration',
    'Network Security',
    'Cloud Networking',
    'System Administration'
  ],
  'Cloud Computing': [
    'AWS',
    'Azure',
    'Google Cloud',
    'DevOps'
  ],
  // Commerce Specializations
  'Accounting': [
    'Financial Accounting',
    'Cost Accounting',
    'Auditing',
    'Taxation'
  ],
  'Banking': [
    'Retail Banking',
    'Corporate Banking',
    'Investment Banking',
    'Risk Management'
  ],
  'Taxation': [
    'Tax Consulting',
    'Tax Planning',
    'GST',
    'International Taxation'
  ],
  // General
  'General': [
    'Administration',
    'Management',
    'Consulting',
    'Teaching'
  ],
  'Specialized': [
    'Research',
    'Consulting',
    'Project Management',
    'Training'
  ]
};

module.exports = {
  educationLevels,
  coursesByLevel,
  specializationsByCourse,
  domainsBySpecialization
};