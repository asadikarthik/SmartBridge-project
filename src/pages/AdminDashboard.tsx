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
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Shield,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Settings,
  Database,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.type !== "admin") {
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

  const platformStats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12%",
      icon: Users,
      breakdown: "1,892 Students, 734 Teachers, 221 Admins",
    },
    {
      title: "Active Courses",
      value: "156",
      change: "+8%",
      icon: BookOpen,
      breakdown: "89 Published, 34 Draft, 33 Under Review",
    },
    {
      title: "Platform Revenue",
      value: "$47,382",
      change: "+23%",
      icon: DollarSign,
      breakdown: "This month's earnings",
    },
    {
      title: "Completion Rate",
      value: "87%",
      change: "+5%",
      icon: TrendingUp,
      breakdown: "Average course completion",
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      type: "teacher",
      joinDate: "2 hours ago",
      status: "active",
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike.chen@example.com",
      type: "student",
      joinDate: "5 hours ago",
      status: "active",
    },
    {
      id: 3,
      name: "Emma Wilson",
      email: "emma.wilson@example.com",
      type: "student",
      joinDate: "1 day ago",
      status: "pending",
    },
    {
      id: 4,
      name: "David Rodriguez",
      email: "david.rodriguez@example.com",
      type: "teacher",
      joinDate: "2 days ago",
      status: "active",
    },
  ];

  const pendingCourses = [
    {
      id: 1,
      title: "Machine Learning Basics",
      instructor: "Dr. Alex Thompson",
      submittedDate: "2 days ago",
      category: "Data Science",
      status: "pending",
    },
    {
      id: 2,
      title: "Digital Photography Masterclass",
      instructor: "Lisa Parker",
      submittedDate: "3 days ago",
      category: "Photography",
      status: "under_review",
    },
    {
      id: 3,
      title: "iOS App Development",
      instructor: "John Smith",
      submittedDate: "1 week ago",
      category: "Mobile Development",
      status: "pending",
    },
  ];

  const systemAlerts = [
    {
      type: "warning",
      message: "Server disk usage at 85%",
      time: "30 minutes ago",
      severity: "medium",
    },
    {
      type: "info",
      message: "Scheduled maintenance in 24 hours",
      time: "2 hours ago",
      severity: "low",
    },
    {
      type: "error",
      message: "Payment gateway timeout errors",
      time: "4 hours ago",
      severity: "high",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "under_review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getRoleColor = (type: string) => {
    switch (type) {
      case "student":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "teacher":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "admin":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Admin Dashboard 🛡️
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage the entire EduHub platform.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {platformStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-green-600">{stat.change}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.breakdown}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Users */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Recent Users</span>
                    </CardTitle>
                    <CardDescription>Latest user registrations</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/admin/users")}
                  >
                    View All Users
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Joined {user.joinDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getRoleColor(user.type)}>
                          {user.type.charAt(0).toUpperCase() +
                            user.type.slice(1)}
                        </Badge>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pending Courses */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>Pending Course Reviews</span>
                    </CardTitle>
                    <CardDescription>Courses awaiting approval</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/admin/courses")}
                  >
                    View All Courses
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-secondary/10 rounded-full flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-secondary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{course.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            by {course.instructor}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Submitted {course.submittedDate} • {course.category}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(course.status)}>
                          {course.status
                            .replace("_", " ")
                            .charAt(0)
                            .toUpperCase() +
                            course.status.replace("_", " ").slice(1)}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>System Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAlerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        alert.severity === "high"
                          ? "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                          : alert.severity === "medium"
                            ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
                            : "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge
                          variant={
                            alert.severity === "high"
                              ? "destructive"
                              : alert.severity === "medium"
                                ? "default"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {alert.time}
                        </span>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/admin/users")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/admin/courses")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Review Courses
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/admin/analytics")}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Platform Analytics
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/admin/settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Platform Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/admin/reports")}
                >
                  <Database className="mr-2 h-4 w-4" />
                  Generate Reports
                </Button>
              </CardContent>
            </Card>

            {/* Platform Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Platform Health</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Server Status
                  </span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Database
                  </span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Storage</span>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    85% Used
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Active Users
                  </span>
                  <span className="font-semibold">1,247</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
