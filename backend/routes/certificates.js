import express from "express";
import Course from "../models/Course.js";
import User from "../models/User.js";
import Enrollment from "../models/Enrollment.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { validateObjectId } from "../middleware/validation.js";

const router = express.Router();

// @desc    Generate certificate for completed course
// @route   POST /api/certificates/generate/:courseId
// @access  Private/Student
router.post(
  "/generate/:courseId",
  authenticate,
  authorize("student"),
  validateObjectId("courseId"),
  async (req, res) => {
    try {
      const courseId = req.params.courseId;

      // Check if enrollment exists and course is completed
      const enrollment = await Enrollment.findOne({
        student: req.user._id,
        course: courseId,
      }).populate("course");

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: "Enrollment not found",
        });
      }

      if (enrollment.progress < 100) {
        return res.status(400).json({
          success: false,
          message: "Course must be completed to generate certificate",
        });
      }

      // Check if certificate already exists
      if (enrollment.certificateIssued) {
        return res.status(400).json({
          success: false,
          message: "Certificate already generated",
          data: {
            certificateId: enrollment.certificateId,
          },
        });
      }

      // Generate certificate ID and mark as issued
      await enrollment.generateCertificateId();

      // Add certificate to user's certificates array
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          certificates: {
            courseId: courseId,
            issuedDate: new Date(),
            certificateId: enrollment.certificateId,
          },
        },
      });

      res.status(201).json({
        success: true,
        message: "Certificate generated successfully",
        data: {
          certificateId: enrollment.certificateId,
          course: enrollment.course,
          issuedDate: new Date(),
          studentName: req.user.name,
        },
      });
    } catch (error) {
      console.error("Generate certificate error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while generating certificate",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// @desc    Get certificate details
// @route   GET /api/certificates/:certificateId
// @access  Public (for verification)
router.get(
  "/:certificateId",
  validateObjectId("certificateId"),
  async (req, res) => {
    try {
      const certificateId = req.params.certificateId;

      // Find enrollment with this certificate ID
      const enrollment = await Enrollment.findOne({ certificateId })
        .populate("student", "name email")
        .populate(
          "course",
          "title description instructor category totalDuration",
        )
        .populate("course.instructor", "name");

      if (!enrollment || !enrollment.certificateIssued) {
        return res.status(404).json({
          success: false,
          message: "Certificate not found",
        });
      }

      // Generate certificate data
      const certificateData = {
        certificateId: enrollment.certificateId,
        studentName: enrollment.student.name,
        courseName: enrollment.course.title,
        courseDescription: enrollment.course.description,
        instructorName: enrollment.course.instructor.name,
        category: enrollment.course.category,
        completedDate: enrollment.completedAt,
        issuedDate: enrollment.updatedAt,
        duration: enrollment.course.totalDuration,
        verificationUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-certificate/${certificateId}`,
      };

      res.json({
        success: true,
        data: {
          certificate: certificateData,
          isValid: true,
        },
      });
    } catch (error) {
      console.error("Get certificate error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching certificate",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// @desc    Download certificate (PDF generation would be here)
// @route   GET /api/certificates/:certificateId/download
// @access  Private
router.get(
  "/:certificateId/download",
  authenticate,
  validateObjectId("certificateId"),
  async (req, res) => {
    try {
      const certificateId = req.params.certificateId;

      // Find enrollment with this certificate ID
      const enrollment = await Enrollment.findOne({ certificateId })
        .populate("student", "name email")
        .populate(
          "course",
          "title description instructor category totalDuration",
        )
        .populate("course.instructor", "name");

      if (!enrollment || !enrollment.certificateIssued) {
        return res.status(404).json({
          success: false,
          message: "Certificate not found",
        });
      }

      // Check if user can download this certificate
      if (
        req.user.type !== "admin" &&
        enrollment.student._id.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      // In a real implementation, you would generate a PDF here
      // For now, we'll return the certificate data
      const certificateData = {
        certificateId: enrollment.certificateId,
        studentName: enrollment.student.name,
        courseName: enrollment.course.title,
        instructorName: enrollment.course.instructor.name,
        category: enrollment.course.category,
        completedDate: enrollment.completedAt,
        issuedDate: enrollment.updatedAt,
        duration: enrollment.course.totalDuration,
        grade: "Completed", // You could add grading logic here
      };

      // Set headers for file download
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="certificate-${certificateId}.json"`,
      );

      res.json({
        success: true,
        message: "Certificate download ready",
        data: {
          certificate: certificateData,
          downloadUrl: `/api/certificates/${certificateId}/download`,
        },
      });
    } catch (error) {
      console.error("Download certificate error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while downloading certificate",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// @desc    Get user's certificates
// @route   GET /api/certificates/my-certificates
// @access  Private/Student
router.get(
  "/user/my-certificates",
  authenticate,
  authorize("student"),
  async (req, res) => {
    try {
      // Get user's certificates from enrollments
      const enrollments = await Enrollment.find({
        student: req.user._id,
        certificateIssued: true,
      })
        .populate("course", "title description instructor category thumbnail")
        .populate("course.instructor", "name")
        .sort({ completedAt: -1 });

      const certificates = enrollments.map((enrollment) => ({
        certificateId: enrollment.certificateId,
        course: enrollment.course,
        completedDate: enrollment.completedAt,
        issuedDate: enrollment.updatedAt,
        downloadUrl: `/api/certificates/${enrollment.certificateId}/download`,
        verificationUrl: `/verify-certificate/${enrollment.certificateId}`,
      }));

      res.json({
        success: true,
        data: {
          certificates,
          totalCertificates: certificates.length,
        },
      });
    } catch (error) {
      console.error("Get user certificates error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching certificates",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

// @desc    Verify certificate authenticity
// @route   GET /api/certificates/verify/:certificateId
// @access  Public
router.get("/verify/:certificateId", async (req, res) => {
  try {
    const certificateId = req.params.certificateId;

    // Find enrollment with this certificate ID
    const enrollment = await Enrollment.findOne({ certificateId })
      .populate("student", "name")
      .populate("course", "title instructor")
      .populate("course.instructor", "name");

    if (!enrollment || !enrollment.certificateIssued) {
      return res.json({
        success: true,
        data: {
          isValid: false,
          message: "Certificate not found or invalid",
        },
      });
    }

    res.json({
      success: true,
      data: {
        isValid: true,
        certificate: {
          certificateId: enrollment.certificateId,
          studentName: enrollment.student.name,
          courseName: enrollment.course.title,
          instructorName: enrollment.course.instructor.name,
          completedDate: enrollment.completedAt,
          issuedDate: enrollment.updatedAt,
        },
        message: "Certificate is valid and authentic",
      },
    });
  } catch (error) {
    console.error("Verify certificate error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while verifying certificate",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @desc    Get certificate statistics (Admin only)
// @route   GET /api/certificates/admin/stats
// @access  Private/Admin
router.get(
  "/admin/stats",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const totalCertificates = await Enrollment.countDocuments({
        certificateIssued: true,
      });

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentCertificates = await Enrollment.countDocuments({
        certificateIssued: true,
        completedAt: { $gte: thirtyDaysAgo },
      });

      // Get certificates by course
      const certificatesByCourse = await Enrollment.aggregate([
        { $match: { certificateIssued: true } },
        {
          $lookup: {
            from: "courses",
            localField: "course",
            foreignField: "_id",
            as: "courseInfo",
          },
        },
        { $unwind: "$courseInfo" },
        {
          $group: {
            _id: "$course",
            courseName: { $first: "$courseInfo.title" },
            certificateCount: { $sum: 1 },
          },
        },
        { $sort: { certificateCount: -1 } },
        { $limit: 10 },
      ]);

      res.json({
        success: true,
        data: {
          totalCertificates,
          recentCertificates,
          topCourses: certificatesByCourse,
        },
      });
    } catch (error) {
      console.error("Get certificate stats error:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching certificate statistics",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
);

export default router;
