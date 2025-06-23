import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Section title is required"],
      trim: true,
      maxLength: [200, "Section title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Section content is required"],
    },
    videoUrl: {
      type: String,
      match: [/^https?:\/\/.+/, "Please provide a valid URL"],
    },
    duration: {
      type: Number,
      required: [true, "Section duration is required"],
      min: [1, "Duration must be at least 1 minute"],
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
    resources: [
      {
        title: String,
        url: String,
        type: {
          type: String,
          enum: ["pdf", "video", "audio", "document", "link", "image"],
        },
      },
    ],
    quiz: {
      questions: [
        {
          question: String,
          options: [String],
          correctAnswer: Number,
          explanation: String,
        },
      ],
      passingScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 70,
      },
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const reviewSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      maxLength: [500, "Review comment cannot exceed 500 characters"],
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    reportedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxLength: [200, "Course title cannot exceed 200 characters"],
      index: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
      maxLength: [2000, "Course description cannot exceed 2000 characters"],
    },
    shortDescription: {
      type: String,
      maxLength: [300, "Short description cannot exceed 300 characters"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
      index: true,
    },
    instructorName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: [true, "Course category is required"],
      enum: [
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
      ],
      index: true,
    },
    subcategory: {
      type: String,
      trim: true,
    },
    level: {
      type: String,
      required: [true, "Course level is required"],
      enum: ["Beginner", "Intermediate", "Advanced"],
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Course price is required"],
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    originalPrice: {
      type: Number,
      min: [0, "Original price cannot be negative"],
    },
    currency: {
      type: String,
      default: "USD",
      enum: ["USD", "EUR", "GBP", "INR", "CAD", "AUD"],
    },
    thumbnail: {
      public_id: String,
      url: String,
      alt: String,
    },
    previewVideo: {
      public_id: String,
      url: String,
      duration: Number,
    },
    images: [
      {
        public_id: String,
        url: String,
        alt: String,
      },
    ],
    sections: [sectionSchema],

    // Course metadata
    language: {
      type: String,
      default: "English",
      required: true,
    },
    tags: [String],
    requirements: [String],
    objectives: [String],
    targetAudience: [String],

    // Enrollment and progress
    enrolled: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
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
            sectionId: mongoose.Schema.Types.ObjectId,
            completedAt: Date,
          },
        ],
        lastAccessedAt: Date,
        certificateIssued: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Reviews and ratings
    reviews: [reviewSchema],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
      distribution: {
        5: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        1: { type: Number, default: 0 },
      },
    },

    // Course status and visibility
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: Date,
    status: {
      type: String,
      enum: ["draft", "review", "published", "archived"],
      default: "draft",
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },

    // Course statistics
    totalDuration: {
      type: Number,
      default: 0,
      min: 0,
    },
    enrollmentCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    completionRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    viewCount: {
      type: Number,
      default: 0,
    },

    // Earnings and analytics
    revenue: {
      total: {
        type: Number,
        default: 0,
      },
      thisMonth: {
        type: Number,
        default: 0,
      },
    },

    // Course settings
    settings: {
      allowDownloads: {
        type: Boolean,
        default: false,
      },
      allowComments: {
        type: Boolean,
        default: true,
      },
      autoEnroll: {
        type: Boolean,
        default: false,
      },
      certificateEnabled: {
        type: Boolean,
        default: true,
      },
      maxStudents: {
        type: Number,
        min: 1,
      },
    },

    // SEO and marketing
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
      slug: {
        type: String,
        unique: true,
        sparse: true,
      },
    },

    // Course dates
    startDate: Date,
    endDate: Date,
    enrollmentDeadline: Date,

    // Admin fields
    moderationNotes: String,
    reportedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reason: String,
        reportedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Version control
    version: {
      type: Number,
      default: 1,
    },
    changelog: [
      {
        version: Number,
        changes: String,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for performance
courseSchema.index({ title: "text", description: "text", tags: "text" });
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ price: 1 });
courseSchema.index({ "rating.average": -1 });
courseSchema.index({ enrollmentCount: -1 });
courseSchema.index({ createdAt: -1 });
courseSchema.index({ isPublished: 1, status: 1 });
courseSchema.index({ instructor: 1, isPublished: 1 });

// Virtual for formatted price
courseSchema.virtual("formattedPrice").get(function () {
  if (this.price === 0) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: this.currency,
  }).format(this.price);
});

// Virtual for enrollment percentage
courseSchema.virtual("enrollmentPercentage").get(function () {
  if (!this.settings.maxStudents) return 0;
  return Math.round((this.enrollmentCount / this.settings.maxStudents) * 100);
});

// Virtual for course duration in hours
courseSchema.virtual("durationInHours").get(function () {
  return Math.round((this.totalDuration / 60) * 100) / 100;
});

