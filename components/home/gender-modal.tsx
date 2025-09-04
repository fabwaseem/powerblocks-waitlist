"use client";

import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Gender, tasksApi } from "@/lib/api/tasks";

interface GenderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function GenderModal({
  open,
  onOpenChange,
  onSuccess,
}: GenderModalProps) {
  const [selectedGender, setSelectedGender] = useState<Gender | "">("");

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedGender("");
    }
  }, [open]);

  const updateGenderMutation = useMutation({
    mutationFn: (gender: Gender) => tasksApi.updateUser({ gender }),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Gender updated successfully!");
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(data.message || "Failed to update gender");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update gender");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGender) {
      toast.error("Please select a gender");
      return;
    }

    updateGenderMutation.mutate(selectedGender as Gender);
  };

  const isLoading = updateGenderMutation.isPending;

  const genderOptions = [
    { value: Gender.MALE, label: "Male" },
    { value: Gender.FEMALE, label: "Female" },
    { value: Gender.OTHER, label: "Other" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-[#11042F]/95 to-[#020106]/95 backdrop-blur-xl border border-[#2a2a4e]/50 rounded-3xl shadow-2xl shadow-[#EE4FFB]/10 p-0 overflow-hidden">
        <div className="relative">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EE4FFB]/5 to-[#28A9A3]/5 opacity-50"></div>

          <div className="flex flex-col items-center justify-center h-full relative z-10">
            <DialogTitle className="sr-only">Select Gender</DialogTitle>

            <div className="p-4 lg:p-8 w-full">
              <div className="text-center space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="p-3 bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] rounded-2xl w-fit mx-auto">
                    <X className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Select Gender
                  </h2>
                  <p className="text-[#A5A9C1] text-sm">
                    Please select your gender
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-left">
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Gender
                    </label>
                    <Select
                      value={selectedGender}
                      onValueChange={(value) =>
                        setSelectedGender(value as Gender)
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-full bg-white/5 border border-white/20 rounded-2xl px-4 py-3 text-white focus:border-[#EE4FFB] focus:outline-none focus:ring-2 focus:ring-[#EE4FFB]/20 transition-all duration-300">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#11042F]/95 backdrop-blur-xl border border-[#2a2a4e]/50 rounded-2xl">
                        {genderOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-white hover:bg-white/10 focus:bg-white/10 transition-colors duration-300"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !selectedGender}
                    className="w-full bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] hover:from-[#FF6B9D] hover:to-[#EE4FFB] text-white py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#EE4FFB]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Updating...
                      </div>
                    ) : (
                      "Update Gender"
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
