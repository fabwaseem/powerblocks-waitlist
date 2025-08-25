"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
}

export function OTPModal({ isOpen, onClose, email }: OTPModalProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return;

    setIsLoading(true);
    try {
      // TODO: Implement OTP verification logic here
      console.log("OTP submitted:", otp);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Close modal on success
      onClose();
      setOtp("");
    } catch (error) {
      console.error("OTP verification failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement resend OTP logic here
      console.log("Resending OTP to:", email);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#282830] border border-gray-600 max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-white text-2xl font-bold mb-6">
            OTP
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <p className="text-gray-300 text-sm mb-4">
              Enter the verification code sent to
            </p>
            <p className="text-white font-medium mb-6">
              {email || "your email"}
            </p>
          </div>

          <div className="flex justify-center">
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              maxLength={6}
              className="text-center text-lg font-bold tracking-widest"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={!otp.trim() || isLoading}
              className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold uppercase"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleResendOTP}
              disabled={isLoading}
              className="w-full h-10 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              {isLoading ? "Sending..." : "Resend OTP"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
