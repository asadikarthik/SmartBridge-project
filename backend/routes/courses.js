import express from "express";
import { body, query, validationResult } from "express-validator";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import mongoose from "mongoose";

const router = express.Router();

// Validation rules
const courseValidation = [
  body("title")
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage("Course title must be between 10 and 200 characters"),
  body("description")
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage("Course description must be between 50 and 2000 characters"),
  body("category")
    .isIn([
      "Technology",
      "Business",
      "Design",
      "Marketing",
      "Data Science",
      "Personal Development",
      "Health & Fitness",
      "Language",
      "Music",
      "Art",
      "Photography",
      "Cooking",
      "Other",
    ])
    .withMessage("Invalid course category"),
  body("level")
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Invalid course level"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("language")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Language must be between 2 and 50 characters"),
];

const sectionValidation = [
  body("sections.*.title")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Section title must be between 5 and 200 characters"),
  body("sections.*.content")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Section content must be at least 10 characters"),
  body("sections.*.duration")
    .isInt({ min: 1 })
    .withMessage("Section duration must be at least 1 minute"),
];

// @desc    Get all courses (with filtering, searching, and pagination)
// @route   GET /api/courses
// @access  Public
router.get(
  "/",
  [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Limit must be between 1 and 100"),
    query("category").optional().trim(),
    query("level").optional().isIn(["Beginner", "Intermediate", "Advanced"]),
    query("priceMin").optional().isFloat({ min: 0 }),
    query("priceMax").optional().isFloat({ min: 0 }),
    query("sortBy")
      .optional()
      .isIn([
        "newest",
        "oldest",
        "price-low",
        "price-high",
        "rating",
        "popular",
      ]),
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isPublished: true };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.level) {
      filter.level = req.query.level;
    }

    if (req.query.priceMin !== undefined || req.query.priceMax !== undefined) {
      filter.price = {};
      if (req.query.priceMin !== undefined) {
        filter.price.$gte = parseFloat(req.query.priceMin);
      }
      if (req.query.priceMax !== undefined) {
        filter.price.$lte = parseFloat(req.query.priceMax);
      }
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Build sort object
    let sort = {};
    switch (req.query.sortBy) {
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "oldest":
        sort = { createdAt: 1 };
        break;
      case "price-low":
        sort = { price: 1 };
        break;
      case "price-high":
        sort = { price: -1 };
        break;
      case "rating":
        sort = { "rating.average": -1 };
        break;
      case "popular":
        sort = { enrollmentCount: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const courses = await Course.find(filter)
      .populate("instructor", "name avatar rating")
      .select("-reviews -enrolled -sections.content")
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Course.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        courses,
        pagination: {
          currentPage: page,
          totalPages,
          totalCourses: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  }),
);

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(req.params.id)
      .populate("instructor", "name avatar bio rating experience")
      .populate("reviews.student", "name avatar");

    if (!course || !course.isPublished) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Increment view count
    await Course.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    // Check if user is enrolled (if authenticated)
    let isEnrolled = false;
    let enrollment = null;

    if (req.headers.authorization) {
      try {
        // Extract user from token without requiring auth middleware
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const enrollmentRecord = course.enrolled.find(
          (e) => e.student.toString() === decoded.userId,
        );

        if (enrollmentRecord) {
          isEnrolled = true;
          enrollment = enrollmentRecord;
        }
      } catch (error) {
        // Invalid token, continue without enrollment info
      }
    }

    res.json({
      success: true,
      data: {
        course,
        isEnrolled,
        enrollment,
      },
    });
  }),
);

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Teacher
router.post(
  "/",
  auth,
  courseValidation,
  sectionValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    // Check if user is teacher or admin
    if (req.user.type !== "teacher" && req.user.type !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only teachers can create courses.",
      });
    }

    // Get instructor info
    const instructor = await User.findById(req.user.userId);
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    // Create course
    const courseData = {
      ...req.body,
      instructor: req.user.userId,
      instructorName: instructor.name,
    };

    const course = await Course.create(courseData);

    // Add course to instructor's created courses
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { createdCourses: course._id },
    });

    // Populate instructor info
    await course.populate("instructor", "name avatar bio");

    // Emit real-time update
    if (req.io) {
      req.io.emit("courseCreated", {
        course: course,
        instructor: instructor.name,
      });
    }

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: {
        course,
      },
    });
  }),
);

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Teacher/Admin
router.put(
  "/:id",
  auth,
  courseValidation,
  sectionValidation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user owns the course or is admin
    if (
      course.instructor.toString() !== req.user.userId &&
      req.user.type !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only update your own courses.",
      });
    }

    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        $inc: { version: 1 },
        $push: {
          changelog: {
            version: course.version + 1,
            changes: req.body.changeDescription || "Course updated",
            updatedAt: new Date(),
          },
        },
      },
      { new: true, runValidators: true },
    ).populate("instructor", "name avatar bio");

    // Emit real-time update
    if (req.io) {
      req.io.emit("courseUpdated", {
        courseId: updatedCourse._id,
        title: updatedCourse.title,
      });
    }

    res.json({
      success: true,
      message: "Course updated successfully",
      data: {
        course: updatedCourse,
      },
    });
  }),
);

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Teacher/Admin
router.delete(
  "/:id",
  auth,
  asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user owns the course or is admin
    if (
      course.instructor.toString() !== req.user.userId &&
      req.user.type !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only delete your own courses.",
      });
    }

    // Check if course has enrollments
    if (course.enrollmentCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete course with active enrollments. Please contact admin.",
      });
    }

    // Remove course from instructor's created courses
    await User.findByIdAndUpdate(course.instructor, {
      $pull: { createdCourses: course._id },
    });

    // Delete the course
    await Course.findByIdAndDelete(req.params.id);

    // Emit real-time update
    if (req.io) {
      req.io.emit("courseDeleted", {
        courseId: req.params.id,
        title: course.title,
      });
    }

    res.json({
      success: true,
      message: "Course deleted successfully",
    });
  }),
);

