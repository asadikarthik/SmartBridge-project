import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/learnhub",
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    console.log("🌱 Seeding users...");

    // Delete existing users
    await User.deleteMany({});

    // Create admin user
    const adminUser = await User.create({
      name: "System Administrator",
      email: "admin@learnhub.com",
      password: "Admin123!",
      type: "admin",
      isActive: true,
    });

    // Create teacher users
    const teacher1 = await User.create({
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@learnhub.com",
      password: "Teacher123!",
      type: "teacher",
      bio: "Experienced web developer with 10+ years in the industry. Specializes in React and Node.js.",
      isActive: true,
    });

    const teacher2 = await User.create({
      name: "Prof. Michael Chen",
      email: "michael.chen@learnhub.com",
      password: "Teacher123!",
      type: "teacher",
      bio: "Data science expert and machine learning researcher. Published author of 50+ research papers.",
      isActive: true,
    });

    // Create student users
    const student1 = await User.create({
      name: "Emily Rodriguez",
      email: "emily.rodriguez@student.com",
      password: "Student123!",
      type: "student",
      isActive: true,
    });

    const student2 = await User.create({
      name: "Alex Thompson",
      email: "alex.thompson@student.com",
      password: "Student123!",
      type: "student",
      isActive: true,
    });

    console.log("✅ Users seeded successfully");
    return { adminUser, teacher1, teacher2, student1, student2 };
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
};

const seedCourses = async (users) => {
  try {
    console.log("🌱 Seeding courses...");

    // Delete existing courses
    await Course.deleteMany({});

    const { teacher1, teacher2 } = users;

    // Course 1: Web Development Fundamentals
    const course1 = await Course.create({
      title: "Web Development Fundamentals",
      description:
        "Learn the basics of web development including HTML, CSS, JavaScript, and modern frameworks. Perfect for beginners who want to start their web development journey.",
      instructor: teacher1._id,
      instructorName: teacher1.name,
      category: "Technology",
      level: "Beginner",
      price: 99.99,
      thumbnail: "💻",
      sections: [
        {
          title: "Introduction to HTML",
          content:
            "Learn the fundamentals of HTML structure and semantic elements. Understand how to create web pages with proper markup.",
          duration: 45,
          order: 1,
          isPublished: true,
        },
        {
          title: "CSS Styling and Layout",
          content:
            "Master CSS for styling and creating responsive layouts. Learn flexbox, grid, and modern CSS techniques.",
          duration: 60,
          order: 2,
          isPublished: true,
        },
        {
          title: "JavaScript Fundamentals",
          content:
            "Learn JavaScript programming and DOM manipulation. Understand variables, functions, and event handling.",
          duration: 90,
          order: 3,
          isPublished: true,
        },
        {
          title: "Building Your First Project",
          content:
            "Apply your knowledge to build a complete web application from scratch using HTML, CSS, and JavaScript.",
          duration: 75,
          order: 4,
          isPublished: true,
        },
      ],
      requirements: [
        "Basic computer skills",
        "No prior programming experience required",
        "Access to a computer with internet connection",
      ],
      objectives: [
        "Build responsive websites using HTML and CSS",
        "Create interactive web pages with JavaScript",
        "Understand modern web development best practices",
        "Complete a portfolio-ready web project",
      ],
      tags: ["html", "css", "javascript", "web development"],
      isPublished: true,
      publishedAt: new Date(),
    });

    // Course 2: Advanced React Development
    const course2 = await Course.create({
      title: "Advanced React Development",
      description:
        "Master React.js with hooks, context, and modern patterns. Build scalable applications with best practices and advanced techniques.",
      instructor: teacher1._id,
      instructorName: teacher1.name,
      category: "Technology",
      level: "Advanced",
      price: 149.99,
      thumbnail: "⚛️",
      sections: [
        {
          title: "React Hooks Deep Dive",
          content:
            "Master useState, useEffect, useContext, and custom hooks for state management.",
          duration: 80,
          order: 1,
          isPublished: true,
        },
        {
          title: "Context API and State Management",
          content:
            "Learn advanced state management patterns with Context API and external libraries.",
          duration: 90,
          order: 2,
          isPublished: true,
        },
        {
          title: "Performance Optimization",
          content:
            "Optimize React applications with memo, useMemo, useCallback, and code splitting.",
          duration: 70,
          order: 3,
          isPublished: true,
        },
        {
          title: "Testing React Applications",
          content:
            "Write comprehensive tests using Jest, React Testing Library, and Cypress.",
          duration: 85,
          order: 4,
          isPublished: true,
        },
      ],
      requirements: [
        "Solid understanding of JavaScript ES6+",
        "Basic React knowledge",
        "Experience with npm/yarn",
      ],
      objectives: [
        "Master advanced React patterns and hooks",
        "Implement complex state management solutions",
        "Optimize application performance",
        "Write comprehensive test suites",
      ],
      tags: ["react", "javascript", "hooks", "testing"],
      isPublished: true,
      publishedAt: new Date(),
    });

    // Course 3: Data Science with Python
    const course3 = await Course.create({
      title: "Data Science with Python",
      description:
        "Learn data analysis, visualization, and machine learning using Python, pandas, numpy, and scikit-learn.",
      instructor: teacher2._id,
      instructorName: teacher2.name,
      category: "Data Science",
      level: "Intermediate",
      price: 199.99,
      thumbnail: "📊",
      sections: [
        {
          title: "Python for Data Science",
          content:
            "Introduction to Python programming for data analysis with NumPy and Pandas.",
          duration: 120,
          order: 1,
          isPublished: true,
        },
        {
          title: "Data Visualization",
          content:
            "Create compelling visualizations using Matplotlib, Seaborn, and Plotly.",
          duration: 100,
          order: 2,
          isPublished: true,
        },
        {
          title: "Machine Learning Basics",
          content:
            "Introduction to machine learning algorithms using scikit-learn.",
          duration: 150,
          order: 3,
          isPublished: true,
        },
        {
          title: "Real-world Project",
          content:
            "Apply your skills to a complete data science project from data collection to deployment.",
          duration: 110,
          order: 4,
          isPublished: true,
        },
      ],
      requirements: [
        "Basic programming knowledge",
        "High school level mathematics",
        "Python installation on your computer",
      ],
      objectives: [
        "Analyze data using Python and pandas",
        "Create professional data visualizations",
        "Build and evaluate machine learning models",
        "Complete an end-to-end data science project",
      ],
      tags: ["python", "data science", "machine learning", "pandas"],
      isPublished: true,
      publishedAt: new Date(),
    });

    // Course 4: Free JavaScript Course
    const course4 = await Course.create({
      title: "JavaScript for Beginners",
      description:
        "Complete introduction to JavaScript programming. Learn variables, functions, objects, and DOM manipulation in this comprehensive free course.",
      instructor: teacher1._id,
      instructorName: teacher1.name,
      category: "Technology",
      level: "Beginner",
      price: 0,
      thumbnail: "🟨",
      sections: [
        {
          title: "Variables and Data Types",
          content:
            "Learn about JavaScript variables, data types, and basic operations.",
          duration: 40,
          order: 1,
          isPublished: true,
        },
        {
          title: "Functions and Scope",
          content:
            "Understand functions, parameters, return values, and variable scope.",
          duration: 50,
          order: 2,
          isPublished: true,
        },
        {
          title: "Objects and Arrays",
          content:
            "Work with JavaScript objects and arrays to store and manipulate data.",
          duration: 45,
          order: 3,
          isPublished: true,
        },
        {
          title: "DOM Manipulation",
          content:
            "Learn how to interact with web pages using the Document Object Model.",
          duration: 45,
          order: 4,
          isPublished: true,
        },
      ],
      requirements: [
        "Basic computer skills",
        "Web browser installed",
        "Text editor or IDE",
      ],
      objectives: [
        "Understand JavaScript fundamentals",
        "Write functions and work with objects",
        "Manipulate HTML elements with JavaScript",
        "Build interactive web pages",
      ],
      tags: ["javascript", "programming", "web development", "beginner"],
      isPublished: true,
      publishedAt: new Date(),
    });

    console.log("✅ Courses seeded successfully");
    return { course1, course2, course3, course4 };
  } catch (error) {
    console.error("❌ Error seeding courses:", error);
    throw error;
  }
};

