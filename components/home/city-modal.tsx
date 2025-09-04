"use client";

import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { tasksApi } from "@/lib/api/tasks";

interface CityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CityModal({ open, onOpenChange, onSuccess }: CityModalProps) {
  const [city, setCity] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setCity("");
    }
  }, [open]);

  const updateCityMutation = useMutation({
    mutationFn: (city: string) => tasksApi.updateUser({ city }),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("City updated successfully!");
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(data.message || "Failed to update city");
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update city");
    },
  });

  const validateCity = (city: string) => {
    // Basic validation for city names
    if (city.length < 2) {
      return "City name must be at least 2 characters long";
    }

    if (city.length > 50) {
      return "City name must be 50 characters or less";
    }

    // Allow letters, spaces, hyphens, apostrophes, and periods
    const cityRegex = /^[a-zA-Z\s\-'.]+$/;
    if (!cityRegex.test(city)) {
      return "City name can only contain letters, spaces, hyphens, apostrophes, and periods";
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedCity = city.trim();

    if (!trimmedCity) {
      toast.error("Please enter your city");
      return;
    }

    const validationError = validateCity(trimmedCity);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    updateCityMutation.mutate(trimmedCity);
  };

  const handleCityChange = (value: string) => {
    // Allow basic formatting while typing
    setCity(value);
  };

  const isLoading = updateCityMutation.isPending;
  const validationError = city ? validateCity(city.trim()) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-[#11042F]/95 to-[#020106]/95 backdrop-blur-xl border border-[#2a2a4e]/50 rounded-3xl shadow-2xl shadow-[#EE4FFB]/10 p-0 overflow-hidden">
        <div className="relative">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EE4FFB]/5 to-[#28A9A3]/5 opacity-50"></div>

          <div className="flex flex-col items-center justify-center h-full relative z-10">
            <DialogTitle className="sr-only">Enter City</DialogTitle>

            <div className="p-4 lg:p-8 w-full">
              <div className="text-center space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="p-3 bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] rounded-2xl w-fit mx-auto">
                    <X className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Enter City</h2>
                  <p className="text-[#A5A9C1] text-sm">
                    Please enter your city or province
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-left">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      City / Province
                    </label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Enter your city or province"
                      value={city}
                      onChange={(e) => handleCityChange(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:border-[#EE4FFB] focus:outline-none focus:ring-2 focus:ring-[#EE4FFB]/20 transition-all duration-300"
                      disabled={isLoading}
                      required
                      minLength={2}
                      maxLength={50}
                    />
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-[#A5A9C1]">
                        Enter the name of your city, town, or province
                      </p>
                      {validationError && (
                        <p className="text-xs text-red-400">
                          {validationError}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !city.trim() || !!validationError}
                    className="w-full bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] hover:from-[#FF6B9D] hover:to-[#EE4FFB] text-white py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#EE4FFB]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Updating...
                      </div>
                    ) : (
                      "Update City"
                    )}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/20">
                  <h3 className="text-sm font-medium text-white mb-2">
                    Location Guidelines:
                  </h3>
                  <ul className="text-xs text-[#A5A9C1] space-y-1 text-left">
                    <li>• Enter your current city or province</li>
                    <li>• Use the common name for your location</li>
                    <li>
                      • 2-50 characters, letters and basic punctuation only
                    </li>
                    <li>• This helps us provide relevant local content</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
