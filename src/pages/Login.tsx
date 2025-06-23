import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const {
    login,
    user,
    isLoading: authLoading,
    error: authError,
    clearError,
  } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      const dashboardRoutes = {
        student: "/student/dashboard",
        teacher: "/teacher/dashboard",
        admin: "/admin/dashboard",
      };
      navigate(redirectTo !== "/" ? redirectTo : dashboardRoutes[user.type], {
        replace: true,
      });
    }
  }, [user, authLoading, navigate, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      await login(formData.email, formData.password);
      // Navigation will be handled by useEffect above
    } catch (err) {
      // Error is already handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (authError) clearError();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">
                  Welcome back to EduHub
                </CardTitle>
                <CardDescription className="text-base">
                  Sign in to continue your learning journey
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {authError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{authError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      disabled={isLoading}
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={isLoading || authLoading}
                >
                  {isLoading || authLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Don't have an account?
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-11"
                onClick={() => navigate("/register")}
                disabled={isLoading}
              >
                Create Account
              </Button>

              {/* Demo Credentials */}
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  Demo Credentials:
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-muted/50 rounded">
                    <p className="font-medium">Student</p>
                    <p>student@demo.com</p>
                    <p>demo123</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <p className="font-medium">Teacher</p>
                    <p>teacher@demo.com</p>
                    <p>demo123</p>
                  </div>
                  <div className="p-2 bg-muted/50 rounded">
                    <p className="font-medium">Admin</p>
                    <p>admin@demo.com</p>
                    <p>demo123</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
