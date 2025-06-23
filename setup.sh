#!/bin/bash

# LearnHub LMS - Complete Setup Script
# This script sets up the entire MERN stack application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Welcome message
echo "
🎓 LearnHub LMS Setup
==========================================
This script will set up the complete MERN stack application.
"

# Check prerequisites
print_status "Checking prerequisites..."

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

# Check npm
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_success "npm found: $NPM_VERSION"
else
    print_error "npm is not installed. Please install npm."
    exit 1
fi

# Check MongoDB
if command_exists mongod; then
    print_success "MongoDB found locally"
    LOCAL_MONGO=true
else
    print_warning "MongoDB not found locally. You'll need MongoDB Atlas or local installation."
    LOCAL_MONGO=false
fi

# Check Git
if command_exists git; then
    print_success "Git found"
else
    print_error "Git is not installed. Please install Git."
    exit 1
fi

# Setup options
echo "
Setup Options:
1. Full setup (Frontend + Backend + Database)
2. Frontend only
3. Backend only
4. Development environment with Docker
5. Production deployment setup
"

read -p "Choose setup option (1-5): " SETUP_OPTION

case $SETUP_OPTION in
    1)
        print_status "Setting up full MERN stack application..."
        SETUP_TYPE="full"
        ;;
    2)
        print_status "Setting up frontend only..."
        SETUP_TYPE="frontend"
        ;;
    3)
        print_status "Setting up backend only..."
        SETUP_TYPE="backend"
        ;;
    4)
        print_status "Setting up development environment with Docker..."
        SETUP_TYPE="docker"
        ;;
    5)
        print_status "Setting up for production deployment..."
        SETUP_TYPE="production"
        ;;
    *)
        print_error "Invalid option. Exiting."
        exit 1
        ;;
esac

# Create logs directory
mkdir -p logs

# Install dependencies
if [[ "$SETUP_TYPE" == "full" || "$SETUP_TYPE" == "frontend" ]]; then
    print_status "Installing frontend dependencies..."
    npm install
    print_success "Frontend dependencies installed"
fi

if [[ "$SETUP_TYPE" == "full" || "$SETUP_TYPE" == "backend" ]]; then
    print_status "Installing backend dependencies..."
    cd backend && npm install && cd ..
    print_success "Backend dependencies installed"
fi

# Environment setup
setup_environment() {
    print_status "Setting up environment variables..."
    
    # Frontend environment
    if [[ "$SETUP_TYPE" == "full" || "$SETUP_TYPE" == "frontend" ]]; then
        if [ ! -f .env.local ]; then
            echo "VITE_API_URL=http://localhost:5000/api" > .env.local
            print_success "Frontend environment file created"
        else
            print_warning "Frontend environment file already exists"
        fi
    fi
    
    # Backend environment
    if [[ "$SETUP_TYPE" == "full" || "$SETUP_TYPE" == "backend" ]]; then
        if [ ! -f backend/.env ]; then
            cp backend/.env.example backend/.env
            print_success "Backend environment file created"
            print_warning "Please edit backend/.env with your configuration"
        else
            print_warning "Backend environment file already exists"
        fi
    fi
}

# MongoDB setup
setup_mongodb() {
    if [[ "$SETUP_TYPE" == "full" || "$SETUP_TYPE" == "backend" ]]; then
        print_status "Setting up MongoDB..."
        
        if [ "$LOCAL_MONGO" = true ]; then
            print_status "Starting local MongoDB..."
            if command_exists brew; then
                brew services start mongodb-community 2>/dev/null || print_warning "Could not start MongoDB with brew"
            elif command_exists systemctl; then
                sudo systemctl start mongod 2>/dev/null || print_warning "Could not start MongoDB with systemctl"
            else
                print_warning "Please start MongoDB manually"
            fi
        else
            print_warning "Please set up MongoDB Atlas and update the MONGODB_URI in backend/.env"
        fi
    fi
}

