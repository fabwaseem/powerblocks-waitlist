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
      <DialogContent
        style={{
          background: "linear-gradient(to bottom, #11042F, #04010E)",
        }}
      >
        <div className="relative">
         
          <div className="flex flex-col items-center justify-center h-full">
            <DialogTitle className="sr-only">Select Country</DialogTitle>

            <div className="lg:p-8 w-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Select Country
                </h2>
                <p className="text-gray-400 text-sm mb-8">
                  Please select your country of residence
                </p>

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
                      <SelectTrigger className="w-full bg-transparent border border-gray-500 rounded-lg px-4 py-3 text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 max-h-60">
                        {COUNTRIES.map((country) => (
                          <SelectItem
                            key={country}
                            value={country}
                            className="text-white hover:bg-gray-800 focus:bg-gray-800"
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
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Updating..." : "Update Country"}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-white mb-2">
                    Location Information:
                  </h3>
                  <p className="text-xs text-gray-400">
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
