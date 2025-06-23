import { body, param, query, validationResult } from "express-validator";

// Handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

// User validation rules
export const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),

  body("type")
    .isIn(["student", "teacher", "admin"])
    .withMessage("User type must be student, teacher, or admin"),

  handleValidationErrors,
];

export const validateUserLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

export const validateUserUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("bio")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  handleValidationErrors,
];

// Course validation rules
export const validateCourseCreation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Course title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Course title must be between 3 and 200 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Course description is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Course description must be between 10 and 2000 characters"),

  body("category")
    .isIn([
      "Technology",
      "Business",
      "Design",
      "Marketing",
      "Development",
      "Data Science",
      "Photography",
      "Music",
      "Language",
      "Health",
      "Lifestyle",
      "Other",
    ])
    .withMessage("Please select a valid category"),

  body("level")
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Course level must be Beginner, Intermediate, or Advanced"),

  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price cannot be negative"),

  body("sections")
    .optional()
    .isArray()
    .withMessage("Sections must be an array"),

  body("sections.*.title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Section title is required")
    .isLength({ max: 200 })
    .withMessage("Section title cannot exceed 200 characters"),

  body("sections.*.content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Section content is required"),

  body("sections.*.duration")
    .optional()
    .isNumeric()
    .withMessage("Section duration must be a number")
    .isFloat({ min: 0 })
    .withMessage("Section duration cannot be negative"),

  handleValidationErrors,
];

export const validateCourseUpdate = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Course title must be between 3 and 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Course description must be between 10 and 2000 characters"),

  body("category")
    .optional()
    .isIn([
      "Technology",
      "Business",
      "Design",
      "Marketing",
      "Development",
      "Data Science",
      "Photography",
      "Music",
      "Language",
      "Health",
      "Lifestyle",
      "Other",
    ])
    .withMessage("Please select a valid category"),

  body("level")
    .optional()
    .isIn(["Beginner", "Intermediate", "Advanced"])
    .withMessage("Course level must be Beginner, Intermediate, or Advanced"),

  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price cannot be negative"),

  handleValidationErrors,
];

// MongoDB ObjectId validation
export const validateObjectId = (paramName = "id") => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName} format`),

  handleValidationErrors,
];

// Pagination validation
export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  handleValidationErrors,
];

// Course enrollment validation
export const validateEnrollment = [
  body("courseId").isMongoId().withMessage("Invalid course ID format"),

  handleValidationErrors,
];

// Review validation
export const validateReview = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("comment")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Review comment cannot exceed 500 characters"),

  handleValidationErrors,
];

// Section progress validation
export const validateSectionProgress = [
  body("sectionId").isMongoId().withMessage("Invalid section ID format"),

  handleValidationErrors,
];
