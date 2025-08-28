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
      <DialogContent
        className="w-full max-w-lg min-h-[400px] mx-4 p-0 border border-white/10 overflow-hidden rounded-xl"
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
            <DialogTitle className="sr-only">Select Gender</DialogTitle>

            <div className="p-8 w-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Select Gender
                </h2>
                <p className="text-gray-400 text-sm mb-8">
                  Please select your gender
                </p>

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
                      <SelectTrigger className="w-full bg-transparent border border-gray-500 rounded-lg px-4 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20">
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        {genderOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-white hover:bg-gray-800 focus:bg-gray-800"
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
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Updating..." : "Update Gender"}
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
