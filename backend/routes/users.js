import express from "express";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import {
  authenticate,
  requireAdmin,
  requireOwnershipOrAdmin,
} from "../middleware/auth.js";
import {
  validateUserUpdate,
  validateObjectId,
  validatePagination,
} from "../middleware/validation.js";

const router = express.Router();

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get(
  "/",
  authenticate,
  requireAdmin,
  validatePagination,
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Build filter object
      const filter = {};
      if (req.query.type) {
        filter.type = req.query.type;
      }
      if (req.query.search) {
        filter.$or = [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ];
      }
      if (req.query.isActive !== undefined) {
        filter.isActive = req.query.isActive === "true";
      }

      // Get users with pagination
      const users = await User.find(filter)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("enrolledCourses", "title")
        .populate("createdCourses", "title");

      const total = await User.countDocuments(filter);
      const totalPages = Math.ceil(total / limit);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            currentPage: page,
            totalPages,
            totalUsers: total,
            hasNext: page < totalPages,
            hasPrev: page > 1,
          },
        },
      });
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching users",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
router.get("/:id", authenticate, validateObjectId(), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("enrolledCourses", "title thumbnail instructor category")
      .populate("createdCourses", "title thumbnail category enrolledCount");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user can access this profile
    if (
      req.user.type !== "admin" &&
      req.user._id.toString() !== req.params.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.json({
      success: true,
      data: {
        user: user.getPublicProfile(),
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
router.put(
  "/:id",
  authenticate,
  validateObjectId(),
  validateUserUpdate,
  async (req, res) => {
    try {
      const { name, email, bio, avatar } = req.body;

      // Check if user can update this profile
      if (
        req.user.type !== "admin" &&
        req.user._id.toString() !== req.params.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // Check if email is already taken
      if (email) {
        const existingUser = await User.findOne({
          email,
          _id: { $ne: req.params.id },
        });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Email is already taken",
          });
        }
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (bio !== undefined) updateData.bio = bio;
      if (avatar !== undefined) updateData.avatar = avatar;

      const user = await User.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      })
        .select("-password")
        .populate("enrolledCourses", "title thumbnail")
        .populate("createdCourses", "title thumbnail");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: {
          user: user.getPublicProfile(),
        },
      });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating profile",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  validateObjectId(),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Prevent deleting other admins
      if (user.type === "admin" && req.user._id.toString() !== req.params.id) {
        return res.status(403).json({
          success: false,
          message: "Cannot delete other admin users",
        });
      }

      // If user is a teacher, handle their courses
      if (user.type === "teacher") {
        // You might want to transfer courses to another teacher or delete them
        await Course.deleteMany({ instructor: user._id });
      }

      // Remove user from enrollments
      await Enrollment.deleteMany({ student: user._id });

      await User.findByIdAndDelete(req.params.id);

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while deleting user",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// @desc    Toggle user active status (Admin only)
// @route   PATCH /api/users/:id/toggle-status
// @access  Private/Admin
router.patch(
  "/:id/toggle-status",
  authenticate,
  requireAdmin,
  validateObjectId(),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Prevent deactivating other admins
      if (user.type === "admin" && req.user._id.toString() !== req.params.id) {
        return res.status(403).json({
          success: false,
          message: "Cannot modify other admin users",
        });
      }

      user.isActive = !user.isActive;
      await user.save();

      res.json({
        success: true,
        message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
        data: {
          user: user.getPublicProfile(),
        },
      });
    } catch (error) {
      console.error("Toggle user status error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while updating user status",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// @desc    Get user statistics (Admin only)
// @route   GET /api/users/stats
// @access  Private/Admin
router.get("/admin/stats", authenticate, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const students = await User.countDocuments({ type: "student" });
    const teachers = await User.countDocuments({ type: "teacher" });
    const admins = await User.countDocuments({ type: "admin" });

    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        usersByType: {
          students,
          teachers,
          admins,
        },
        recentRegistrations,
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user statistics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

export default router;
