# LearnHub - MERN Stack Learning Management System

A full-stack Learning Management System built with the MERN stack (MongoDB, Express.js, React, Node.js) with TypeScript.

## Project Structure

```
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/         # Shadcn/ui components
│   │   │   ├── Header.tsx  # Navigation header
│   │   │   ├── PaymentModal.tsx # Payment processing
│   │   │   └── CertificateGenerator.tsx # PDF certificates
│   │   ├── pages/          # Page components
│   │   │   ├── Index.tsx          # Landing page
│   │   │   ├── Login.tsx          # Authentication
│   │   │   ├── Register.tsx       # User registration
│   │   │   ├── Courses.tsx        # Course catalog
│   │   │   ├── CourseDetails.tsx  # Course information
│   │   │   ├── CourseLearning.tsx # Course player
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── StudentCertificates.tsx
│   │   │   ├── TeacherDashboard.tsx
│   │   │   ├── TeacherCreateCourse.tsx
│   │   │   ├── TeacherEditCourse.tsx
│   │   │   ├── TeacherMyCourses.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── DiscussionForums.tsx
│   │   │   └── LiveWebinars.tsx
│   │   ├── contexts/       # React contexts
│   │   │   └── AuthContext.tsx # Authentication state
│   │   ├── services/       # API services
│   │   │   └── api.ts      # Axios HTTP client
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/           # Utility functions
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── backend/               # Node.js backend
│   ├── models/           # MongoDB schemas
│   │   ├── User.js       # User model
│   │   ├── Course.js     # Course model
│   │   └── Enrollment.js # Enrollment model
│   ├── routes/           # Express API routes
│   │   ├── auth.js       # Authentication routes
│   │   ├── courses.js    # Course management
│   │   ├── enrollments.js # Student enrollments
│   │   ├── users.js      # User management
│   │   └── certificates.js # Certificate generation
│   ├── middleware/       # Express middleware
│   │   ├── auth.js       # JWT authentication
│   │   ├── errorHandler.js # Error handling
│   │   └── validation.js # Request validation
│   └── scripts/          # Database utilities
│       └── seed.js       # Sample data seeding
├── package.json          # Backend dependencies
├── server.js            # Express server entry point
└── README.md           # This file
```

## Features

### 🎓 For Students

- **Course Browsing**: Search and filter courses by category, level, price
- **Enrollment System**: Enroll in free courses or purchase paid courses
- **Learning Progress**: Track completion progress through course sections
- **Certificates**: Download PDF certificates upon course completion
- **Payment Integration**: Secure payment processing for paid courses
- **Discussion Forums**: Engage with community and instructors
- **Live Webinars**: Join live sessions and access recordings

### 👨‍🏫 For Teachers

- **Course Creation**: Create comprehensive courses with multiple sections
- **Content Management**: Add videos, text content, quizzes, and resources
- **Student Analytics**: View enrollment statistics and student progress
- **Course Publishing**: Control course visibility and publication status
- **Revenue Tracking**: Monitor earnings from course sales
- **Student Management**: View and interact with enrolled students

### 👨‍💼 For Administrators

- **User Management**: Manage students, teachers, and admin accounts
- **Course Moderation**: Approve, reject, or modify courses
- **Analytics Dashboard**: Platform-wide statistics and insights
- **System Configuration**: Manage platform settings and policies
- **Content Moderation**: Review and manage user-generated content

## Technology Stack

### Frontend

- **React 18** with TypeScript - Modern UI development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible component library
- **React Router DOM** - Client-side routing
- **React Query** - Server state management
- **Axios** - HTTP client for API calls
- **React Hook Form** - Form handling and validation
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icon library

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **Socket.io** - Real-time communication
- **Multer** - File upload handling
- **Validator** - Input validation
- **Helmet** - Security middleware

### Additional Tools

- **jsPDF & html2canvas** - PDF certificate generation
- **React QR Code** - QR code generation for payments
- **Date-fns** - Date manipulation utilities

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository:**

```bash
git clone <your-repo-url>
cd learnhub-lms
```

2. **Install backend dependencies:**

```bash
npm install
```

3. **Install frontend dependencies:**

```bash
cd frontend
npm install
cd ..
```

4. **Set up environment variables:**

**Backend (.env):**

```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learnhub
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-key-minimum-32-characters
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
CORS_ORIGIN=http://localhost:5173
BCRYPT_SALT_ROUNDS=12
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PAYMENT_GATEWAY_KEY=your-payment-key
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Frontend (.env.local):**

```bash
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

