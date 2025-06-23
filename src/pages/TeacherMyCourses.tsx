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
  Edit,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Copy,
  Trash2,
} from "lucide-react";

const TeacherMyCourses = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.type !== "teacher") {
        navigate("/login");
        return;
      }
      setUser(parsedUser);
      loadTeacherCourses(parsedUser._id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    let filtered = courses;

    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      const isPublished = statusFilter === "published";
      filtered = filtered.filter(
        (course) => course.isPublished === isPublished,
      );
    }

    setFilteredCourses(filtered);
  }, [courses, searchQuery, statusFilter]);

  const loadTeacherCourses = (teacherId: string) => {
    const teacherCourses = JSON.parse(
      localStorage.getItem(`teacherCourses_${teacherId}`) || "[]",
    );

    const coursesWithStats = teacherCourses.map((course: any) => ({
      ...course,
      id: course._id,
      students: Math.floor(Math.random() * 100) + 10,
      earnings: course.price * Math.floor(Math.random() * 50 + 10),
      status: course.isPublished ? "Published" : "Draft",
      lastUpdated: new Date(course.updatedAt).toLocaleDateString(),
    }));

    setCourses(coursesWithStats);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleDeleteCourse = (courseId: string, courseTitle: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`,
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
    const teacherCourses = JSON.parse(
      localStorage.getItem(`teacherCourses_${user._id}`) || "[]",
    );

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

    loadTeacherCourses(user._id);
  };

  const handleDuplicateCourse = (courseId: string) => {
    const teacherCourses = JSON.parse(
      localStorage.getItem(`teacherCourses_${user._id}`) || "[]",
    );

    const originalCourse = teacherCourses.find(
      (course: any) => course._id === courseId,
    );
    if (originalCourse) {
      const duplicatedCourse = {
        ...originalCourse,
        _id: `course-${Date.now()}`,
        title: `${originalCourse.title} (Copy)`,
        isPublished: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedTeacherCourses = [...teacherCourses, duplicatedCourse];
      localStorage.setItem(
        `teacherCourses_${user._id}`,
        JSON.stringify(updatedTeacherCourses),
      );

      loadTeacherCourses(user._id);
      alert("Course duplicated successfully!");
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.isPublished).length;
  const draftCourses = courses.filter((c) => !c.isPublished).length;
  const totalEarnings = courses.reduce((sum, c) => sum + (c.earnings || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/teacher/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                My Courses
              </h1>
              <p className="text-muted-foreground">
                Manage and monitor your courses, track performance, and engage
                with students.
              </p>
            </div>
            <Button
              onClick={() => navigate("/teacher/create-course")}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Create Course</span>
            </Button>
          </div>
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
              <p className="text-xs text-muted-foreground">Total courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Published
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {publishedCourses}
              </div>
              <p className="text-xs text-muted-foreground">Live courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Drafts
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {draftCourses}
              </div>
              <p className="text-xs text-muted-foreground">
                Unpublished courses
              </p>
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
              <div className="text-2xl font-bold text-primary">
                ${totalEarnings.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Revenue earned</p>
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
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
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
                key={course._id}
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
                              course.isPublished ? "default" : "secondary"
                            }
                            className={
                              course.isPublished
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            }
                          >
                            {course.status}
                          </Badge>
                        </div>

                        <p className="text-muted-foreground line-clamp-2">
                          {course.description}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <Badge variant="outline">{course.category}</Badge>
                          <Badge variant="outline">{course.level}</Badge>
                          <span className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{course.students} students</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3" />
                            <span>${course.price || "Free"}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{course.totalDuration || 0} min</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <p>Last updated: {course.lastUpdated}</p>
                          <p>
                            Earnings: ${course.earnings?.toLocaleString() || 0}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTogglePublish(course._id)}
                          >
                            {course.isPublished ? "Unpublish" : "Publish"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/course/${course._id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              navigate(`/teacher/courses/${course._id}/edit`)
                            }
                            className="flex items-center space-x-1"
                          >
                            <Edit className="h-4 w-4" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDuplicateCourse(course._id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleDeleteCourse(course._id, course.title)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
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
                  {courses.length === 0
                    ? "No Courses Yet"
                    : "No Matching Courses"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {courses.length === 0
                    ? "Create your first course to start teaching and sharing your knowledge."
                    : "Try adjusting your search criteria or filters."}
                </p>
                <div className="space-x-2">
                  {courses.length === 0 ? (
                    <Button onClick={() => navigate("/teacher/create-course")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create First Course
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

export default TeacherMyCourses;
