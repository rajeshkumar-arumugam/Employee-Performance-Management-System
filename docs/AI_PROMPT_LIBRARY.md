# AI Prompt Library

## Database Design Prompts

### Prompt 1: User Model with Role-based Authentication
**Prompt**: "Create a User model for HR system with roles (admin, hr, manager, employee) using Sequelize ORM with PostgreSQL. Include authentication fields and proper validations."
**Context**: HR Performance Management System requiring multi-role access
**Output Quality**: 9/10
**Iterations**: 1 refinement for enum constraints
**Final Result**: Complete User model with bcrypt password hashing and role-based access

### Prompt 2: Performance Review Schema
**Prompt**: "Design a PerformanceReview model with weighted scoring system for 6 metrics: Effort Deviation (30%), STR Pass Rate (20%), QA Pass Rate (20%), Customer Delight (10%), AI Task Completion (10%), AI Assessment (10%)"
**Context**: Complex performance evaluation system with specific business requirements
**Output Quality**: 8/10
**Iterations**: 2 refinements for totalScore and finalRating fields
**Final Result**: Comprehensive review model with enum constraints and scoring logic

## Code Generation Prompts

### Prompt 3: Employee CRUD Operations
**Prompt**: "Create complete employee management system with CRUD operations, role-based colors (Admin-red, HR-orange, Manager-blue, Employee-green), and password handling using Material-UI DataGrid"
**Context**: Employee management page with visual role indicators
**Output Quality**: 9/10
**Modifications**: Minor styling adjustments for role chips
**Final Result**: Full employee management with create, edit, delete, and role-based styling

### Prompt 4: Authentication System
**Prompt**: "Implement JWT-based authentication with login, registration, and role-based access control. Include middleware for token verification and user context management."
**Context**: Secure multi-role authentication system
**Output Quality**: 10/10
**Modifications**: None required
**Final Result**: Complete auth system with JWT tokens, protected routes, and user context

## Problem-Solving Prompts

### Prompt 5: Performance Review Scoring Logic
**Prompt**: "Create weighted scoring calculation for performance reviews with 6 metrics, each having different point scales and final rating categories (Outstanding 90-100, Exceeds Expectations 75-89, etc.)"
**Context**: Complex business logic for employee performance evaluation
**Effectiveness**: High - automated complex calculations with visual feedback
**Final Result**: Complete scoring system with emoji indicators and real-time preview

### Prompt 6: Role-based Data Filtering
**Prompt**: "Modify reviews API to show all reviews for admin/hr/manager roles, but only employee's own reviews for employee role"
**Context**: Data security and role-based access control
**Output Quality**: 10/10
**Iterations**: 1 implementation
**Final Result**: Dynamic filtering based on user role with proper security

## Frontend Component Prompts

### Prompt 7: Dashboard with Real Data Integration
**Prompt**: "Replace mock data in dashboard with real API calls, add employee analytics charts using Recharts, and implement role-based statistics"
**Context**: Converting prototype to production-ready dashboard
**Output Quality**: 8/10
**Modifications**: Chart styling and responsive design adjustments
**Final Result**: Dynamic dashboard with real-time data and analytics

### Prompt 8: Multi-theme Support
**Prompt**: "Implement theme switching with Light, Dark, Corporate, and Ocean themes using Material-UI ThemeProvider"
**Context**: User experience enhancement with multiple theme options
**Output Quality**: 9/10
**Iterations**: 1 refinement for theme persistence
**Final Result**: Complete theme system with localStorage persistence

## API Development Prompts

### Prompt 9: Goals Management System
**Prompt**: "Create goals CRUD API with progress tracking, priority levels, and manager assignment. Include time logging functionality for employees."
**Context**: Goal setting and tracking system for performance management
**Output Quality**: 9/10
**Modifications**: Added estimated_hours field for better tracking
**Final Result**: Complete goals management with progress tracking

### Prompt 10: Security Middleware Implementation
**Prompt**: "Add security middleware including Helmet, rate limiting (1000 requests per 15 minutes), CORS configuration, and input validation"
**Context**: Production-ready security for HR system
**Output Quality**: 10/10
**Iterations**: None required
**Final Result**: Comprehensive security layer with proper error handling