5. **Start the development servers:**

**Backend:**

```bash
npm run dev
```

**Frontend (in a new terminal):**

```bash
cd frontend
npm run dev
```

6. **Access the application:**

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Demo Accounts

For testing purposes, you can use these demo accounts:

**Student Account:**

- Email: `student@demo.com`
- Password: `password123`

**Teacher Account:**

- Email: `teacher@demo.com`
- Password: `password123`

**Admin Account:**

- Email: `admin@demo.com`
- Password: `password123`

## API Documentation

### Authentication Endpoints

```
POST /api/auth/register     # User registration
POST /api/auth/login        # User login
GET  /api/auth/me          # Get current user profile
POST /api/auth/logout      # User logout
POST /api/auth/refresh     # Refresh JWT token
```

### Course Management

```
GET    /api/courses                    # Get all courses (with filters)
POST   /api/courses                    # Create new course (teacher only)
GET    /api/courses/:id                # Get course details
PUT    /api/courses/:id                # Update course (teacher only)
DELETE /api/courses/:id                # Delete course (teacher only)
PATCH  /api/courses/:id/toggle-publish # Toggle course publication
POST   /api/courses/:id/reviews        # Add course review
```

### Enrollment System

```
POST /api/enrollments/enroll           # Enroll in a course
GET  /api/enrollments/my-courses       # Get user's enrollments
POST /api/enrollments/:id/progress     # Update learning progress
GET  /api/enrollments                  # Get all enrollments (admin)
```

### User Management

```
GET    /api/users              # Get all users (admin only)
GET    /api/users/:id          # Get user details
PUT    /api/users/:id          # Update user profile
DELETE /api/users/:id          # Delete user (admin only)
PATCH  /api/users/:id/status   # Toggle user status
```

### Certificate System

```
POST /api/certificates/generate/:courseId    # Generate certificate
GET  /api/certificates/:id                   # Get certificate
GET  /api/certificates/user/my-certificates  # Get user certificates
GET  /api/certificates/verify/:id            # Verify certificate
```

## Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  type: ['student', 'teacher', 'admin'],
  avatar: String,
  bio: String,
  enrolledCourses: [ObjectId],
  createdCourses: [ObjectId],
  isActive: Boolean,
  loginAttempts: Number,
  lockUntil: Date,
  preferences: Object,
  socialLinks: Object,
  education: [Object],
  experience: [Object]
}
```

### Course Model

```javascript
{
  title: String,
  description: String,
  instructor: ObjectId,
  instructorName: String,
  category: String,
  level: ['Beginner', 'Intermediate', 'Advanced'],
  price: Number,
  thumbnail: String,
  sections: [SectionSchema],
  enrolled: [EnrolledStudentSchema],
  rating: { average: Number, count: Number },
  reviews: [ReviewSchema],
  isPublished: Boolean,
  totalDuration: Number,
  requirements: [String],
  objectives: [String],
  tags: [String],
  language: String,
  difficulty: Number,
  certificateTemplate: String
}
```

## Deployment

### Backend Deployment (Railway/Render/Heroku)

1. **Prepare for production:**

```bash
npm run build
```

2. **Set environment variables on your hosting platform**

3. **Deploy using Git or Docker**

### Frontend Deployment (Netlify/Vercel)

1. **Build the frontend:**

```bash
cd frontend
npm run build
```

2. **Deploy the `dist` folder to your hosting service**

3. **Set up environment variables on your hosting platform**

## Course Creation Workflow

1. **Teacher Registration**: Teachers register and get approved by admin
2. **Course Creation**: Teachers create courses with title, description, sections
3. **Content Upload**: Add videos, text, quizzes, and resources to sections
4. **Course Review**: Optional admin review before publication
5. **Publication**: Course becomes available to students
6. **Enrollment**: Students can browse and enroll in courses
7. **Learning**: Students progress through sections and track completion
8. **Certification**: Automatic certificate generation upon completion

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Testing

### Run Backend Tests

```bash
npm test
```

### Run Frontend Tests

```bash
cd frontend
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Support

For support, email support@learnhub.com or join our Discord community.

## Acknowledgments

- React and Node.js communities
- MongoDB team for excellent documentation
- Tailwind CSS for the design system
- All contributors who helped build this project

---

**Built with ❤️ for education and learning**
