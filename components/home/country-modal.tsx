"use client";

import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import countries from "world-countries";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { tasksApi } from "@/lib/api/tasks";

interface CountryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// Get country names and sort them
const COUNTRIES = countries.map((country) => country.name.common).sort();

export function CountryModal({
  open,
  onOpenChange,
  onSuccess,
}: CountryModalProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSelectedCountry("");
    }
  }, [open]);

  const updateCountryMutation = useMutation({
    mutationFn: (country: string) => tasksApi.updateUser({ country }),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Country updated successfully!");
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(data.message || "Failed to update country");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update country");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCountry) {
      toast.error("Please select a country");
      return;
    }

    updateCountryMutation.mutate(selectedCountry);
  };

  const isLoading = updateCountryMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-[#11042F]/95 to-[#020106]/95 backdrop-blur-xl border border-[#2a2a4e]/50 rounded-3xl shadow-2xl shadow-[#EE4FFB]/10 p-0 overflow-hidden">
        <div className="relative">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EE4FFB]/5 to-[#28A9A3]/5 opacity-50"></div>

          <div className="flex flex-col items-center justify-center h-full relative z-10">
            <DialogTitle className="sr-only">Select Country</DialogTitle>

            <div className="p-4 lg:p-8 w-full">
              <div className="text-center space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="p-3 bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] rounded-2xl w-fit mx-auto">
                    <X className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Select Country
                  </h2>
                  <p className="text-[#A5A9C1] text-sm">
                    Please select your country of residence
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-left">
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Country
                    </label>
                    <Select
                      value={selectedCountry}
                      onValueChange={setSelectedCountry}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-full bg-white/5 border border-white/20 rounded-2xl px-4 py-3 text-white focus:border-[#EE4FFB] focus:outline-none focus:ring-2 focus:ring-[#EE4FFB]/20 transition-all duration-300">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#11042F]/95 backdrop-blur-xl border border-[#2a2a4e]/50 max-h-60 rounded-2xl">
                        {COUNTRIES.map((country) => (
                          <SelectItem
                            key={country}
                            value={country}
                            className="text-white hover:bg-white/10 focus:bg-white/10 transition-colors duration-300"
                          >
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !selectedCountry}
                    className="w-full bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] hover:from-[#FF6B9D] hover:to-[#EE4FFB] text-white py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#EE4FFB]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Updating...
                      </div>
                    ) : (
                      "Update Country"
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/20">
                  <h3 className="text-sm font-medium text-white mb-2">
                    Location Information:
                  </h3>
                  <p className="text-xs text-[#A5A9C1]">
                    Your country information helps us provide localized content
                    and comply with regional regulations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