// Pre-save middleware to calculate total duration
courseSchema.pre("save", function (next) {
  if (this.sections && this.sections.length > 0) {
    this.totalDuration = this.sections.reduce((total, section) => {
      return total + (section.duration || 0);
    }, 0);
  }

  // Generate slug if not provided
  if (this.isModified("title") && !this.seo.slug) {
    this.seo.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  // Set published date
  if (this.isModified("isPublished") && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Pre-save middleware to update rating
courseSchema.pre("save", function (next) {
  if (this.isModified("reviews")) {
    const reviews = this.reviews.filter((review) => !review.isHidden);

    if (reviews.length > 0) {
      const sum = reviews.reduce((total, review) => total + review.rating, 0);
      this.rating.average = Math.round((sum / reviews.length) * 10) / 10;
      this.rating.count = reviews.length;

      // Update distribution
      this.rating.distribution = {
        5: reviews.filter((r) => r.rating === 5).length,
        4: reviews.filter((r) => r.rating === 4).length,
        3: reviews.filter((r) => r.rating === 3).length,
        2: reviews.filter((r) => r.rating === 2).length,
        1: reviews.filter((r) => r.rating === 1).length,
      };
    }
  }
  next();
});

// Instance method to enroll a student
courseSchema.methods.enrollStudent = function (studentId) {
  const existingEnrollment = this.enrolled.find(
    (enrollment) => enrollment.student.toString() === studentId.toString(),
  );

  if (existingEnrollment) {
    throw new Error("Student is already enrolled in this course");
  }

  if (
    this.settings.maxStudents &&
    this.enrollmentCount >= this.settings.maxStudents
  ) {
    throw new Error("Course has reached maximum enrollment capacity");
  }

  this.enrolled.push({
    student: studentId,
    enrolledAt: new Date(),
    lastAccessedAt: new Date(),
  });

  this.enrollmentCount = this.enrolled.length;
  return this.save();
};

// Instance method to update student progress
courseSchema.methods.updateProgress = function (studentId, sectionId) {
  const enrollment = this.enrolled.find(
    (e) => e.student.toString() === studentId.toString(),
  );

  if (!enrollment) {
    throw new Error("Student is not enrolled in this course");
  }

  // Check if section is already completed
  const isAlreadyCompleted = enrollment.completedSections.some(
    (cs) => cs.sectionId.toString() === sectionId.toString(),
  );

  if (!isAlreadyCompleted) {
    enrollment.completedSections.push({
      sectionId,
      completedAt: new Date(),
    });

    // Calculate progress percentage
    const totalSections = this.sections.length;
    const completedSections = enrollment.completedSections.length;
    enrollment.progress = Math.round((completedSections / totalSections) * 100);

    // Check if course is completed
    if (enrollment.progress === 100 && !enrollment.certificateIssued) {
      enrollment.certificateIssued = true;
    }
  }

  enrollment.lastAccessedAt = new Date();
  return this.save();
};

// Static method to get popular courses
courseSchema.statics.getPopular = function (limit = 10) {
  return this.find({ isPublished: true })
    .sort({ enrollmentCount: -1, "rating.average": -1 })
    .limit(limit)
    .populate("instructor", "name avatar")
    .select("-reviews -enrolled");
};

// Static method to get featured courses
courseSchema.statics.getFeatured = function (limit = 6) {
  return this.find({ isPublished: true, isFeatured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("instructor", "name avatar")
    .select("-reviews -enrolled");
};

// Static method to search courses
courseSchema.statics.searchCourses = function (query, filters = {}) {
  const searchQuery = {
    isPublished: true,
    ...filters,
  };

  if (query) {
    searchQuery.$text = { $search: query };
  }

  return this.find(searchQuery)
    .populate("instructor", "name avatar")
    .select("-reviews -enrolled")
    .sort({ score: { $meta: "textScore" }, enrollmentCount: -1 });
};

// Static method to get course analytics
courseSchema.statics.getAnalytics = async function (instructorId) {
  const analytics = await this.aggregate([
    { $match: { instructor: mongoose.Types.ObjectId(instructorId) } },
    {
      $group: {
        _id: null,
        totalCourses: { $sum: 1 },
        publishedCourses: {
          $sum: { $cond: [{ $eq: ["$isPublished", true] }, 1, 0] },
        },
        totalStudents: { $sum: "$enrollmentCount" },
        totalRevenue: { $sum: "$revenue.total" },
        averageRating: { $avg: "$rating.average" },
      },
    },
  ]);

  return (
    analytics[0] || {
      totalCourses: 0,
      publishedCourses: 0,
      totalStudents: 0,
      totalRevenue: 0,
      averageRating: 0,
    }
  );
};

export default mongoose.model("Course", courseSchema);
