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
            <DialogTitle className="sr-only">Enter City</DialogTitle>

            <div className="p-8 w-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Enter City
                </h2>
                <p className="text-gray-400 text-sm mb-8">
                  Please enter your city or province
                </p>

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
                      className="w-full bg-transparent border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                      disabled={isLoading}
                      required
                      minLength={2}
                      maxLength={50}
                    />
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-400">
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
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Updating..." : "Update City"}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-white mb-2">
                    Location Guidelines:
                  </h3>
                  <ul className="text-xs text-gray-400 space-y-1 text-left">
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
