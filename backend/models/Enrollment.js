import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student ID is required"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course ID is required"],
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedSections: [
      {
        sectionId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    certificateId: {
      type: String,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "completed", // For free courses
    },
    paymentAmount: {
      type: Number,
      default: 0,
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Compound index to ensure unique enrollment per student-course pair
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

// Other indexes for performance
enrollmentSchema.index({ student: 1 });
enrollmentSchema.index({ course: 1 });
enrollmentSchema.index({ enrolledAt: -1 });
enrollmentSchema.index({ progress: -1 });
enrollmentSchema.index({ completedAt: -1 });

// Virtual for completion status
enrollmentSchema.virtual("isCompleted").get(function () {
  return this.progress >= 100;
});

// Virtual for completed sections count
enrollmentSchema.virtual("completedSectionsCount").get(function () {
  return this.completedSections ? this.completedSections.length : 0;
});

// Method to update progress
enrollmentSchema.methods.updateProgress = async function (totalSections) {
  const completedCount = this.completedSections.length;
  this.progress =
    totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0;

  // Mark as completed if 100% progress
  if (this.progress >= 100 && !this.completedAt) {
    this.completedAt = new Date();
  }

  this.lastAccessedAt = new Date();
  return this.save();
};

// Method to add completed section
enrollmentSchema.methods.addCompletedSection = function (sectionId) {
  const existingSection = this.completedSections.find(
    (section) => section.sectionId.toString() === sectionId.toString(),
  );

  if (!existingSection) {
    this.completedSections.push({
      sectionId: sectionId,
      completedAt: new Date(),
    });
  }

  return this;
};

// Method to generate certificate ID
enrollmentSchema.methods.generateCertificateId = function () {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  this.certificateId = `CERT-${timestamp}-${random}`;
  this.certificateIssued = true;
  return this.save();
};

// Static method to get enrollment statistics
enrollmentSchema.statics.getEnrollmentStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalEnrollments: { $sum: 1 },
        completedEnrollments: {
          $sum: { $cond: [{ $gte: ["$progress", 100] }, 1, 0] },
        },
        averageProgress: { $avg: "$progress" },
        totalRevenue: { $sum: "$paymentAmount" },
      },
    },
  ]);

  return (
    stats[0] || {
      totalEnrollments: 0,
      completedEnrollments: 0,
      averageProgress: 0,
      totalRevenue: 0,
    }
  );
};

// Static method to get course-wise enrollment stats
enrollmentSchema.statics.getCourseWiseStats = async function () {
  return this.aggregate([
    {
      $lookup: {
        from: "courses",
        localField: "course",
        foreignField: "_id",
        as: "courseInfo",
      },
    },
    {
      $unwind: "$courseInfo",
    },
    {
      $group: {
        _id: "$course",
        courseTitle: { $first: "$courseInfo.title" },
        totalEnrollments: { $sum: 1 },
        completedEnrollments: {
          $sum: { $cond: [{ $gte: ["$progress", 100] }, 1, 0] },
        },
        averageProgress: { $avg: "$progress" },
        revenue: { $sum: "$paymentAmount" },
      },
    },
    {
      $sort: { totalEnrollments: -1 },
    },
  ]);
};

export default mongoose.model("Enrollment", enrollmentSchema);
