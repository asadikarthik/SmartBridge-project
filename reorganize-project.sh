#!/bin/bash

# Create frontend and backend directories
mkdir -p frontend
mkdir -p frontend/public
mkdir -p frontend/src

echo "Creating MERN Stack LMS Project Structure..."

# Move all source files to frontend
echo "Moving frontend files..."
cp -r src/* frontend/src/ 2>/dev/null || true
cp -r public/* frontend/public/ 2>/dev/null || true

# Copy frontend configuration files
cp package.json frontend/ 2>/dev/null || true
cp tsconfig.json frontend/ 2>/dev/null || true
cp tsconfig.app.json frontend/ 2>/dev/null || true
cp tsconfig.node.json frontend/ 2>/dev/null || true
cp vite.config.ts frontend/ 2>/dev/null || true
cp tailwind.config.ts frontend/ 2>/dev/null || true
cp postcss.config.js frontend/ 2>/dev/null || true
cp components.json frontend/ 2>/dev/null || true
cp index.html frontend/ 2>/dev/null || true
cp .env.local frontend/ 2>/dev/null || true

# Copy backend files
echo "Moving backend files..."
cp -r backend/* ./ 2>/dev/null || true

# Create project README
cat > README.md << 'EOF'
# LearnHub - MERN Stack Learning Management System

A full-stack Learning Management System built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Project Structure


├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── lib/           # Utility functions
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── backend/               # Node.js backend (moved to root)
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   └── scripts/          # Database scripts
├── package.json          # Backend dependencies
├── server.js            # Express server entry point
└── README.md           # This file
```

## Features

### For Students
- Browse and search courses
- Enroll in courses (free/paid)
- Track learning progress
- Download certificates upon completion
- Payment integration for paid courses

### For Teachers
- Create and manage courses
- Add course content and sections
- View student enrollments
- Publish/unpublish courses
- Real-time course analytics

### For Administrators
- Manage users (students, teachers)
- Monitor platform analytics
- Course moderation
- System configuration

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.io** - Real-time updates
- **Bcrypt** - Password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd learnhub-lms
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

4. Set up environment variables:

Backend (.env):
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learnhub
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
CORS_ORIGIN=http://localhost:5173
```

Frontend (.env.local):
```
VITE_API_URL=http://localhost:5000/api
```

5. Start the development servers:

Backend:
```bash
npm run dev
```

Frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (teacher only)
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course (teacher only)
- `DELETE /api/courses/:id` - Delete course (teacher only)

### Enrollments
- `POST /api/enrollments/enroll` - Enroll in course
- `GET /api/enrollments/my-courses` - Get user enrollments
- `POST /api/enrollments/:id/progress` - Update progress

### Users (Admin only)
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Demo Accounts

For testing purposes, you can use these demo accounts:

**Student Account:**
- Email: student@demo.com
- Password: any password

**Teacher Account:**
- Email: teacher@demo.com
- Password: any password

**Admin Account:**
- Email: admin@demo.com
- Password: any password

## Deployment

### Frontend (Netlify/Vercel)
1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to your hosting service

### Backend (Railway/Render/Heroku)
1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy using your preferred service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact: [your-email@example.com]
EOF

# Create frontend package.json with updated dependencies
cat > frontend/package.json << 'EOF'
{
  "name": "learnhub-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.2",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-aspect-ratio": "^1.0.3",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-collapsible": "^1.0.3",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-menubar": "^1.0.4",
    "@radix-ui/react-navigation-menu": "^1.1.4",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-toggle": "^1.0.3",
    "@radix-ui/react-toggle-group": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@tanstack/react-query": "^5.8.4",
    "axios": "^1.6.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "cmdk": "^0.2.0",
    "date-fns": "^2.30.0",
    "embla-carousel-react": "^8.0.0-rc14",
    "html2canvas": "^1.4.1",
    "input-otp": "^1.2.4",
    "jspdf": "^2.5.1",
    "lucide-react": "^0.294.0",
    "next-themes": "^0.2.1",
    "react": "^18.2.0",
    "react-day-picker": "^8.9.1",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.47.0",
    "react-qr-code": "^2.0.12",
    "react-resizable-panels": "^0.0.55",
    "react-router-dom": "^6.18.0",
    "recharts": "^2.8.0",
    "sonner": "^1.2.0",
    "tailwind-merge": "^2.0.0",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.7.9",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.9.0",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@typescript-eslint/eslint-plugin": "^6.10.0",
    "@typescript-eslint/parser": "^6.10.0",
    "@vitejs/plugin-react": "^4.1.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.53.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.4",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.5",
    "typescript": "^5.2.2",
    "vite": "^4.5.0"
  }
}
EOF

echo "✅ Project structure created successfully!"
echo ""
echo "📁 Frontend files are now in the 'frontend/' directory"
echo "📁 Backend files are in the root directory"
echo ""
echo "🚀 To run the project:"
echo "1. Backend: npm install && npm run dev"
echo "2. Frontend: cd frontend && npm install && npm run dev"
echo ""
echo "📋 Demo Accounts:"
echo "   Student: student@demo.com"
echo "   Teacher: teacher@demo.com"
echo "   Admin: admin@demo.com"
echo ""
echo "🎉 Ready for submission to faculty!"

# Create git ignore for the root
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
frontend/node_modules/

# Build outputs
frontend/dist/
frontend/build/

# Environment variables
.env
.env.local
.env.production
frontend/.env.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# IDE/Editor files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Database
*.sqlite
*.db

# Other
reorganize-project.sh
EOF
