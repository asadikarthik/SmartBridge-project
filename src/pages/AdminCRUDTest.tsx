import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import {
  usersAPI,
  coursesAPI,
  enrollmentsAPI,
  certificatesAPI,
} from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  Play,
  Database,
} from "lucide-react";

const AdminCRUDTest = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testEmail, setTestEmail] = useState("test@example.com");

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Check if user is admin
  if (!user || user.type !== "admin") {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              Only administrators can access this page.
            </p>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const addTestResult = (
    test: string,
    status: "success" | "error",
    message: string,
    data?: any,
  ) => {
    setTestResults((prev) => [
      ...prev,
      {
        test,
        status,
        message,
        data,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const runCRUDTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Users API - Get Users
      try {
        const usersResult = await usersAPI.getUsers({ page: 1, limit: 5 });
        addTestResult(
          "Users API - Get Users",
          "success",
          `Successfully fetched users`,
          usersResult,
        );
      } catch (error: any) {
        addTestResult(
          "Users API - Get Users",
          "error",
          error.message || "Failed to fetch users",
        );
      }

      // Test 2: Users API - Get User Stats
      try {
        const statsResult = await usersAPI.getUserStats();
        addTestResult(
          "Users API - Get Stats",
          "success",
          "Successfully fetched user statistics",
          statsResult,
        );
      } catch (error: any) {
        addTestResult(
          "Users API - Get Stats",
          "error",
          error.message || "Failed to fetch user stats",
        );
      }

      // Test 3: Courses API - Get Courses
      try {
        const coursesResult = await coursesAPI.getCourses({
          page: 1,
          limit: 5,
        });
        addTestResult(
          "Courses API - Get Courses",
          "success",
          `Successfully fetched courses`,
          coursesResult,
        );
      } catch (error: any) {
        addTestResult(
          "Courses API - Get Courses",
          "error",
          error.message || "Failed to fetch courses",
        );
      }

      // Test 4: Courses API - Create Course (Mock)
      try {
        const newCourse = {
          title: "Test Course",
          description: "This is a test course for CRUD operations",
          category: "Testing",
          level: "Beginner" as const,
          price: 99.99,
        };

        const createResult = await coursesAPI.createCourse(newCourse);
        addTestResult(
          "Courses API - Create Course",
          "success",
          "Successfully created test course",
          createResult,
        );
      } catch (error: any) {
        addTestResult(
          "Courses API - Create Course",
          "error",
          error.message || "Failed to create course",
        );
      }

      // Test 5: Enrollments API - Get All Enrollments
      try {
        const enrollmentsResult = await enrollmentsAPI.getAllEnrollments({
          page: 1,
          limit: 5,
        });
        addTestResult(
          "Enrollments API - Get All",
          "success",
          "Successfully fetched enrollments",
          enrollmentsResult,
        );
      } catch (error: any) {
        addTestResult(
          "Enrollments API - Get All",
          "error",
          error.message || "Failed to fetch enrollments",
        );
      }

      // Test 6: Enrollments API - Get Stats
      try {
        const enrollmentStats = await enrollmentsAPI.getEnrollmentStats();
        addTestResult(
          "Enrollments API - Get Stats",
          "success",
          "Successfully fetched enrollment statistics",
          enrollmentStats,
        );
      } catch (error: any) {
        addTestResult(
          "Enrollments API - Get Stats",
          "error",
          error.message || "Failed to fetch enrollment stats",
        );
      }

      // Test 7: Certificates API - Get Stats
      try {
        const certStats = await certificatesAPI.getCertificateStats();
        addTestResult(
          "Certificates API - Get Stats",
          "success",
          "Successfully fetched certificate statistics",
          certStats,
        );
      } catch (error: any) {
        addTestResult(
          "Certificates API - Get Stats",
          "error",
          error.message || "Failed to fetch certificate stats",
        );
      }

      // Test 8: Authentication Test
      try {
        const profileResult = await usersAPI.getUser(user._id);
        addTestResult(
          "Authentication - Get Profile",
          "success",
          "Authentication working correctly",
          profileResult,
        );
      } catch (error: any) {
        addTestResult(
          "Authentication - Get Profile",
          "error",
          error.message || "Authentication failed",
        );
      }
    } catch (error: any) {
      addTestResult(
        "General Error",
        "error",
        `Unexpected error: ${error.message}`,
      );
    }

    setIsRunning(false);
  };

  const mockDataTest = () => {
    setTestResults([]);

    // Test localStorage data
    const enrollments = JSON.parse(
      localStorage.getItem("userEnrollments") || "[]",
    );
    const userData = localStorage.getItem("user");

    addTestResult(
      "Local Storage - User Data",
      userData ? "success" : "error",
      userData
        ? "User data found in localStorage"
        : "No user data in localStorage",
      userData ? JSON.parse(userData) : null,
    );

    addTestResult(
      "Local Storage - Enrollments",
      "success",
      `Found ${enrollments.length} enrollments in localStorage`,
      enrollments,
    );

    // Test mock course data
    const mockCourses = [
      { id: "course-1", title: "Web Development Fundamentals", price: 99.99 },
      { id: "course-2", title: "Advanced React Development", price: 149.99 },
      { id: "course-3", title: "JavaScript for Beginners", price: 0 },
    ];

    addTestResult(
      "Mock Data - Courses",
      "success",
      `Mock courses available: ${mockCourses.length}`,
      mockCourses,
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin Dashboard
          </Button>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            CRUD Operations Test
          </h1>
          <p className="text-muted-foreground">
            Test all CRUD operations and API endpoints to ensure everything is
            working correctly.
          </p>
        </div>

        <Tabs defaultValue="api-tests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="api-tests">API Tests</TabsTrigger>
            <TabsTrigger value="mock-tests">Mock Data Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="api-tests" className="space-y-6">
            {/* Control Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>API Endpoint Tests</span>
                </CardTitle>
                <CardDescription>
                  Test backend API endpoints and CRUD operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Input
                    placeholder="Test email for user operations"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button
                    onClick={runCRUDTests}
                    disabled={isRunning}
                    className="flex items-center space-x-2"
                  >
                    {isRunning ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    <span>
                      {isRunning ? "Running Tests..." : "Run API Tests"}
                    </span>
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>This will test the following operations:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Users API - Get users, Get stats</li>
                    <li>Courses API - Get courses, Create course</li>
                    <li>Enrollments API - Get enrollments, Get stats</li>
                    <li>Certificates API - Get stats</li>
                    <li>Authentication - Verify token</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mock-tests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Mock Data Tests</span>
                </CardTitle>
                <CardDescription>
                  Test localStorage data and mock functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={mockDataTest}
                  className="flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Test Mock Data</span>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>
                Results of the CRUD operations tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.status === "success"
                        ? "bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800"
                        : "bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {result.status === "success" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{result.test}</h4>
                          <Badge
                            variant={
                              result.status === "success"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {result.status === "success" ? "PASS" : "FAIL"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {result.message}
                        </p>
                        {result.data && (
                          <details className="text-sm">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              View response data
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </details>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(result.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Backend Status Info */}
        <Card>
          <CardHeader>
            <CardTitle>Backend Status</CardTitle>
            <CardDescription>
              Information about the backend API status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">API Configuration</h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Base URL:</span>{" "}
                      {import.meta.env.VITE_API_URL ||
                        "http://localhost:5000/api"}
                    </p>
                    <p>
                      <span className="font-medium">Environment:</span>{" "}
                      {import.meta.env.VITE_NODE_ENV || "development"}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Demo Mode</h4>
                  <div className="text-sm space-y-1">
                    <p className="text-muted-foreground">
                      The application includes mock authentication and data for
                      demonstration purposes when the backend API is not
                      available.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">
                  How to Start Backend
                </h4>
                <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <p>To test with the real backend API:</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>
                      Navigate to the backend directory: <code>cd backend</code>
                    </li>
                    <li>
                      Install dependencies: <code>npm install</code>
                    </li>
                    <li>
                      Set up environment variables:{" "}
                      <code>cp .env.example .env</code>
                    </li>
                    <li>Start MongoDB database</li>
                    <li>
                      Start the server: <code>npm start</code>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCRUDTest;
