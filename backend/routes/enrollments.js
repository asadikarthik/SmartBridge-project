import express from "express";
import { body, validationResult } from "express-validator";
import Course from "../models/Course.js";
import User from "../models/User.js";
import { auth, authorize } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import mongoose from "mongoose";

const router = express.Router();

// @desc    Enroll in a course
// @route   POST /api/enrollments/enroll
// @access  Private/Student
router.post(
  "/enroll",
  auth,
  authorize("student"),
  [body("courseId").isMongoId().withMessage("Invalid course ID")],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const { courseId } = req.body;

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!course.isPublished) {
      return res.status(400).json({
        success: false,
        message: "Course is not available for enrollment",
      });
    }

    // Check if already enrolled
    const existingEnrollment = course.enrolled.find(
      (enrollment) => enrollment.student.toString() === req.user.userId,
    );

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    // Check enrollment capacity
    if (
      course.settings.maxStudents &&
      course.enrollmentCount >= course.settings.maxStudents
    ) {
      return res.status(400).json({
        success: false,
        message: "Course has reached maximum enrollment capacity",
      });
    }

    // Check enrollment deadline
    if (course.enrollmentDeadline && new Date() > course.enrollmentDeadline) {
      return res.status(400).json({
        success: false,
        message: "Enrollment deadline has passed",
      });
    }

    // Create enrollment
    const enrollment = {
      student: req.user.userId,
      enrolledAt: new Date(),
      progress: 0,
      completedSections: [],
      lastAccessedAt: new Date(),
      certificateIssued: false,
    };

    course.enrolled.push(enrollment);
    course.enrollmentCount = course.enrolled.length;

    // Update course revenue if it's a paid course
    if (course.price > 0) {
      course.revenue.total += course.price;
      course.revenue.thisMonth += course.price;
    }

    await course.save();

    // Add course to student's enrolled courses
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { enrolledCourses: courseId },
    });

    // Update instructor's earnings if it's a paid course
    if (course.price > 0) {
      const instructorShare = course.price * 0.7; // 70% to instructor, 30% to platform
      await User.findByIdAndUpdate(course.instructor, {
        $inc: {
          "earnings.total": instructorShare,
          "earnings.thisMonth": instructorShare,
        },
      });
    }

    // Emit real-time notification
    if (req.io) {
      req.io.emit("studentEnrolled", {
        courseId: course._id,
        courseName: course.title,
        studentName: req.user.name,
        instructorId: course.instructor,
      });
    }

    res.status(201).json({
      success: true,
      message: "Successfully enrolled in the course",
      data: {
        enrollment: course.enrolled[course.enrolled.length - 1],
        course: {
          _id: course._id,
          title: course.title,
          instructor: course.instructorName,
          thumbnail: course.thumbnail,
        },
      },
    });
  }),
);

// @desc    Get student's enrollments
// @route   GET /api/enrollments/my-courses
// @access  Private/Student
router.get(
  "/my-courses",
  auth,
  authorize("student"),
  asyncHandler(async (req, res) => {
    const courses = await Course.find({
      "enrolled.student": req.user.userId,
    })
      .populate("instructor", "name avatar")
      .select("-reviews");

    // Extract enrollment data for each course
    const enrollmentsWithCourses = courses.map((course) => {
      const enrollment = course.enrolled.find(
        (e) => e.student.toString() === req.user.userId,
      );

      return {
        _id: enrollment._id,
        course: {
          _id: course._id,
          title: course.title,
          thumbnail: course.thumbnail,
          instructor: course.instructor,
          totalDuration: course.totalDuration,
          sections: course.sections.length,
          price: course.price,
          category: course.category,
          level: course.level,
        },
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress,
        completedSections: enrollment.completedSections,
        lastAccessedAt: enrollment.lastAccessedAt,
        certificateIssued: enrollment.certificateIssued,
      };
    });

    // Calculate stats
    const stats = {
      totalEnrollments: enrollmentsWithCourses.length,
      completedCourses: enrollmentsWithCourses.filter((e) => e.progress === 100)
        .length,
      inProgressCourses: enrollmentsWithCourses.filter(
        (e) => e.progress > 0 && e.progress < 100,
      ).length,
      notStartedCourses: enrollmentsWithCourses.filter((e) => e.progress === 0)
        .length,
      averageProgress:
        enrollmentsWithCourses.length > 0
          ? Math.round(
              enrollmentsWithCourses.reduce((sum, e) => sum + e.progress, 0) /
                enrollmentsWithCourses.length,
            )
          : 0,
    };

    res.json({
      success: true,
      data: {
        enrollments: enrollmentsWithCourses,
        stats,
      },
    });
  }),
);

