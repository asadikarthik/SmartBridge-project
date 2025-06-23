import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import CertificateGenerator from "@/components/CertificateGenerator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Award, Download, Calendar, ArrowLeft, Eye } from "lucide-react";

const StudentCertificates = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.type !== "student") {
        navigate("/login");
        return;
      }
      setUser(parsedUser);
      loadCertificates(parsedUser._id);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const loadCertificates = (userId: string) => {
    // Get completed enrollments from localStorage
    const enrollments = JSON.parse(
      localStorage.getItem("userEnrollments") || "[]",
    );
    const userCompletedEnrollments = enrollments.filter(
      (enrollment: any) =>
        enrollment.student === userId && enrollment.progress === 100,
    );

    // Course mapping for display
    const courseMapping: {
      [key: string]: { title: string; instructor: string; category: string };
    } = {
      "course-1": {
        title: "Web Development Fundamentals",
        instructor: "John Doe",
        category: "Technology",
      },
      "course-2": {
        title: "Advanced React Development",
        instructor: "Sarah Wilson",
        category: "Technology",
      },
      "course-3": {
        title: "JavaScript for Beginners",
        instructor: "Mike Johnson",
        category: "Technology",
      },
      "course-4": {
        title: "Digital Marketing Mastery",
        instructor: "Emily Chen",
        category: "Marketing",
      },
      "course-5": {
        title: "Data Science with Python",
        instructor: "Dr. Alex Thompson",
        category: "Data Science",
      },
      "course-6": {
        title: "UX/UI Design Principles",
        instructor: "Lisa Rodriguez",
        category: "Design",
      },
    };

    const certificateData = userCompletedEnrollments.map(
      (enrollment: any, index: number) => {
        const courseInfo = courseMapping[enrollment.course] || {
          title: "Unknown Course",
          instructor: "Unknown Instructor",
          category: "General",
        };

        return {
          id: index + 1,
          title: courseInfo.title,
          instructor: courseInfo.instructor,
          completedDate: enrollment.completedAt || enrollment.enrolledAt,
          certificateId: `CERT-${enrollment.course.toUpperCase()}-${Date.now() + index}`,
          category: courseInfo.category,
          grade: "A+",
          enrollmentId: enrollment._id,
          courseId: enrollment.course,
        };
      },
    );

    setCertificates(certificateData);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleViewCertificate = (certificate: any) => {
    setSelectedCertificate(certificate);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/student/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Certificates
          </h1>
          <p className="text-muted-foreground">
            View and download your earned certificates.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Certificates
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{certificates.length}</div>
              <p className="text-xs text-muted-foreground">Earned to date</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  This Year
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">
                Certificates in 2024
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average Grade
                </CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">A+</div>
              <p className="text-xs text-muted-foreground">
                Across all courses
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Certificates Content */}
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list">My Certificates</TabsTrigger>
            {selectedCertificate && (
              <TabsTrigger value="view">View Certificate</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Your Certificates</span>
                </CardTitle>
                <CardDescription>
                  All your earned certificates are listed below
                </CardDescription>
              </CardHeader>
              <CardContent>
                {certificates.length > 0 ? (
                  <div className="space-y-4">
                    {certificates.map((certificate) => (
                      <div
                        key={certificate.id}
                        className="flex items-center justify-between p-6 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Award className="h-8 w-8 text-primary" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold">
                                {certificate.title}
                              </h3>
                              <Badge
                                className={
                                  certificate.grade === "A+"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                }
                              >
                                {certificate.grade}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Instructor: {certificate.instructor}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Completed:{" "}
                              {new Date(
                                certificate.completedDate,
                              ).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Certificate ID: {certificate.certificateId}
                            </p>
                            <Badge variant="outline">
                              {certificate.category}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => handleViewCertificate(certificate)}
                            className="flex items-center space-x-2"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedCertificate(certificate);
                              // Trigger download after a short delay to ensure component is rendered
                              setTimeout(() => {
                                const downloadBtn = document.querySelector(
                                  "[data-download-pdf]",
                                ) as HTMLButtonElement;
                                if (downloadBtn) downloadBtn.click();
                              }, 100);
                            }}
                            className="flex items-center space-x-2"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Certificates Yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Complete your first course to earn a certificate!
                    </p>
                    <Button onClick={() => navigate("/courses")}>
                      Browse Courses
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {selectedCertificate && (
            <TabsContent value="view">
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Preview</CardTitle>
                  <CardDescription>
                    Preview and download your certificate
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CertificateGenerator
                    certificate={{
                      studentName: user.name,
                      courseName: selectedCertificate.title,
                      instructorName: selectedCertificate.instructor,
                      completionDate: selectedCertificate.completedDate,
                      certificateId: selectedCertificate.certificateId,
                      grade: selectedCertificate.grade,
                    }}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default StudentCertificates;
