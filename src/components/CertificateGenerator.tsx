import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface CertificateProps {
  studentName: string;
  courseName: string;
  instructorName: string;
  completionDate: string;
  certificateId: string;
  grade?: string;
}

const CertificateTemplate = ({
  studentName,
  courseName,
  instructorName,
  completionDate,
  certificateId,
  grade = "A",
}: CertificateProps) => {
  return (
    <div
      className="w-[800px] h-[600px] bg-white border-4 border-blue-600 relative overflow-hidden"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      {/* Header */}
      <div className="text-center pt-6 pb-4">
        <div className="flex items-center justify-center mb-2">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
            LH
          </div>
        </div>
        <h1 className="text-2xl font-bold text-blue-600 mb-1">LearnHub</h1>
        <p className="text-blue-500 text-sm">
          Your Center for Skill Enhancement
        </p>
      </div>

      {/* Certificate Title */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Certificate of Completion
        </h2>
        <div className="w-24 h-0.5 bg-gray-400 mx-auto"></div>
      </div>

      {/* Content */}
      <div className="px-16 text-center space-y-1">
        <p className="text-sm text-gray-600">This is to certify that</p>

        <h3 className="text-2xl font-bold text-blue-600 py-2">{studentName}</h3>

        <p className="text-sm text-gray-600">
          has successfully completed the course
        </p>

        <h4 className="text-lg font-semibold text-gray-800 py-2">
          "{courseName}"
        </h4>
      </div>

      {/* Footer - positioned to stay within bounds */}
      <div className="absolute bottom-40 left-0 right-0 text-center px-16">
        <p className="text-xs text-gray-500 mb-1">
          Certificate ID: CERT-COURSE-{certificateId}
        </p>
        <p className="text-xs text-gray-400">
          Verify at learnhub.com/verify • CERT COURSE • learnahub2024
        </p>
      </div>

      {/* Company Seal */}
      <div className="absolute bottom-8 right-8">
        <div className="w-16 h-16 border-2 border-blue-600 rounded-full flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="text-blue-600 font-bold text-xs">LEARN</div>
            <div className="text-blue-600 font-bold text-xs">HUB</div>
            <div className="text-xs text-blue-400">2024</div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CertificateGeneratorProps {
  certificate: {
    studentName: string;
    courseName: string;
    instructorName: string;
    completionDate: string;
    certificateId: string;
    grade?: string;
  };
  className?: string;
}

const CertificateGenerator = ({
  certificate,
  className,
}: CertificateGeneratorProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadCertificateAsPDF = async () => {
    if (!certificateRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      // Dynamic imports to ensure libraries are loaded
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      console.log("Starting PDF generation...");

      // Create a temporary full-size certificate for capture
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.top = "-9999px";
      tempDiv.style.left = "-9999px";
      tempDiv.innerHTML = certificateRef.current.innerHTML;
      document.body.appendChild(tempDiv);

      // Wait a moment for rendering
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Create canvas from certificate element
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        width: 800,
        height: 600,
      });

      // Remove temporary div
      document.body.removeChild(tempDiv);

      console.log("Canvas created successfully");

      // Create PDF
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [800, 600],
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      pdf.addImage(imgData, "PNG", 0, 0, 800, 600);

      // Generate filename
      const fileName = `${certificate.courseName.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_")}_Certificate_${certificate.studentName.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_")}.pdf`;

      console.log("Saving PDF as:", fileName);

      // Download the PDF
      pdf.save(fileName);

      console.log("PDF download initiated");
    } catch (error) {
      console.error("Error generating PDF certificate:", error);
      alert(
        `Failed to generate PDF certificate: ${error.message || "Unknown error"}`,
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadCertificateAsImage = async () => {
    if (!certificateRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      // Dynamic import
      const { default: html2canvas } = await import("html2canvas");

      console.log("Starting image generation...");

      // Create a temporary full-size certificate for capture
      const tempDiv = document.createElement("div");
      tempDiv.style.position = "absolute";
      tempDiv.style.top = "-9999px";
      tempDiv.style.left = "-9999px";
      tempDiv.innerHTML = certificateRef.current.innerHTML;
      document.body.appendChild(tempDiv);

      // Wait a moment for rendering
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Create canvas from certificate element
      const canvas = await html2canvas(tempDiv, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        width: 800,
        height: 600,
      });

      // Remove temporary div
      document.body.removeChild(tempDiv);

      console.log("Canvas created successfully");

      // Convert canvas to blob and download
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            const fileName = `${certificate.courseName.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_")}_Certificate_${certificate.studentName.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_")}.png`;

            link.href = url;
            link.download = fileName;
            link.style.display = "none";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up
            setTimeout(() => URL.revokeObjectURL(url), 100);

            console.log("Image download initiated");
          } else {
            throw new Error("Failed to create image blob");
          }
        },
        "image/png",
        0.95,
      );
    } catch (error) {
      console.error("Error generating image certificate:", error);
      alert(
        `Failed to generate image certificate: ${error.message || "Unknown error"}`,
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={className}>
      {/* Certificate preview and download */}
      <div className="space-y-6">
        {/* Certificate template */}
        <div className="flex justify-center">
          <div
            ref={certificateRef}
            className="transform scale-75 origin-center"
          >
            <CertificateTemplate {...certificate} />
          </div>
        </div>

        {/* Download buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={downloadCertificateAsPDF}
            className="flex items-center space-x-2"
            data-download-pdf
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>
              {isDownloading ? "Generating PDF..." : "Download as PDF"}
            </span>
          </Button>
          <Button
            onClick={downloadCertificateAsImage}
            variant="outline"
            className="flex items-center space-x-2"
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>
              {isDownloading ? "Generating Image..." : "Download as Image"}
            </span>
          </Button>
        </div>

        {/* Print option */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            You can also{" "}
            <button
              onClick={() => window.print()}
              className="text-primary hover:underline"
            >
              print this page
            </button>{" "}
            to save the certificate.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerator;
