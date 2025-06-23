import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "./asyncHandler.js";

// Protect routes - verify JWT token
export const auth = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key",
      );

      // Get user from token (exclude password)
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account has been deactivated",
        });
      }

      // Add user to request object
      req.user = {
        userId: user._id,
        email: user.email,
        type: user.type,
        name: user.name,
      };

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Authorization failed",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }
});

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!roles.includes(req.user.type)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }

    next();
  };
};

// Optional auth - get user if token is provided, but don't require it
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key",
      );
      const user = await User.findById(decoded.userId).select("-password");

      if (user && user.isActive) {
        req.user = {
          userId: user._id,
          email: user.email,
          type: user.type,
          name: user.name,
        };
      }
    } catch (error) {
      // Invalid token, but continue without user
      console.log("Optional auth - invalid token:", error.message);
    }
  }

  next();
});

// Check if user owns resource
export const checkOwnership = (resourceField = "user") => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Admin can access everything
    if (req.user.type === "admin") {
      return next();
    }

    // Get the resource to check ownership
    const resourceId = req.params.id;
    let resource;

    // Determine which model to check based on the route
    if (req.baseUrl.includes("courses")) {
      const Course = (await import("../models/Course.js")).default;
      resource = await Course.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: "Resource not found",
        });
      }

      // Check if user is the instructor
      if (resource.instructor.toString() !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only access your own resources.",
        });
      }
    }

    req.resource = resource;
    next();
  });
};

// Rate limiting for sensitive operations
export const rateLimitSensitive = asyncHandler(async (req, res, next) => {
  const key = `rate_limit:${req.ip}:${req.path}`;

  // This would typically use Redis for production
  // For now, we'll implement a simple in-memory rate limiting
  if (!global.rateLimitStore) {
    global.rateLimitStore = new Map();
  }

  const now = Date.now();
  const window = 15 * 60 * 1000; // 15 minutes
  const limit = 5; // 5 requests per window

  const record = global.rateLimitStore.get(key) || {
    count: 0,
    resetTime: now + window,
  };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + window;
  } else {
    record.count++;
  }

  global.rateLimitStore.set(key, record);

  if (record.count > limit) {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
      resetTime: new Date(record.resetTime).toISOString(),
    });
  }

  next();
});

// Check if user account is verified
export const requireVerified = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const user = await User.findById(req.user.userId);

  if (!user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email address to access this resource",
    });
  }

  next();
});

// Check if user has specific permissions (for admin users)
export const hasPermission = (permission) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user || req.user.type !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const user = await User.findById(req.user.userId);

    if (!user.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required permission: ${permission}`,
      });
    }

    next();
  });
};

export default {
  auth,
  authorize,
  optionalAuth,
  checkOwnership,
  rateLimitSensitive,
  requireVerified,
  hasPermission,
};
