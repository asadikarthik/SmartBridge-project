import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import CertificateGenerator from "@/components/CertificateGenerator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  CheckCircle,
  Clock,
  ArrowLeft,
  Award,
  BookOpen,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

interface Section {
  _id: string;
  title: string;
  content: string;
  duration: number;
  order: number;
  isCompleted?: boolean;
}

interface CourseData {
  _id: string;
  title: string;
  instructorName: string;
  sections: Section[];
  totalDuration: number;
}

const CourseLearning = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [course, setCourse] = useState<CourseData | null>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      fetchCourseData();
    }
  }, [id, user]);

  const fetchCourseData = () => {
    // Mock course data
    const courseData = {
      "course-1": {
        title: "Web Development Fundamentals",
        instructorName: "John Doe",
      },
      "course-2": {
        title: "Advanced React Development",
        instructorName: "Sarah Wilson",
      },
      "course-3": {
        title: "JavaScript for Beginners",
        instructorName: "Mike Johnson",
      },
      "course-4": {
        title: "Digital Marketing Mastery",
        instructorName: "Emily Chen",
      },
      "course-5": {
        title: "Data Science with Python",
        instructorName: "Dr. Alex Thompson",
      },
      "course-6": {
        title: "UX/UI Design Principles",
        instructorName: "Lisa Rodriguez",
      },
    };

    const selectedCourse =
      courseData[id as keyof typeof courseData] || courseData["course-1"];

    const mockCourse: CourseData = {
      _id: id!,
      title: selectedCourse.title,
      instructorName: selectedCourse.instructorName,
      totalDuration: 270,
      sections: [
        {
          _id: "section-1",
          title: "Introduction and Setup",
          content: `
            <h3>Welcome to ${selectedCourse.title}!</h3>
            <p>In this section, you'll learn the fundamentals and set up your development environment.</p>
            
            <h4>What you'll learn:</h4>
            <ul>
              <li>Overview of the course structure</li>
              <li>Setting up your development environment</li>
              <li>Installing necessary tools and software</li>
              <li>Understanding the basics</li>
            </ul>

            <h4>Video Content:</h4>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>🎥 Video:</strong> Course Introduction (15 minutes)</p>
              <p><strong>📋 Exercise:</strong> Environment Setup Checklist</p>
              <p><strong>📖 Reading:</strong> Course Prerequisites</p>
            </div>

            <p>Take your time to understand these concepts before moving to the next section.</p>
          `,
          duration: 45,
          order: 1,
        },
        {
          _id: "section-2",
          title: "Core Concepts",
          content: `
            <h3>Understanding Core Concepts</h3>
            <p>This section covers the fundamental concepts you need to master.</p>
            
            <h4>Key Topics:</h4>
            <ul>
              <li>Basic principles and methodologies</li>
              <li>Industry best practices</li>
              <li>Common patterns and approaches</li>
              <li>Tools and techniques</li>
            </ul>

            <h4>Interactive Content:</h4>
            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>🎥 Video:</strong> Core Concepts Explained (25 minutes)</p>
              <p><strong>💻 Lab:</strong> Hands-on Practice Exercise</p>
              <p><strong>📝 Quiz:</strong> Test Your Understanding</p>
            </div>

            <h4>Additional Resources:</h4>
            <p>Check out the supplementary materials in the resources section for deeper understanding.</p>
          `,
          duration: 60,
          order: 2,
        },
        {
          _id: "section-3",
          title: "Advanced Techniques",
          content: `
            <h3>Advanced Techniques and Implementation</h3>
            <p>Now that you understand the basics, let's dive into more advanced topics.</p>
            
            <h4>Advanced Topics:</h4>
            <ul>
              <li>Advanced methodologies and frameworks</li>
              <li>Performance optimization</li>
              <li>Scalability considerations</li>
              <li>Real-world applications</li>
            </ul>

            <h4>Practical Applications:</h4>
            <div style="background: #f3e5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>🎥 Video:</strong> Advanced Implementation (30 minutes)</p>
              <p><strong>🔨 Project:</strong> Build a Real Application</p>
              <p><strong>👥 Discussion:</strong> Community Forum</p>
            </div>

            <p>This section will challenge you to apply what you've learned in practical scenarios.</p>
          `,
          duration: 90,
          order: 3,
        },
        {
          _id: "section-4",
          title: "Final Project and Assessment",
          content: `
            <h3>Capstone Project</h3>
            <p>Put everything together in this comprehensive final project.</p>
            
            <h4>Project Requirements:</h4>
            <ul>
              <li>Apply all concepts learned throughout the course</li>
              <li>Create a complete, functional solution</li>
              <li>Document your process and decisions</li>
              <li>Present your final work</li>
            </ul>

            <h4>Assessment:</h4>
            <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>🎯 Project:</strong> Final Capstone (45 minutes)</p>
              <p><strong>📊 Assessment:</strong> Peer Review</p>
              <p><strong>🏆 Certificate:</strong> Course Completion Certificate</p>
            </div>

            <p>Congratulations on reaching the final section! Complete this project to earn your certificate.</p>
          `,
          duration: 75,
          order: 4,
        },
      ],
    };

    // Get enrollment data
    const enrollments = JSON.parse(
      localStorage.getItem("userEnrollments") || "[]",
    );
    const userEnrollment = enrollments.find(
      (e: any) => e.course === id && e.student === user?._id,
    );

    if (userEnrollment) {
      // Mark completed sections
      const sectionsWithProgress = mockCourse.sections.map((section) => ({
        ...section,
        isCompleted: userEnrollment.completedSections.some(
          (cs: any) => cs.sectionId === section._id,
        ),
      }));

      setCourse({ ...mockCourse, sections: sectionsWithProgress });
      setEnrollment(userEnrollment);
      setProgress(userEnrollment.progress);

      // Check if course is completed
      if (userEnrollment.progress === 100) {
        setShowCertificate(true);
      }
    } else {
      // Not enrolled
      navigate(`/course/${id}`);
      return;
    }

    setIsLoading(false);
  };

  const handleCompleteSection = (sectionId: string) => {
    if (!enrollment || !course) return;

    // Update enrollment data
    const updatedCompletedSections = [
      ...enrollment.completedSections.filter(
        (cs: any) => cs.sectionId !== sectionId,
      ),
      {
        sectionId,
        completedAt: new Date().toISOString(),
      },
    ];

    const newProgress = Math.round(
      (updatedCompletedSections.length / course.sections.length) * 100,
    );

    const updatedEnrollment = {
      ...enrollment,
      completedSections: updatedCompletedSections,
      progress: newProgress,
      lastAccessedAt: new Date().toISOString(),
      ...(newProgress === 100 && { completedAt: new Date().toISOString() }),
    };

    // Update localStorage
    const enrollments = JSON.parse(
      localStorage.getItem("userEnrollments") || "[]",
    );
    const updatedEnrollments = enrollments.map((e: any) =>
      e._id === enrollment._id ? updatedEnrollment : e,
    );
    localStorage.setItem("userEnrollments", JSON.stringify(updatedEnrollments));

    // Update state
    setEnrollment(updatedEnrollment);
    setProgress(newProgress);

    // Update course sections
    const updatedSections = course.sections.map((section) => ({
      ...section,
      isCompleted: updatedCompletedSections.some(
        (cs: any) => cs.sectionId === section._id,
      ),
    }));
    setCourse({ ...course, sections: updatedSections });

    // Show certificate if course completed
    if (newProgress === 100) {
      setShowCertificate(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={handleLogout} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
            <Button onClick={() => navigate("/courses")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentSectionData = course.sections[currentSection];
  const isLastSection = currentSection === course.sections.length - 1;
  const isFirstSection = currentSection === 0;

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(`/course/${course._id}`)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course Details
          </Button>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <span>Instructor: {course.instructorName}</span>
              <span>•</span>
              <span>{course.sections.length} sections</span>
              <span>•</span>
              <span>{Math.floor(course.totalDuration / 60)}h total</span>
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Course Progress</span>
                <span>{progress}% completed</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>

        {showCertificate ? (
          /* Certificate View */
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Award className="h-16 w-16 text-yellow-500" />
              </div>
              <CardTitle className="text-2xl text-green-600">
                Congratulations! 🎉
              </CardTitle>
              <CardDescription>
                You have successfully completed "{course.title}"
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CertificateGenerator
                certificate={{
                  studentName: user?.name || "Student",
                  courseName: course.title,
                  instructorName: course.instructorName,
                  completionDate:
                    enrollment?.completedAt || new Date().toISOString(),
                  certificateId: `CERT-${course._id.toUpperCase()}-${Date.now()}`,
                  grade: "A+",
                }}
                className="mb-8"
              />

              <div className="text-center space-y-4">
                <Button onClick={() => navigate("/student/certificates")}>
                  View All Certificates
                </Button>
                <Button variant="outline" onClick={() => navigate("/courses")}>
                  Browse More Courses
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Course Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center space-x-2">
                        <span>Section {currentSection + 1}:</span>
                        <span>{currentSectionData.title}</span>
                        {currentSectionData.isCompleted && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{currentSectionData.duration} minutes</span>
                      </div>
                    </div>

                    {!currentSectionData.isCompleted && (
                      <Button
                        onClick={() =>
                          handleCompleteSection(currentSectionData._id)
                        }
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: currentSectionData.content,
                    }}
                  />
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentSection(currentSection - 1)}
                  disabled={isFirstSection}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous Section
                </Button>

                <Button
                  onClick={() => setCurrentSection(currentSection + 1)}
                  disabled={isLastSection}
                >
                  Next Section
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        {progress}%
                      </div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                    </div>
                    <Progress value={progress} />
                    <p className="text-sm text-muted-foreground">
                      {course.sections.filter((s) => s.isCompleted).length} of{" "}
                      {course.sections.length} sections completed
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Section List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {course.sections.map((section, index) => (
                      <div
                        key={section._id}
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                          index === currentSection
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setCurrentSection(index)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {section.isCompleted ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              {section.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {section.duration} min
                            </p>
                          </div>
                        </div>
                        {index === currentSection && (
                          <Play className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseLearning;
