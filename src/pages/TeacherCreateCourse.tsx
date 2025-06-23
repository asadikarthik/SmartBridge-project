import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { coursesAPI } from "@/services/api";
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
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  BookOpen,
  DollarSign,
  Users,
  Clock,
} from "lucide-react";

const TeacherCreateCourse = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    isPublished: true, // Default to published
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

  useState(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.type !== "teacher") {
        navigate("/login");
        return;
      }
      setUser(parsedUser);
    } else {
      navigate("/login");
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
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
      // Validate required fields
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

      // Validate sections
      const validSections = sections.filter(
        (section) => section.title.trim() && section.content.trim(),
      );
      if (validSections.length === 0) {
        alert("At least one complete section is required");
        return;
      }

      const courseData = {
        ...formData,
        sections: validSections.map((section, index) => ({
          title: section.title,
          content: section.content,
          duration: section.duration,
          order: index + 1,
          isPublished: true,
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
        isPublished: formData.isPublished,
      };

      console.log("Creating course:", courseData);

      const newCourse = {
        ...courseData,
        _id: `course-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("New course to save:", newCourse);
      console.log("Course is published:", newCourse.isPublished);

      // Save to teacher-specific courses
      const teacherCourses = JSON.parse(
        localStorage.getItem(`teacherCourses_${user._id}`) || "[]",
      );
      teacherCourses.push(newCourse);
      localStorage.setItem(
        `teacherCourses_${user._id}`,
        JSON.stringify(teacherCourses),
      );

      // Also save to global courses list for students to see
      const allCourses = JSON.parse(localStorage.getItem("allCourses") || "[]");
      allCourses.push(newCourse);
      localStorage.setItem("allCourses", JSON.stringify(allCourses));

      console.log("Saved to allCourses:", allCourses);
      console.log("Total courses in allCourses:", allCourses.length);

      // Try API call (will fail gracefully in demo mode)
      try {
        await coursesAPI.createCourse(courseData);
      } catch (error) {
        console.log("API not available, using localStorage");
      }

      alert("Course created successfully!");
      navigate("/teacher/courses");
    } catch (error: any) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
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
            Create New Course
          </h1>
          <p className="text-muted-foreground">
            Create and publish a new course for students to enroll in.
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
                Enter the basic details about your course
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
                  Publish course immediately (make it visible to students)
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
                Create sections and lessons for your course
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

          {/* Course Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Course Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Requirements */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Requirements</label>
                <div className="flex space-x-2">
                  <Input
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="Add a requirement..."
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), addRequirement())
                    }
                  />
                  <Button type="button" onClick={addRequirement}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.requirements.map((req, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {req}
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Learning Objectives */}
              <div className="space-y-4">
                <label className="text-sm font-medium">
                  Learning Objectives
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Add a learning objective..."
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addObjective())
                    }
                  />
                  <Button type="button" onClick={addObjective}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.objectives.map((obj, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {obj}
                      <button
                        type="button"
                        onClick={() => removeObjective(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Tags</label>
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                  />
                  <Button type="button" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
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
                <>Creating Course...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Course
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherCreateCourse;
