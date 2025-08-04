# HR Performance System - Prompt Library

This document contains all the prompts and requests used during the development of the HR Performance Management System.

## System Setup & Configuration

1. **Demo Credentials Update**
   - "Demo Credentials were not working update it with a working password"
   - "The user logins not working, please update it with proper working ones for all the users"

2. **Admin Password Management**
   - "Allow admin to update password for users"
   - "No need of separate Password Update button, update password along with the employee details update button"
   - "Unable to update password, its gets a validation error from backend"
   - "Pre-Populate the password field with the current password"

3. **Employee Management**
   - "Add Employee Popup missing the Password Field"
   - "Empty the old data in the Add Employee PopUp when we click the Button Add"
   - "Still the issue is there when i open a employee then click the button"
   - "Employee data is loading from a mock data, load it from the actual database"
   - "Employee CruD operation is not working properly. Also remove the separate web call for the password fetch and update user all as a single form submission"
   - "Add different color for different roles in the Employee Table"

## UI/UX Enhancements

4. **Dashboard Improvements**
   - "The dashboard data is not correct, replace the mock data with the actual data from the backend"

5. **Analytics & Charts**
   - "Add a chart in Employee Analytics for Employee Position"
   - "Show Some beautiful creative smile next to Score Preview based on the scores"

6. **Goals Management**
   - "Unable to get the Goals its http://localhost:5000/api/goals {"success":false,"message":"Invalid token."}"
   - "New error message for fetching the goals"
   - "Allow employee to update and edit the logs added in the goals"

## Performance Reviews System

7. **Review System Creation**
   - "The Review Section is redirecting to the dashboard, create a proper Performance Reviews section with the realatable. Please find the sample form below [Performance Review Form with detailed scoring criteria]"

8. **Review Form Configuration**
   - "Review Period is a dropdown with values of Q1(Apr-June), Q2(Jul-Sep),Q3(Oct-Dec),Q4(Jan-marc)"
   - "Performance Review Score Preview calculation is wrong.Fix this"

9. **Backend Integration**
   - "The reviews are not stored in backend. Store the submitted review in backend and load only employees for the reviews"
   - "Employee list is not loading in review Window"

## Error Fixes & Debugging

10. **Build Errors**
    - "Encountered a below issue. Fix this ERROR in ./src/pages/Reviews.js Module build failed"
    - "Encountered the below error. Fix this ERROR in ./src/pages/Reviews.js Module build failed"
    - "Fix all the build failed errors"

11. **Database & API Errors**
    - "Received the below error while submitting the review"
    - "Still facing errors while saving"
    - "The Performance Reviews table not showing the Score ratings and the date of review"
    - "Unable to save review, got the below error"
    - "Fix the issues"

12. **Authentication Issues**
    - "Unable to login"
    - "received 429 Too Many Request"

13. **Data Display Issues**
    - "Score ratings and Review dates are not populating properly"

## Project Management

14. **Version Control**
    - "Create a git ignore files for front end and backend folders"
    - "create a git ignore file for this project"

15. **Documentation**
    - "Create a prompt library file the list of prompts used till now"

## Technical Specifications Used

### Performance Review Scoring System
- **Effort Deviation (30%)**: Range-based scoring from <±5% (30 pts) to >±60% (5 pts)
- **STR 1st Pass Rate (20%)**: Percentage-based scoring from <50% (0 pts) to 100%+ (20 pts)
- **QA 1st Pass Rate (20%)**: Similar to STR with escape defect considerations
- **Customer Delight (10%)**: Recognition-based scoring from 0 to 10 points
- **AI Task Completion (10%)**: Assignment completion tracking
- **AI Assessment (10%)**: Pass/fail assessment scoring

### Final Rating Categories
- **Outstanding**: 90–100 points
- **Exceeds Expectations**: 75–89 points
- **Meets Expectations**: 60–74 points
- **Needs Improvement**: 40–59 points
- **Key Result Area Not Met**: <40 points

### Quarterly Periods
- **Q1**: Apr-Jun
- **Q2**: Jul-Sep
- **Q3**: Oct-Dec
- **Q4**: Jan-Mar

## Key Features Implemented

1. **Multi-role Authentication System** (Admin, HR, Manager, Employee)
2. **Employee Management** with CRUD operations
3. **Goal Tracking System** with time logging
4. **Performance Review System** with weighted scoring
5. **Dashboard Analytics** with real-time data
6. **Multi-theme Support** (Light, Dark, Corporate, Ocean)
7. **Role-based Access Control**
8. **Real-time Score Calculation** with emoji feedback
9. **Database Integration** with PostgreSQL
10. **Responsive Design** with Material-UI

## Technologies Used

### Backend
- Node.js with Express.js
- PostgreSQL with Sequelize ORM
- JWT Authentication
- bcrypt Password Hashing
- Rate Limiting & Security Headers

### Frontend
- React 18 with Hooks
- Material-UI (MUI) Components
- React Router for Navigation
- React Hook Form for Form Management
- Recharts for Data Visualization
- React Hot Toast for Notifications

This prompt library serves as a comprehensive record of the development process and can be used for future reference, debugging, or system enhancements.