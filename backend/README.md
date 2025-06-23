# EduHub Backend API

A comprehensive Learning Management System (LMS) backend built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Role-based Authentication** (Student, Teacher, Admin)
- **Course Management** with sections, reviews, and ratings
- **Enrollment System** with progress tracking
- **Certificate Generation** for completed courses
- **User Management** with admin controls
- **RESTful API** with comprehensive validation
- **Security** with JWT, rate limiting, and data validation

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs

## 📁 Project Structure

```
backend/
├── models/
│   ├── User.js           # User schema and methods
│   ├── Course.js         # Course schema with sections
│   └── Enrollment.js     # Enrollment and progress tracking
├── routes/
│   ├── auth.js           # Authentication endpoints
│   ├── users.js          # User management
│   ├── courses.js        # Course CRUD operations
│   ├── enrollments.js    # Enrollment management
│   └── certificates.js   # Certificate generation
├── middleware/
│   ├── auth.js           # JWT authentication
│   └── validation.js     # Input validation rules
├── server.js             # Main application entry point
├── package.json          # Dependencies and scripts
└── .env.example          # Environment variables template
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone and navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/eduhub
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=30d
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**

   ```bash
   # If using local MongoDB
   mongod

   # Or make sure your MongoDB Atlas cluster is running
   ```

5. **Start the server**

   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint             | Description       | Access  |
| ------ | -------------------- | ----------------- | ------- |
| POST   | `/api/auth/register` | Register new user | Public  |
| POST   | `/api/auth/login`    | User login        | Public  |
| GET    | `/api/auth/me`       | Get current user  | Private |
| POST   | `/api/auth/logout`   | User logout       | Private |

### User Management

| Method | Endpoint                       | Description                  | Access  |
| ------ | ------------------------------ | ---------------------------- | ------- |
| GET    | `/api/users`                   | Get all users (with filters) | Admin   |
| GET    | `/api/users/:id`               | Get single user              | Private |
| PUT    | `/api/users/:id`               | Update user profile          | Private |
| DELETE | `/api/users/:id`               | Delete user                  | Admin   |
| PATCH  | `/api/users/:id/toggle-status` | Toggle user active status    | Admin   |

### Course Management

| Method | Endpoint                          | Description               | Access        |
| ------ | --------------------------------- | ------------------------- | ------------- |
| GET    | `/api/courses`                    | Get all published courses | Public        |
| GET    | `/api/courses/:id`                | Get single course         | Public        |
| POST   | `/api/courses`                    | Create new course         | Teacher/Admin |
| PUT    | `/api/courses/:id`                | Update course             | Teacher/Admin |
| DELETE | `/api/courses/:id`                | Delete course             | Teacher/Admin |
| GET    | `/api/courses/teacher/my-courses` | Get teacher's courses     | Teacher       |
| PATCH  | `/api/courses/:id/toggle-publish` | Publish/unpublish course  | Teacher/Admin |
| POST   | `/api/courses/:id/reviews`        | Add course review         | Student       |

### Enrollment Management

| Method | Endpoint                        | Description            | Access  |
| ------ | ------------------------------- | ---------------------- | ------- |
| POST   | `/api/enrollments/enroll`       | Enroll in course       | Student |
| GET    | `/api/enrollments/my-courses`   | Get user enrollments   | Student |
| GET    | `/api/enrollments/:id`          | Get enrollment details | Private |
| POST   | `/api/enrollments/:id/progress` | Update course progress | Student |
| GET    | `/api/enrollments`              | Get all enrollments    | Admin   |
| DELETE | `/api/enrollments/:id`          | Remove enrollment      | Private |

### Certificate System

| Method | Endpoint                                    | Description             | Access  |
| ------ | ------------------------------------------- | ----------------------- | ------- |
| POST   | `/api/certificates/generate/:courseId`      | Generate certificate    | Student |
| GET    | `/api/certificates/:certificateId`          | Get certificate details | Public  |
| GET    | `/api/certificates/:certificateId/download` | Download certificate    | Private |
| GET    | `/api/certificates/user/my-certificates`    | Get user certificates   | Student |
| GET    | `/api/certificates/verify/:certificateId`   | Verify certificate      | Public  |

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **Student**: Can enroll in courses, track progress, get certificates
- **Teacher**: Can create and manage courses, view student progress
- **Admin**: Full access to all users, courses, and system management

## 📝 Request/Response Examples

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "type": "student"
}
```