// @desc    Get teacher's courses
// @route   GET /api/courses/teacher/my-courses
// @access  Private/Teacher
router.get(
  "/teacher/my-courses",
  auth,
  asyncHandler(async (req, res) => {
    if (req.user.type !== "teacher" && req.user.type !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only teachers can access this endpoint.",
      });
    }

    const courses = await Course.find({ instructor: req.user.userId })
      .sort({ createdAt: -1 })
      .select("-reviews -enrolled");

    const analytics = await Course.getAnalytics(req.user.userId);

    res.json({
      success: true,
      data: {
        courses,
        analytics,
      },
    });
  }),
);

// @desc    Toggle course publish status
// @route   PATCH /api/courses/:id/toggle-publish
// @access  Private/Teacher/Admin
router.patch(
  "/:id/toggle-publish",
  auth,
  asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user owns the course or is admin
    if (
      course.instructor.toString() !== req.user.userId &&
      req.user.type !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only modify your own courses.",
      });
    }

    // Toggle publish status
    course.isPublished = !course.isPublished;
    course.status = course.isPublished ? "published" : "draft";

    if (course.isPublished && !course.publishedAt) {
      course.publishedAt = new Date();
    }

    await course.save();

    // Emit real-time update
    if (req.io) {
      req.io.emit("courseStatusChanged", {
        courseId: course._id,
        title: course.title,
        isPublished: course.isPublished,
      });
    }

    res.json({
      success: true,
      message: `Course ${course.isPublished ? "published" : "unpublished"} successfully`,
      data: {
        course,
      },
    });
  }),
);

// @desc    Add course review
// @route   POST /api/courses/:id/reviews
// @access  Private/Student
router.post(
  "/:id/reviews",
  auth,
  [
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be between 1 and 5"),
    body("comment")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Comment cannot exceed 500 characters"),
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

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user is enrolled in the course
    const isEnrolled = course.enrolled.some(
      (enrollment) => enrollment.student.toString() === req.user.userId,
    );

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled in the course to leave a review",
      });
    }

    // Check if user has already reviewed
    const existingReview = course.reviews.find(
      (review) => review.student.toString() === req.user.userId,
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this course",
      });
    }

    // Add review
    const review = {
      student: req.user.userId,
      rating: req.body.rating,
      comment: req.body.comment,
      isVerifiedPurchase: true,
    };

    course.reviews.push(review);
    await course.save();

    // Populate the review
    await course.populate("reviews.student", "name avatar");

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: {
        review: course.reviews[course.reviews.length - 1],
      },
    });
  }),
);

// @desc    Get popular courses
// @route   GET /api/courses/popular
// @access  Public
router.get(
  "/popular",
  asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const courses = await Course.getPopular(limit);

    res.json({
      success: true,
      data: {
        courses,
      },
    });
  }),
);

// @desc    Get featured courses
// @route   GET /api/courses/featured
// @access  Public
router.get(
  "/featured",
  asyncHandler(async (req, res) => {
    const limit = parseInt(req.query.limit) || 6;
    const courses = await Course.getFeatured(limit);

    res.json({
      success: true,
      data: {
        courses,
      },
    });
  }),
);

export default router;
