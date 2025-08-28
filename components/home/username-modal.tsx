"use client";

import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { tasksApi } from "@/lib/api/tasks";

interface UsernameModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UsernameModal({
  open,
  onOpenChange,
  onSuccess,
}: UsernameModalProps) {
  const [username, setUsername] = useState("");

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setUsername("");
    }
  }, [open]);

  const updateUsernameMutation = useMutation({
    mutationFn: (username: string) => tasksApi.updateUser({ username }),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Username created successfully!");
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(data.message || "Failed to create username");
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create username"
      );
    },
  });

  const validateUsername = (username: string) => {
    // Username validation rules:
    // - 3-20 characters
    // - Alphanumeric and underscores only
    // - Cannot start with underscore
    // - Cannot end with underscore
    const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9_]{1,18}[a-zA-Z0-9]$/;

    if (username.length < 3) {
      return "Username must be at least 3 characters long";
    }

    if (username.length > 20) {
      return "Username must be 20 characters or less";
    }

    if (!usernameRegex.test(username)) {
      return "Username can only contain letters, numbers, and underscores. Cannot start or end with underscore.";
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateUsername(username);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    updateUsernameMutation.mutate(username);
  };

  const handleUsernameChange = (value: string) => {
    // Remove any non-alphanumeric characters except underscores
    const cleaned = value.replace(/[^a-zA-Z0-9_]/g, "");
    setUsername(cleaned);
  };

  const isLoading = updateUsernameMutation.isPending;
  const validationError = username ? validateUsername(username) : null;

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
            <DialogTitle className="sr-only">Create Username</DialogTitle>

            <div className="p-8 w-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Create Username
                </h2>
                <p className="text-gray-400 text-sm mb-8">
                  Choose a unique username for your account
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="text-left">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Username
                    </label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="your_username"
                      value={username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      className="w-full bg-transparent border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400/20"
                      disabled={isLoading}
                      required
                      minLength={3}
                      maxLength={20}
                    />
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-400">
                        3-20 characters, letters, numbers, and underscores only
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
                    disabled={
                      isLoading || !username.trim() || !!validationError
                    }
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Creating..." : "Create Username"}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                  <h3 className="text-sm font-medium text-white mb-2">
                    Username Rules:
                  </h3>
                  <ul className="text-xs text-gray-400 space-y-1 text-left">
                    <li>• 3-20 characters long</li>
                    <li>• Letters, numbers, and underscores only</li>
                    <li>• Cannot start or end with underscore</li>
                    <li>• Must be unique</li>
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
