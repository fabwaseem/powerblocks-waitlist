"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { XIcon } from "@/components/common/icons";
import { ExternalLink, CheckCircle } from "lucide-react";
import { useOAuth } from "@/hooks/use-oauth";
import { Task, tasksApi } from "@/lib/api/tasks";
import toast from "react-hot-toast";
import { getXProfileLinkFromUsername } from "@/lib/utils";
import { OAuthProvider } from "@/types";
import { useAuth } from "@/hooks/use-auth";

interface TwitterTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  task?: Task;
}

export function TwitterTaskModal({
  open,
  onOpenChange,
  onSuccess,
  task,
}: TwitterTaskModalProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const {
    connectOAuth,
    loading: isConnecting,
    error: oauthError,
    clearError,
  } = useOAuth();
  const { user } = useAuth();

  const handleConnectTwitter = async () => {
    try {
      clearError(); // Clear any previous errors
      const result = await connectOAuth("twitter");
      setIsConnected(true);
      toast.success("X account connected successfully!");
    } catch (error) {
      console.error("Twitter connection failed:", error);
      // Don't show toast here - let the useEffect handle it
    }
  };

  const handleVerifyFollow = async () => {
    setIsVerifying(true);

    try {
      console.log("Verifying Twitter follow...");

      const result = await tasksApi.verifyTwitterFollow();

      if (result.isFollowing) {
        toast.success(
          result.xpAwarded
            ? `${result.message} +${result.xpAwarded} XP!`
            : result.message
        );
        console.log("Twitter follow verified successfully!", result);

        // Call success callback and close modal
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(
          result.message ||
            "You are not following the account yet. Please follow and try again."
        );
        console.log("Twitter follow verification failed:", result);
      }
    } catch (error) {
      console.error("Error verifying Twitter follow:", error);
      // toast.error("Failed to verify Twitter follow. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setIsVerifying(false);
    clearError(); // Clear any OAuth errors when closing
  };

  useEffect(() => {
    if (
      user?.oauthAccounts?.find(
        (account) => account.provider === OAuthProvider.TWITTER
      )
    ) {
      setIsConnected(true);
    }
  }, []);

  // Show toast notification when OAuth error occurs (excluding popup closed errors)
  useEffect(() => {
    if (oauthError && !oauthError.includes("popup was closed")) {
      toast.error(oauthError);
    }
  }, [oauthError]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-gradient-to-br from-[#11042F]/95 to-[#020106]/95 backdrop-blur-xl border border-[#2a2a4e]/50 rounded-3xl shadow-2xl shadow-[#EE4FFB]/10 p-0 overflow-hidden">
        <div className="relative">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EE4FFB]/5 to-[#28A9A3]/5 opacity-50"></div>

          <div className="flex flex-col items-center justify-center h-full relative z-10">
            <div className="p-4 lg:p-8 w-full">
              <div className="text-center space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className="p-3 bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] rounded-2xl w-fit mx-auto">
                    <XIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Follow Our X Account
                  </h2>
                </div>

                <div className="space-y-6">
                  {!isConnected ? (
                    // Step 1: Connect Twitter Account
                    <div className="space-y-6">
                      <div className="text-center space-y-2">
                        <p className="text-[#A5A9C1] text-sm">
                          First, connect your X (Twitter) account to verify your
                          follow
                        </p>
                      </div>

                      <div className="flex justify-center">
                        <Button
                          onClick={handleConnectTwitter}
                          disabled={isConnecting}
                          className="bg-gradient-to-r from-black to-gray-900 hover:from-gray-900 hover:to-black text-white px-8 py-3 rounded-2xl flex items-center gap-3 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-black/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {isConnecting ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              Connecting...
                            </div>
                          ) : (
                            <>
                              <XIcon className="w-5 h-5" />
                              Connect X Account
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Step 2: Follow and Verify
                    <div className="space-y-6">
                      <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                        <span className="font-medium text-green-400">
                          X Account Connected!
                        </span>
                      </div>

                      <div className="text-center space-y-3">
                        <p className="text-[#A5A9C1] text-sm">
                          Click the button below to follow our X account, then
                          verify your follow
                        </p>
                        {task?.data?.link && (
                          <p className="text-[#A5A9C1] text-xs font-mono bg-white/5 rounded-lg p-2 border border-white/10">
                            {task.data.link}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-3">
                        <Button
                          onClick={() =>
                            window.open(
                              getXProfileLinkFromUsername(
                                task?.data?.username || ""
                              ),
                              "_blank"
                            )
                          }
                          variant="outline"
                          className="border-white/20 hover:bg-white/10 text-white flex items-center gap-3 rounded-2xl transition-all duration-300 hover:border-[#EE4FFB]/50"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Follow {task?.data?.username}
                        </Button>

                        <Button
                          onClick={handleVerifyFollow}
                          disabled={isVerifying}
                          className="w-full bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] hover:from-[#FF6B9D] hover:to-[#EE4FFB] text-white py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#EE4FFB]/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                          {isVerifying ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              Verifying...
                            </div>
                          ) : (
                            "Verify Follow"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {oauthError && !oauthError.includes("popup was closed") && (
                  <div className="text-xs text-red-400 text-center bg-red-500/10 border border-red-500/20 rounded-2xl p-3">
                    {oauthError}
                  </div>
                )}

                <div className="text-xs text-[#A5A9C1] text-center bg-white/5 rounded-2xl p-3 border border-white/10">
                  Complete this task to earn XP points
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
