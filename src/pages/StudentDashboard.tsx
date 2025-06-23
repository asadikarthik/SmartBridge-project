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
import {
  BookOpen,
  Play,
  Award,
  Clock,
  TrendingUp,
  Star,
  Calendar,
  Users,
} from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.type !== "student") {
        navigate("/login");
        return;
      }
      setUser(parsedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const enrolledCourses = [
    {
      id: 1,
      title: "Web Development Fundamentals",
      instructor: "Dr. Sarah Johnson",
      progress: 65,
      totalLessons: 12,
      completedLessons: 8,
      category: "Technology",
      thumbnail: "💻",
      nextLesson: "JavaScript Functions",
      estimatedTime: "2h 30m",
    },
    {
      id: 2,
      title: "Digital Marketing Essentials",
      instructor: "Mark Wilson",
      progress: 40,
      totalLessons: 10,
      completedLessons: 4,
      category: "Marketing",
      thumbnail: "📱",
      nextLesson: "Social Media Strategy",
      estimatedTime: "1h 45m",
    },
    {
      id: 3,
      title: "Data Science with Python",
      instructor: "Prof. Lisa Chen",
      progress: 25,
      totalLessons: 15,
      completedLessons: 4,
      category: "Data Science",
      thumbnail: "📊",
      nextLesson: "Pandas DataFrames",
      estimatedTime: "3h 15m",
    },
  ];

  const achievements = [
    {
      title: "First Course Completed",
      description: "Completed your first course",
      icon: "🎓",
      date: "2 weeks ago",
    },
    {
      title: "Quick Learner",
      description: "Completed 5 lessons in one day",
      icon: "⚡",
      date: "1 week ago",
    },
    {
      title: "Consistent Learner",
      description: "Learned for 7 days straight",
      icon: "🔥",
      date: "3 days ago",
    },
  ];

  const upcomingEvents = [
    {
      title: "Live Q&A Session",
      course: "Web Development Fundamentals",
      time: "Today, 3:00 PM",
      type: "Live Session",
    },
    {
      title: "Assignment Due",
      course: "Digital Marketing Essentials",
      time: "Tomorrow, 11:59 PM",
      type: "Assignment",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey and achieve your goals.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Enrolled Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                +1 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Completed Lessons
                </CardTitle>
                <Play className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">16</div>
              <p className="text-xs text-muted-foreground">+4 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Certificates Earned
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                +1 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Study Hours
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24h</div>
              <p className="text-xs text-muted-foreground">
                +6h from last week
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Continue Learning</span>
                </CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="text-3xl">{course.thumbnail}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{course.title}</h3>
                          <Badge variant="outline">{course.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          by {course.instructor}
                        </p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>
                              {course.completedLessons} of {course.totalLessons}{" "}
                              lessons
                            </span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Next: {course.nextLesson} • {course.estimatedTime}{" "}
                          remaining
                        </p>
                      </div>
                      <Button
                        onClick={() => navigate(`/course/${course.id}/learn`)}
                      >
                        Continue
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Recent Achievements</span>
                </CardTitle>
                <CardDescription>Your learning milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-3 border rounded-lg"
                    >
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {achievement.date}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Upcoming</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{event.title}</h4>
                        <Badge
                          variant={
                            event.type === "Live Session"
                              ? "default"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {event.course}
                      </p>
                      <p className="text-xs text-primary font-medium">
                        {event.time}
                      </p>
                      {index < upcomingEvents.length - 1 && (
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
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/courses")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Browse All Courses
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/student/certificates")}
                >
                  <Award className="mr-2 h-4 w-4" />
                  View Certificates
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/student/profile")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Learning Streak */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🔥</span>
                  <span>Learning Streak</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">7</div>
                  <p className="text-sm text-muted-foreground">Days in a row</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Keep it up! You're doing great! 🎉
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
