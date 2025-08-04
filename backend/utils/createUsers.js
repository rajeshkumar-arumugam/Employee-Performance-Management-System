const { User } = require('../models');
const { sequelize } = require('../config/database');

const createUsers = async () => {
  try {
    await sequelize.authenticate();
    
    // Admin user
    await User.create({
      employeeId: 'ADMIN001',
      email: 'admin@company.com',
      password: 'admin123456',
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin',
      department: 'IT',
      position: 'System Administrator',
      isActive: true
    });

    // HR user
    await User.create({
      employeeId: 'HR001',
      email: 'hr@company.com',
      password: 'hr123456',
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'hr',
      department: 'Human Resources',
      position: 'HR Manager',
      isActive: true
    });

    // Manager user
    await User.create({
      employeeId: 'MGR001',
      email: 'manager@company.com',
      password: 'manager123456',
      firstName: 'Michael',
      lastName: 'Chen',
      role: 'manager',
      department: 'Engineering',
      position: 'Engineering Manager',
      isActive: true
    });

    // Employee user
    await User.create({
      employeeId: 'EMP001',
      email: 'john@company.com',
      password: 'employee123456',
      firstName: 'John',
      lastName: 'Doe',
      role: 'employee',
      department: 'Engineering',
      position: 'Senior Software Developer',
      isActive: true
    });

    console.log('✅ Users created successfully!');
    console.log('Admin: admin@company.com / admin123456');
    console.log('HR: hr@company.com / hr123456');
    console.log('Manager: manager@company.com / manager123456');
    console.log('Employee: john@company.com / employee123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating users:', error.message);
    process.exit(1);
  }
};

createUsers();