const seedEnrollments = async (users, courses) => {
  try {
    console.log("🌱 Seeding enrollments...");

    // Delete existing enrollments
    await Enrollment.deleteMany({});

    const { student1, student2 } = users;
    const { course1, course4 } = courses;

    // Create some sample enrollments
    await Enrollment.create({
      student: student1._id,
      course: course1._id,
      progress: 65,
      completedSections: [
        { sectionId: course1.sections[0]._id, completedAt: new Date() },
        { sectionId: course1.sections[1]._id, completedAt: new Date() },
      ],
      paymentStatus: "completed",
      paymentAmount: course1.price,
      paymentDate: new Date(),
    });

    await Enrollment.create({
      student: student2._id,
      course: course4._id,
      progress: 100,
      completedSections: course4.sections.map((section) => ({
        sectionId: section._id,
        completedAt: new Date(),
      })),
      completedAt: new Date(),
      certificateIssued: true,
      certificateId: `CERT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      paymentStatus: "completed",
      paymentAmount: 0,
      paymentDate: new Date(),
    });

    console.log("✅ Enrollments seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding enrollments:", error);
    throw error;
  }
};

const runSeed = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    await connectDB();

    const users = await seedUsers();
    const courses = await seedCourses(users);
    await seedEnrollments(users, courses);

    console.log("🎉 Database seeded successfully!");
    console.log("\n📋 Login Credentials:");
    console.log("👨‍💼 Admin: admin@learnhub.com / Admin123!");
    console.log("👩‍🏫 Teacher: sarah.johnson@learnhub.com / Teacher123!");
    console.log("👨‍🏫 Teacher: michael.chen@learnhub.com / Teacher123!");
    console.log("👩‍🎓 Student: emily.rodriguez@student.com / Student123!");
    console.log("👨‍🎓 Student: alex.thompson@student.com / Student123!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

runSeed();
