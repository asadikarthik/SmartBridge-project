import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Play,
  CheckCircle,
  ArrowRight,
  Star,
  Clock,
  Globe,
  Shield,
  Zap,
  Trophy,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const features = [
    {
      icon: BookOpen,
      title: "Rich Course Content",
      description:
        "Create and consume courses with video, text, quizzes, and interactive elements.",
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description:
        "Connect with fellow learners and instructors in a supportive community.",
    },
    {
      icon: Award,
      title: "Certificates & Badges",
      description:
        "Earn verifiable certificates and badges upon course completion.",
    },
    {
      icon: Globe,
      title: "Learn Anywhere",
      description:
        "Access your courses from any device, anywhere in the world.",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description:
        "Your data and progress are protected with enterprise-grade security.",
    },
    {
      icon: Zap,
      title: "Fast & Modern",
      description:
        "Built with cutting-edge technology for the best learning experience.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Students" },
    { value: "500+", label: "Expert Teachers" },
    { value: "1000+", label: "Courses Available" },
    { value: "95%", label: "Completion Rate" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Data Science Student",
      content:
        "EduHub transformed my learning journey. The courses are well-structured and the instructors are incredibly knowledgeable.",
      rating: 5,
    },
    {
      name: "Dr. Michael Chen",
      role: "Course Instructor",
      content:
        "As an educator, I love how easy it is to create and manage courses. The platform provides all the tools I need.",
      rating: 5,
    },
    {
      name: "Alex Rodriguez",
      role: "Web Developer",
      content:
        "The practical approach to learning helped me land my dream job. Highly recommend EduHub to anyone looking to upskill.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                  🚀 Next Generation Learning Platform
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  Learn, Grow, and <span className="text-primary">Excel</span>{" "}
                  with <span className="text-secondary">EduHub</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Join thousands of learners on a journey of discovery. Whether
                  you're a student, teacher, or administrator, EduHub provides
                  the tools you need to succeed.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-lg px-8 py-3"
                  onClick={() => navigate("/register")}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-3"
                  onClick={() => navigate("/courses")}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Explore Courses
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-card rounded-2xl shadow-2xl border p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Course Dashboard</h3>
                    <Badge className="bg-secondary text-secondary-foreground">
                      In Progress
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">
                          Web Development Fundamentals
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          8 of 12 lessons completed
                        </p>
                        <div className="mt-2 bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full w-2/3"></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Team Collaboration</h4>
                        <p className="text-sm text-muted-foreground">
                          4 of 6 lessons completed
                        </p>
                        <div className="mt-2 bg-muted rounded-full h-2">
                          <div className="bg-secondary h-2 rounded-full w-2/3"></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Award className="h-6 w-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Project Management</h4>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <p className="text-sm text-green-600 font-medium">
                            Completed
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background decoration */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-secondary/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-primary border-primary/20">
              Features
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold">
              Everything you need to{" "}
              <span className="text-primary">succeed</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and features
              needed for effective online learning and teaching.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader>
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge
              variant="outline"
              className="text-secondary border-secondary/20"
            >
              For Everyone
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold">
              Built for <span className="text-secondary">every learner</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you're a student, teacher, or administrator, EduHub has
              been designed with your specific needs in mind.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
                <CardTitle className="text-2xl">Students</CardTitle>
                <CardDescription>
                  Learn at your own pace with personalized learning paths
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">
                      Browse and enroll in courses
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">
                      Track your learning progress
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">
                      Earn certificates and badges
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Access premium content</span>
                  </li>
                </ul>
                <Button
                  className="w-full mt-6"
                  onClick={() => navigate("/register?role=student")}
                >
                  Join as Student
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-primary/20">
              <CardHeader className="text-center">
                <div className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-green-600 dark:text-green-300" />
                </div>
                <CardTitle className="text-2xl">Teachers</CardTitle>
                <CardDescription>
                  Create engaging courses and inspire learners worldwide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Create and manage courses</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Add multimedia content</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Monitor student progress</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Monetize your expertise</span>
                  </li>
                </ul>
                <Button
                  className="w-full mt-6"
                  onClick={() => navigate("/register?role=teacher")}
                >
                  Become a Teacher
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="mx-auto h-16 w-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mb-4">
                  <Trophy className="h-8 w-8 text-orange-600 dark:text-orange-300" />
                </div>
                <CardTitle className="text-2xl">Administrators</CardTitle>
                <CardDescription>
                  Manage users and oversee platform operations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Manage users and roles</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Oversee course content</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Analytics and reporting</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">Platform configuration</span>
                  </li>
                </ul>
                <Button
                  variant="outline"
                  className="w-full mt-6"
                  onClick={() => navigate("/contact")}
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="outline" className="text-accent border-accent/20">
              Testimonials
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold">
              What our <span className="text-accent">community</span> says
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our students,
              teachers, and administrators have to say about EduHub.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold text-white">
              Ready to start your learning journey?
            </h2>
            <p className="text-xl text-white/90">
              Join thousands of learners and educators who are already
              transforming their lives with EduHub.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-3"
                onClick={() => navigate("/register")}
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="rounded-lg bg-primary p-2">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">EduHub</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 EduHub. All rights reserved. Built with ❤️ for learners
            worldwide.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
