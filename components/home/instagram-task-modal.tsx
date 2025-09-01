"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InstagramIcon } from "@/components/common/icons";
import { ExternalLink, CheckCircle } from "lucide-react";
import { useOAuth } from "@/hooks/use-oauth";
import { Task, tasksApi } from "@/lib/api/tasks";
import toast from "react-hot-toast";
import { getInstagramProfileLinkFromUsername } from "@/lib/utils";

interface InstagramTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  task?: Task;
}

export function InstagramTaskModal({
  open,
  onOpenChange,
  onSuccess,
  task,
}: InstagramTaskModalProps) {
  const [isConnected, setIsConnected] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const { connectOAuth, loading: isConnecting, error: oauthError } = useOAuth();

  const handleConnectInstagram = async () => {
    try {
      const result = await connectOAuth("instagram");
      setIsConnected(true);
      console.log("Instagram connected successfully:", result);
    } catch (error) {
      console.error("Instagram connection failed:", error);
      // Error is already handled by the useOAuth hook
    }
  };

  const handleVerifyFollow = async () => {
    setIsVerifying(true);

    try {
      console.log("Verifying Instagram follow...");

      const result = await tasksApi.verifyInstagramFollow();

      if (result.isFollowing) {
        toast.success(
          result.xpAwarded
            ? `${result.message} +${result.xpAwarded} XP!`
            : result.message
        );
        console.log("Instagram follow verified successfully!", result);

        // Call success callback and close modal
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(
          result.message ||
            "You are not following the account yet. Please follow and try again."
        );
        console.log("Instagram follow verification failed:", result);
      }
    } catch (error) {
      console.error("Error verifying Instagram follow:", error);
      // toast.error("Failed to verify Instagram follow. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset states when closing
    setIsConnected(false);
    setIsVerifying(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1e] border-[#2a2a4e] text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl font-bold">
            <InstagramIcon className="w-6 h-6" />
            Follow Our Instagram Account
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!isConnected ? (
            // Step 1: Connect Instagram Account
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">
                  Connect Your Instagram Account
                </h3>
                <p className="text-gray-400 text-sm">
                  First, connect your Instagram account to verify your follow
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleConnectInstagram}
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                >
                  <InstagramIcon className="w-5 h-5" />
                  {isConnecting ? "Connecting..." : "Connect Instagram Account"}
                </Button>
              </div>
            </div>
          ) : (
            // Step 2: Follow and Verify
            <div className="space-y-4">
              {/* <div className="flex items-center justify-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  Instagram Account Connected!
                </span>
              </div> */}

              <div className="text-center space-y-3">
                <p className="text-gray-400 text-sm">
                  Click the button below to follow our Instagram account, then
                  verify your follow
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() =>
                    window.open(
                      getInstagramProfileLinkFromUsername(
                        task?.data?.username || ""
                      ),
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
