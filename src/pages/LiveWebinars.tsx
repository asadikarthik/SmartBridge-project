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
  Video,
  Calendar,
  Clock,
  Users,
  Play,
  Eye,
  Plus,
  Filter,
  Bell,
  Share,
} from "lucide-react";

interface Webinar {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  course: string;
  scheduledAt: string;
  duration: number;
  maxAttendees: number;
  registeredCount: number;
  status: "upcoming" | "live" | "completed";
  category: string;
  recordingUrl?: string;
  meetingLink?: string;
  tags: string[];
}

const LiveWebinars = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [filteredWebinars, setFilteredWebinars] = useState<Webinar[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      loadWebinars();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    let filtered = webinars;

    if (statusFilter !== "all") {
      filtered = filtered.filter((webinar) => webinar.status === statusFilter);
    }

    if (courseFilter !== "all") {
      filtered = filtered.filter((webinar) => webinar.course === courseFilter);
    }

    setFilteredWebinars(filtered);
  }, [webinars, statusFilter, courseFilter]);

  const loadWebinars = () => {
    const mockWebinars: Webinar[] = [
      {
        id: "webinar-1",
        title: "Introduction to React Hooks",
        description:
          "A comprehensive session covering useState, useEffect, and custom hooks with practical examples and live coding.",
        instructor: "Sarah Wilson",
        instructorAvatar: "SW",
        course: "Advanced React Development",
        scheduledAt: "2024-01-25T15:00:00Z",
        duration: 90,
        maxAttendees: 100,
        registeredCount: 67,
        status: "upcoming",
        category: "Live Session",
        meetingLink: "https://meet.learnhub.com/react-hooks-intro",
        tags: ["react", "hooks", "frontend"],
      },
      {
        id: "webinar-2",
        title: "Building Responsive Layouts",
        description:
          "Learn modern CSS Grid and Flexbox techniques to create responsive web layouts that work on all devices.",
        instructor: "John Doe",
        instructorAvatar: "JD",
        course: "Web Development Fundamentals",
        scheduledAt: "2024-01-22T18:00:00Z",
        duration: 60,
        maxAttendees: 150,
        registeredCount: 89,
        status: "live",
        category: "Workshop",
        meetingLink: "https://meet.learnhub.com/responsive-layouts",
        tags: ["css", "responsive", "layout"],
      },
      {
        id: "webinar-3",
        title: "JavaScript Async Programming Deep Dive",
        description:
          "Master promises, async/await, and error handling in JavaScript with real-world examples and best practices.",
        instructor: "Mike Johnson",
        instructorAvatar: "MJ",
        course: "JavaScript for Beginners",
        scheduledAt: "2024-01-20T14:00:00Z",
        duration: 75,
        maxAttendees: 80,
        registeredCount: 72,
        status: "completed",
        category: "Q&A Session",
        recordingUrl: "https://recordings.learnhub.com/js-async-programming",
        tags: ["javascript", "async", "promises"],
      },
      {
        id: "webinar-4",
        title: "Career Tips for New Developers",
        description:
          "Industry insights, portfolio building tips, and interview preparation for aspiring web developers.",
        instructor: "Emily Chen",
        instructorAvatar: "EC",
        course: "Web Development Fundamentals",
        scheduledAt: "2024-01-26T16:30:00Z",
        duration: 45,
        maxAttendees: 200,
        registeredCount: 156,
        status: "upcoming",
        category: "Career Talk",
        meetingLink: "https://meet.learnhub.com/career-tips-developers",
        tags: ["career", "tips", "portfolio"],
      },
    ];

    setWebinars(mockWebinars);
  };

  const handleRegister = (webinarId: string) => {
    setWebinars(
      webinars.map((w) =>
        w.id === webinarId
          ? { ...w, registeredCount: w.registeredCount + 1 }
          : w,
      ),
    );
    alert("Successfully registered for the webinar!");
  };

  const handleJoinLive = (webinar: Webinar) => {
    if (webinar.meetingLink) {
      window.open(webinar.meetingLink, "_blank");
    }
  };

  const handleWatchRecording = (webinar: Webinar) => {
    if (webinar.recordingUrl) {
      window.open(webinar.recordingUrl, "_blank");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const upcomingWebinars = webinars.filter((w) => w.status === "upcoming");
  const liveWebinars = webinars.filter((w) => w.status === "live");
  const completedWebinars = webinars.filter((w) => w.status === "completed");

  const courses = [
    "all",
    ...Array.from(new Set(webinars.map((w) => w.course))),
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
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Live Webinars
          </h1>
          <p className="text-muted-foreground">
            Join live interactive sessions with instructors and fellow learners.
            Participate in real-time discussions and Q&A sessions.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {upcomingWebinars.length}
                  </div>
                  <p className="text-xs text-muted-foreground">Upcoming</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Video className="h-8 w-8 text-red-500" />
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {liveWebinars.length}
                  </div>
                  <p className="text-xs text-muted-foreground">Live Now</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Play className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {completedWebinars.length}
                  </div>
                  <p className="text-xs text-muted-foreground">Recordings</p>
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
                    {webinars.reduce((sum, w) => sum + w.registeredCount, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total Attendees
                  </p>
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
              <span>Filter Webinars</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Webinars</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="live">Live Now</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
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

        {/* Live Webinars Alert */}
        {liveWebinars.length > 0 && (
          <Card className="mb-8 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 dark:text-red-400">
                    🔴 Live Now!
                  </h3>
                  <p className="text-red-700 dark:text-red-300">
                    {liveWebinars.length} webinar(s) are currently live. Join
                    now!
                  </p>
                </div>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    const liveWebinar = liveWebinars[0];
                    if (liveWebinar) handleJoinLive(liveWebinar);
                  }}
                >
                  Join Live Session
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Webinars List */}
        <div className="space-y-6">
          {filteredWebinars.map((webinar) => (
            <Card
              key={webinar.id}
              className={`hover:shadow-lg transition-shadow ${
                webinar.status === "live"
                  ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/5"
                  : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {webinar.instructorAvatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-semibold">
                            {webinar.title}
                          </h3>
                          {webinar.status === "live" && (
                            <Badge className="bg-red-500 text-white animate-pulse">
                              🔴 LIVE
                            </Badge>
                          )}
                          <Badge
                            variant={
                              webinar.status === "upcoming"
                                ? "default"
                                : webinar.status === "completed"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {webinar.category}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          {webinar.description}
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">
                              {webinar.instructor}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(
                                webinar.scheduledAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {new Date(webinar.scheduledAt).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {webinar.registeredCount}/{webinar.maxAttendees}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-sm text-muted-foreground">
                            Course: {webinar.course}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-1">
                      {webinar.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      {webinar.status === "upcoming" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRegister(webinar.id)}
                          >
                            <Bell className="h-4 w-4 mr-1" />
                            Register
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </>
                      )}
                      {webinar.status === "live" && (
                        <Button
                          onClick={() => handleJoinLive(webinar)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Live Session
                        </Button>
                      )}
                      {webinar.status === "completed" && (
                        <Button
                          variant="outline"
                          onClick={() => handleWatchRecording(webinar)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Watch Recording
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredWebinars.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No webinars found</h3>
              <p className="text-muted-foreground mb-4">
                {webinars.length === 0
                  ? "Check back later for upcoming live sessions!"
                  : "Try adjusting your filters to see more webinars."}
              </p>
              <Button variant="outline" onClick={() => setStatusFilter("all")}>
                Show All Webinars
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LiveWebinars;
