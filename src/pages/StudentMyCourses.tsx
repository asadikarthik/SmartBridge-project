import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Play,
  Clock,
  Calendar,
  Award,
  ArrowLeft,
  Filter,
  Search,
} from "lucide-react";

const StudentMyCourses = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.type !== "student") {
        navigate("/login");
        return;
      }
      setUser(parsedUser);
      loadEnrolledCourses(parsedUser._id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    let filtered = enrolledCourses;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((course) => course.status === statusFilter);
    }

    setFilteredCourses(filtered);
  }, [enrolledCourses, searchQuery, statusFilter]);

  const loadEnrolledCourses = (userId: string) => {
    // Get enrollments from localStorage
    const enrollments = JSON.parse(
      localStorage.getItem("userEnrollments") || "[]",
    );
    const userEnrollments = enrollments.filter(
      (e: any) => e.student === userId,
    );

    // Course mapping for display
    const courseMapping: {
      [key: string]: {
        title: string;
        instructor: string;
        thumbnail: string;
        category: string;
        level: string;
        totalLessons: number;
      };
    } = {
      "course-1": {
        title: "Web Development Fundamentals",
        instructor: "John Doe",
        thumbnail: "💻",
        category: "Technology",
        level: "Beginner",
        totalLessons: 4,
      },
      "course-2": {
        title: "Advanced React Development",
        instructor: "Sarah Wilson",
        thumbnail: "⚛️",
        category: "Technology",
        level: "Advanced",
        totalLessons: 6,
      },
      "course-3": {
        title: "JavaScript for Beginners",
        instructor: "Mike Johnson",
        thumbnail: "🟨",
        category: "Technology",
        level: "Beginner",
        totalLessons: 4,
      },
      "course-4": {
        title: "Digital Marketing Mastery",
        instructor: "Emily Chen",
        thumbnail: "📱",
        category: "Marketing",
        level: "Intermediate",
        totalLessons: 5,
      },
      "course-5": {
        title: "Data Science with Python",
        instructor: "Dr. Alex Thompson",
        thumbnail: "📊",
        category: "Data Science",
        level: "Intermediate",
        totalLessons: 8,
      },
      "course-6": {
        title: "UX/UI Design Principles",
        instructor: "Lisa Rodriguez",
        thumbnail: "🎨",
        category: "Design",
        level: "Beginner",
        totalLessons: 6,
      },
    };

    const coursesWithDetails = userEnrollments.map(
      (enrollment: any, index: number) => {
        const courseInfo = courseMapping[enrollment.course] || {
          title: "Unknown Course",
          instructor: "Unknown Instructor",
          thumbnail: "📚",
          category: "General",
          level: "Beginner",
          totalLessons: 4,
        };

        return {
          id: index + 1,
          courseId: enrollment.course,
          title: courseInfo.title,
          instructor: courseInfo.instructor,
          thumbnail: courseInfo.thumbnail,
          progress: enrollment.progress,
          totalLessons: courseInfo.totalLessons,
          completedLessons: enrollment.completedSections?.length || 0,
          category: courseInfo.category,
          level: courseInfo.level,
          enrolledAt: enrollment.enrolledAt,
          lastAccessed: enrollment.lastAccessedAt,
          status:
            enrollment.progress === 100
              ? "completed"
              : enrollment.progress > 0
                ? "in-progress"
                : "not-started",
          enrollmentId: enrollment._id,
        };
      },
    );

    setEnrolledCourses(coursesWithDetails);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(
    (c) => c.status === "completed",
  ).length;
  const inProgressCourses = enrolledCourses.filter(
    (c) => c.status === "in-progress",
  ).length;
  const avgProgress =
    totalCourses > 0
      ? Math.round(
          enrolledCourses.reduce((sum, c) => sum + c.progress, 0) /
            totalCourses,
        )
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/student/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Learning
          </h1>
          <p className="text-muted-foreground">
            Track your progress and continue your learning journey.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground">Enrolled courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {completedCourses}
              </div>
              <p className="text-xs text-muted-foreground">Courses completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  In Progress
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {inProgressCourses}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently learning
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Progress
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {avgProgress}%
              </div>
              <p className="text-xs text-muted-foreground">Overall progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter Courses</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course List */}
        <div className="space-y-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Course Thumbnail */}
                    <div className="text-4xl">{course.thumbnail}</div>

                    {/* Course Info */}
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold">
                            {course.title}
                          </h3>
                          <Badge
                            variant={
                              course.status === "completed"
                                ? "default"
                                : course.status === "in-progress"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={
                              course.status === "completed"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : course.status === "in-progress"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : ""
                            }
                          >
                            {course.status === "completed"
                              ? "Completed"
                              : course.status === "in-progress"
                                ? "In Progress"
                                : "Not Started"}
                          </Badge>
                        </div>

                        <p className="text-muted-foreground">
                          Instructor: {course.instructor}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <Badge variant="outline">{course.category}</Badge>
                          <Badge variant="outline">{course.level}</Badge>
                          <span>
                            {course.completedLessons} of {course.totalLessons}{" "}
                            lessons
                          </span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <p>
                            Enrolled:{" "}
                            {new Date(course.enrolledAt).toLocaleDateString()}
                          </p>
                          <p>
                            Last accessed:{" "}
                            {new Date(course.lastAccessed).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/course/${course.courseId}`)
                            }
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            className="flex items-center space-x-1"
                            onClick={() =>
                              navigate(`/course/${course.courseId}/learn`)
                            }
                          >
                            <Play className="h-4 w-4" />
                            <span>
                              {course.status === "completed"
                                ? "Review"
                                : course.status === "in-progress"
                                  ? "Continue"
                                  : "Start"}
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {enrolledCourses.length === 0
                    ? "No Enrolled Courses"
                    : "No Matching Courses"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {enrolledCourses.length === 0
                    ? "Start your learning journey by enrolling in a course."
                    : "Try adjusting your search criteria or filters."}
                </p>
                <div className="space-x-2">
                  {enrolledCourses.length === 0 ? (
                    <Button onClick={() => navigate("/courses")}>
                      Browse Courses
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentMyCourses;
