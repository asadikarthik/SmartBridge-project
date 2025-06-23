import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: "Too many authentication attempts, please try again later.",
  },
  skipSuccessfulRequests: true,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 login attempts per windowMs
  message: {
    error: "Too many login attempts, please try again later.",
  },
  skipSuccessfulRequests: true,
});

// Validation rules
const registerValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
    ),
  body("type")
    .isIn(["student", "teacher", "admin"])
    .withMessage("Invalid user type"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post(
  "/register",
  authLimiter,
  registerValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const { name, email, password, type = "student" } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      type,
    });

    // Generate token
    const token = user.generateToken();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: userResponse,
        token,
      },
    });
  }),
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
router.post(
  "/login",
  loginLimiter,
  loginValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      // Find user by credentials (includes password checking)
      const user = await User.findByCredentials(email, password);

      // Generate token
      const token = user.generateToken();

      // Remove sensitive data from response
      const userResponse = user.toObject();
      delete userResponse.password;
      delete userResponse.passwordResetToken;
      delete userResponse.passwordResetExpires;
      delete userResponse.emailVerificationToken;
      delete userResponse.twoFactorSecret;

      res.json({
        success: true,
        message: "Login successful",
        data: {
          user: userResponse,
          token,
        },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }),
);

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
router.get(
  "/me",
  auth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId)
      .populate("enrolledCourses", "title thumbnail price instructor")
      .populate("createdCourses", "title thumbnail price enrollmentCount")
      .populate("certificates");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        user,
      },
    });
  }),
);

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put(
  "/profile",
  auth,
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
    body("bio")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Bio cannot exceed 500 characters"),
    body("phone")
      .optional()
      .matches(/^\+?[1-9]\d{1,14}$/)
      .withMessage("Please provide a valid phone number"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const allowedUpdates = [
      "name",
      "bio",
      "phone",
      "dateOfBirth",
      "address",
      "socialLinks",
      "preferences",
      "expertise",
      "experience",
      "education",
    ];

    const updates = {};
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user,
      },
    });
  }),
);

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
router.put(
  "/change-password",
  auth,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        "New password must contain at least one lowercase letter, one uppercase letter, and one number",
      ),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.userId).select("+password");

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  }),
);

// @desc    Logout user (client-side token removal)
// @route   POST /api/auth/logout
// @access  Private
router.post(
  "/logout",
  auth,
  asyncHandler(async (req, res) => {
    // In a JWT-based system, logout is typically handled client-side
    // by removing the token. Here we can log the logout event.

    await User.findByIdAndUpdate(req.user.userId, {
      $set: { lastLogout: new Date() },
    });

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  }),
);

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Private
router.post(
  "/refresh-token",
  auth,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User not found or inactive",
      });
    }

    // Generate new token
    const token = user.generateToken();

    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        token,
      },
    });
  }),
);

// @desc    Get user statistics (for admin)
// @route   GET /api/auth/stats
// @access  Private/Admin
router.get(
  "/stats",
  auth,
  asyncHandler(async (req, res) => {
    // Check if user is admin
    if (req.user.type !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const stats = await User.getStats();

    res.json({
      success: true,
      data: stats,
    });
  }),
);

export default router;
