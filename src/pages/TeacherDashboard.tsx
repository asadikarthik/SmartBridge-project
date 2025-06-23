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
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  BarChart3,
  Star,
  Calendar,
  MessageSquare,
} from "lucide-react";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [myCourses, setMyCourses] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.type !== "teacher") {
        navigate("/login");
        return;
      }
      setUser(parsedUser);

      // Load teacher's courses directly in useEffect to avoid infinite loop
      const teacherCourses = JSON.parse(
        localStorage.getItem(`teacherCourses_${parsedUser._id}`) || "[]",
      );

      // Convert to display format with additional stats
      const coursesWithStats = teacherCourses.map(
        (course: any, index: number) => {
          // Use course ID to generate consistent random values
          const seed = course._id ? course._id.slice(-2) : index.toString();
          const seedNum = parseInt(seed, 16) || index;

          return {
            id: course._id,
            title: course.title,
            students: Math.floor((seedNum % 90) + 10), // Consistent student count based on course ID
            rating: course.rating?.average || 0,
            earnings: Math.floor((seedNum % 1900) + 100), // Consistent earnings based on course ID
            status: course.isPublished ? "Published" : "Draft",
            lastUpdated: new Date(course.updatedAt).toLocaleDateString(),
            thumbnail: course.thumbnail || "📚",
            category: course.category,
            description: course.description,
            price: course.price,
            level: course.level,
          };
        },
      );

      setMyCourses(coursesWithStats);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const loadTeacherCourses = (teacherId: string) => {
    try {
      // Load teacher's courses from localStorage
      const teacherCourses = JSON.parse(
        localStorage.getItem(`teacherCourses_${teacherId}`) || "[]",
      );

      // Convert to display format with additional stats
      const coursesWithStats = teacherCourses.map(
        (course: any, index: number) => {
          // Use course ID to generate consistent random values
          const seed = course._id ? course._id.slice(-2) : index.toString();
          const seedNum = parseInt(seed, 16) || index;

          return {
            id: course._id,
            title: course.title,
            students: Math.floor((seedNum % 90) + 10), // Consistent student count based on course ID
            rating: course.rating?.average || 0,
            earnings: Math.floor((seedNum % 1900) + 100), // Consistent earnings based on course ID
            status: course.isPublished ? "Published" : "Draft",
            lastUpdated: new Date(course.updatedAt).toLocaleDateString(),
            thumbnail: course.thumbnail || "📚",
            category: course.category,
            description: course.description,
            price: course.price,
            level: course.level,
          };
        },
      );

      // Only update if courses have actually changed
      setMyCourses((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(coursesWithStats)) {
          return coursesWithStats;
        }
        return prev;
      });
    } catch (error) {
      console.error("Error loading teacher courses:", error);
      setMyCourses([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleDeleteCourse = (courseId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone.",
      )
    ) {
      // Remove from teacher's courses
      const teacherCourses = JSON.parse(
        localStorage.getItem(`teacherCourses_${user._id}`) || "[]",
      );
      const updatedTeacherCourses = teacherCourses.filter(
        (course: any) => course._id !== courseId,
      );
      localStorage.setItem(
        `teacherCourses_${user._id}`,
        JSON.stringify(updatedTeacherCourses),
      );

      // Remove from global courses
      const allCourses = JSON.parse(localStorage.getItem("allCourses") || "[]");
      const updatedAllCourses = allCourses.filter(
        (course: any) => course._id !== courseId,
      );
      localStorage.setItem("allCourses", JSON.stringify(updatedAllCourses));

      // Reload courses
      loadTeacherCourses(user._id);
    }
  };

  const handleTogglePublish = (courseId: string) => {
    // Get teacher's courses
    const teacherCourses = JSON.parse(
      localStorage.getItem(`teacherCourses_${user._id}`) || "[]",
    );

    // Toggle published status
    const updatedTeacherCourses = teacherCourses.map((course: any) =>
      course._id === courseId
        ? {
            ...course,
            isPublished: !course.isPublished,
            updatedAt: new Date().toISOString(),
          }
        : course,
    );
    localStorage.setItem(
      `teacherCourses_${user._id}`,
      JSON.stringify(updatedTeacherCourses),
    );

    // Update global courses
    const allCourses = JSON.parse(localStorage.getItem("allCourses") || "[]");
    const updatedAllCourses = allCourses.map((course: any) =>
      course._id === courseId
        ? {
            ...course,
            isPublished: !course.isPublished,
            updatedAt: new Date().toISOString(),
          }
        : course,
    );
    localStorage.setItem("allCourses", JSON.stringify(updatedAllCourses));

    // Reload courses
    loadTeacherCourses(user._id);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const recentActivity = [
    {
      type: "enrollment",
      message: "New student enrolled in Web Development Fundamentals",
      time: "2 hours ago",
      icon: Users,
    },
    {
      type: "review",
      message: "Sarah M. left a 5-star review on Advanced React Patterns",
      time: "5 hours ago",
      icon: Star,
    },
    {
      type: "question",
      message: "New question posted in JavaScript for Beginners",
      time: "1 day ago",
      icon: MessageSquare,
    },
    {
      type: "payment",
      message: "You earned $89 from course sales",
      time: "2 days ago",
      icon: DollarSign,
    },
  ];

  const upcomingTasks = [
    {
      title: "Review Assignment Submissions",
      course: "Web Development Fundamentals",
      deadline: "Today, 5:00 PM",
      priority: "high",
    },
    {
      title: "Update Course Content",
      course: "Advanced React Patterns",
      deadline: "Tomorrow",
      priority: "medium",
    },
    {
      title: "Respond to Student Questions",
      course: "JavaScript for Beginners",
      deadline: "This Week",
      priority: "low",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.name}! 👨‍🏫
          </h1>
          <p className="text-muted-foreground">
            Manage your courses and help students achieve their goals.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Students
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">146</div>
              <p className="text-xs text-muted-foreground">
                +12 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">2 published</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Earnings
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4,340</div>
              <p className="text-xs text-muted-foreground">
                +$890 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg. Rating
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.85</div>
              <p className="text-xs text-muted-foreground">
                Based on 89 reviews
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* My Courses */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>My Courses</span>
                    </CardTitle>
                    <CardDescription>
                      Manage and monitor your courses
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => navigate("/teacher/courses/new")}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Course</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{course.thumbnail}</div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{course.title}</h3>
                            <Badge
                              variant={
                                course.status === "Published"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {course.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{course.students} students</span>
                            </span>
                            {course.rating > 0 && (
                              <span className="flex items-center space-x-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{course.rating}</span>
                              </span>
                            )}
                            <span className="flex items-center space-x-1">
                              <DollarSign className="h-3 w-3" />
                              <span>${course.earnings}</span>
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Updated {course.lastUpdated}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePublish(course.id)}
                          title={
                            course.status === "Published"
                              ? "Unpublish Course"
                              : "Publish Course"
                          }
                        >
                          {course.status === "Published" ? "📤" : "📥"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/course/${course.id}`)}
                          title="View Course"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(`/teacher/courses/${course.id}/edit`)
                          }
                          title="Edit Course"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteCourse(course.id)}
                          title="Delete Course"
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Latest updates from your courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 border rounded-lg"
                    >
                      <div className="p-2 bg-primary/10 rounded-full">
                        <activity.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Upcoming Tasks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{task.title}</h4>
                        <Badge
                          variant={
                            task.priority === "high"
                              ? "destructive"
                              : task.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {task.course}
                      </p>
                      <p className="text-xs text-primary font-medium">
                        Due: {task.deadline}
                      </p>
                      {index < upcomingTasks.length - 1 && (
                        <div className="border-b" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  onClick={() => navigate("/teacher/courses/new")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Course
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/teacher/students")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Students
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/teacher/earnings")}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  View Earnings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/forums")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Discussion Forums
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/webinars")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Live Webinars
                </Button>
              </CardContent>
            </Card>

            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>This Month</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    New Enrollments
                  </span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Course Completions
                  </span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Revenue</span>
                  <span className="font-semibold text-green-600">$890</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Avg. Rating
                  </span>
                  <span className="font-semibold">4.9 ⭐</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
