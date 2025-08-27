import { Check, LinkIcon } from "lucide-react";
import React from "react";
import CopyButton from "../common/CopyButton";
import { useReferralStore } from "@/store/referrals";
import { useAuthStore } from "@/store/auth";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

const ReferralsCard = () => {
  const { user, checkAuth } = useAuthStore();
  const {
    referralInfo,
    loading,
    claimReferralReward,
    claimReferralRewardLoading,
    fetchReferralInfo,
  } = useReferralStore();

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
          <span className="text-[#4ade80] text-sm font-medium">+500 XP</span>
        );
      case "CLAIMABLE":
        return (
          <Button
            variant={"purple"}
            size={"sm"}
            className="w-max"
            onClick={async () => {
              const result = await claimReferralReward(referralId);
              if (result.success) {
                toast.success("Referral reward claimed successfully! +500 XP");
                // Refetch user data to update XP points
                await checkAuth();
                // Force refetch referral info to update the UI
                await fetchReferralInfo(true);
              } else {
                toast.error("Failed to claim referral reward");
              }
            }}
            disabled={claimReferralRewardLoading}
          >
            {claimReferralRewardLoading ? "Claiming..." : "Claim"}
          </Button>
        );
      case "PENDING":
        return (
          <span className="px-3 py-1 bg-[#2a2a4e] text-[#A5A9C1] text-xs rounded-full w-max">
            Pending...
          </span>
        );
      default:
        return null;
    }
  };

  const getVerificationIcon = (verified: boolean) => {
    if (verified) {
      return (
        <div className="w-5 h-5 bg-[#EE4FFB] rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 " />
        </div>
      );
    }
    return <div></div>;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-gradient-to-b  from-[#11042F] to-[#020106] rounded-2xl p-6 border border-[#2a2a4e]">
      <div className="lg:w-[40%]">
        <h2 className="text-xl font-bold text-white mb-4">REFERRALS</h2>

        <div className="mb-6">
          <p className="text-[#A5A9C1] text-sm mb-2">
            For Every Successful Referral you Get:
          </p>
          <p className="text-2xl font-bold text-[#EE4FFB]">500 XP points</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 border border-[#6C7793] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#96A3F6] mb-1">
              {loading ? "-" : referralInfo?.stats.pendingReferrals || 0}
            </div>
            <div className="text-[#A5A9C1] text-sm">Pending Referrals</div>
          </div>
          <div className="bg-white/10 border border-[#6C7793] rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#96A3F6] mb-1">
              {loading ? "-" : referralInfo?.stats.successfulReferrals || 0}
            </div>
            <div className="text-[#A5A9C1] text-sm">Successful Referrals</div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-gradient-to-b from-white/5 border border-white/10  rounded-lg p-3">
          <LinkIcon className="w-4 h-4 " />
          <span className="text-gray-300 text-sm flex-1">
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
      <div className="bg-gradient-to-b from-[#11042F] to-[#020106] rounded-2xl p-6 border border-white/10 flex-1">
        <h3 className="text-lg font-bold text-white mb-4">Referral History</h3>

        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 pb-3  border-[#2a2a4e] text-[#A5A9C1] text-sm">
          <span>Username</span>
          <span>Date</span>
          <span>Verified</span>
          <span>Reward</span>
          <span>ID</span>
        </div>

        {/* Table Rows */}
        <div className="space-y-3 ">
          {loading ? (
            <div className="text-center text-[#A5A9C1] py-8">
              Loading referral history...
            </div>
          ) : referralInfo?.history && referralInfo.history.length > 0 ? (
            referralInfo.history.map((referral) => (
              <div
                key={referral.id}
                className="grid grid-cols-5 gap-4 items-center py-2 border-b border-white/10"
              >
                <span className="text-white text-sm">{referral.username}</span>
                <span className="text-[#A5A9C1] text-sm">
                  {formatDate(referral.date)}
                </span>
                <div className="flex items-center">
                  {getVerificationIcon(referral.verified)}
                </div>
                {getStatusBadge(referral.status, referral.id)}
                <span className="text-[#A5A9C1] text-sm">
                  #{referral.id.slice(0, 4)}...
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-[#A5A9C1] py-8">
              No referral history yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralsCard;
