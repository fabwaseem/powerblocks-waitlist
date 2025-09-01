"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TelegramIcon } from "@/components/common/icons";
import { ExternalLink, CheckCircle } from "lucide-react";
import { useOAuth } from "@/hooks/use-oauth";
import { Task, tasksApi } from "@/lib/api/tasks";
import toast from "react-hot-toast";

interface TelegramTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  task?: Task;
}

export function TelegramTaskModal({
  open,
  onOpenChange,
  onSuccess,
  task,
}: TelegramTaskModalProps) {
  const [isConnected, setIsConnected] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const { connectOAuth, loading: isConnecting, error: oauthError } = useOAuth();

  const handleConnectTelegram = async () => {
    try {
      const result = await connectOAuth("telegram");
      setIsConnected(true);
      console.log("Telegram connected successfully:", result);
    } catch (error) {
      console.error("Telegram connection failed:", error);
      // Error is already handled by the useOAuth hook
    }
  };

  const handleVerifyJoin = async () => {
    setIsVerifying(true);

    try {
      console.log("Verifying Telegram group join...");

      const result = await tasksApi.verifyTelegramJoin();

      if (result.isFollowing) {
        toast.success(
          result.xpAwarded
            ? `${result.message} +${result.xpAwarded} XP!`
            : result.message
        );
        console.log("Telegram group join verified successfully!", result);

        // Call success callback and close modal
        onSuccess?.();
        onOpenChange(false);
      } else {
        toast.error(
          result.message ||
            "You are not in the group yet. Please join and try again."
        );
        console.log("Telegram group join verification failed:", result);
      }
    } catch (error) {
      console.error("Error verifying Telegram group join:", error);
      // toast.error("Failed to verify Telegram group join. Please try again.");
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
            <TelegramIcon className="w-6 h-6" />
            Join Our Telegram Group
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!isConnected ? (
            // Step 1: Connect Telegram Account
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">
                  Connect Your Telegram Account
                </h3>
                <p className="text-gray-400 text-sm">
                  First, connect your Telegram account to verify your group
                  membership
                </p>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleConnectTelegram}
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                >
                  <TelegramIcon className="w-5 h-5" />
                  {isConnecting ? "Connecting..." : "Connect Telegram Account"}
                </Button>
              </div>
            </div>
          ) : (
            // Step 2: Join Group and Verify
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Telegram Account Connected!</span>
              </div>

              <div className="text-center space-y-3">
                <p className="text-gray-400 text-sm">
                  Click the button below to join our Telegram group, then verify
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
                      task?.data?.link || "https://t.me/PowerBlocks_io",
                      "_blank"
                    )
                  }
                  variant="outline"
                  className="border-[#2a2a4e] hover:bg-[#2a2a4e] flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Join {task?.data?.groupName || "PowerBlocks Group"}
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
