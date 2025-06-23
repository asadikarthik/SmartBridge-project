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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  MessageSquare,
  Plus,
  Search,
  Filter,
  ThumbsUp,
  Reply,
  Pin,
  Clock,
  Users,
} from "lucide-react";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorType: "student" | "teacher" | "admin";
  course: string;
  category: string;
  createdAt: string;
  replies: number;
  likes: number;
  isPinned: boolean;
  isResolved: boolean;
  tags: string[];
}

const DiscussionForums = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "general",
    course: "",
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      loadForumPosts();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    let filtered = posts;

    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((post) => post.category === categoryFilter);
    }

    if (courseFilter !== "all") {
      filtered = filtered.filter((post) => post.course === courseFilter);
    }

    setFilteredPosts(filtered);
  }, [posts, searchQuery, categoryFilter, courseFilter]);

  const loadForumPosts = () => {
    // Mock forum posts data
    const mockPosts: ForumPost[] = [
      {
        id: "post-1",
        title: "How to implement responsive design in CSS?",
        content:
          "I'm struggling with creating responsive layouts. Can someone explain the best practices for responsive design using CSS Grid and Flexbox?",
        author: "Sarah Johnson",
        authorType: "student",
        course: "Web Development Fundamentals",
        category: "question",
        createdAt: "2024-01-20T10:30:00Z",
        replies: 8,
        likes: 12,
        isPinned: false,
        isResolved: true,
        tags: ["css", "responsive", "layout"],
      },
      {
        id: "post-2",
        title: "Welcome to Web Development Course!",
        content:
          "Welcome everyone! This is where we'll discuss course topics, share resources, and help each other learn. Please introduce yourselves and let us know your learning goals.",
        author: "John Doe",
        authorType: "teacher",
        course: "Web Development Fundamentals",
        category: "announcement",
        createdAt: "2024-01-15T09:00:00Z",
        replies: 25,
        likes: 35,
        isPinned: true,
        isResolved: false,
        tags: ["welcome", "introduction"],
      },
      {
        id: "post-3",
        title: "JavaScript async/await best practices",
        content:
          "I'd like to discuss best practices for handling asynchronous operations in JavaScript. What are your preferred patterns for error handling with async/await?",
        author: "Mike Wilson",
        authorType: "student",
        course: "JavaScript for Beginners",
        category: "discussion",
        createdAt: "2024-01-18T14:20:00Z",
        replies: 6,
        likes: 9,
        isPinned: false,
        isResolved: false,
        tags: ["javascript", "async", "promises"],
      },
      {
        id: "post-4",
        title: "Course Resources and Additional Learning Materials",
        content:
          "Here are some excellent resources to supplement your learning: MDN Web Docs, freeCodeCamp, and JavaScript.info. Please share any other helpful resources you've found!",
        author: "Emily Chen",
        authorType: "teacher",
        course: "JavaScript for Beginners",
        category: "resource",
        createdAt: "2024-01-17T11:45:00Z",
        replies: 12,
        likes: 28,
        isPinned: true,
        isResolved: false,
        tags: ["resources", "learning", "links"],
      },
    ];

    setPosts(mockPosts);
  };

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert("Please fill in title and content");
      return;
    }

    const post: ForumPost = {
      id: `post-${Date.now()}`,
      title: newPost.title,
      content: newPost.content,
      author: user.name,
      authorType: user.type,
      course: newPost.course || "General",
      category: newPost.category,
      createdAt: new Date().toISOString(),
      replies: 0,
      likes: 0,
      isPinned: false,
      isResolved: false,
      tags: [],
    };

    setPosts([post, ...posts]);
    setNewPost({ title: "", content: "", category: "general", course: "" });
    setIsCreatePostOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const categories = [
    "all",
    "announcement",
    "question",
    "discussion",
    "resource",
  ];
  const courses = [
    "all",
    "Web Development Fundamentals",
    "JavaScript for Beginners",
    "Advanced React Development",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Discussion Forums
              </h1>
              <p className="text-muted-foreground">
                Connect with fellow learners and instructors. Ask questions,
                share knowledge, and engage in meaningful discussions.
              </p>
            </div>
            <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New Post</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                  <DialogDescription>
                    Share your question, discussion topic, or resource with the
                    community.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={newPost.title}
                      onChange={(e) =>
                        setNewPost({ ...newPost, title: e.target.value })
                      }
                      placeholder="Enter post title..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Select
                        value={newPost.category}
                        onValueChange={(value) =>
                          setNewPost({ ...newPost, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="question">Question</SelectItem>
                          <SelectItem value="discussion">Discussion</SelectItem>
                          <SelectItem value="resource">Resource</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Course</label>
                      <Select
                        value={newPost.course}
                        onValueChange={(value) =>
                          setNewPost({ ...newPost, course: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select course..." />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.slice(1).map((course) => (
                            <SelectItem key={course} value={course}>
                              {course}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content</label>
                    <Textarea
                      value={newPost.content}
                      onChange={(e) =>
                        setNewPost({ ...newPost, content: e.target.value })
                      }
                      placeholder="Write your post content..."
                      rows={6}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreatePostOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePost}>Create Post</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{posts.length}</div>
                  <p className="text-xs text-muted-foreground">Total Posts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">
                    {new Set(posts.map((p) => p.author)).size}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Active Members
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Reply className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">
                    {posts.reduce((sum, p) => sum + p.replies, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Total Replies</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <ThumbsUp className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-2xl font-bold">
                    {posts.reduce((sum, p) => sum + p.likes, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Total Likes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter Posts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all"
                          ? "All Categories"
                          : category.charAt(0).toUpperCase() +
                            category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Course</label>
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course === "all" ? "All Courses" : course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts List */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/forums/post/${post.id}`)}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {post.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {post.isPinned && (
                            <Pin className="h-4 w-4 text-primary" />
                          )}
                          <h3 className="text-lg font-semibold">
                            {post.title}
                          </h3>
                          {post.isResolved && (
                            <Badge
                              variant="default"
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            >
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">{post.author}</span>
                            <Badge variant="outline" className="text-xs">
                              {post.authorType}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <span>in {post.course}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-2 ml-4">
                      <Badge
                        variant={
                          post.category === "announcement"
                            ? "default"
                            : post.category === "question"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Reply className="h-4 w-4" />
                        <span>{post.replies} replies</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes} likes</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-4">
                {posts.length === 0
                  ? "Be the first to start a discussion!"
                  : "Try adjusting your search criteria or filters."}
              </p>
              <Button onClick={() => setIsCreatePostOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Post
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DiscussionForums;
