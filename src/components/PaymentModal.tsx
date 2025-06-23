import { useState } from "react";
import QRCode from "react-qr-code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  CreditCard,
  Smartphone,
  Copy,
  Check,
  Clock,
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    title: string;
    price: number;
    instructor: string;
  };
  onPaymentSuccess: () => void;
}

const PaymentModal = ({
  isOpen,
  onClose,
  course,
  onPaymentSuccess,
}: PaymentModalProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card">("upi");
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "success" | "failed"
  >("pending");
  const [copied, setCopied] = useState(false);

  const upiId = "learnhub@upi";
  const upiString = `upi://pay?pa=${upiId}&pn=LearnHub&am=${course.price}&cu=USD&tn=Course: ${course.title}`;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulatePayment = () => {
    setPaymentStatus("processing");

    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus("success");
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
        setPaymentStatus("pending");
      }, 2000);
    }, 3000);
  };

  const handleCardPayment = () => {
    // In a real app, this would integrate with Stripe, Razorpay, etc.
    simulatePayment();
  };

  if (paymentStatus === "success") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Payment Successful!
            </h2>
            <p className="text-muted-foreground mb-4">
              You have successfully enrolled in "{course.title}"
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to course...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
          <DialogDescription>
            Choose your preferred payment method to enroll in the course
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Course Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">{course.title}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Instructor: {course.instructor}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${course.price}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h3 className="font-semibold">Select Payment Method</h3>

            <div className="grid gap-3">
              {/* UPI Payment */}
              <Card
                className={`cursor-pointer transition-all ${
                  paymentMethod === "upi" ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setPaymentMethod("upi")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">UPI Payment</p>
                      <p className="text-sm text-muted-foreground">
                        Pay using UPI apps like GPay, PhonePe, Paytm
                      </p>
                    </div>
                    <Badge variant="secondary">Recommended</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Card Payment */}
              <Card
                className={`cursor-pointer transition-all ${
                  paymentMethod === "card" ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-muted-foreground">
                        Pay securely with your card
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Payment Details */}
          {paymentMethod === "upi" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span>UPI Payment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Scan QR code or copy UPI ID to pay
                  </p>

                  {/* QR Code */}
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-white rounded-lg border">
                      <QRCode
                        value={upiString}
                        size={200}
                        level="L"
                        includeMargin={true}
                      />
                    </div>
                  </div>

                  {/* UPI ID */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Or copy UPI ID:</p>
                    <div className="flex items-center justify-center space-x-2">
                      <code className="px-3 py-2 bg-muted rounded text-sm font-mono">
                        {upiId}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyUPI}
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground mt-4">
                    Amount: ${course.price} | Reference: Course Purchase
                  </p>
                </div>

                {paymentStatus === "processing" ? (
                  <div className="text-center py-4">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-2 animate-spin" />
                    <p className="text-sm text-muted-foreground">
                      Processing payment...
                    </p>
                  </div>
                ) : (
                  <Button className="w-full" onClick={simulatePayment}>
                    I have made the payment
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {paymentMethod === "card" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Card Payment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {paymentStatus === "processing" ? (
                  <div className="text-center py-8">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-2 animate-spin" />
                    <p className="text-sm text-muted-foreground">
                      Processing payment...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      In a real application, this would integrate with payment
                      processors like Stripe, Razorpay, or similar services.
                    </p>
                    <Button className="w-full" onClick={handleCardPayment}>
                      Pay ${course.price} with Card (Demo)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
