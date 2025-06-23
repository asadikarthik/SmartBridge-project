import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import StudentCertificates from "./pages/StudentCertificates";
import StudentMyCourses from "./pages/StudentMyCourses";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherMyCourses from "./pages/TeacherMyCourses";
import TeacherCreateCourse from "./pages/TeacherCreateCourse";
import TeacherEditCourse from "./pages/TeacherEditCourse";
import TeacherStudents from "./pages/TeacherStudents";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import CourseLearning from "./pages/CourseLearning";
import AdminCRUDTest from "./pages/AdminCRUDTest";
import DiscussionForums from "./pages/DiscussionForums";
import LiveWebinars from "./pages/LiveWebinars";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetails />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/my-courses" element={<StudentMyCourses />} />
          <Route
            path="/student/certificates"
            element={<StudentCertificates />}
          />
          <Route path="/course/:id/learn" element={<CourseLearning />} />
          <Route path="/student/my-courses" element={<StudentMyCourses />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/courses" element={<TeacherMyCourses />} />
          <Route
            path="/teacher/courses/new"
            element={<TeacherCreateCourse />}
          />
          <Route
            path="/teacher/create-course"
            element={<TeacherCreateCourse />}
          />
          <Route
            path="/teacher/courses/:id/edit"
            element={<TeacherEditCourse />}
          />
          <Route path="/teacher/students" element={<TeacherStudents />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/crud-test" element={<AdminCRUDTest />} />
          <Route path="/forums" element={<DiscussionForums />} />
          <Route path="/webinars" element={<LiveWebinars />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