# Docker setup
setup_docker() {
    if command_exists docker && command_exists docker-compose; then
        print_status "Setting up Docker development environment..."
        docker-compose up --build -d
        print_success "Docker environment started"
        print_status "Services available at:"
        echo "  - Frontend: http://localhost:3000"
        echo "  - Backend API: http://localhost:5000"
        echo "  - MongoDB: localhost:27017"
    else
        print_error "Docker or docker-compose not found. Please install Docker."
        exit 1
    fi
}

# Production setup
setup_production() {
    print_status "Setting up production environment..."
    
    # Install PM2 globally
    if ! command_exists pm2; then
        print_status "Installing PM2..."
        npm install -g pm2
    fi
    
    # Create production environment file
    if [ ! -f backend/.env.production ]; then
        cp backend/.env.production backend/.env.production.local
        print_success "Production environment template created"
        print_warning "Please edit backend/.env.production.local with your production settings"
    fi
    
    # Build frontend
    print_status "Building frontend for production..."
    npm run client:build
    print_success "Frontend built successfully"
    
    print_status "Production setup complete. Use the following commands:"
    echo "  pm2 start ecosystem.config.js --env production"
    echo "  pm2 monit"
    echo "  pm2 logs"
}

# Database seeding
seed_database() {
    if [[ "$SETUP_TYPE" == "full" || "$SETUP_TYPE" == "backend" ]]; then
        read -p "Do you want to seed the database with sample data? (y/n): " SEED_DB
        if [[ "$SEED_DB" == "y" || "$SEED_DB" == "Y" ]]; then
            print_status "Seeding database..."
            cd backend && npm run seed && cd ..
            print_success "Database seeded successfully"
            echo "
Demo Credentials:
👨‍💼 Admin: admin@learnhub.com / Admin123!
👩‍🏫 Teacher: sarah.johnson@learnhub.com / Teacher123!
👩‍🎓 Student: emily.rodriguez@student.com / Student123!
"
        fi
    fi
}

# Main setup execution
case $SETUP_TYPE in
    "docker")
        setup_docker
        ;;
    "production")
        setup_environment
        setup_production
        ;;
    *)
        setup_environment
        setup_mongodb
        seed_database
        ;;
esac

# Start development servers
start_development() {
    if [[ "$SETUP_TYPE" == "full" ]]; then
        print_status "Starting development servers..."
        print_status "Frontend will be available at: http://localhost:3000"
        print_status "Backend API will be available at: http://localhost:5000"
        print_status "Press Ctrl+C to stop both servers"
        npm run dev
    elif [[ "$SETUP_TYPE" == "frontend" ]]; then
        print_status "Starting frontend development server..."
        npm run client:dev
    elif [[ "$SETUP_TYPE" == "backend" ]]; then
        print_status "Starting backend development server..."
        cd backend && npm run dev
    fi
}

# Final instructions
print_success "Setup completed successfully! 🎉"

case $SETUP_TYPE in
    "docker")
        echo "
🐳 Docker Environment Ready!
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

Commands:
  docker-compose logs -f     # View logs
  docker-compose down        # Stop services
        "
        ;;
    "production")
        echo "
🚀 Production Setup Complete!
Next steps:
1. Edit backend/.env.production.local with your settings
2. Start with: pm2 start ecosystem.config.js --env production
3. Monitor with: pm2 monit
        "
        ;;
    *)
        echo "
🎯 Development Environment Ready!

Next steps:
1. Edit backend/.env if needed
2. Start development servers
3. Open http://localhost:3000 in your browser

Commands:
  npm run dev              # Start both frontend and backend
  npm run client:dev       # Frontend only
  npm run server:dev       # Backend only
        "
        
        read -p "Start development servers now? (y/n): " START_DEV
        if [[ "$START_DEV" == "y" || "$START_DEV" == "Y" ]]; then
            start_development
        fi
        ;;
esac

print_success "LearnHub LMS setup complete! Happy coding! 🚀"
