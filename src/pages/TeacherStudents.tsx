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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Users,
  Search,
  Filter,
  Mail,
  Calendar,
  BookOpen,
  TrendingUp,
  Award,
  MessageSquare,
} from "lucide-react";

interface StudentData {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[];
  totalProgress: number;
  completedCourses: number;
  enrolledDate: string;
  lastActive: string;
  status: "active" | "inactive";
}

const TeacherStudents = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");

  const loadStudentData = () => {
    // Get enrollments from localStorage
    const enrollments = JSON.parse(
      localStorage.getItem("userEnrollments") || "[]",
    );

    // Create mock student data based on enrollments
    const studentMap = new Map<string, StudentData>();

    enrollments.forEach((enrollment: any) => {
      if (!studentMap.has(enrollment.student)) {
        studentMap.set(enrollment.student, {
          id: enrollment.student,
          name: `Student ${enrollment.student.slice(-4)}`,
          email: `student${enrollment.student.slice(-4)}@example.com`,
          enrolledCourses: [],
          totalProgress: 0,
          completedCourses: 0,
          enrolledDate: enrollment.enrolledAt,
          lastActive: enrollment.lastAccessedAt || enrollment.enrolledAt,
          status: Math.random() > 0.2 ? "active" : "inactive",
        });
      }

      const student = studentMap.get(enrollment.student)!;
      student.enrolledCourses.push(enrollment.course);
      student.totalProgress += enrollment.progress;
      if (enrollment.progress === 100) {
        student.completedCourses++;
      }
    });

    // Calculate average progress
    studentMap.forEach((student) => {
      if (student.enrolledCourses.length > 0) {
        student.totalProgress = Math.round(
          student.totalProgress / student.enrolledCourses.length,
        );
      }
    });

    const studentsArray = Array.from(studentMap.values());
    setStudents(studentsArray);
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.type !== "teacher") {
        navigate("/login");
        return;
      }
      setUser(parsedUser);
      loadStudentData();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    let filtered = students;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.email.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((student) => student.status === statusFilter);
    }

    // Filter by course
    if (courseFilter !== "all") {
      filtered = filtered.filter((student) =>
        student.enrolledCourses.includes(courseFilter),
      );
    }

    setFilteredStudents(filtered);
  }, [students, searchQuery, statusFilter, courseFilter]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "active").length;
  const avgProgress =
    students.length > 0
      ? Math.round(
          students.reduce((sum, s) => sum + s.totalProgress, 0) /
            students.length,
        )
      : 0;
  const totalCompletions = students.reduce(
    (sum, s) => sum + s.completedCourses,
    0,
  );

  // Get unique courses for filter
  const allCourses = Array.from(
    new Set(students.flatMap((s) => s.enrolledCourses)),
  );

  // Course mapping for display
  const courseMapping: { [key: string]: string } = {
    "course-1": "Web Development Fundamentals",
    "course-2": "Advanced React Development",
    "course-3": "JavaScript for Beginners",
    "course-4": "Digital Marketing Mastery",
    "course-5": "Data Science with Python",
    "course-6": "UX/UI Design Principles",
  };

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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Students
          </h1>
          <p className="text-muted-foreground">
            Manage and track your students' progress across all courses.
          </p>
        </div>

        {/* Stats */}
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
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                Across all courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Students
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {activeStudents}
              </div>
              <p className="text-xs text-muted-foreground">Recently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg Progress
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {avgProgress}%
              </div>
              <p className="text-xs text-muted-foreground">
                Overall completion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completions
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {totalCompletions}
              </div>
              <p className="text-xs text-muted-foreground">Courses completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter Students</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Course</label>
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {allCourses.map((courseId) => (
                      <SelectItem key={courseId} value={courseId}>
                        {courseMapping[courseId] || `Course ${courseId}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Students Overview</CardTitle>
            <CardDescription>
              Detailed view of all your students and their progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enrolled Courses</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {student.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              student.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              student.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : ""
                            }
                          >
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {student.enrolledCourses.length} courses
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {student.enrolledCourses
                                .slice(0, 2)
                                .map((courseId) => (
                                  <Badge
                                    key={courseId}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {courseMapping[courseId]?.split(" ")[0] ||
                                      "Course"}
                                  </Badge>
                                ))}
                              {student.enrolledCourses.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{student.enrolledCourses.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Overall</span>
                              <span>{student.totalProgress}%</span>
                            </div>
                            <Progress
                              value={student.totalProgress}
                              className="h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">
                              {student.completedCourses}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              completed
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {new Date(
                                  student.lastActive,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Mail className="h-3 w-3 mr-1" />
                              Message
                            </Button>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {students.length === 0
                    ? "No Students Yet"
                    : "No Matching Students"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {students.length === 0
                    ? "Students will appear here once they enroll in your courses."
                    : "Try adjusting your search criteria or filters."}
                </p>
                {students.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setCourseFilter("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherStudents;
