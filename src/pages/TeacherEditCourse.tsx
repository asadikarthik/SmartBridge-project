import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  BookOpen,
  DollarSign,
  Clock,
} from "lucide-react";

const TeacherEditCourse = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    price: 0,
    thumbnail: "📚",
    requirements: [] as string[],
    objectives: [] as string[],
    tags: [] as string[],
    language: "English",
    isPublished: false,
  });
  const [newRequirement, setNewRequirement] = useState("");
  const [newObjective, setNewObjective] = useState("");
  const [newTag, setNewTag] = useState("");
  const [sections, setSections] = useState([
    {
      title: "",
      content: "",
      duration: 30,
    },
  ]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.type !== "teacher") {
        navigate("/login");
        return;
      }
      setUser(parsedUser);
      loadCourseData(parsedUser._id);
    } else {
      navigate("/login");
    }
  }, [navigate, id]);

  const loadCourseData = (teacherId: string) => {
    if (!id) return;

    const teacherCourses = JSON.parse(
      localStorage.getItem(`teacherCourses_${teacherId}`) || "[]",
    );

    const course = teacherCourses.find((c: any) => c._id === id);

    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        price: course.price,
        thumbnail: course.thumbnail,
        requirements: course.requirements || [],
        objectives: course.objectives || [],
        tags: course.tags || [],
        language: course.language || "English",
        isPublished: course.isPublished || false,
      });

      setSections(
        course.sections || [{ title: "", content: "", duration: 30 }],
      );
    } else {
      alert("Course not found");
      navigate("/teacher/courses");
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData((prev) => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()],
      }));
      setNewObjective("");
    }
  };

  const removeObjective = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        title: "",
        content: "",
        duration: 30,
      },
    ]);
  };

  const updateSection = (index: number, field: string, value: any) => {
    setSections((prev) =>
      prev.map((section, i) =>
        i === index ? { ...section, [field]: value } : section,
      ),
    );
  };

  const removeSection = (index: number) => {
    if (sections.length > 1) {
      setSections((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title.trim()) {
        alert("Course title is required");
        return;
      }
      if (!formData.description.trim()) {
        alert("Course description is required");
        return;
      }
      if (!formData.category.trim()) {
        alert("Course category is required");
        return;
      }

      const validSections = sections.filter(
        (section) => section.title.trim() && section.content.trim(),
      );
      if (validSections.length === 0) {
        alert("At least one complete section is required");
        return;
      }

      const updatedCourse = {
        _id: id,
        ...formData,
        sections: validSections.map((section, index) => ({
          _id: `section-${index + 1}`,
          title: section.title,
          content: section.content,
          duration: section.duration,
          order: index + 1,
          isPublished: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
        totalDuration: validSections.reduce(
          (sum, section) => sum + section.duration,
          0,
        ),
        instructor: user._id,
        instructorName: user.name,
        enrolled: [],
        rating: { average: 0, count: 0 },
        reviews: [],
        updatedAt: new Date().toISOString(),
      };

      // Update teacher's courses
      const teacherCourses = JSON.parse(
        localStorage.getItem(`teacherCourses_${user._id}`) || "[]",
      );
      const updatedTeacherCourses = teacherCourses.map((course: any) =>
        course._id === id ? updatedCourse : course,
      );
      localStorage.setItem(
        `teacherCourses_${user._id}`,
        JSON.stringify(updatedTeacherCourses),
      );

      // Update global courses
      const allCourses = JSON.parse(localStorage.getItem("allCourses") || "[]");
      const updatedAllCourses = allCourses.map((course: any) =>
        course._id === id ? updatedCourse : course,
      );
      localStorage.setItem("allCourses", JSON.stringify(updatedAllCourses));

      alert("Course updated successfully!");
      navigate("/teacher/courses");
    } catch (error: any) {
      console.error("Error updating course:", error);
      alert("Failed to update course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={handleLogout} />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const categories = [
    "Technology",
    "Business",
    "Design",
    "Marketing",
    "Data Science",
    "Personal Development",
    "Health & Fitness",
    "Language",
    "Music",
    "Art",
  ];

  const thumbnailOptions = [
    "📚",
    "💻",
    "🎨",
    "📊",
    "🚀",
    "🎯",
    "💡",
    "🔬",
    "🏆",
    "⚡",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/teacher/courses")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Courses
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Edit Course
          </h1>
          <p className="text-muted-foreground">
            Update your course information and content.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>
                Update the basic details about your course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Course Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter course title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category *</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Level</label>
                  <Select
                    value={formData.level}
                    onValueChange={(value: any) =>
                      handleInputChange("level", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Price ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange(
                          "price",
                          parseFloat(e.target.value) || 0,
                        )
                      }
                      placeholder="0.00"
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Set to 0 for free course
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Course Description *
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe what students will learn in this course..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Thumbnail</label>
                <div className="flex flex-wrap gap-2">
                  {thumbnailOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleInputChange("thumbnail", emoji)}
                      className={`text-2xl p-2 rounded border ${
                        formData.thumbnail === emoji
                          ? "border-primary bg-primary/10"
                          : "border-muted hover:border-muted-foreground"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    handleInputChange("isPublished", e.target.checked)
                  }
                  className="rounded"
                />
                <label htmlFor="isPublished" className="text-sm font-medium">
                  Publish course (make it visible to students)
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Course Sections</span>
                </div>
                <Button type="button" onClick={addSection} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </CardTitle>
              <CardDescription>
                Update sections and lessons for your course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {sections.map((section, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Section {index + 1}</h4>
                    {sections.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSection(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Section Title
                      </label>
                      <Input
                        value={section.title}
                        onChange={(e) =>
                          updateSection(index, "title", e.target.value)
                        }
                        placeholder="Enter section title"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Duration (minutes)
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={section.duration}
                        onChange={(e) =>
                          updateSection(
                            index,
                            "duration",
                            parseInt(e.target.value) || 30,
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Section Content
                    </label>
                    <Textarea
                      value={section.content}
                      onChange={(e) =>
                        updateSection(index, "content", e.target.value)
                      }
                      placeholder="Enter the content for this section..."
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/teacher/courses")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Updating Course...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Course
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherEditCourse;
