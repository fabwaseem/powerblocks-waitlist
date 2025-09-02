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
  const { connectOAuth, loading: isConnecting, error: oauthError } = useOAuth();
  const { user   } = useAuth();

  const handleConnectTwitter = async () => {
    try {
      const result = await connectOAuth("twitter");
      setIsConnected(true);
    } catch (error) {
      console.error("Twitter connection failed:", error);
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1e] border-[#2a2a4e] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl font-bold">
            <XIcon className="w-6 h-6" />
            Follow Our X Account
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!isConnected ? (
            // Step 1: Connect Twitter Account
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">
                  Connect Your X Account
                </h3>
                <p className="text-gray-400 text-sm">
                  First, connect your X (Twitter) account to verify your follow
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleConnectTwitter}
                  disabled={isConnecting}
                  className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                >
                  <XIcon className="w-5 h-5" />
                  {isConnecting ? "Connecting..." : "Connect X Account"}
                </Button>
              </div>
            </div>
          ) : (
            // Step 2: Follow and Verify
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">X Account Connected!</span>
              </div>

              <div className="text-center space-y-3">
                <p className="text-gray-400 text-sm">
                  Click the button below to follow our X account, then verify
                  your follow
                </p>
                {task?.data?.link && (
                  <p className="text-gray-400 text-sm">{task.data.link}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() =>
                    window.open(
                      getXProfileLinkFromUsername(task?.data?.username || ""),
                      "_blank"
                    )
                  }
                  variant="outline"
                  className="border-[#2a2a4e] hover:bg-[#2a2a4e] flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Follow {task?.data?.username}
                </Button>

                <Button
                  onClick={handleVerifyFollow}
                  disabled={isVerifying}
                  variant="purple"
                  className="w-full"
                >
                  {isVerifying ? "Verifying..." : "Verify Follow"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {oauthError && (
          <div className="text-xs text-red-400 text-center bg-red-900/20 border border-red-800 rounded p-2">
            {oauthError}
          </div>
        )}

        <div className="text-xs text-gray-500 text-center">
          Complete this task to earn XP points
        </div>
      </DialogContent>
    </Dialog>
  );
}
