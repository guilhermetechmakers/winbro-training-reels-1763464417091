import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function EmailVerificationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isResending, setIsResending] = useState(false);
  const token = searchParams.get("token");
  const verified = token !== null; // In real app, verify token with API

  const handleResend = async () => {
    setIsResending(true);
    try {
      // TODO: Implement resend verification email API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Verification email sent!");
    } catch (error) {
      toast.error("Failed to send verification email");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            {verified ? (
              <>
                <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
                <CardTitle className="text-2xl">Email Verified!</CardTitle>
                <CardDescription>
                  Your email has been successfully verified.
                </CardDescription>
              </>
            ) : (
              <>
                <Mail className="h-16 w-16 text-primary mx-auto mb-4" />
                <CardTitle className="text-2xl">Check Your Email</CardTitle>
                <CardDescription>
                  We've sent a verification link to your email address.
                </CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {!verified && (
              <>
                <p className="text-sm text-text-secondary text-center">
                  Click the link in the email to verify your account. If you don't see it, check your spam folder.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleResend}
                  disabled={isResending}
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              </>
            )}
            <Button
              className="w-full"
              onClick={() => navigate(verified ? "/dashboard" : "/login")}
            >
              {verified ? "Continue to Dashboard" : "Back to Login"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
