"use client";

import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { tasksApi } from "@/lib/api/tasks";
import { Input } from "../ui/input";

interface AgeDobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AgeDobModal({
  open,
  onOpenChange,
  onSuccess,
}: AgeDobModalProps) {
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setDateOfBirth(null);
    }
  }, [open]);

  const updateDobMutation = useMutation({
    mutationFn: (dob: string) => tasksApi.updateUser({ dob }),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Date of birth updated successfully!");
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(data.message || "Failed to update date of birth");
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update date of birth"
      );
    },
  });

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }

    return age;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dateOfBirth) {
      toast.error("Please select your date of birth");
      return;
    }

    const age = calculateAge(dateOfBirth);

    if (age > 120) {
      toast.error("Please enter a valid date of birth");
      return;
    }

    // Format date as YYYY-MM-DD
    const formattedDate = dateOfBirth.toISOString().split("T")[0];
    updateDobMutation.mutate(formattedDate);
  };

  const isLoading = updateDobMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-[#11042F]/95 to-[#020106]/95 backdrop-blur-xl border border-[#2a2a4e]/50 rounded-3xl shadow-2xl shadow-[#EE4FFB]/10 p-0 overflow-hidden">
        <div className="relative">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EE4FFB]/5 to-[#28A9A3]/5 opacity-50"></div>

          <div className="flex flex-col items-center justify-center h-full relative z-10">
            <DialogTitle className="sr-only">Select Date of Birth</DialogTitle>

            <div className="p-4 lg:p-8 w-full">
              <div className="text-center space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="p-3 bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] rounded-2xl w-fit mx-auto">
                    <X className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Date of Birth
                  </h2>
                  <p className="text-[#A5A9C1] text-sm">
                    Please select your date of birth
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-left">
                    <label
                      htmlFor="dob"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Date of Birth
                    </label>
                    <div className="w-full">
                      <Input
                        type="date"
                        value={dateOfBirth?.toISOString().split("T")[0]}
                        onChange={(e) =>
                          setDateOfBirth(new Date(e.target.value))
                        }
                        disabled={isLoading}
                        className="w-full bg-white/5 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:border-[#EE4FFB] focus:outline-none focus:ring-2 focus:ring-[#EE4FFB]/20 transition-all duration-300"
                      />
                    </div>

                    {dateOfBirth && (
                      <p className="text-xs text-[#EE4FFB] mt-2 font-medium">
                        Age: {calculateAge(dateOfBirth)} years
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !dateOfBirth}
                    className="w-full bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] hover:from-[#FF6B9D] hover:to-[#EE4FFB] text-white py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#EE4FFB]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Updating...
                      </div>
                    ) : (
                      "Update Date of Birth"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Custom styles for react-datepicker */}
      <style jsx global>{`
        .react-datepicker {
          background-color: #1f2937 !important;
          border: 1px solid #4b5563 !important;
          border-radius: 8px !important;
          color: white !important;
        }

        .react-datepicker__header {
          background-color: #374151 !important;
          border-bottom: 1px solid #4b5563 !important;
          color: white !important;
        }

        .react-datepicker__current-month,
        .react-datepicker__day-name {
          color: white !important;
        }

        .react-datepicker__day {
          color: #d1d5db !important;
        }

        .react-datepicker__day:hover {
          background-color: #4b5563 !important;
          color: white !important;
        }

        .react-datepicker__day--selected {
          background-color: #7c3aed !important;
          color: white !important;
        }

        .react-datepicker__day--keyboard-selected {
          background-color: #6d28d9 !important;
          color: white !important;
        }

        .react-datepicker__navigation {
          border: none !important;
        }

        .react-datepicker__navigation--previous {
          border-right-color: white !important;
        }

        .react-datepicker__navigation--next {
          border-left-color: white !important;
        }

        .react-datepicker__month-select,
        .react-datepicker__year-select {
          background-color: #374151 !important;
          color: white !important;
          border: 1px solid #4b5563 !important;
        }

        .react-datepicker__day--outside-month {
          color: #6b7280 !important;
        }

        .react-datepicker__day--disabled {
          color: #4b5563 !important;
        }
      `}</style>
    </Dialog>
  );
}
