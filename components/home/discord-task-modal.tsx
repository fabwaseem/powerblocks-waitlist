"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DiscordIcon } from "@/components/common/icons";
import { ExternalLink, CheckCircle } from "lucide-react";
import { useOAuth } from "@/hooks/use-oauth";
import { Task, tasksApi } from "@/lib/api/tasks";
import toast from "react-hot-toast";

interface DiscordTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  task?: Task;
}

export function DiscordTaskModal({
  open,
  onOpenChange,
  onSuccess,
  task,
}: DiscordTaskModalProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { connectOAuth, loading: isConnecting, error: oauthError } = useOAuth();

  const handleConnectDiscord = async () => {
    try {
      const result = await connectOAuth("discord");
      setIsConnected(true);
      console.log("Discord connected successfully:", result);
    } catch (error) {
      console.error("Discord connection failed:", error);
      // Error is already handled by the useOAuth hook
    }
  };

  const handleVerifyJoin = async () => {
    setIsVerifying(true);

    try {
      console.log("Verifying Discord server join...");

      const result = await tasksApi.verifyDiscordJoin();

      if (result.isJoined) {
        toast.success(
          result.xpAwarded
            ? `${result.message} +${result.xpAwarded} XP!`
            : result.message
        );
        console.log("Discord server join verified successfully!", result);

        // Call success callback and close modal
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(
          result.message ||
            "You are not in the server yet. Please join and try again."
        );
        console.log("Discord server join verification failed:", result);
      }
    } catch (error) {
      console.error("Error verifying Discord server join:", error);
      // toast.error("Failed to verify Discord server join. Please try again.");
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
            <DiscordIcon className="w-6 h-6" />
            Join Our Discord Server
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!isConnected ? (
            // Step 1: Connect Discord Account
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">
                  Connect Your Discord Account
                </h3>
                <p className="text-gray-400 text-sm">
                  First, connect your Discord account to verify your server
                  membership
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleConnectDiscord}
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                >
                  <DiscordIcon className="w-5 h-5" />
                  {isConnecting ? "Connecting..." : "Connect Discord Account"}
                </Button>
              </div>
            </div>
          ) : (
            // Step 2: Join Server and Verify
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Discord Account Connected!</span>
              </div>

              <div className="text-center space-y-3">
                <p className="text-gray-400 text-sm">
                  Click the button below to join our Discord server, then verify
                  your membership
                </p>
                {task?.data?.link && (
                  <p className="text-gray-400 text-sm">{task.data.link}</p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() =>
                    window.open(
                      task?.data?.link || "https://discord.gg/powerblocks",
                      "_blank"
                    )
                  }
                  variant="outline"
                  className="border-[#2a2a4e] hover:bg-[#2a2a4e] flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Join {task?.data?.serverName || "PowerBlocks Server"}
                </Button>

                <Button
                  onClick={handleVerifyJoin}
                  disabled={isVerifying}
                  variant="purple"
                  className="w-full"
                >
                  {isVerifying ? "Verifying..." : "Verify Membership"}
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
