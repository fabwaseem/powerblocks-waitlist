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
      <DialogContent
        className="w-full max-w-lg! min-h-[500px] mx-4 p-0  border border-white/10 overflow-hidden rounded-xl "
        showCloseButton={false}
        style={{
          background: "linear-gradient(to bottom, #11042F, #04010E)",
        }}
      >
        <div className="relative">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex flex-col items-center justify-center h-full">
            <DialogTitle className="sr-only">One-Time Password</DialogTitle>

            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  One-Time Password
                </h2>

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
                      className="w-12 h-12 text-center text-white text-lg font-mono bg-transparent border border-gray-500 rounded-lg focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20 transition-colors"
                      disabled={isLoading}
                    />
                  ))}
                </div>

                <p className="text-gray-400 text-sm mb-2">
                  Enter the verification code sent as a message to
                </p>
                <p className="text-white text-sm mb-6">{email}</p>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={timeLeft > 0 || isLoading}
                  className="text-purple-400 hover:text-purple-300 text-sm disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
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
