module.exports = {
  apps: [
    {
      name: "learnhub-backend",
      script: "backend/server.js",
      instances: process.env.NODE_ENV === "production" ? "max" : 1,
      exec_mode: process.env.NODE_ENV === "production" ? "cluster" : "fork",
      watch: process.env.NODE_ENV === "development",
      ignore_watch: ["node_modules", "logs", "dist"],
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "development",
        PORT: 5000,
        MONGODB_URI: "mongodb://localhost:27017/learnhub",
        JWT_SECRET: "development-secret-key",
        FRONTEND_URL: "http://localhost:3000",
      },
      env_staging: {
        NODE_ENV: "staging",
        PORT: 5000,
        MONGODB_URI: process.env.MONGODB_URI_STAGING,
        JWT_SECRET: process.env.JWT_SECRET_STAGING,
        FRONTEND_URL: process.env.FRONTEND_URL_STAGING,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 5000,
        MONGODB_URI: process.env.MONGODB_URI,
        JWT_SECRET: process.env.JWT_SECRET,
        FRONTEND_URL: process.env.FRONTEND_URL,
      },
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      log_date_format: "YYYY-MM-DD HH:mm Z",
    },
  ],

  deploy: {
    production: {
      user: "deploy",
      host: ["your-server-ip"],
      ref: "origin/main",
      repo: "https://github.com/yourusername/learnhub-lms.git",
      path: "/var/www/learnhub",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && npm run install:all && npm run build && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
    staging: {
      user: "deploy",
      host: ["staging-server-ip"],
      ref: "origin/develop",
      repo: "https://github.com/yourusername/learnhub-lms.git",
      path: "/var/www/learnhub-staging",
      "post-deploy":
        "npm install && npm run install:all && npm run build && pm2 reload ecosystem.config.js --env staging",
    },
  },
};
