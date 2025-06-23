# EduHub LMS - Complete MERN Stack Setup Guide

A full-stack Learning Management System built with React, Node.js, Express, and MongoDB.

## 🏗️ Project Structure

```
eduhub-lms/
├── frontend/                 # React application (current directory)
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── contexts/       # React contexts
│   │   └── ...
│   └── package.json
├── backend/                 # Node.js API server
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Main server file
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### 1. Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/eduhub
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start MongoDB**

   ```bash
   # For local MongoDB
   mongod

   # Or ensure your MongoDB Atlas cluster is running
   ```

6. **Start the backend server**

   ```bash
   npm run dev
   ```

   Backend will run on `http://localhost:5000`

### 2. Frontend Setup

1. **Navigate to frontend directory (main project)**

   ```bash
   cd ../  # or stay in main directory
   ```

2. **Install dependencies** (if not already done)

   ```bash
   npm install
   ```

3. **Create environment file for React**

   ```bash
   echo "VITE_API_URL=http://localhost:5000/api" > .env.local
   ```

4. **Start the frontend development server**

   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

## 🗄️ Database Setup

### Option 1: Local MongoDB

1. **Install MongoDB Community Edition**

   - [Download MongoDB](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB service**

   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community

   # Linux (systemd)
   sudo systemctl start mongod

   # Windows
   net start MongoDB
   ```

3. **Verify connection**
   ```bash
   mongosh mongodb://localhost:27017/eduhub
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas account**

   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free tier

2. **Create a cluster**

   - Choose free tier (M0)
   - Select region closest to you
   - Create cluster

3. **Get connection string**

   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

4. **Update backend .env**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eduhub?retryWrites=true&w=majority
   ```

## 🔐 Authentication Flow

The system uses JWT tokens for authentication:

1. **User registers/logs in** → Backend generates JWT token
2. **Token stored** in localStorage on frontend
3. **All API requests** include token in Authorization header
4. **Backend validates** token on protected routes

### Test Accounts

Once running, you can create test accounts:

**Student Account:**

- Email: `student@test.com`
- Password: `Password123`
- Type: Student

**Teacher Account:**

- Email: `teacher@test.com`
- Password: `Password123`
- Type: Teacher

**Admin Account:**

- Email: `admin@test.com`
- Password: `Password123`
- Type: Admin

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)

### Courses

- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (Teacher/Admin)
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Enrollments

- `POST /api/enrollments/enroll` - Enroll in course
- `GET /api/enrollments/my-courses` - Get student enrollments
- `POST /api/enrollments/:id/progress` - Update progress

### Certificates

- `POST /api/certificates/generate/:courseId` - Generate certificate
- `GET /api/certificates/:id/download` - Download certificate

## 🎯 Features Implemented

### ✅ Core Features

- **Role-based Authentication** (Student, Teacher, Admin)
- **Course Management** with sections and content
- **Enrollment System** with progress tracking
- **Certificate Generation** for completed courses
- **User Dashboard** for each role type
- **Responsive Design** for all screen sizes

### ✅ Security Features

- **JWT Authentication** with secure tokens
- **Password Hashing** using bcryptjs
- **Input Validation** and sanitization
- **Rate Limiting** to prevent abuse
- **CORS Protection** for cross-origin requests

### ✅ User Experience

- **Modern UI/UX** with TailwindCSS
- **Real-time Updates** with React state management
- **Error Handling** with user-friendly messages
- **Loading States** for better feedback
- **Mobile Responsive** design

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)

1. **Push backend to Git repository**
2. **Connect to Railway/Heroku**
3. **Set environment variables**
   ```env
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   FRONTEND_URL=https://your-frontend-domain.com
   ```

### Frontend Deployment (Vercel/Netlify)

1. **Build the frontend**

   ```bash
   npm run build
   ```

2. **Deploy to Vercel/Netlify**
3. **Set environment variables**
   ```env
   VITE_API_URL=https://your-backend-domain.com/api
   ```

## 🔧 Development Tips

### Backend Development

- Use `npm run dev` for auto-restart with nodemon
- Check MongoDB connection in server logs
- Use MongoDB Compass for database visualization
- Test API endpoints with Postman or Thunder Client

### Frontend Development

- Use React DevTools for component debugging
- Check browser Network tab for API requests
- Use localStorage inspector to view stored tokens
- Test responsive design with browser dev tools

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**

- Check MongoDB is running
- Verify environment variables in `.env`
- Check for port conflicts (default: 5000)

**Frontend can't connect to backend:**

- Verify `VITE_API_URL` in `.env.local`
- Check CORS settings in backend
- Ensure backend is running on correct port

**Authentication not working:**

- Check JWT secret is set
- Verify token is being sent in requests
- Check token expiration settings

**Database connection failed:**

- Verify MongoDB URI format
- Check network connectivity
- Ensure database user has proper permissions

## 📚 Next Steps

### Potential Enhancements

1. **File Upload** for course materials and user avatars
2. **Payment Integration** for paid courses (Stripe)
3. **Video Streaming** for course content
4. **Real-time Messaging** between teachers and students
5. **Advanced Analytics** and reporting
6. **Email Notifications** for important events
7. **Mobile App** using React Native

### Testing

- Add unit tests with Jest and React Testing Library
- Integration tests for API endpoints
- End-to-end tests with Cypress or Playwright

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

If you encounter any issues:

1. Check this setup guide
2. Review the troubleshooting section
3. Check existing GitHub issues
4. Create a new issue with detailed information

---

**Happy coding! 🚀**
