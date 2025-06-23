import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Users,
  Clock,
  Star,
  BookOpen,
  ChevronRight,
} from "lucide-react";

interface Course {
  _id: string;
  title: string;
  description: string;
  instructorName: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  thumbnail: string;
  totalDuration: number;
  enrolledCount: number;
  rating: { average: number; count: number };
  isPublished: boolean;
}

const Courses = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Mock courses data that matches the case study
  const mockCourses: Course[] = [
    {
      _id: "course-1",
      title: "Web Development Fundamentals",
      description:
        "Learn the basics of web development including HTML, CSS, JavaScript, and modern frameworks. Perfect for beginners who want to start their web development journey.",
      instructorName: "John Doe",
      category: "Technology",
      level: "Beginner",
      price: 99.99,
      thumbnail: "💻",
      totalDuration: 270,
      enrolledCount: 89,
      rating: { average: 4.8, count: 89 },
      isPublished: true,
    },
    {
      _id: "course-2",
      title: "Advanced React Development",
      description:
        "Master React.js with hooks, context, and modern patterns. Build scalable applications with best practices.",
      instructorName: "Sarah Wilson",
      category: "Technology",
      level: "Advanced",
      price: 149.99,
      thumbnail: "⚛️",
      totalDuration: 420,
      enrolledCount: 156,
      rating: { average: 4.9, count: 156 },
      isPublished: true,
    },
    {
      _id: "course-3",
      title: "JavaScript for Beginners",
      description:
        "Complete introduction to JavaScript programming. Learn variables, functions, objects, and DOM manipulation.",
      instructorName: "Mike Johnson",
      category: "Technology",
      level: "Beginner",
      price: 0,
      thumbnail: "🟨",
      totalDuration: 180,
      enrolledCount: 234,
      rating: { average: 4.7, count: 234 },
      isPublished: true,
    },
    {
      _id: "course-4",
      title: "Digital Marketing Mastery",
      description:
        "Learn social media marketing, SEO, content marketing, and analytics to grow your business online.",
      instructorName: "Emily Chen",
      category: "Marketing",
      level: "Intermediate",
      price: 79.99,
      thumbnail: "📱",
      totalDuration: 200,
      enrolledCount: 98,
      rating: { average: 4.6, count: 98 },
      isPublished: true,
    },
    {
      _id: "course-5",
      title: "Data Science with Python",
      description:
        "Learn data analysis, visualization, and machine learning using Python, pandas, and scikit-learn.",
      instructorName: "Dr. Alex Thompson",
      category: "Data Science",
      level: "Intermediate",
      price: 199.99,
      thumbnail: "📊",
      totalDuration: 480,
      enrolledCount: 67,
      rating: { average: 4.9, count: 67 },
      isPublished: true,
    },
    {
      _id: "course-6",
      title: "UX/UI Design Principles",
      description:
        "Master user experience and interface design principles. Learn Figma, wireframing, and prototyping.",
      instructorName: "Lisa Rodriguez",
      category: "Design",
      level: "Beginner",
      price: 89.99,
      thumbnail: "🎨",
      totalDuration: 240,
      enrolledCount: 145,
      rating: { average: 4.8, count: 145 },
      isPublished: true,
    },
  ];

  useEffect(() => {
    // Load both mock courses and teacher-created courses
    const loadAllCourses = () => {
      // Get teacher-created courses
      const teacherCreatedCourses = JSON.parse(
        localStorage.getItem("allCourses") || "[]",
      );

      console.log("Loading teacher-created courses:", teacherCreatedCourses);

      // Convert teacher courses to display format
      const formattedTeacherCourses = teacherCreatedCourses
        .filter((course: any) => course.isPublished) // Only show published courses
        .map((course: any) => ({
          _id: course._id,
          title: course.title,
          description: course.description,
          instructorName: course.instructorName,
          category: course.category,
          level: course.level,
          price: course.price,
          thumbnail: course.thumbnail,
          totalDuration: course.totalDuration || 180,
          enrolledCount: Math.floor(Math.random() * 50) + 10, // Mock enrollment count
          rating: {
            average: parseFloat((Math.random() * 2 + 3).toFixed(1)),
            count: Math.floor(Math.random() * 100) + 10,
          },
          isPublished: course.isPublished,
        }));

      console.log("Formatted teacher courses:", formattedTeacherCourses);

      // Combine with mock courses
      const allCourses = [...mockCourses, ...formattedTeacherCourses];

      console.log("All courses to display:", allCourses);

      setCourses(allCourses);
      setFilteredCourses(allCourses);
      setIsLoading(false);
    };

    // Load immediately, no delay
    loadAllCourses();

    // Also listen for storage changes to refresh when courses are added
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "allCourses") {
        console.log("Storage changed, reloading courses");
        loadAllCourses();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Refresh when window comes into focus (useful when navigating back from course creation)
    const handleFocus = () => {
      console.log("Window focused, refreshing courses");
      loadAllCourses();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  useEffect(() => {
    let filtered = courses;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          course.instructorName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (course) => course.category === selectedCategory,
      );
    }

    // Filter by level
    if (selectedLevel !== "all") {
      filtered = filtered.filter((course) => course.level === selectedLevel);
    }

    setFilteredCourses(filtered);
  }, [courses, searchQuery, selectedCategory, selectedLevel]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const categories = [
    "all",
    ...Array.from(new Set(courses.map((c) => c.category))),
  ];
  const levels = ["all", "Beginner", "Intermediate", "Advanced"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={handleLogout} />
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Course Catalog
              </h1>
              <p className="text-muted-foreground">
                Discover courses to enhance your skills and advance your career.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setIsLoading(true);
                // Reload courses
                const teacherCreatedCourses = JSON.parse(
                  localStorage.getItem("allCourses") || "[]",
                );
                const formattedTeacherCourses = teacherCreatedCourses
                  .filter((course: any) => course.isPublished)
                  .map((course: any) => ({
                    _id: course._id,
                    title: course.title,
                    description: course.description,
                    instructorName: course.instructorName,
                    category: course.category,
                    level: course.level,
                    price: course.price,
                    thumbnail: course.thumbnail,
                    totalDuration: course.totalDuration || 180,
                    enrolledCount: Math.floor(Math.random() * 50) + 10,
                    rating: {
                      average: parseFloat((Math.random() * 2 + 3).toFixed(1)),
                      count: Math.floor(Math.random() * 100) + 10,
                    },
                    isPublished: course.isPublished,
                  }));
                const allCourses = [...mockCourses, ...formattedTeacherCourses];
                setCourses(allCourses);
                setFilteredCourses(allCourses);
                setIsLoading(false);
              }}
            >
              🔄 Refresh Courses
            </Button>
          </div>
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
            <div className="grid md:grid-cols-3 gap-4">
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
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Level</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level === "all" ? "All Levels" : level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredCourses.length} of {courses.length} courses
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course._id}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => navigate(`/course/${course._id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="text-4xl mb-2">{course.thumbnail}</div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">
                      {course.rating.average}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{course.category}</Badge>
                    <Badge
                      variant={
                        course.level === "Beginner"
                          ? "default"
                          : course.level === "Intermediate"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {course.level}
                    </Badge>
                  </div>

                  <CardTitle className="group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {course.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    by {course.instructorName}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.enrolledCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{Math.floor(course.totalDuration / 60)}h</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-primary">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                      View Course
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && !isLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedLevel("all");
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Courses;
