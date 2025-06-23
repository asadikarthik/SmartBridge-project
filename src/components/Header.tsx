import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Award,
} from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    type: "student" | "teacher" | "admin";
  } | null;
  onLogout?: () => void;
}

const Header = ({ user, onLogout }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getDashboardPath = (userType: string) => {
    switch (userType) {
      case "student":
        return "/student/dashboard";
      case "teacher":
        return "/teacher/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  const getRoleColor = (userType: string) => {
    switch (userType) {
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="rounded-lg bg-primary p-2">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">EduHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {!user ? (
            <>
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Home
              </Link>
              <Link
                to="/courses"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/courses")
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Courses
              </Link>
              <Link
                to="/about"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/about") ? "text-primary" : "text-muted-foreground"
                }`}
              >
                About
              </Link>
            </>
          ) : (
            <>
              {/* Student Navigation */}
              {user.type === "student" && (
                <>
                  <Link
                    to="/student/dashboard"
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/student/dashboard")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/courses"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/courses")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    Browse Courses
                  </Link>
                  <Link
                    to="/student/my-courses"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/student/my-courses")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    My Learning
                  </Link>
                  <Link
                    to="/student/certificates"
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/student/certificates")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Award className="h-4 w-4" />
                    <span>Certificates</span>
                  </Link>
                  <Link
                    to="/forums"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/forums")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    Forums
                  </Link>
                  <Link
                    to="/webinars"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/webinars")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    Webinars
                  </Link>
                </>
              )}

              {/* Teacher Navigation */}
              {user.type === "teacher" && (
                <>
                  <Link
                    to="/teacher/dashboard"
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/teacher/dashboard")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/teacher/courses"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/teacher/courses")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    My Courses
                  </Link>
                  <Link
                    to="/teacher/create-course"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/teacher/create-course")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    Create Course
                  </Link>
                  <Link
                    to="/teacher/students"
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/teacher/students")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span>Students</span>
                  </Link>
                  <Link
                    to="/forums"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/forums")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    Forums
                  </Link>
                  <Link
                    to="/webinars"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/webinars")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    Webinars
                  </Link>
                </>
              )}

              {/* Admin Navigation */}
              {user.type === "admin" && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/admin/dashboard")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/admin/users")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span>Users</span>
                  </Link>
                  <Link
                    to="/admin/courses"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/admin/courses")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    All Courses
                  </Link>
                  <Link
                    to="/admin/analytics"
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/admin/analytics")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    Analytics
                  </Link>
                  <Link
                    to="/admin/crud-test"
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/admin/crud-test")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span>CRUD Test</span>
                  </Link>
                  <Link
                    to="/admin/settings"
                    className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                      isActive("/admin/settings")
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </>
              )}
            </>
          )}
        </nav>

        {/* User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                Sign Up
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Badge className={getRoleColor(user.type)}>
                  {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {!user ? (
              <>
                <Link
                  to="/"
                  className="block text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/courses"
                  className="block text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link
                  to="/about"
                  className="block text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      navigate("/register");
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2 pb-4 border-b">
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <Badge className={getRoleColor(user.type)}>
                    {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                  </Badge>
                </div>
                <Link
                  to={getDashboardPath(user.type)}
                  className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                {/* Student Mobile Navigation */}
                {user.type === "student" && (
                  <>
                    <Link
                      to="/courses"
                      className="block text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Browse Courses
                    </Link>
                    <Link
                      to="/student/my-courses"
                      className="block text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Learning
                    </Link>
                    <Link
                      to="/student/certificates"
                      className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Award className="h-4 w-4" />
                      <span>Certificates</span>
                    </Link>
                    <Link
                      to="/forums"
                      className="block text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Discussion Forums
                    </Link>
                    <Link
                      to="/webinars"
                      className="block text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Live Webinars
                    </Link>
                  </>
                )}

                {/* Teacher Mobile Navigation */}
                {user.type === "teacher" && (
                  <>
                    <Link
                      to="/teacher/courses"
                      className="block text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Courses
                    </Link>
                    <Link
                      to="/teacher/create-course"
                      className="block text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Create Course
                    </Link>
                    <Link
                      to="/teacher/students"
                      className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Users className="h-4 w-4" />
                      <span>Students</span>
                    </Link>
                    <Link
                      to="/forums"
                      className="block text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Discussion Forums
                    </Link>
                    <Link
                      to="/webinars"
                      className="block text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Live Webinars
                    </Link>
                  </>
                )}

                {/* Admin Mobile Navigation */}
                {user.type === "admin" && (
                  <>
                    <Link
                      to="/admin/users"
                      className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Users className="h-4 w-4" />
                      <span>Users</span>
                    </Link>
                    <Link
                      to="/admin/courses"
                      className="block text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      All Courses
                    </Link>
                    <Link
                      to="/admin/analytics"
                      className="block text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Analytics
                    </Link>
                    <Link
                      to="/admin/crud-test"
                      className="block text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      CRUD Test
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start p-0 h-auto"
                  onClick={() => {
                    onLogout?.();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
