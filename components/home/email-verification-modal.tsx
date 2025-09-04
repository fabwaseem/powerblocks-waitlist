"use client";

import { X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { tasksApi } from "@/lib/api/tasks";

interface EmailVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EmailVerificationModal({
  open,
  onOpenChange,
  onSuccess,
}: EmailVerificationModalProps) {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for OTP
  useEffect(() => {
    if (open && step === "otp" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [open, step, timeLeft]);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setStep("email");
      setEmail("");
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(300);
    }
  }, [open]);

  const sendOtpMutation = useMutation({
    mutationFn: tasksApi.sendEmailOtp,
    onSuccess: () => {
      setStep("otp");
      setTimeLeft(300);
      toast.success("OTP sent to your email address!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      tasksApi.verifyEmailOtp(email, otp),
    onSuccess: async (data) => {
      if (data.success) {
        toast.success("Email verified successfully!");
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast.error("Invalid OTP. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to verify OTP");
      setOtp(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    },
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    sendOtpMutation.mutate(email);
  };

  const handleOtpInputChange = (index: number, value: string) => {
    // Handle paste - if more than 1 character, it's likely a paste
    if (value.length > 1) {
      const pastedCode = value.replace(/\D/g, "").slice(0, 6);
      const newOtp = [...otp];

      // Fill the inputs starting from current index
      for (let i = 0; i < pastedCode.length && index + i < 6; i++) {
        newOtp[index + i] = pastedCode[i];
      }

      setOtp(newOtp);

      // Focus the next empty input or the last filled input
      const nextIndex = Math.min(index + pastedCode.length, 5);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex]?.focus();
      }

      // Auto-submit if all fields are filled
      if (
        newOtp.every((digit) => digit !== "") &&
        newOtp.join("").length === 6
      ) {
        handleOtpSubmit(newOtp.join(""));
      }
      return;
    }

    // Handle single character input
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 6) {
      handleOtpSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (index: number, e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedCode = pastedData.replace(/\D/g, "").slice(0, 6);

    if (pastedCode.length > 0) {
      const newOtp = [...otp];

      // Fill the inputs starting from current index
      for (let i = 0; i < pastedCode.length && index + i < 6; i++) {
        newOtp[index + i] = pastedCode[i];
      }

      setOtp(newOtp);

      // Focus the next empty input or the last filled input
      const nextIndex = Math.min(index + pastedCode.length, 5);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex]?.focus();
      }

      // Auto-submit if all fields are filled
      if (
        newOtp.every((digit) => digit !== "") &&
        newOtp.join("").length === 6
      ) {
        handleOtpSubmit(newOtp.join(""));
      }
    }
  };

  const handleOtpSubmit = (otpString: string) => {
    verifyOtpMutation.mutate({
      email,
      otp: otpString,
    });
  };

  const handleResendOtp = () => {
    setTimeLeft(300);
    setOtp(["", "", "", "", "", ""]);
    sendOtpMutation.mutate(email);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const isLoading = sendOtpMutation.isPending || verifyOtpMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-[#11042F]/95 to-[#020106]/95 backdrop-blur-xl border border-[#2a2a4e]/50 rounded-3xl shadow-2xl shadow-[#EE4FFB]/10 p-0 overflow-hidden">
        <div className="relative">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EE4FFB]/5 to-[#28A9A3]/5 opacity-50"></div>

          <div className="flex flex-col items-center justify-center h-full relative z-10">
            <DialogTitle className="sr-only">
              {step === "email"
                ? "Email Verification"
                : "Email OTP Verification"}
            </DialogTitle>

            <div className="p-4 lg:p-8 w-full">
              {step === "email" ? (
                <div className="text-center space-y-6">
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="p-3 bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] rounded-2xl w-fit mx-auto">
                      <X className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Verify Email Address
                    </h2>
                    <p className="text-[#A5A9C1] text-sm">
                      We'll send a verification code to your email
                    </p>
                  </div>

                  <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <div className="text-left">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:border-[#EE4FFB] focus:outline-none focus:ring-2 focus:ring-[#EE4FFB]/20 transition-all duration-300"
                        disabled={isLoading}
                        required
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        Enter your email address to receive the verification
                        code
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !email.trim()}
                      className="w-full bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] hover:from-[#FF6B9D] hover:to-[#EE4FFB] text-white py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#EE4FFB]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Sending...
                        </div>
                      ) : (
                        "Send Verification Code"
                      )}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="p-3 bg-gradient-to-r from-[#28A9A3] to-[#00D4FF] rounded-2xl w-fit mx-auto">
                      <X className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Enter Verification Code
                    </h2>
                    <p className="text-[#A5A9C1] text-sm">
                      Check your email for the verification code
                    </p>
                  </div>

                  {/* OTP Input Boxes */}
                  <div className="flex justify-center gap-3 mb-6">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          if (el) {
                            inputRefs.current[index] = el;
                          }
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]"
                        maxLength={1}
                        value={digit}
                        onChange={(e) =>
                          handleOtpInputChange(
                            index,
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={(e) => handlePaste(index, e)}
                        className="w-12 h-12 text-center text-white text-lg font-mono bg-white/5 border border-white/20 rounded-2xl focus:border-[#EE4FFB] focus:outline-none focus:ring-2 focus:ring-[#EE4FFB]/20 transition-all duration-300 hover:border-[#EE4FFB]/50"
                        disabled={isLoading}
                      />
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">
                      Verification code sent to
                    </p>
                    <p className="text-white text-sm font-medium">{email}</p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setStep("email")}
                      className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
                    >
                      Change email address
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={timeLeft > 0 || isLoading}
                      className="text-[#EE4FFB] hover:text-[#FF6B9D] text-sm disabled:text-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
                    >
                      {timeLeft > 0
                        ? `Resend code (${formatTime(timeLeft)})`
                        : "Resend code"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
