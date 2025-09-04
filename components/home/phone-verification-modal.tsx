"use client";

import { X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { tasksApi } from "@/lib/api/tasks";

interface PhoneVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PhoneVerificationModal({
  open,
  onOpenChange,
  onSuccess,
}: PhoneVerificationModalProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
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
      setStep("phone");
      setPhoneNumber("");
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(300);
    }
  }, [open]);

  const sendOtpMutation = useMutation({
    mutationFn: tasksApi.sendPhoneOtp,
    onSuccess: () => {
      setStep("otp");
      setTimeLeft(300);
      toast.success("OTP sent to your phone number!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ phoneNumber, otp }: { phoneNumber: string; otp: string }) =>
      tasksApi.verifyPhoneOtp(phoneNumber, otp),
    onSuccess: async (data) => {
      if (data.success) {
        toast.success("Phone verified successfully!");
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

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters except +
    const cleaned = value.replace(/[^\d+]/g, "");

    // Ensure it starts with + if it has digits
    if (cleaned.length > 0 && !cleaned.startsWith("+")) {
      return "+" + cleaned;
    }

    return cleaned;
  };

  const validatePhoneNumber = (phone: string) => {
    // Basic validation: should start with + and have 10-15 digits
    const phoneRegex = /^\+\d{10,15}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhoneNumber(phoneNumber)) {
      toast.error(
        "Please enter a valid phone number with country code (e.g., +1234567890)"
      );
      return;
    }

    sendOtpMutation.mutate(phoneNumber);
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
      phoneNumber,
      otp: otpString,
    });
  };

  const handleResendOtp = () => {
    setTimeLeft(300);
    setOtp(["", "", "", "", "", ""]);
    sendOtpMutation.mutate(phoneNumber);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const isLoading = sendOtpMutation.isPending || verifyOtpMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          background: "linear-gradient(to bottom, #11042F, #04010E)",
        }}
      >
        <div className="relative">

          <div className="flex flex-col items-center justify-center h-full">
            <DialogTitle className="sr-only">
              {step === "phone"
                ? "Phone Verification"
                : "Phone OTP Verification"}
            </DialogTitle>

            <div className="lg:p-8 w-full">
              {step === "phone" ? (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Verify Phone Number
                  </h2>

                  <form onSubmit={handlePhoneSubmit} className="space-y-6">
                    <div className="text-left">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1234567890"
                        value={phoneNumber}
                        onChange={(e) =>
                          setPhoneNumber(formatPhoneNumber(e.target.value))
                        }
                        className="w-full bg-transparent border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                        disabled={isLoading}
                        required
                      />
                      <p className="text-xs text-gray-400 mt-2">
                        Enter your phone number with country code (e.g., +1 for
                        US)
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !phoneNumber.trim()}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Sending..." : "Send Verification Code"}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-6">
                    Enter Verification Code
                  </h2>

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
                        className="w-12 h-12 text-center text-white text-lg font-mono bg-transparent border border-gray-500 rounded-lg focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-colors"
                        disabled={isLoading}
                      />
                    ))}
                  </div>

                  <p className="text-gray-400 text-sm mb-2">
                    Enter the verification code sent to
                  </p>
                  <p className="text-white text-sm mb-6">{phoneNumber}</p>

                  <div className="flex flex-col gap-4">
                    <button
                      type="button"
                      onClick={() => setStep("phone")}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      Change phone number
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={timeLeft > 0 || isLoading}
                      className="text-purple-400 hover:text-purple-300 text-sm disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
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
