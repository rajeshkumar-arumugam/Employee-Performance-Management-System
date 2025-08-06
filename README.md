# HR Performance Management System

A comprehensive Employee Performance Management System built for HR departments to streamline performance reviews, goal tracking, and employee development.

## 🚀 Features

### Core Functionality
- **Employee Profiles**: Complete personal information, role details, and reporting structure
- **Goal Setting & Tracking**: Quarterly/annual goals with progress monitoring
- **360-Degree Performance Reviews**: Multi-source feedback and evaluation forms
- **Skill Assessment**: Competency tracking and development planning
- **Reports & Analytics**: Performance trends, goal achievement rates, and downloadable reports

### User Roles
- **Admin**: Full system access, user management, organization-wide reports
- **HR**: Employee management, performance oversight, analytics
- **Manager**: Team member reviews, goal assignment, subordinate tracking
- **Employee**: Personal goals, self-reviews, skill development

### Technical Features
- **Multi-Theme Support**: Light, Dark, Corporate, and Ocean themes
- **Responsive Design**: Mobile-first approach with Material-UI
- **Real-time Updates**: Live notifications and progress tracking
- **Export Capabilities**: PDF and Excel report generation
- **Secure Authentication**: JWT-based auth with role-based permissions

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js framework
- **PostgreSQL** database with Sequelize ORM
- **JWT** authentication with bcrypt password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **Rate Limiting** for API protection

### Frontend
- **React 18** with functional components and hooks
- **Material-UI (MUI)** for component library
- **React Router** for navigation
- **React Query** for data fetching and caching
- **Recharts** for data visualization
- **React Hook Form** for form management
- **React Hot Toast** for notifications

## 📁 Project Structure

```
hr-performance-system/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Goal.js
│   │   ├── PerformanceReview.js
│   │   ├── Skill.js
│   │   └── index.js
│   ├── routes/
│   │   └── auth.js
│   ├── services/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Layout/
│   │   │   └── common/
│   │   ├── contexts/
│   │   │   ├── AuthContext.js
│   │   │   └── ThemeContext.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Profile.js
│   │   │   └── Settings.js
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── docs/
│   ├── DEVELOPER_GUIDE.md
│   └── API_DOCUMENTATION.md
└── README.md
```

## 🚦 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hr-performance-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Database Setup**
   - Create a PostgreSQL database named `hr_performance_db`
   - Update the `.env` file with your database credentials
   ```bash
   cp .env.example .env
   # Edit .env with your database settings
   ```

4. **Initialize Database**
   ```bash
   npm run init-db
   ```

5. **Start Backend Server**
   ```bash
   npm run dev
   ```

6. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Default Login Credentials
- **Admin**: admin@company.com / test@123
- **HR**: hr@company.com / hr123456
- **Manager**: manager@company.com / manager123456
- **Employee**: john@company.com / test@123

## 📊 Key Features Walkthrough

### Dashboard
- Role-based statistics and metrics
- Recent goals and progress tracking
- Performance review summaries
- Real-time notifications

### Goal Management
- Create quarterly/annual goals
- Track progress with visual indicators
- Set priorities and deadlines
- Manager assignment and approval

### Performance Reviews
- 360-degree feedback system
- Multiple review types (self, peer, manager)
- Skill-based evaluations
- Historical review tracking

### Reporting & Analytics
- Performance trend analysis
- Goal achievement rates
- Department-wise statistics
- Exportable reports (PDF/Excel)

## 🎨 Theme Customization

The application supports multiple themes:
- **Light Theme**: Clean, professional appearance
- **Dark Theme**: Reduced eye strain for extended use
- **Corporate Theme**: Business-focused color scheme
- **Ocean Theme**: Calming blue-based palette

Users can switch themes from the navigation bar, and preferences are saved locally.

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection
- Security headers with Helmet

## 📈 Performance Optimization

- React Query for efficient data caching
- Lazy loading of components
- Optimized database queries
- Connection pooling
- Compressed API responses

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

See [DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) for detailed deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in the `docs/` folder

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Core functionality implementation
- Multi-theme support
- Role-based access control
- Basic reporting features

## 🎯 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Integration with external HR systems
- [ ] Advanced reporting with custom filters
- [ ] Automated performance insights
- [ ] Multi-language support