// @desc    Update course progress
// @route   POST /api/enrollments/:enrollmentId/progress
// @access  Private/Student
router.post(
  "/:enrollmentId/progress",
  auth,
  authorize("student"),
  [body("sectionId").isMongoId().withMessage("Invalid section ID")],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    const { sectionId } = req.body;
    const { enrollmentId } = req.params;

    // Find the course with the enrollment
    const course = await Course.findOne({
      "enrolled._id": enrollmentId,
      "enrolled.student": req.user.userId,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    // Find the specific enrollment
    const enrollment = course.enrolled.id(enrollmentId);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    // Check if section exists in the course
    const section = course.sections.id(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found in this course",
      });
    }

    // Check if section is already completed
    const isAlreadyCompleted = enrollment.completedSections.some(
      (cs) => cs.sectionId.toString() === sectionId,
    );

    let isCompleted = false;

    if (!isAlreadyCompleted) {
      // Mark section as completed
      enrollment.completedSections.push({
        sectionId,
        completedAt: new Date(),
      });

      // Calculate new progress
      const totalSections = course.sections.length;
      const completedSections = enrollment.completedSections.length;
      enrollment.progress = Math.round(
        (completedSections / totalSections) * 100,
      );

      // Check if course is completed
      if (enrollment.progress === 100) {
        isCompleted = true;
        enrollment.certificateIssued = true;

        // Add to completed courses
        await User.findByIdAndUpdate(req.user.userId, {
          $push: {
            completedCourses: {
              course: course._id,
              completedAt: new Date(),
              grade: "A+", // Default grade, could be calculated based on quizzes/assignments
            },
          },
        });
      }
    }

    enrollment.lastAccessedAt = new Date();
    await course.save();

    // Emit real-time progress update
    if (req.io) {
      req.io.emit("progressUpdated", {
        studentId: req.user.userId,
        courseId: course._id,
        progress: enrollment.progress,
        isCompleted,
      });

      // Notify instructor of student progress
      req.io.to(`instructor_${course.instructor}`).emit("studentProgress", {
        studentName: req.user.name,
        courseName: course.title,
        progress: enrollment.progress,
        isCompleted,
      });
    }

    res.json({
      success: true,
      message: `Section marked as completed. ${isCompleted ? "Congratulations! You've completed the course!" : ""}`,
      data: {
        enrollment: {
          _id: enrollment._id,
          progress: enrollment.progress,
          completedSections: enrollment.completedSections,
          lastAccessedAt: enrollment.lastAccessedAt,
          certificateIssued: enrollment.certificateIssued,
        },
        isCompleted,
      },
    });
  }),
);

// @desc    Get all enrollments (Admin only)
// @route   GET /api/enrollments
// @access  Private/Admin
router.get(
  "/",
  auth,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.courseId) {
      filter._id = req.query.courseId;
    }
    if (req.query.studentId) {
      filter["enrolled.student"] = req.query.studentId;
    }

    const courses = await Course.find(filter)
      .populate("instructor", "name email")
      .populate("enrolled.student", "name email")
      .skip(skip)
      .limit(limit);

    // Flatten enrollments
    const enrollments = [];
    courses.forEach((course) => {
      course.enrolled.forEach((enrollment) => {
        enrollments.push({
          _id: enrollment._id,
          student: enrollment.student,
          course: {
            _id: course._id,
            title: course.title,
            instructor: course.instructor,
          },
          enrolledAt: enrollment.enrolledAt,
          progress: enrollment.progress,
          lastAccessedAt: enrollment.lastAccessedAt,
          certificateIssued: enrollment.certificateIssued,
        });
      });
    });

    const totalEnrollments = await Course.aggregate([
      { $unwind: "$enrolled" },
      { $count: "total" },
    ]);

    const total = totalEnrollments[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        enrollments,
        pagination: {
          currentPage: page,
          totalPages,
          totalEnrollments: total,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  }),
);

// @desc    Get enrollment statistics
// @route   GET /api/enrollments/admin/stats
// @access  Private/Admin
router.get(
  "/admin/stats",
  auth,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const stats = await Course.aggregate([
      {
        $project: {
          totalEnrollments: { $size: "$enrolled" },
          completedEnrollments: {
            $size: {
              $filter: {
                input: "$enrolled",
                cond: { $eq: ["$$this.progress", 100] },
              },
            },
          },
          revenue: "$revenue.total",
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: null,
          totalEnrollments: { $sum: "$totalEnrollments" },
          totalCompletions: { $sum: "$completedEnrollments" },
          totalRevenue: { $sum: "$revenue" },
          averageEnrollments: { $avg: "$totalEnrollments" },
        },
      },
    ]);

    // Get monthly enrollment data
    const monthlyStats = await Course.aggregate([
      { $unwind: "$enrolled" },
      {
        $group: {
          _id: {
            year: { $year: "$enrolled.enrolledAt" },
            month: { $month: "$enrolled.enrolledAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalEnrollments: 0,
          totalCompletions: 0,
          totalRevenue: 0,
          averageEnrollments: 0,
        },
        monthlyTrend: monthlyStats,
      },
    });
  }),
);

// @desc    Remove enrollment (Admin only)
// @route   DELETE /api/enrollments/:id
// @access  Private/Admin
router.delete(
  "/:id",
  auth,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const enrollmentId = req.params.id;

    // Find the course containing this enrollment
    const course = await Course.findOne({
      "enrolled._id": enrollmentId,
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    const enrollment = course.enrolled.id(enrollmentId);
    const studentId = enrollment.student;

    // Remove enrollment from course
    course.enrolled.pull(enrollmentId);
    course.enrollmentCount = course.enrolled.length;

    await course.save();

    // Remove course from student's enrolled courses
    await User.findByIdAndUpdate(studentId, {
      $pull: { enrolledCourses: course._id },
    });

    res.json({
      success: true,
      message: "Enrollment removed successfully",
    });
  }),
);

export default router;
