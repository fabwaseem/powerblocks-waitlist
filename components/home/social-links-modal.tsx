"use client";

import { useMutation } from "@tanstack/react-query";
import { Users2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { tasksApi } from "@/lib/api/tasks";

interface SocialLinksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface SocialLinks {
  telegram?: string;
  instagram?: string;
  tiktok?: string;
}

export function SocialLinksModal({
  open,
  onOpenChange,
  onSuccess,
}: SocialLinksModalProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    telegram: "",
    instagram: "",
    tiktok: "",
  });
  const [validationErrors, setValidationErrors] = useState<{
    telegram?: string;
    instagram?: string;
    tiktok?: string;
  }>({});

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSocialLinks({
        telegram: "",
        instagram: "",
        tiktok: "",
      });
      setValidationErrors({});
    }
  }, [open]);

  // Validate and extract username from social media links
  const extractUsername = (
    platform: string,
    input: string
  ): { username: string; isValid: boolean; error?: string } => {
    if (!input.trim()) return { username: "", isValid: true };

    // Remove whitespace
    const cleanInput = input.trim();

    // If it's already just a username (no URL), validate and return
    if (!cleanInput.includes("http") && !cleanInput.includes("www")) {
      const username = cleanInput.replace(/^@/, "");

      // Basic username validation
      if (username.length < 1) {
        return {
          username: "",
          isValid: false,
          error: "Username cannot be empty",
        };
      }
      if (username.length > 30) {
        return {
          username: "",
          isValid: false,
          error: "Username too long (max 30 characters)",
        };
      }
      if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
        return {
          username: "",
          isValid: false,
          error: "Username contains invalid characters",
        };
      }

      return { username, isValid: true };
    }

    try {
      const url = new URL(
        cleanInput.startsWith("http") ? cleanInput : `https://${cleanInput}`
      );
      const pathname = url.pathname;

      switch (platform) {
        case "telegram":
          // Handle telegram.me/username or t.me/username
          if (
            url.hostname.includes("telegram.me") ||
            url.hostname.includes("t.me")
          ) {
            const username = pathname.replace("/", "").replace("@", "");
            if (!username) {
              return {
                username: "",
                isValid: false,
                error: "Invalid Telegram URL - no username found",
              };
            }
            return { username, isValid: true };
          }
          return {
            username: "",
            isValid: false,
            error: "Invalid Telegram URL - must be from telegram.me or t.me",
          };

        case "instagram":
          // Handle instagram.com/username
          if (url.hostname.includes("instagram.com")) {
            const username = pathname.replace("/", "").replace("@", "");
            if (!username) {
              return {
                username: "",
                isValid: false,
                error: "Invalid Instagram URL - no username found",
              };
            }
            return { username, isValid: true };
          }
          return {
            username: "",
            isValid: false,
            error: "Invalid Instagram URL - must be from instagram.com",
          };

        case "tiktok":
          // Handle tiktok.com/@username
          if (url.hostname.includes("tiktok.com")) {
            const username = pathname.split("/")[2] || pathname.split("/")[1];
            if (!username || username === "@") {
              return {
                username: "",
                isValid: false,
                error: "Invalid TikTok URL - no username found",
              };
            }
            return { username: username.replace("@", ""), isValid: true };
          }
          return {
            username: "",
            isValid: false,
            error: "Invalid TikTok URL - must be from tiktok.com",
          };

        default:
          return {
            username: "",
            isValid: false,
            error: "Unsupported platform",
          };
      }
    } catch (error) {
      // If URL parsing fails, check if it might be a username
      const potentialUsername = cleanInput.replace(/^@/, "");

      // If it looks like a username (no spaces, reasonable length), treat as username
      if (
        potentialUsername.length > 0 &&
        potentialUsername.length <= 30 &&
        !potentialUsername.includes(" ")
      ) {
        if (!/^[a-zA-Z0-9._-]+$/.test(potentialUsername)) {
          return {
            username: "",
            isValid: false,
            error: "Invalid format - use @username or full URL",
          };
        }
        return { username: potentialUsername, isValid: true };
      }

      return { username: "", isValid: false, error: "Invalid URL format" };
    }
  };

  const updateSocialLinksMutation = useMutation({
    mutationFn: (links: SocialLinks) => tasksApi.updateUser(links),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Social links updated successfully!");
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(data.message || "Failed to update social links");
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update social links"
      );
    },
  });

  const handleInputChange = (platform: keyof SocialLinks, value: string) => {
    setSocialLinks((prev) => ({
      ...prev,
      [platform]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate and extract usernames from links
    const processedLinks: SocialLinks = {};
    const validationErrors: string[] = [];

    if (socialLinks.telegram) {
      const result = extractUsername("telegram", socialLinks.telegram);
      if (result.isValid) {
        processedLinks.telegram = result.username;
      } else {
        validationErrors.push(`Telegram: ${result.error}`);
      }
    }
    if (socialLinks.instagram) {
      const result = extractUsername("instagram", socialLinks.instagram);
      if (result.isValid) {
        processedLinks.instagram = result.username;
      } else {
        validationErrors.push(`Instagram: ${result.error}`);
      }
    }
    if (socialLinks.tiktok) {
      const result = extractUsername("tiktok", socialLinks.tiktok);
      if (result.isValid) {
        processedLinks.tiktok = result.username;
      } else {
        validationErrors.push(`TikTok: ${result.error}`);
      }
    }

    // Check for validation errors
    if (validationErrors.length > 0) {
      toast.error(validationErrors.join(", "));
      return;
    }

    // Check if at least one social link is provided
    const hasAnyLink = Object.values(processedLinks).some(
      (link) => link.trim() !== ""
    );

    if (!hasAnyLink) {
      toast.error("Please provide at least one social media link or username");
      return;
    }

    updateSocialLinksMutation.mutate(processedLinks);
  };

  const isLoading = updateSocialLinksMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-[#11042F]/95 to-[#020106]/95 backdrop-blur-xl border border-[#2a2a4e]/50 rounded-3xl shadow-2xl shadow-[#EE4FFB]/10 p-0 overflow-hidden">
        <div className="relative">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EE4FFB]/5 to-[#28A9A3]/5 opacity-50"></div>

          <div className="flex flex-col items-center justify-center h-full relative z-10">
            <DialogTitle className="sr-only">Social Media Links</DialogTitle>

            <div className="p-4 lg:p-8 w-full">
              <div className="text-center space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="p-3 bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] rounded-2xl w-fit mx-auto">
                    <Users2 className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Social Media Links
                  </h2>
                  <p className="text-[#A5A9C1] text-sm">
                    Add your social media or links
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Telegram */}
                  <div className="text-left">
                    <label
                      htmlFor="telegram"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Telegram
                    </label>
                    <Input
                      id="telegram"
                      type="text"
                      placeholder="https://t.me/username"
                      value={socialLinks.telegram}
                      onChange={(e) =>
                        handleInputChange("telegram", e.target.value)
                      }
                      className="w-full bg-white/5 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:border-[#EE4FFB] focus:outline-none focus:ring-2 focus:ring-[#EE4FFB]/20 transition-all duration-300"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Instagram */}
                  <div className="text-left">
                    <label
                      htmlFor="instagram"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      Instagram
                    </label>
                    <Input
                      id="instagram"
                      type="text"
                      placeholder="https://instagram.com/username"
                      value={socialLinks.instagram}
                      onChange={(e) =>
                        handleInputChange("instagram", e.target.value)
                      }
                      className="w-full bg-white/5 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:border-[#EE4FFB] focus:outline-none focus:ring-2 focus:ring-[#EE4FFB]/20 transition-all duration-300"
                      disabled={isLoading}
                    />
                  </div>

                  {/* TikTok */}
                  <div className="text-left">
                    <label
                      htmlFor="tiktok"
                      className="block text-sm font-medium text-gray-300 mb-2"
                    >
                      TikTok
                    </label>
                    <Input
                      id="tiktok"
                      type="text"
                      placeholder="https://tiktok.com/@username"
                      value={socialLinks.tiktok}
                      onChange={(e) =>
                        handleInputChange("tiktok", e.target.value)
                      }
                      className="w-full bg-white/5 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-gray-400 focus:border-[#EE4FFB] focus:outline-none focus:ring-2 focus:ring-[#EE4FFB]/20 transition-all duration-300"
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] hover:from-[#FF6B9D] hover:to-[#EE4FFB] text-white py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#EE4FFB]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Updating...
                      </div>
                    ) : (
                      "Update Social Links"
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