### Create Course

```bash
POST /api/courses
Authorization: Bearer <teacher-token>
Content-Type: application/json

{
  "title": "JavaScript Fundamentals",
  "description": "Learn the basics of JavaScript programming",
  "category": "Technology",
  "level": "Beginner",
  "price": 99.99,
  "sections": [
    {
      "title": "Introduction to JavaScript",
      "content": "Overview of JavaScript and its uses",
      "duration": 30,
      "order": 1
    }
  ]
}
```

### Enroll in Course

```bash
POST /api/enrollments/enroll
Authorization: Bearer <student-token>
Content-Type: application/json

{
  "courseId": "course-id-here"
}
```

## 🔧 Environment Variables

| Variable       | Description               | Default                          |
| -------------- | ------------------------- | -------------------------------- |
| `NODE_ENV`     | Environment mode          | development                      |
| `PORT`         | Server port               | 5000                             |
| `MONGODB_URI`  | MongoDB connection string | mongodb://localhost:27017/eduhub |
| `JWT_SECRET`   | JWT signing secret        | -                                |
| `JWT_EXPIRE`   | JWT expiration time       | 30d                              |
| `FRONTEND_URL` | Frontend URL for CORS     | http://localhost:3000            |

## 🛡️ Security Features

- **JWT Authentication** with secure token generation
- **Password Hashing** using bcryptjs
- **Rate Limiting** to prevent abuse
- **Input Validation** using express-validator
- **CORS Protection** for cross-origin requests
- **Helmet** for security headers
- **MongoDB Injection Protection**

## 📊 Database Schema

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  type: String (student|teacher|admin),
  avatar: String,
  bio: String,
  enrolledCourses: [ObjectId],
  createdCourses: [ObjectId],
  certificates: [{courseId, issuedDate, certificateId}],
  isActive: Boolean,
  lastLogin: Date
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
  level: String,
  price: Number,
  thumbnail: String,
  sections: [{title, content, videoUrl, duration, order}],
  enrolled: [{student, enrolledAt, progress, completedSections}],
  rating: {average, count},
  reviews: [{student, rating, comment, createdAt}],
  isPublished: Boolean,
  requirements: [String],
  objectives: [String],
  tags: [String]
}
```

### Enrollment Model

```javascript
{
  student: ObjectId,
  course: ObjectId,
  enrolledAt: Date,
  progress: Number,
  completedSections: [{sectionId, completedAt}],
  lastAccessedAt: Date,
  completedAt: Date,
  certificateIssued: Boolean,
  certificateId: String,
  paymentStatus: String,
  paymentAmount: Number
}
```

## 🚀 Deployment

### Production Setup

1. **Set environment to production**

   ```env
   NODE_ENV=production
   ```

2. **Use a secure JWT secret**

   ```env
   JWT_SECRET=your-very-secure-random-string-here
   ```

3. **Use MongoDB Atlas or secure MongoDB instance**

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eduhub
   ```

4. **Set production frontend URL**
   ```env
   FRONTEND_URL=https://your-frontend-domain.com
   ```

### Deployment Platforms

- **Heroku**: Create `Procfile` with `web: node server.js`
- **Railway**: Auto-deploys from Git repository
- **DigitalOcean**: Use App Platform or Droplets
- **AWS**: Use Elastic Beanstalk or EC2
- **Vercel**: For serverless deployment

## 🧪 Testing

```bash
# Install development dependencies
npm install --dev

# Run tests (when test files are created)
npm test

# Run with test coverage
npm run test:coverage
```

## 📈 Performance

- **Database Indexing** on frequently queried fields
- **Pagination** for large data sets
- **Aggregation Pipelines** for complex queries
- **Rate Limiting** to prevent abuse
- **Compression** for API responses

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
