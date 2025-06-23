# 🚀 LearnHub LMS - Complete Deployment Guide

This guide covers deployment to various platforms following industry best practices.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
  - [Heroku](#heroku)
  - [Railway](#railway)
  - [Render](#render)
  - [DigitalOcean](#digitalocean)
  - [AWS](#aws)
- [Database Setup](#database-setup)
- [CI/CD Pipeline](#cicd-pipeline)
- [Monitoring & Logging](#monitoring--logging)

## 🔧 Prerequisites

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **MongoDB** (local or cloud)
- **Git**
- **Docker** (optional)

## 🌍 Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/learnhub-lms.git
cd learnhub-lms
```

### 2. Install Dependencies

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Or install separately
npm install              # Frontend
cd backend && npm install # Backend
```

### 3. Environment Variables

Create environment files:

**Frontend (.env.local):**

```env
VITE_API_URL=http://localhost:5000/api
```

**Backend (backend/.env):**

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/learnhub
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
```

## 💻 Local Development

### Option 1: Traditional Setup

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Frontend
npm run dev
```

### Option 2: Docker Development

```bash
# Start all services with Docker
npm run docker:dev

# Or manually
docker-compose up --build
```

### Database Seeding

```bash
cd backend
npm run seed
```

## 🐳 Docker Deployment

### Build and Run

```bash
# Build production image
docker build -t learnhub-lms .

# Run container
docker run -p 5000:5000 \
  -e MONGODB_URI="your-mongodb-uri" \
  -e JWT_SECRET="your-jwt-secret" \
  learnhub-lms
```

### Docker Compose Production

```yaml
# docker-compose.prod.yml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/learnhub
      - JWT_SECRET=your-production-secret
    depends_on:
      - mongodb
    restart: unless-stopped

  mongodb:
    image: mongo:7.0
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
```

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## ☁️ Cloud Deployment

### 🚀 Heroku

1. **Install Heroku CLI**

   ```bash
   # macOS
   brew tap heroku/brew && brew install heroku

   # Other platforms: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create Heroku App**

   ```bash
   heroku create learnhub-lms
   heroku addons:create mongolab:sandbox
   ```

3. **Set Environment Variables**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-super-secret-production-key
   heroku config:set FRONTEND_URL=https://learnhub-lms.herokuapp.com
   ```

4. **Deploy**

   ```bash
   git push heroku main
   ```

5. **Scale and Monitor**
   ```bash
   heroku ps:scale web=1
   heroku logs --tail
   ```

### 🚂 Railway

1. **Install Railway CLI**

   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Initialize Project**

   ```bash
   railway init
   railway add mongodb
   ```

3. **Deploy**

   ```bash
   railway up
   ```

4. **Set Environment Variables**
   ```bash
   railway variables:set NODE_ENV=production
   railway variables:set JWT_SECRET=your-secret
   ```

### 🎨 Render

1. **Create `render.yaml`**

   ```yaml
   services:
     - type: web
       name: learnhub-backend
       env: node
       buildCommand: npm run install:all && npm run build
       startCommand: npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: MONGODB_URI
           fromDatabase:
             name: learnhub-mongodb
             property: connectionString
         - key: JWT_SECRET
           generateValue: true

     - type: web
       name: learnhub-frontend
       env: static
       buildCommand: npm install && npm run client:build
       staticPublishPath: ./dist

   databases:
     - name: learnhub-mongodb
       databaseName: learnhub
   ```

2. **Deploy via GitHub**
   - Connect your GitHub repository
   - Render will auto-deploy on push

### 🌊 DigitalOcean App Platform

1. **Create `app.yaml`**

   ```yaml
   name: learnhub-lms
   services:
     - name: backend
       source_dir: /
       github:
         repo: yourusername/learnhub-lms
         branch: main
       run_command: npm start
       environment_slug: node-js
       instance_count: 1
       instance_size_slug: basic-xxs
       envs:
         - key: NODE_ENV
           value: production
         - key: MONGODB_URI
           value: ${mongodb.DATABASE_URL}
         - key: JWT_SECRET
           type: SECRET

   databases:
     - name: mongodb
       engine: MONGODB
       version: "5"
   ```

2. **Deploy**
   ```bash
   doctl apps create --spec app.yaml
   ```

### ☁️ AWS (EC2 + MongoDB Atlas)

1. **Launch EC2 Instance**

   ```bash
   # Connect to instance
   ssh -i your-key.pem ubuntu@your-instance-ip

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   sudo npm install -g pm2
   ```

2. **Deploy Application**

   ```bash
   # Clone repository
   git clone https://github.com/yourusername/learnhub-lms.git
   cd learnhub-lms

   # Install dependencies and build
   npm run install:all
   npm run build

   # Start with PM2
   pm2 start ecosystem.config.js --env production
   pm2 startup
   pm2 save
   ```

3. **Create `ecosystem.config.js`**

   ```javascript
   module.exports = {
     apps: [
       {
         name: "learnhub-backend",
         script: "backend/server.js",
         instances: "max",
         exec_mode: "cluster",
         env: {
           NODE_ENV: "development",
         },
         env_production: {
           NODE_ENV: "production",
           PORT: 5000,
           MONGODB_URI: "your-mongodb-atlas-uri",
           JWT_SECRET: "your-production-secret",
         },
       },
     ],
   };
   ```

4. **Setup Nginx Reverse Proxy**

   ```nginx
   # /etc/nginx/sites-available/learnhub
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           try_files $uri $uri/ /index.html;
           root /path/to/learnhub-lms/dist;
       }

       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🗄️ Database Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**

   - Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster (M0 free tier available)
   - Configure network access (0.0.0.0/0 for development)

2. **Create Database User**

   - Go to Database Access
   - Add new database user with read/write permissions

3. **Get Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/learnhub?retryWrites=true&w=majority
   ```

### Local MongoDB

```bash
# Install MongoDB Community Edition
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Ubuntu
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy LearnHub LMS

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:7.0
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm run install:all

      - name: Run tests
        run: |
          cd backend && npm test
          npm run test
        env:
          MONGODB_URI: mongodb://localhost:27017/learnhub_test
          JWT_SECRET: test-secret

      - name: Build frontend
        run: npm run client:build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{secrets.HEROKU_API_KEY}}
          heroku_app_name: "learnhub-lms"
          heroku_email: "your-email@example.com"
```

## 📊 Monitoring & Logging

### Production Monitoring

1. **Application Monitoring**

   ```javascript
   // backend/middleware/monitoring.js
   import express from "express";

   export const healthCheck = (req, res) => {
     res.status(200).json({
       status: "healthy",
       timestamp: new Date().toISOString(),
       uptime: process.uptime(),
       memory: process.memoryUsage(),
     });
   };
   ```

2. **Error Tracking (Sentry)**

   ```bash
   npm install @sentry/node @sentry/tracing
   ```

   ```javascript
   // backend/server.js
   import * as Sentry from "@sentry/node";

   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

3. **Logging (Winston)**

   ```bash
   cd backend && npm install winston
   ```

   ```javascript
   // backend/utils/logger.js
   import winston from "winston";

   const logger = winston.createLogger({
     level: "info",
     format: winston.format.json(),
     transports: [
       new winston.transports.File({ filename: "error.log", level: "error" }),
       new winston.transports.File({ filename: "combined.log" }),
     ],
   });

   if (process.env.NODE_ENV !== "production") {
     logger.add(
       new winston.transports.Console({
         format: winston.format.simple(),
       }),
     );
   }

   export default logger;
   ```

## 🔒 Security Checklist

### Production Security

- [ ] Use HTTPS/SSL certificates
- [ ] Set secure JWT secrets (32+ characters)
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Sanitize user inputs
- [ ] Use helmet.js for security headers
- [ ] Enable MongoDB authentication
- [ ] Set up proper firewall rules
- [ ] Use environment variables for secrets
- [ ] Enable audit logging
- [ ] Regular security updates

### Environment Variables Security

```bash
# Use tools like dotenv-vault for secret management
npm install dotenv-vault

# Or use cloud-specific secret management
# AWS: AWS Secrets Manager
# Azure: Azure Key Vault
# GCP: Secret Manager
```

## 🚀 Performance Optimization

### Frontend Optimization

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist/stats.html

# Optimize images
npm install vite-plugin-imagemin
```

### Backend Optimization

```javascript
// backend/server.js
import compression from "compression";
import helmet from "helmet";

app.use(compression());
app.use(helmet());

// Enable gzip compression
app.get("*.js", (req, res, next) => {
  req.url = req.url + ".gz";
  res.set("Content-Encoding", "gzip");
  res.set("Content-Type", "text/javascript");
  next();
});
```

## 📈 Scaling Strategies

### Horizontal Scaling

1. **Load Balancer Setup**

   ```bash
   # Using PM2 cluster mode
   pm2 start ecosystem.config.js --env production
   ```

2. **Database Scaling**

   - MongoDB replica sets
   - Read replicas for read-heavy operations
   - Database sharding for large datasets

3. **Caching Strategy**

   ```javascript
   // Redis caching
   import redis from "redis";
   const client = redis.createClient(process.env.REDIS_URL);

   // Cache frequently accessed data
   app.get("/api/courses", async (req, res) => {
     const cacheKey = "courses:all";
     const cached = await client.get(cacheKey);

     if (cached) {
       return res.json(JSON.parse(cached));
     }

     const courses = await Course.find();
     await client.setex(cacheKey, 300, JSON.stringify(courses)); // 5 min cache
     res.json(courses);
   });
   ```

## 🎯 Post-Deployment Steps

1. **Verify Deployment**

   ```bash
   curl https://your-domain.com/api/health
   ```

2. **Seed Production Database**

   ```bash
   heroku run npm run seed -a learnhub-lms
   ```

3. **Monitor Logs**

   ```bash
   heroku logs --tail -a learnhub-lms
   ```

4. **Set up Domain & SSL**

   ```bash
   heroku domains:add www.learnhub.com
   heroku certs:auto:enable
   ```

5. **Configure CDN (Optional)**
   - CloudFlare for global CDN
   - AWS CloudFront
   - Google Cloud CDN

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**

   ```bash
   # Clear npm cache
   npm cache clean --force

   # Delete node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Database Connection Issues**

   ```bash
   # Test MongoDB connection
   mongosh "mongodb+srv://cluster.mongodb.net/learnhub" --username your-username
   ```

3. **Environment Variable Issues**

   ```bash
   # Verify environment variables are set
   heroku config -a learnhub-lms
   ```

4. **Memory Issues**
   ```bash
   # Increase Node.js memory limit
   node --max-old-space-size=4096 server.js
   ```

## 📞 Support

For deployment issues:

1. Check the logs first
2. Verify environment variables
3. Test database connectivity
4. Check application health endpoints
5. Review security group/firewall settings

---

**🎉 Congratulations! Your LearnHub LMS is now deployed and ready for production use!**
