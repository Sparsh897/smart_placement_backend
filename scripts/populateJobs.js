const mongoose = require('mongoose');
const Job = require('../src/models/Job');
const connectDB = require('../src/config/db');

// Enhanced job data with expanded descriptions
const jobsData = [
  // AI / ML Domain
  {
    title: 'Junior ML Engineer',
    company: 'Tech Labs',
    location: 'Bangalore',
    salary: '₹6-8 LPA',
    domain: 'AI / ML',
    description: `Join Tech Labs as a Junior ML Engineer and work on cutting-edge machine learning models for recommendation systems serving millions of users. You'll collaborate with senior engineers to design, implement, and optimize ML algorithms that power our core products. Key responsibilities include developing ML models, implementing data preprocessing pipelines, feature engineering, and translating research into production code. You'll optimize model performance, participate in code reviews, and work with large datasets using distributed computing frameworks. This role offers excellent learning opportunities in advanced ML techniques, deep learning, neural networks, production ML systems, MLOps practices, big data technologies like Spark and Hadoop, cloud platforms (AWS/GCP) for ML deployment, and A/B testing frameworks. Perfect for fresh graduates passionate about AI/ML who want to kickstart their career with mentorship from industry experts in a collaborative environment focused on innovation and growth.`,
    eligibility: 'B.Tech/M.Tech CSE or related, strong Python/ML skills.',
    educationLevel: 'Undergraduate',
    course: 'Engineering',
    specialization: 'Computer Science',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Scikit-learn', 'Pandas'],
    applyLink: 'https://example.com/jobs/ml1'
  },
  {
    title: 'AI Research Intern',
    company: 'AI Innovations',
    location: 'Hyderabad',
    salary: '₹4-6 LPA',
    domain: 'AI / ML',
    description: `AI Innovations seeks an AI Research Intern to contribute to groundbreaking artificial intelligence research. This internship provides hands-on experience developing novel AI algorithms and working on cutting-edge research projects. You'll focus on research areas including Natural Language Processing, Computer Vision, Reinforcement Learning, Generative AI, Large Language Models, and Explainable AI. Responsibilities include conducting literature reviews, implementing state-of-the-art AI algorithms, collaborating with PhD researchers and senior scientists, presenting findings at research meetings, contributing to research papers and publications, and developing prototypes. You'll have access to high-performance computing resources, mentorship from leading AI researchers, exposure to advanced research methodologies, opportunities to publish papers, and networking within the AI research community. This position offers excellent learning opportunities in cutting-edge AI technologies and research practices. Perfect for students passionate about AI research who are considering careers in academia or advanced R&D roles in the rapidly evolving field of artificial intelligence.`,
    eligibility: 'M.Tech/M.Sc in CS or related field.',
    educationLevel: 'Postgraduate',
    course: 'Engineering',
    specialization: 'Computer Science',
    skills: ['Python', 'Deep Learning', 'PyTorch', 'Research', 'Mathematics'],
    applyLink: 'https://example.com/jobs/ml2'
  },

  // Data Science Domain
  {
    title: 'Data Analyst',
    company: 'DataCorp',
    location: 'Mumbai',
    salary: '₹5-7 LPA',
    domain: 'Data Science',
    description: `DataCorp seeks a detail-oriented Data Analyst to transform raw data into actionable business insights driving strategic organizational decisions. You'll analyze large datasets to identify trends, patterns, and business opportunities while creating comprehensive reports and dashboards for stakeholders. Key responsibilities include performing statistical analysis, hypothesis testing, collaborating with business teams on data requirements, developing automated reporting solutions, and ensuring data quality. You'll use SQL for data extraction, Python/R for statistical analysis, Tableau/Power BI for visualization, Excel for reporting, and statistical methods for A/B testing. Your work will support marketing campaigns through customer segmentation, optimize pricing strategies, improve operational efficiency, identify revenue opportunities through data mining, and monitor KPIs. This role offers excellent career growth opportunities with paths to Senior Data Analyst and Data Scientist positions, training in advanced analytics and machine learning, exposure to various business domains, and mentorship from experienced professionals. Perfect for analytical minds passionate about solving complex business problems with data-driven insights and statistical analysis.`,
    eligibility: 'B.Sc/M.Sc in Statistics, Mathematics, or CS.',
    educationLevel: 'Undergraduate',
    course: 'Science',
    specialization: 'Mathematics',
    skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Statistics'],
    applyLink: 'https://example.com/jobs/ds1'
  },
  {
    title: 'Junior Data Scientist',
    company: 'Analytics Pro',
    location: 'Pune',
    salary: '₹7-9 LPA',
    domain: 'Data Science',
    description: `Analytics Pro seeks a Junior Data Scientist for exciting projects involving predictive modeling, machine learning, and advanced analytics to solve complex business challenges. You'll work on customer churn prediction, demand forecasting for inventory optimization, fraud detection models, recommendation systems for e-commerce, and price optimization models. Technical responsibilities include building and deploying ML models in production, designing data pipelines, performing feature engineering and preprocessing, conducting exploratory data analysis, collaborating with engineering teams for deployment, and monitoring model performance. You'll use Python ecosystem tools (Pandas, NumPy, Scikit-learn, TensorFlow), SQL and NoSQL databases, cloud platforms (AWS/Azure), Docker and Kubernetes for containerization, Git for version control, and Jupyter notebooks for experimentation. Professional development opportunities include working with senior data scientists, attending conferences and workshops, contributing to open-source projects, leading junior team members, and advancing to Senior Data Scientist roles. Join our collaborative, innovative environment to make real impact with data science while growing your career in this rapidly expanding field with cutting-edge technologies and methodologies.`,
    eligibility: 'MCA/M.Tech with Python, SQL, ML knowledge.',
    educationLevel: 'Postgraduate',
    course: 'Engineering',
    specialization: 'Computer Science',
    skills: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'AWS'],
    applyLink: 'https://example.com/jobs/ds2'
  },

  // Web Development Domain
  {
    title: 'Flutter Web Developer',
    company: 'Webify',
    location: 'Remote',
    salary: '₹5-7 LPA',
    domain: 'Web Development',
    description: `Webify seeks a talented Flutter Web Developer to create beautiful, responsive web applications using Flutter's web capabilities. This remote position offers flexibility to work from anywhere while contributing to innovative projects including Progressive Web Applications (PWAs) with offline capabilities, e-commerce platforms with real-time features, dashboard and admin panels, cross-platform applications, and interactive data visualization tools. Technical responsibilities include developing responsive web applications, implementing state management solutions (Provider, Bloc, Riverpod), integrating RESTful APIs and GraphQL endpoints, optimizing web performance, ensuring cross-browser compatibility, and writing clean, maintainable code. You'll develop expertise in widget composition, custom widget development, navigation and routing, web-specific plugins, SEO optimization, PWA implementation, and web API integration. Collaboration includes working with UI/UX designers for pixel-perfect implementations, backend developers for API integration, participating in code reviews, and mentoring junior developers. Remote work benefits include flexible hours across time zones, home office setup allowance, regular team meetups, virtual events, and professional development budget for courses and conferences. Perfect for developers passionate about Flutter and modern web development.`,
    eligibility: 'BCA/B.Sc/B.Tech with Flutter experience.',
    educationLevel: 'Undergraduate',
    course: 'Engineering',
    specialization: 'Computer Science',
    skills: ['Flutter', 'Dart', 'Web Development', 'API Integration', 'State Management'],
    applyLink: 'https://example.com/jobs/web1'
  },
  {
    title: 'Full Stack Developer',
    company: 'TechStart',
    location: 'Bangalore',
    salary: '₹6-10 LPA',
    domain: 'Web Development',
    description: `TechStart seeks a versatile Full Stack Developer to build end-to-end web applications using modern technologies. You'll work on diverse projects from concept to deployment, handling both frontend and backend development. Our technology stack includes React.js, Next.js, TypeScript, Tailwind CSS for frontend; Node.js, Express.js, Python Django/FastAPI for backend; MongoDB, PostgreSQL, Redis for databases; AWS, Docker, Kubernetes for cloud; and Git, CI/CD pipelines, testing frameworks for development tools. Project responsibilities include designing scalable web applications from scratch, building responsive user interfaces, developing robust backend APIs and microservices, implementing authentication and security features, optimizing performance and user experience, and deploying applications with CI/CD. You'll create modern React interfaces, implement state management with Redux, build reusable component libraries, ensure cross-browser compatibility, design RESTful APIs, implement database schemas, handle authentication and security, build real-time features with WebSockets, and integrate third-party services. DevOps responsibilities include setting up CI/CD pipelines, containerizing applications with Docker, deploying to cloud platforms, monitoring performance, and implementing backup strategies. Career growth opportunities include working with cutting-edge technologies, leading technical decisions, mentoring developers, specializing in frontend/backend/DevOps, and advancing to Technical Lead roles.`,
    eligibility: 'MCA/B.Tech with MERN/MEAN stack experience.',
    educationLevel: 'Undergraduate',
    course: 'Engineering',
    specialization: 'Computer Science',
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript'],
    applyLink: 'https://example.com/jobs/web2'
  },

  // Digital Marketing Domain
  {
    title: 'Digital Marketing Executive',
    company: 'MarketPro',
    location: 'Delhi',
    salary: '₹3-5 LPA',
    domain: 'Digital Marketing',
    description: `MarketPro seeks a creative, data-driven Digital Marketing Executive to develop and execute digital marketing strategies across multiple channels for brand awareness and customer acquisition. Core responsibilities include planning and executing digital campaigns, managing social media accounts, creating engaging content, optimizing websites for SEO, running paid advertising campaigns (Google Ads, Facebook Ads), analyzing campaign performance, and collaborating with design teams. You'll develop social media strategies, create content across Facebook, Instagram, LinkedIn, Twitter, engage with followers, build online communities, monitor trends and competitor activities, and analyze social media metrics. SEO responsibilities include keyword research, competitive analysis, optimizing website content and meta tags, building high-quality backlinks, monitoring search rankings and organic traffic, and staying updated with Google algorithm changes. Paid advertising involves creating Google Ads campaigns (Search, Display, Shopping), optimizing Facebook and Instagram ads, conducting A/B testing, monitoring budgets for better ROI, and generating performance reports. Analytics work includes using Google Analytics, creating marketing reports and dashboards, analyzing customer journeys and conversion funnels, identifying optimization opportunities, and presenting findings to management. Skills development includes training in advanced digital marketing tools, certification programs (Google Ads, Facebook Blueprint, HubSpot), exposure to marketing automation and CRM systems, and working with influencers.`,
    eligibility: 'BBA/MBA in Marketing.',
    educationLevel: 'Undergraduate',
    course: 'Management',
    specialization: 'Marketing',
    skills: ['Digital Marketing', 'SEO', 'Social Media', 'Google Ads', 'Analytics'],
    applyLink: 'https://example.com/jobs/dm1'
  },
  {
    title: 'SEO Specialist',
    company: 'Growth Agency',
    location: 'Gurgaon',
    salary: '₹4-6 LPA',
    domain: 'Digital Marketing',
    description: `Growth Agency seeks an experienced SEO Specialist to help clients achieve top search engine rankings and drive organic traffic growth across diverse industries. You'll conduct comprehensive SEO audits, develop customized strategies based on business goals, perform in-depth keyword research and competitive analysis, create SEO roadmaps and implementation timelines, and monitor strategies based on algorithm updates. Technical SEO responsibilities include optimizing website architecture and URL structures, improving site speed and Core Web Vitals, implementing schema markup and structured data, fixing crawl errors and indexation issues, and optimizing for mobile-first indexing. Content optimization involves optimizing existing content for target keywords, developing content strategies for improved rankings, creating SEO-friendly content briefs, optimizing meta titles and descriptions, and implementing internal linking strategies. Link building includes developing campaigns, identifying high-quality opportunities, building relationships with industry publications and bloggers, creating linkable assets, and monitoring toxic backlinks. Local SEO covers Google My Business optimization, local citation building, managing online reviews, optimizing for local search queries, and creating location-specific landing pages. Analytics work involves tracking keyword rankings, monitoring technical SEO health, creating detailed client reports, using tools like SEMrush and Ahrefs, and providing actionable recommendations. Client management includes communicating strategies and results, conducting training sessions, collaborating with development teams, and staying updated with industry trends.`,
    eligibility: 'MBA/BBA with SEO certification.',
    educationLevel: 'Postgraduate',
    course: 'Management',
    specialization: 'Marketing',
    skills: ['SEO', 'Google Analytics', 'Keyword Research', 'Link Building', 'Technical SEO'],
    applyLink: 'https://example.com/jobs/dm2'
  },

  // Financial Analysis Domain
  {
    title: 'Financial Analyst',
    company: 'FinCorp',
    location: 'Mumbai',
    salary: '₹5-8 LPA',
    domain: 'Financial Analysis',
    description: `FinCorp seeks a detail-oriented Financial Analyst for financial planning, analysis, and reporting to support strategic business decisions and drive company growth. Core responsibilities include preparing detailed financial reports and analysis for management, developing financial models for budgeting and forecasting, analyzing financial performance to identify trends and variances, supporting strategic planning and investment decisions, conducting market research and competitive analysis, and assisting in merger and acquisition evaluations. Financial modeling involves building comprehensive Excel models, creating scenario analysis and sensitivity testing, developing valuation models using DCF and comparable company analysis, modeling financial impact of business initiatives, and automating reporting processes and dashboards. Budgeting and forecasting includes preparing annual budgets and quarterly forecasts, collaborating with department heads for budget planning, monitoring actual performance against budgets, identifying and explaining variances, and recommending corrective actions. Investment analysis covers evaluating capital expenditure proposals and ROI analysis, conducting due diligence for potential investments, analyzing market opportunities and business cases, supporting pricing strategies and profitability analysis, and assessing financial risks and mitigation strategies. Reporting involves preparing monthly, quarterly, and annual financial reports, creating executive dashboards and KPI tracking, presenting findings to senior management, developing automated reporting solutions, and ensuring compliance with accounting standards. Skills development includes advanced Excel modeling, training in financial software (SAP, Oracle, QuickBooks), exposure to business intelligence tools, professional certifications, and industry knowledge.`,
    eligibility: 'M.Com/MBA Finance with Excel skills.',
    educationLevel: 'Postgraduate',
    course: 'Commerce',
    specialization: 'Finance',
    skills: ['Financial Analysis', 'Excel', 'Financial Modeling', 'Budgeting', 'Reporting'],
    applyLink: 'https://example.com/jobs/fa1'
  },

  // Software Development Domain
  {
    title: 'Software Engineer',
    company: 'Tech Solutions',
    location: 'Bangalore',
    salary: '₹6-9 LPA',
    domain: 'Software Development',
    description: `Tech Solutions seeks a passionate Software Engineer to build scalable software applications and contribute to all phases of the software development lifecycle. Development responsibilities include designing, developing, and maintaining high-quality software applications, writing clean, efficient, well-documented code, participating in code reviews, maintaining coding standards, debugging and troubleshooting software issues, collaborating with cross-functional teams on project requirements, and implementing software testing and quality assurance practices. Our technology stack includes programming languages (Java, Python, JavaScript, C#), frameworks (Spring Boot, Django, React, Angular), databases (MySQL, PostgreSQL, MongoDB), cloud platforms (AWS, Azure, Google Cloud), and DevOps tools (Docker, Kubernetes, Jenkins, Git). Software architecture work involves designing scalable and maintainable architectures, implementing design patterns and best practices, building microservices and distributed systems, ensuring application security and performance optimization, and creating technical documentation. You'll work in Agile/Scrum methodology, participate in sprint planning and daily standups, collaborate with product managers and designers, deliver features in iterative cycles, and continuously improve development processes. Quality assurance includes writing unit and integration tests, implementing automated testing frameworks, performing code reviews and peer programming, following test-driven development practices, and ensuring code quality. Professional growth opportunities include mentorship from senior engineers, training in emerging technologies, leading technical projects, exposure to different domains, and advancement to Senior Engineer, Tech Lead, and Architect roles.`,
    eligibility: 'B.Tech/MCA/M.Sc CS.',
    educationLevel: 'Undergraduate',
    course: 'Engineering',
    specialization: 'Computer Science',
    skills: ['Java', 'Python', 'JavaScript', 'Spring Boot', 'React'],
    applyLink: 'https://example.com/jobs/sd1'
  },

  // Cloud Computing Domain
  {
    title: 'Cloud Engineer',
    company: 'CloudTech',
    location: 'Hyderabad',
    salary: '₹7-10 LPA',
    domain: 'Cloud Computing',
    description: `CloudTech seeks a skilled Cloud Engineer to design, implement, and manage cloud infrastructure solutions using cutting-edge technologies to build scalable, secure, cost-effective cloud environments. Cloud infrastructure responsibilities include designing and implementing architectures on AWS, Azure, and GCP, setting up and managing virtual machines, containers, and serverless functions, configuring networking, security groups, and load balancers, implementing auto-scaling and high-availability solutions, and optimizing cloud costs and resource utilization. DevOps and automation work involves building CI/CD pipelines for automated deployment, implementing Infrastructure as Code (IaC) using Terraform and CloudFormation, automating cloud operations with scripting and configuration management, setting up monitoring, logging, and alerting systems, and managing containerized applications with Docker and Kubernetes. Cloud security includes implementing best practices and compliance, configuring identity and access management (IAM) policies, setting up encryption for data at rest and in transit, monitoring security threats and implementing incident response, and ensuring compliance with industry standards (SOC2, HIPAA, GDPR). Migration and modernization involves planning and executing cloud migration strategies, modernizing legacy applications for cloud-native architectures, implementing disaster recovery and backup solutions, optimizing applications for cloud performance and scalability, and providing technical guidance for cloud adoption. You'll gain expertise in AWS (EC2, S3, RDS, Lambda, EKS, CloudWatch), Azure (Virtual Machines, Blob Storage, SQL Database, Functions, AKS), GCP (Compute Engine, Cloud Storage, Cloud SQL, Cloud Functions, GKE), and multi-cloud architectures.`,
    eligibility: 'B.Tech/M.Tech with AWS/Azure certification.',
    educationLevel: 'Undergraduate',
    course: 'Engineering',
    specialization: 'Computer Science',
    skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform'],
    applyLink: 'https://example.com/jobs/cc1'
  },

  // Cybersecurity Domain
  {
    title: 'Security Analyst',
    company: 'SecureNet',
    location: 'Pune',
    salary: '₹6-9 LPA',
    domain: 'Cybersecurity',
    description: `SecureNet seeks a dedicated Security Analyst to protect our organization and clients from cyber threats by monitoring security systems, investigating incidents, and implementing security measures to safeguard digital assets. Security monitoring responsibilities include monitoring security events and alerts from SIEM systems, analyzing network traffic and system logs for suspicious activities, investigating security incidents and conducting forensic analysis, responding to security breaches and coordinating incident response, and maintaining security dashboards and threat intelligence feeds. Threat detection and analysis involves identifying and analyzing potential security threats and vulnerabilities, conducting malware analysis and reverse engineering, performing threat hunting and proactive security monitoring, assessing risk levels and prioritizing security incidents, and documenting security findings and creating incident reports. You'll work with security tools including SIEM platforms (Splunk, QRadar, ArcSight), vulnerability scanners (Nessus, OpenVAS, Qualys), network security tools (Wireshark, Nmap, Metasploit), endpoint protection and EDR solutions, and cloud security tools and services. Vulnerability management includes conducting regular vulnerability assessments and penetration testing, analyzing security scan results and prioritizing remediation, coordinating with IT teams for patch management, validating security fixes and verifying remediation, and maintaining vulnerability databases and tracking systems. Compliance and governance involves ensuring compliance with security standards (ISO 27001, NIST, PCI DSS), conducting security audits and assessments, developing and updating security policies and procedures, providing security training and awareness programs, and supporting regulatory compliance and audit activities.`,
    eligibility: 'B.Tech/MCA with security certifications.',
    educationLevel: 'Undergraduate',
    course: 'Engineering',
    specialization: 'Computer Science',
    skills: ['Cybersecurity', 'SIEM', 'Incident Response', 'Vulnerability Assessment', 'Network Security'],
    applyLink: 'https://example.com/jobs/cs1'
  }
];

async function populateJobs() {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing jobs (optional - remove this line if you want to keep existing data)
    await Job.deleteMany({});
    console.log('Cleared existing jobs');
    
    // Insert new jobs
    const insertedJobs = await Job.insertMany(jobsData);
    console.log(`Successfully inserted ${insertedJobs.length} jobs`);
    
    // Display summary
    const jobsByDomain = {};
    insertedJobs.forEach(job => {
      if (!jobsByDomain[job.domain]) {
        jobsByDomain[job.domain] = 0;
      }
      jobsByDomain[job.domain]++;
    });
    
    console.log('\nJobs inserted by domain:');
    Object.entries(jobsByDomain).forEach(([domain, count]) => {
      console.log(`${domain}: ${count} jobs`);
    });
    
    console.log('\nDatabase population completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error populating database:', error);
    process.exit(1);
  }
}

// Run the script
populateJobs();