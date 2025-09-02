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
      <DialogContent
        className="w-full max-w-lg min-h-[450px] mx-4 p-0 border border-white/10 overflow-hidden rounded-xl"
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
            <DialogTitle className="sr-only">Select Date of Birth</DialogTitle>

            <div className="p-8 w-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Date of Birth
                </h2>
                <p className="text-gray-400 text-sm mb-8">
                  Please select your date of birth
                </p>

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
                      />
                    </div>

                    {dateOfBirth && (
                      <p className="text-xs text-purple-400 mt-1">
                        Age: {calculateAge(dateOfBirth)} years
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !dateOfBirth}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Updating..." : "Update Date of Birth"}
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
