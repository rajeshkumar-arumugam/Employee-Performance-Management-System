const { sequelize } = require('../config/database');
const { syncModels, User, Goal, PerformanceReview, Skill, UserSkill, TimeLog } = require('../models');

/**
 * Initialize database with sample data
 */
const initDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Sync all models (this will create tables)
    await syncModels(true); // force: true will drop existing tables
    
    console.log('📊 Creating sample data...');
    
    // Create sample skills
    const skills = await Skill.bulkCreate([
      { name: 'JavaScript', category: 'technical', description: 'JavaScript programming language' },
      { name: 'React', category: 'technical', description: 'React.js framework' },
      { name: 'Node.js', category: 'technical', description: 'Node.js runtime' },
      { name: 'PostgreSQL', category: 'technical', description: 'PostgreSQL database' },
      { name: 'Communication', category: 'soft_skills', description: 'Effective communication skills' },
      { name: 'Leadership', category: 'leadership', description: 'Team leadership abilities' },
      { name: 'Problem Solving', category: 'soft_skills', description: 'Analytical problem solving' },
      { name: 'Project Management', category: 'leadership', description: 'Project management skills' },
      { name: 'Teamwork', category: 'soft_skills', description: 'Collaborative teamwork' },
      { name: 'Time Management', category: 'soft_skills', description: 'Effective time management' }
    ]);

    // Create admin user
    const admin = await User.create({
      employeeId: 'ADMIN001',
      email: 'admin@company.com',
      password: 'test@123',
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin',
      department: 'IT',
      position: 'System Administrator',
      dateOfJoining: new Date('2020-01-01'),
      phone: '+1-555-0001',
      isActive: true
    });

    // Create HR user
    const hrUser = await User.create({
      employeeId: 'HR001',
      email: 'hr@company.com',
      password: 'hr123456',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'hr',
      department: 'Human Resources',
      position: 'HR Manager',
      dateOfJoining: new Date('2020-02-01'),
      phone: '+1-555-0002',
      isActive: true
    });

    // Create manager user
    const manager = await User.create({
      employeeId: 'MGR001',
      email: 'manager@company.com',
      password: 'manager123456',
      firstName: 'Michael',
      lastName: 'Chen',
      role: 'manager',
      department: 'Engineering',
      position: 'Engineering Manager',
      dateOfJoining: new Date('2019-03-15'),
      phone: '+1-555-0003',
      isActive: true
    });

    // Create sample employees
    const employees = await User.bulkCreate([
      {
        employeeId: 'EMP001',
        email: 'john@company.com',
        password: 'test@123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'employee',
        department: 'Engineering',
        position: 'Senior Software Developer',
        managerId: manager.id,
        dateOfJoining: new Date('2021-06-01'),
        phone: '+1-555-0101',
        isActive: true
      },
      {
        employeeId: 'EMP002',
        email: 'jane@company.com',
        password: 'test@123',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'employee',
        department: 'Engineering',
        position: 'Frontend Developer',
        managerId: manager.id,
        dateOfJoining: new Date('2021-08-15'),
        phone: '+1-555-0102',
        isActive: true
      },
      {
        employeeId: 'EMP003',
        email: 'bob@company.com',
        password: 'test@123',
        firstName: 'Bob',
        lastName: 'Wilson',
        role: 'employee',
        department: 'Engineering',
        position: 'Backend Developer',
        managerId: manager.id,
        dateOfJoining: new Date('2022-01-10'),
        phone: '+1-555-0103',
        isActive: true
      },
      {
        employeeId: 'EMP004',
        email: 'alice@company.com',
        password: 'test@123',
        firstName: 'Alice',
        lastName: 'Brown',
        role: 'employee',
        department: 'Design',
        position: 'UX Designer',
        dateOfJoining: new Date('2021-11-20'),
        phone: '+1-555-0104',
        isActive: true
      }
    ]);

    // Create sample goals
    const currentYear = new Date().getFullYear();
    const goals = await Goal.bulkCreate([
      {
        title: 'Complete React Advanced Training',
        description: 'Master advanced React concepts including hooks, context, and performance optimization',
        category: 'learning',
        priority: 'high',
        status: 'in_progress',
        progress: 85,
        estimated_hours: 40,
        logged_hours: 34,
        startDate: new Date(`${currentYear}-01-01`),
        dueDate: new Date(`${currentYear}-03-31`),
        employeeId: employees[0].id,
        assignedBy: manager.id,
        quarter: 'Q1',
        year: currentYear,
        weight: 3
      },
      {
        title: 'Improve Code Review Process',
        description: 'Implement better code review practices and reduce review time by 30%',
        category: 'performance',
        priority: 'medium',
        status: 'active',
        progress: 60,
        estimated_hours: 30,
        logged_hours: 18,
        startDate: new Date(`${currentYear}-01-01`),
        dueDate: new Date(`${currentYear}-06-30`),
        employeeId: employees[1].id,
        assignedBy: manager.id,
        quarter: 'Q2',
        year: currentYear,
        weight: 2
      },
      {
        title: 'Mentor Junior Developers',
        description: 'Provide guidance and mentorship to 2 junior developers',
        category: 'leadership',
        priority: 'medium',
        status: 'completed',
        progress: 100,
        estimated_hours: 20,
        logged_hours: 20,
        startDate: new Date(`${currentYear}-01-01`),
        dueDate: new Date(`${currentYear}-12-31`),
        completedDate: new Date(),
        employeeId: employees[0].id,
        assignedBy: manager.id,
        quarter: 'Q4',
        year: currentYear,
        weight: 2
      }
    ]);

    // Create sample time logs
    const timeLogs = await TimeLog.bulkCreate([
      {
        goal_id: goals[0].id,
        user_id: employees[0].id,
        date: '2024-01-15',
        hours_spent: 8,
        work_description: 'Completed React hooks tutorial and built practice components'
      },
      {
        goal_id: goals[0].id,
        user_id: employees[0].id,
        date: '2024-01-16',
        hours_spent: 6,
        work_description: 'Studied React Context API and state management patterns'
      },
      {
        goal_id: goals[0].id,
        user_id: employees[0].id,
        date: '2024-01-17',
        hours_spent: 8,
        work_description: 'Implemented useEffect patterns and custom hooks'
      },
      {
        goal_id: goals[0].id,
        user_id: employees[0].id,
        date: '2024-01-18',
        hours_spent: 6,
        work_description: 'Worked on performance optimization techniques'
      },
      {
        goal_id: goals[0].id,
        user_id: employees[0].id,
        date: '2024-01-19',
        hours_spent: 6,
        work_description: 'Built advanced React components with error boundaries'
      },
      {
        goal_id: goals[1].id,
        user_id: employees[1].id,
        date: '2024-01-20',
        hours_spent: 6,
        work_description: 'Reviewed existing code review process and documented issues'
      },
      {
        goal_id: goals[1].id,
        user_id: employees[1].id,
        date: '2024-01-22',
        hours_spent: 4,
        work_description: 'Researched industry best practices for code reviews'
      },
      {
        goal_id: goals[1].id,
        user_id: employees[1].id,
        date: '2024-01-25',
        hours_spent: 8,
        work_description: 'Created new review templates and guidelines'
      },
      {
        goal_id: goals[2].id,
        user_id: employees[0].id,
        date: '2024-01-10',
        hours_spent: 10,
        work_description: 'Conducted mentoring sessions and code reviews'
      },
      {
        goal_id: goals[2].id,
        user_id: employees[0].id,
        date: '2024-01-12',
        hours_spent: 10,
        work_description: 'Provided technical guidance and career development advice'
      }
    ]);

    // Create sample performance reviews
    const reviews = await PerformanceReview.bulkCreate([
      {
        employeeId: employees[0].id,
        reviewerId: manager.id,
        reviewType: 'manager',
        reviewPeriod: 'Q4-2023',
        overallRating: 4,
        technicalSkills: 4,
        communicationSkills: 5,
        teamwork: 4,
        leadership: 3,
        problemSolving: 5,
        initiative: 4,
        qualityOfWork: 4,
        timeManagement: 4,
        adaptability: 4,
        strengths: 'Excellent technical skills and problem-solving abilities. Great mentor to junior developers.',
        areasForImprovement: 'Could improve leadership skills and take more initiative in cross-team projects.',
        feedback: 'John has been performing exceptionally well this quarter. His technical contributions have been outstanding.',
        goals: 'Focus on developing leadership skills and taking ownership of larger projects.',
        status: 'approved',
        submittedAt: new Date(),
        reviewedAt: new Date()
      },
      {
        employeeId: employees[0].id,
        reviewerId: employees[1].id,
        reviewType: 'peer',
        reviewPeriod: 'Q4-2023',
        overallRating: 5,
        technicalSkills: 5,
        communicationSkills: 4,
        teamwork: 5,
        problemSolving: 5,
        initiative: 4,
        qualityOfWork: 5,
        timeManagement: 4,
        adaptability: 4,
        strengths: 'Always willing to help team members. Excellent code quality and technical knowledge.',
        areasForImprovement: 'Sometimes takes on too much work and could delegate more effectively.',
        feedback: 'John is an excellent team player and his technical expertise is invaluable to our team.',
        status: 'approved',
        submittedAt: new Date(),
        reviewedAt: new Date()
      }
    ]);

    // Create sample user skills
    const userSkills = await UserSkill.bulkCreate([
      {
        userId: employees[0].id,
        skillId: skills[0].id, // JavaScript
        proficiencyLevel: 'expert',
        rating: 5,
        assessedBy: manager.id,
        notes: 'Excellent JavaScript skills with deep understanding of ES6+ features'
      },
      {
        userId: employees[0].id,
        skillId: skills[1].id, // React
        proficiencyLevel: 'advanced',
        rating: 4,
        assessedBy: manager.id,
        notes: 'Strong React skills, currently learning advanced patterns'
      },
      {
        userId: employees[0].id,
        skillId: skills[4].id, // Communication
        proficiencyLevel: 'advanced',
        rating: 4,
        assessedBy: manager.id,
        notes: 'Good communication skills, effective in team meetings'
      },
      {
        userId: employees[1].id,
        skillId: skills[1].id, // React
        proficiencyLevel: 'expert',
        rating: 5,
        assessedBy: manager.id,
        notes: 'Outstanding React skills with excellent component design'
      },
      {
        userId: employees[1].id,
        skillId: skills[4].id, // Communication
        proficiencyLevel: 'advanced',
        rating: 4,
        assessedBy: manager.id,
        notes: 'Excellent presentation skills and clear documentation'
      }
    ]);

    console.log('✅ Database initialized successfully!');
    console.log('\n📋 Sample Login Credentials:');
    console.log('👤 Admin: admin@company.com / test@123');
    console.log('👤 HR: hr@company.com / hr123456');
    console.log('👤 Manager: manager@company.com / manager123456');
    console.log('👤 Employee: john@company.com / test@123');
    console.log('👤 Employee: jane@company.com / test@123');
    console.log('\n🎯 Sample Data Created:');
    console.log(`📊 Users: ${await User.count()}`);
    console.log(`🎯 Goals: ${await Goal.count()}`);
    console.log(`📝 Reviews: ${await PerformanceReview.count()}`);
    console.log(`🛠️ Skills: ${await Skill.count()}`);
    console.log(`📈 User Skills: ${await UserSkill.count()}`);
    console.log(`⏰ Time Logs: ${await TimeLog.count()}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Run initialization if this file is executed directly
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;