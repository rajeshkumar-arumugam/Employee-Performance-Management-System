# Developer Guide - HR Performance Management System

This guide provides detailed instructions for developers to set up, develop, and deploy the HR Performance Management System.

## 📋 Table of Contents

1. [Development Environment Setup](#development-environment-setup)
2. [Local Development](#local-development)
3. [Database Management](#database-management)
4. [API Development](#api-development)
5. [Frontend Development](#frontend-development)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

## 🛠️ Development Environment Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher (comes with Node.js)
- **PostgreSQL**: v12.0 or higher
- **Git**: Latest version
- **Code Editor**: VS Code recommended

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "ms-vscode.vscode-json",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-eslint"
  ]
}
```

### Environment Variables

Create `.env` files in both backend and frontend directories:

#### Backend `.env`
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hr_performance_db
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_complex
JWT_EXPIRES_IN=7d

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend `.env` (optional)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## 🚀 Local Development

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd hr-performance-system

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb hr_performance_db

# Or using psql
psql -U postgres
CREATE DATABASE hr_performance_db;
\q

# Initialize database with sample data
cd backend
npm run init-db
```

### 3. Start Development Servers

```bash
# Terminal 1: Start backend server
cd backend
npm run dev

# Terminal 2: Start frontend server
cd frontend
npm start
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## 🗄️ Database Management

### Database Schema

The system uses the following main tables:

- `users` - Employee and admin information
- `goals` - Employee goals and objectives
- `performance_reviews` - 360-degree feedback data
- `skills` - Master skill list
- `user_skills` - Employee skill assessments
- `skill_assessments` - Skill development tracking

### Database Commands

```bash
# Reset database (WARNING: This will delete all data)
npm run init-db

# Run migrations (if using migrations)
npm run migrate

# Seed database with sample data
npm run seed

# Backup database
pg_dump hr_performance_db > backup.sql

# Restore database
psql hr_performance_db < backup.sql
```

### Adding New Models

1. Create model file in `backend/models/`
2. Define associations in `backend/models/index.js`
3. Update database initialization script
4. Create corresponding API endpoints

Example model structure:
```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const NewModel = sequelize.define('NewModel', {
  // Define fields here
}, {
  tableName: 'new_models',
  // Additional options
});

module.exports = NewModel;
```

## 🔌 API Development

### Adding New Endpoints

1. **Create Controller**
   ```javascript
   // backend/controllers/newController.js
   const { NewModel } = require('../models');

   const getAll = async (req, res) => {
     try {
       const items = await NewModel.findAll();
       res.json({ success: true, data: items });
     } catch (error) {
       res.status(500).json({ success: false, message: error.message });
     }
   };

   module.exports = { getAll };
   ```

2. **Create Routes**
   ```javascript
   // backend/routes/newRoutes.js
   const express = require('express');
   const { getAll } = require('../controllers/newController');
   const { authenticate, authorize } = require('../middleware/auth');

   const router = express.Router();

   router.get('/', authenticate, authorize('admin', 'hr'), getAll);

   module.exports = router;
   ```

3. **Register Routes**
   ```javascript
   // backend/server.js
   const newRoutes = require('./routes/newRoutes');
   app.use('/api/new-endpoint', newRoutes);
   ```

### API Response Format

Maintain consistent response format:

```javascript
// Success Response
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}

// Error Response
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (development only)"
}

// Paginated Response
{
  "success": true,
  "data": {
    "items": [/* array of items */],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## ⚛️ Frontend Development

### Component Structure

Follow this structure for new components:

```javascript
import React, { useState, useEffect } from 'react';
import { 
  // MUI imports
} from '@mui/material';
import { 
  // Icon imports
} from '@mui/icons-material';

const ComponentName = ({ prop1, prop2 }) => {
  // State management
  const [state, setState] = useState(initialValue);

  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // Event handlers
  const handleEvent = () => {
    // Handle event
  };

  // Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.js`
3. Update navigation in `src/components/Layout/Navbar.js`

### State Management

Use React Context for global state:

```javascript
// Create context
const NewContext = createContext();

// Provider component
const NewProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  
  const contextValue = {
    state,
    setState,
    // Methods
  };

  return (
    <NewContext.Provider value={contextValue}>
      {children}
    </NewContext.Provider>
  );
};

// Custom hook
export const useNew = () => {
  const context = useContext(NewContext);
  if (!context) {
    throw new Error('useNew must be used within NewProvider');
  }
  return context;
};
```

### Styling Guidelines

- Use Material-UI's `sx` prop for styling
- Follow the theme structure for consistency
- Use responsive breakpoints: `xs`, `sm`, `md`, `lg`, `xl`

```javascript
<Box
  sx={{
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: 2,
    p: 3,
    bgcolor: 'background.paper',
    borderRadius: 2,
  }}
>
  {/* Content */}
</Box>
```

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Frontend Testing

```bash
cd frontend

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Writing Tests

#### Backend Test Example
```javascript
const request = require('supertest');
const app = require('../server');

describe('Auth Endpoints', () => {
  test('POST /api/auth/login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

#### Frontend Test Example
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../components/Auth/Login';

test('renders login form', () => {
  render(<Login />);
  
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
});
```

## 🚀 Deployment

### Production Environment Setup

1. **Server Requirements**
   - Node.js v16+
   - PostgreSQL v12+
   - Nginx (recommended)
   - SSL certificate
   - Domain name

2. **Environment Variables**
   ```env
   NODE_ENV=production
   DB_HOST=your-production-db-host
   JWT_SECRET=your-super-secure-production-secret
   # ... other production values
   ```

### Deployment Steps

#### 1. Build Applications

```bash
# Build frontend
cd frontend
npm run build

# The build folder contains the production build
```

#### 2. Server Deployment

```bash
# On your server
git clone <repository-url>
cd hr-performance-system

# Install dependencies
cd backend
npm ci --only=production

# Set up environment variables
cp .env.example .env
# Edit .env with production values

# Start with PM2 (recommended)
npm install -g pm2
pm2 start server.js --name "hr-backend"
pm2 startup
pm2 save
```

#### 3. Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/frontend/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 4. SSL Setup with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Docker Deployment (Alternative)

```dockerfile
# Dockerfile.backend
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

```dockerfile
# Dockerfile.frontend
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  database:
    image: postgres:13
    environment:
      POSTGRES_DB: hr_performance_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
      - DB_HOST=database
    depends_on:
      - database

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check if database exists
psql -U postgres -l

# Test connection
psql -U postgres -d hr_performance_db -c "SELECT 1;"
```

#### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

#### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Debug Mode

Enable debug logging:

```bash
# Backend
DEBUG=* npm run dev

# Frontend
REACT_APP_DEBUG=true npm start
```

### Performance Monitoring

```bash
# Install monitoring tools
npm install -g clinic

# Profile your app
clinic doctor -- node server.js
clinic flame -- node server.js
```

## 📚 Additional Resources

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Best Practices](https://reactjs.org/docs/thinking-in-react.html)
- [Material-UI Documentation](https://mui.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

## 🤝 Contributing Guidelines

1. Follow the existing code style
2. Write tests for new features
3. Update documentation
4. Use meaningful commit messages
5. Create pull requests for review

## 📞 Support

For development support:
- Check existing issues in the repository
- Create detailed bug reports
- Include environment information
- Provide steps to reproduce issues