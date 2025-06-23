import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import PaymentModal from "@/components/PaymentModal";
import { coursesAPI, enrollmentsAPI, Course } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  Users,
  Clock,
  Star,
  BookOpen,
  Award,
  CheckCircle,
  ArrowLeft,
  ShoppingCart,
} from "lucide-react";

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
    }
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setIsLoading(true);
      setError("");

      // First try to find in teacher-created courses (real courses)
      const allCourses = JSON.parse(localStorage.getItem("allCourses") || "[]");
      let foundCourse = allCourses.find((course: any) => course._id === id);

      if (foundCourse) {
        // Use teacher-created course data directly
        const mockCourse: Course = {
          _id: foundCourse._id,
          title: foundCourse.title,
          description: foundCourse.description,
          instructor: foundCourse.instructor,
          instructorName: foundCourse.instructorName,
          category: foundCourse.category,
          level: foundCourse.level,
          price: foundCourse.price,
          thumbnail: foundCourse.thumbnail || "📚",
          sections: foundCourse.sections || [],
          enrolled: [],
          rating: foundCourse.rating || { average: 4.5, count: 0 },
          reviews: [],
          isPublished: foundCourse.isPublished,
          totalDuration:
            foundCourse.totalDuration ||
            (foundCourse.sections || []).reduce(
              (total: number, section: any) => total + (section.duration || 60),
              0,
            ),
          requirements: foundCourse.requirements || ["Basic computer skills"],
          objectives: foundCourse.objectives || ["Learn the course content"],
          tags: foundCourse.tags || [],
          language: foundCourse.language || "English",
          createdAt: foundCourse.createdAt,
          updatedAt: foundCourse.updatedAt,
        };

        setCourse(mockCourse);
      } else {
        // Fallback to mock courses for demo
        const mockCourses = {
          "course-1": {
            title: "Web Development Fundamentals",
            price: 99.99,
            instructorName: "John Doe",
            category: "Technology",
            description:
              "Learn the basics of web development including HTML, CSS, JavaScript, and modern frameworks.",
            thumbnail: "💻",
            sections: [
              {
                _id: "section-1",
                title: "Introduction to HTML",
                content: "Learn HTML fundamentals and semantic elements",
                duration: 45,
                order: 1,
                isPublished: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              {
                _id: "section-2",
                title: "CSS Styling and Layout",
                content: "Master CSS for styling and responsive layouts",
                duration: 60,
                order: 2,
                isPublished: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          },
          "course-2": {
            title: "Advanced React Development",
            price: 149.99,
            instructorName: "Sarah Wilson",
            category: "Technology",
            description: "Master advanced React concepts and modern patterns.",
            thumbnail: "⚛️",
            sections: [
              {
                _id: "section-1",
                title: "React Hooks",
                content: "Learn useState, useEffect, and custom hooks",
                duration: 75,
                order: 1,
                isPublished: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          },
          "course-3": {
            title: "JavaScript for Beginners",
            price: 0,
            instructorName: "Mike Johnson",
            category: "Technology",
            description: "Complete introduction to JavaScript programming.",
            thumbnail: "🟨",
            sections: [
              {
                _id: "section-1",
                title: "JavaScript Basics",
                content: "Learn variables, functions, and control structures",
                duration: 60,
                order: 1,
                isPublished: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          },
          "course-4": {
            title: "Digital Marketing Mastery",
            price: 79.99,
            instructorName: "Emily Chen",
            category: "Marketing",
            description: "Learn comprehensive digital marketing strategies.",
            thumbnail: "📱",
            sections: [
              {
                _id: "section-1",
                title: "SEO Fundamentals",
                content: "Learn search engine optimization basics",
                duration: 90,
                order: 1,
                isPublished: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          },
          "course-5": {
            title: "Data Science with Python",
            price: 199.99,
            instructorName: "Dr. Alex Thompson",
            category: "Data Science",
            description:
              "Learn data analysis and machine learning with Python.",
            thumbnail: "📊",
            sections: [
              {
                _id: "section-1",
                title: "Python Basics",
                content: "Learn Python fundamentals for data science",
                duration: 120,
                order: 1,
                isPublished: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          },
          "course-6": {
            title: "UX/UI Design Principles",
            price: 89.99,
            instructorName: "Lisa Rodriguez",
            category: "Design",
            description:
              "Learn user experience and interface design principles.",
            thumbnail: "🎨",
            sections: [
              {
                _id: "section-1",
                title: "Design Thinking",
                content: "Learn the design thinking process",
                duration: 75,
                order: 1,
                isPublished: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          },
        };

        const selectedCourse = mockCourses[id as keyof typeof mockCourses];

        if (selectedCourse) {
          const mockCourse: Course = {
            _id: id!,
            title: selectedCourse.title,
            description: selectedCourse.description,
            instructor: "instructor-id",
            instructorName: selectedCourse.instructorName,
            category: selectedCourse.category,
            level: "Beginner" as const,
            price: selectedCourse.price,
            thumbnail: selectedCourse.thumbnail,
            sections: selectedCourse.sections,
            enrolled: [],
            rating: { average: 4.8, count: 89 },
            reviews: [],
            isPublished: true,
            totalDuration: selectedCourse.sections.reduce(
              (total, section) => total + section.duration,
              0,
            ),
            requirements: ["Basic computer skills"],
            objectives: ["Master the fundamentals", "Build real projects"],
            tags: ["programming", "development"],
            language: "English",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          setCourse(mockCourse);
        } else {
          setError("Course not found");
        }
      }

      // Check if user is enrolled
      if (user) {
        const enrollments = JSON.parse(
          localStorage.getItem("userEnrollments") || "[]",
        );
        const userEnrollment = enrollments.find(
          (e: any) => e.course === id && e.student === user._id,
        );

        if (userEnrollment) {
          setIsEnrolled(true);
          setEnrollment(userEnrollment);
        } else {
          setIsEnrolled(false);
          setEnrollment(null);
        }
      } else {
        setIsEnrolled(false);
        setEnrollment(null);
      }
    } catch (err: any) {
      setError("Failed to load course details");
      console.error("Error fetching course:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (course?.price === 0) {
      // Free course - enroll directly
      try {
        setIsEnrolling(true);
        await enrollInCourse();
      } catch (error) {
        console.error("Enrollment error:", error);
        setError("Failed to enroll in course");
      } finally {
        setIsEnrolling(false);
      }
    } else {
      // Paid course - show payment modal
      setShowPaymentModal(true);
    }
  };

  const enrollInCourse = async () => {
    if (!course || !user) return;

    try {
      // Mock enrollment for demo mode
      const newEnrollment = {
        _id: Math.random().toString(36).substr(2, 9),
        student: user._id,
        course: course._id,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        completedSections: [],
        lastAccessedAt: new Date().toISOString(),
        paymentStatus: course.price === 0 ? "completed" : "pending",
        paymentAmount: course.price,
      };

      // Save to localStorage
      const enrollments = JSON.parse(
        localStorage.getItem("userEnrollments") || "[]",
      );
      enrollments.push(newEnrollment);
      localStorage.setItem("userEnrollments", JSON.stringify(enrollments));

      setIsEnrolled(true);
      setEnrollment(newEnrollment);
      setShowPaymentModal(false);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      throw error;
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      setIsEnrolling(true);
      await enrollInCourse();
    } catch (error) {
      console.error("Payment completion error:", error);
      setError("Failed to complete enrollment");
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading course details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => navigate("/courses")}>
                Back to Courses
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="mb-4">Course not found</p>
              <Button onClick={() => navigate("/courses")}>
                Back to Courses
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Link
          to="/courses"
          className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-6 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Courses</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="outline">{course.level}</Badge>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {course.rating.average}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({course.rating.count} reviews)
                  </span>
                </div>
              </div>

              <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">
                {course.description}
              </p>

              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{course.enrolled.length} students enrolled</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(course.totalDuration)} total</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.sections.length} sections</span>
                </div>
              </div>
            </div>

            {/* Course Content */}
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {course.sections.length} sections •{" "}
                  {formatDuration(course.totalDuration)} total length
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {course.sections.map((section, index) => (
                    <div
                      key={section._id || `section-${index}`}
                      className="flex items-center space-x-4 p-4 border rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Play className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{section.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {section.content}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {section.duration} minutes
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* What you'll learn */}
            {course.objectives && course.objectives.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>What you'll learn</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {course.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="text-3xl font-bold">
                    {course.price === 0 ? "Free" : `$${course.price}`}
                  </div>
                  {course.price > 0 && (
                    <p className="text-sm text-muted-foreground">
                      One-time payment
                    </p>
                  )}

                  {isEnrolled ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center space-x-2 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Enrolled</span>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => navigate(`/course/${course._id}/learn`)}
                      >
                        Continue Learning
                      </Button>
                      {enrollment && enrollment.progress > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{enrollment.progress}%</span>
                          </div>
                          <Progress value={enrollment.progress} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                    >
                      {isEnrolling ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Enrolling...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          {course.price === 0 ? (
                            <BookOpen className="h-4 w-4" />
                          ) : (
                            <ShoppingCart className="h-4 w-4" />
                          )}
                          <span>
                            {course.price === 0 ? "Enroll Now" : "Buy Now"}
                          </span>
                        </div>
                      )}
                    </Button>
                  )}
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Certificate of completion</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Self-paced learning</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Access to community</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {course.instructorName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{course.instructorName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {course.category} Expert
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && course && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          course={{
            id: course._id,
            title: course.title,
            price: course.price,
            instructor: course.instructorName,
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default CourseDetails;
