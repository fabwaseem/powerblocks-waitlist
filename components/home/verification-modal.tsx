"use client";

import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { authApi, VerifyCodeData } from "@/lib/auth-api";
import { useAuth } from "@/hooks/use-auth";

interface VerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  type: "signup" | "signin" | "waitlist";
  onResendCode: () => void;
}

export function VerificationModal({
  open,
  onOpenChange,
  email,
  type,
  onResendCode,
}: VerificationModalProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { refetch } = useAuth();

  // Timer countdown
  useEffect(() => {
    if (open && timeLeft > 0) {
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
  }, [open, timeLeft]);

  // Reset timer when modal opens
  useEffect(() => {
    if (open) {
      setTimeLeft(300);
      setCode(["", "", "", "", "", ""]);
    }
  }, [open]);

  const verifyMutation = useMutation({
    mutationFn: authApi.verifyCode,
    onSuccess: (data) => {
      refetch();
      localStorage.setItem("accessToken", data.accessToken);
      toast.success(
        type === "signup"
          ? "Account created successfully!"
          : type === "waitlist"
          ? "Welcome to the waitlist!"
          : "Welcome back!"
      );
      onOpenChange(false);
    },
    onError: () => {
      // Error handling is done by axios interceptor
      // setCode(["", "", "", "", "", ""]);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    },
  });

  const handleInputChange = (index: number, value: string) => {
    // Handle paste - if more than 1 character, it's likely a paste
    if (value.length > 1) {
      const pastedCode = value.replace(/\D/g, "").slice(0, 6);
      const newCode = [...code];

      // Fill the inputs starting from current index
      for (let i = 0; i < pastedCode.length && index + i < 6; i++) {
        newCode[index + i] = pastedCode[i];
      }

      setCode(newCode);

      // Focus the next empty input or the last filled input
      const nextIndex = Math.min(index + pastedCode.length, 5);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex]?.focus();
      }

      // Auto-submit if all fields are filled
      if (
        newCode.every((digit) => digit !== "") &&
        newCode.join("").length === 6
      ) {
        handleSubmit(newCode.join(""));
      }
      return;
    }

    // Handle single character input
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (
      newCode.every((digit) => digit !== "") &&
      newCode.join("").length === 6
    ) {
      handleSubmit(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (index: number, e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedCode = pastedData.replace(/\D/g, "").slice(0, 6);

    if (pastedCode.length > 0) {
      const newCode = [...code];

      // Fill the inputs starting from current index
      for (let i = 0; i < pastedCode.length && index + i < 6; i++) {
        newCode[index + i] = pastedCode[i];
      }

      setCode(newCode);

      // Focus the next empty input or the last filled input
      const nextIndex = Math.min(index + pastedCode.length, 5);
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex]?.focus();
      }

      // Auto-submit if all fields are filled
      if (
        newCode.every((digit) => digit !== "") &&
        newCode.join("").length === 6
      ) {
        handleSubmit(newCode.join(""));
      }
    }
  };

  const handleSubmit = (codeString: string) => {
    const verifyData: VerifyCodeData = {
      email,
      code: codeString,
      type,
    };

    verifyMutation.mutate(verifyData);
  };

  const handleResendCode = () => {
    setTimeLeft(300);
    setCode(["", "", "", "", "", ""]);
    onResendCode();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const isLoading = verifyMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-[#11042F]/95 to-[#020106]/95 backdrop-blur-xl border border-[#2a2a4e]/50 rounded-3xl shadow-2xl shadow-[#EE4FFB]/10 p-0 overflow-hidden">
        <div className="relative">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EE4FFB]/5 to-[#28A9A3]/5 opacity-50"></div>

          <div className="flex flex-col items-center justify-center h-full relative z-10">
            <DialogTitle className="sr-only">One-Time Password</DialogTitle>

            <div className="p-4 lg:p-8 w-full">
              <div className="text-center space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="p-3 bg-gradient-to-r from-[#28A9A3] to-[#00D4FF] rounded-2xl w-fit mx-auto">
                    <X className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    One-Time Password
                  </h2>
                  <p className="text-[#A5A9C1] text-sm">
                    Enter the verification code sent to your email
                  </p>
                </div>

                {/* OTP Input Boxes */}
                <div className="flex justify-center gap-3 mb-6">
                  {code.map((digit, index) => (
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
                        handleInputChange(
                          index,
                          e.target.value.replace(/\D/g, "")
                        )
                      }
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={(e) => handlePaste(index, e)}
                      className="size-10 lg:size-12 text-center text-white text-lg font-mono bg-white/5 border border-white/20 rounded-2xl focus:border-[#EE4FFB] focus:outline-none focus:ring-2 focus:ring-[#EE4FFB]/20 transition-all duration-300 hover:border-[#EE4FFB]/50"
                      disabled={isLoading}
                    />
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-[#A5A9C1] text-sm">
                    Verification code sent to
                  </p>
                  <p className="text-white text-sm font-medium">{email}</p>
                </div>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={timeLeft > 0 || isLoading}
                  className="text-[#EE4FFB] hover:text-[#FF6B9D] text-sm disabled:text-gray-600 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {timeLeft > 0
                    ? `Resend a code (${formatTime(timeLeft)})`
                    : "Resend a code"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
