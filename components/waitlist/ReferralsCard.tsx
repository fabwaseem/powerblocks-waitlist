import {
  Check,
  LinkIcon,
  Users,
  Trophy,
  TrendingUp,
  Gift,
  Share2,
} from "lucide-react";
import React, { useState } from "react";
import CopyButton from "../common/CopyButton";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useClaimReferralReward, useReferralInfo } from "@/hooks/use-referrals";
import { useAuth } from "@/hooks/use-auth";

const ReferralsCard = () => {
  const { user, refetch: refetchUser } = useAuth();
  const { data: referralInfo, isLoading } = useReferralInfo();
  const { mutate: claimReferralReward, isPending: claimReferralRewardLoading } =
    useClaimReferralReward();

  // Track loading state for individual referral claims
  const [claimingReferralId, setClaimingReferralId] = useState<string | null>(
    null
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
  };

  const getStatusBadge = (status: string, referralId: string) => {
    switch (status) {
      case "COLLECTED":
        return (
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/40 rounded-xl w-max">
            <Trophy className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-semibold">
              +500 XP
            </span>
          </div>
        );
      case "CLAIMABLE":
        const isClaimingThisReferral = claimingReferralId === referralId;
        return (
          <Button
            variant={"purple"}
            size={"sm"}
            className="w-max bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] hover:from-[#FF6B9D] hover:to-[#EE4FFB] transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#EE4FFB]/25 text-white"
            onClick={async () => {
              setClaimingReferralId(referralId);
              try {
                await claimReferralReward(referralId);
                refetchUser();
              } finally {
                setClaimingReferralId(null);
              }
            }}
            disabled={isClaimingThisReferral}
          >
            {isClaimingThisReferral ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Claiming...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Claim
              </div>
            )}
          </Button>
        );
      case "PENDING":
        return (
          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#2a2a4e]/50 to-[#3a3a5e]/50 border border-[#4a4a6e]/50 rounded-xl">
            <div className="w-2 h-2 bg-[#A5A9C1] rounded-full animate-pulse"></div>
            <span className="text-[#A5A9C1] text-sm font-medium">
              Pending...
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  const getVerificationIcon = (verified: boolean) => {
    if (verified) {
      return (
        <div className="w-6 h-6 bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] rounded-full flex items-center justify-center shadow-lg shadow-[#EE4FFB]/25">
          <Check className="w-4 h-4 text-white" />
        </div>
      );
    }
    return (
      <div className="w-6 h-6 bg-gradient-to-r from-gray-600/50 to-gray-700/50 rounded-full flex items-center justify-center border border-gray-500/50">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-[#11042F]/80 to-[#020106]/90 backdrop-blur-xl rounded-3xl border border-[#2a2a4e]/50 p-4 sm:p-8 shadow-2xl shadow-[#EE4FFB]/10 relative overflow-hidden group">
      {/* Card Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#EE4FFB]/5 to-[#28A9A3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 flex flex-col lg:flex-row gap-8">
        {/* Left Side - Referral Info */}
        <div className="lg:w-[40%] space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] rounded-2xl">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">REFERRALS</h2>
              <p className="text-[#A5A9C1] text-sm">
                Invite friends & earn rewards
              </p>
            </div>
          </div>

          {/* Reward Info */}
          <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-xl">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[#A5A9C1] text-sm mb-1">
                  For Every Successful Referral you Get:
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                  500 XP points
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-2xl p-4 text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-[#96A3F6] mb-1">
                {isLoading ? "-" : referralInfo?.stats.pendingReferrals || 0}
              </div>
              <div className="text-[#A5A9C1] text-sm font-medium">
                Pending Referrals
              </div>
            </div>
            <div className="bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-2xl p-4 text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-[#28A9A3] mb-1">
                {isLoading ? "-" : referralInfo?.stats.successfulReferrals || 0}
              </div>
              <div className="text-[#A5A9C1] text-sm font-medium">
                Successful Referrals
              </div>
            </div>
          </div>

          {/* Referral Link */}
          <div className="bg-gradient-to-br from-[#EE4FFB]/10 to-[#28A9A3]/10 border border-[#EE4FFB]/20 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] rounded-xl">
                <Share2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-white text-sm font-medium">
                Your Referral Link
              </span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/20 rounded-xl p-3">
              <LinkIcon className="w-4 h-4 text-[#A5A9C1]" />
              <span className="text-gray-300 text-sm flex-1 font-mono">
                {process.env.NEXT_PUBLIC_APP_URL}?ref=
                {referralInfo?.referralCode || user?.referralCode}
              </span>
              <CopyButton
                text={`${process.env.NEXT_PUBLIC_APP_URL}?ref=${
                  referralInfo?.referralCode || user?.referralCode
                }`}
              />
            </div>
          </div>
        </div>

        {/* Right Side - Referral History */}
        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-3xl p-6 border border-white/20 flex-1 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-xl font-bold text-white">Referral History</h3>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 pb-4 border-b border-white/20 text-[#A5A9C1] text-sm font-medium">
            <span>Username</span>
            <span>Date</span>
            <span>Verified</span>
            <span>Reward</span>
            <span>ID</span>
          </div>

          {/* Table Rows */}
          <div className="space-y-3 mt-4">
            {isLoading ? (
              <div className="text-center text-[#A5A9C1] py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#EE4FFB] border-t-transparent mx-auto mb-4"></div>
                <p className="text-sm">Loading referral history...</p>
              </div>
            ) : referralInfo?.history && referralInfo.history.length > 0 ? (
              referralInfo.history.map((referral, index) => (
                <div
                  key={referral.id}
                  className="grid grid-cols-5 gap-4 items-center py-3 border-b border-white/10 hover:bg-white/5 rounded-xl px-3 transition-all duration-300 group"
                >
                  <span className="text-white text-sm font-medium group-hover:text-[#EE4FFB] transition-colors duration-300">
                    {referral.username}
                  </span>
                  <span className="text-[#A5A9C1] text-sm">
                    {formatDate(referral.date)}
                  </span>
                  <div className="flex items-center">
                    {getVerificationIcon(referral.verified)}
                  </div>
                  {getStatusBadge(referral.status, referral.id)}
                  <span className="text-[#A5A9C1] text-sm">
                    {referral.status === "COLLECTED" && (
                      <Tooltip>
                        <TooltipTrigger className="hover:text-white transition-colors duration-300">
                          #{referral.id.slice(0, 4)}...
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1a1a2e] border border-[#2a2a4e] text-white">
                          <p className="font-mono text-sm">{referral.id}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-[#A5A9C1] py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-[#EE4FFB]/20 to-[#28A9A3]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#A5A9C1]" />
                </div>
                <p className="text-sm font-medium">No referral history yet</p>
                <p className="text-xs text-gray-500 mt-1">
                  Start sharing your referral link!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralsCard;
