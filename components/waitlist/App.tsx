"use client";

import React, { useEffect, useState } from "react";
import {
  DiscordIcon,
  GoogleIcon,
  TelegramIcon,
  XIcon,
} from "@/components/common/icons";
import { Button } from "../ui/button";
import { Check, Copy, CopyIcon, LinkIcon, Pencil } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useReferralStore } from "@/store/referrals";
import Image from "next/image";
import { copyToClipboard } from "@/lib/utils";
import CopyButton from "../common/CopyButton";

const App = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { referralInfo, loading, fetchReferralInfo, clearReferralInfo } =
    useReferralStore();
  const [newUsername, setNewUsername] = useState(user?.username);

  useEffect(() => {
    if (user) {
      setNewUsername(user.username);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchReferralInfo();
    } else {
      clearReferralInfo();
    }
  }, [isAuthenticated, user, fetchReferralInfo, clearReferralInfo]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COLLECTED":
        return (
          <span className="text-[#4ade80] text-sm font-medium">+500 PWR</span>
        );
      case "CLAIMABLE":
        return (
          <button className="px-3 py-1 bg-[#4c1d95] text-white text-xs rounded-full border border-[#6d28d9] hover:bg-[#5b21b6] transition-colors">
            Claim
          </button>
        );
      case "PENDING":
        return (
          <span className="px-3 py-1 bg-[#2a2a4e] text-[#A5A9C1] text-xs rounded-full">
            Pending
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
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 relative pt-32">
      {/* glowing bg elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-50 left-55 w-266 h-30 rounded-full bg-[#EE4FFB]/20 blur-[100px]"></div>
        <div className="absolute bottom-10 -right-10 w-200 h-50 rounded-full bg-[#EE4FFB]/10 blur-[100px]"></div>
        <div className="absolute top-90 left-20 w-160 h-80 rounded-full bg-[#28A9A3]/20 blur-[100px]"></div>
      </div>

      {/* content */}
      <div className="max-w-[1640px] mx-auto relative z-10">
        {/* Welcome Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Hi Dawg, welcome back!
          </h1>

          {/* Social Media Icons */}
          <div className="flex gap-3">
            <Button variant="purple" size={"icon"}>
              <GoogleIcon className="w-6 h-6" />
            </Button>
            <Button variant="purple" size={"icon"}>
              <XIcon className="w-6 h-6" />
            </Button>
            <Button variant="purple" size={"icon"}>
              <TelegramIcon className="w-6 h-6" />
            </Button>
            <Button variant="purple" size={"icon"}>
              <DiscordIcon className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <div className=" space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-b  from-[#11042F] to-[#020106] rounded-2xl p-6 border border-[#2a2a4e]">
              <div className="flex items-start gap-4 mb-6">
                <div className="size-32 relative ">
                  <Image src={"/images/avatar.png"} alt="supa-dwag" fill />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">
                      {newUsername}
                    </span>
                    <Pencil className="w-4 h-4 text-[#A5A9C1]" />
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[#A5A9C1] text-sm">#6421</span>
                    <CopyButton text={``} />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">100</div>
                  <div className="text-[#A5A9C1] text-sm">
                    Available PR points
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className=" text-sm mb-1">Today</div>
                  <div className="bg-white/10 border border-white/10 rounded-lg py-3">
                    <div className="text-2xl font-bold text-white">100</div>
                    <div className="text-[#A5A9C1] text-xs">XP</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className=" text-sm mb-1">This Week</div>
                  <div className="bg-white/10 border border-white/10 rounded-lg py-3">
                    <div className="text-2xl font-bold text-white">-</div>
                    <div className="text-[#A5A9C1] text-xs">XP</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm mb-1">This Month</div>
                  <div className="bg-white/10 border border-white/10 rounded-lg py-3">
                    <div className="text-2xl font-bold text-white">-</div>
                    <div className="text-[#A5A9C1] text-xs">XP</div>
                  </div>
                </div>
              </div>

              {/* Lifetime XP */}
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">Lifetime XP points</span>
                <span className="text-[#EE4FFB] font-bold">0</span>
              </div>
            </div>

            <div className="bg-gradient-to-b from-[#11042F] to-[#020106] lg:col-span-2 rounded-2xl border border-[#2a2a4e] ">
              <h2 className="text-xl font-bold text-white  p-6">
                Collect Points
              </h2>

              <div className="no-scrollbar max-h-[250px] overflow-y-auto">
                {/* Task 1 - Completed */}
                <div className="flex items-center justify-between p-4  border-b border-white/10 bg-[#EE4FFB]/10">
                  <span className="text-white font-medium text-base">
                    Task 1 - Verify Email
                  </span>
                  <span className="text-[#EE4FFB] font-bold text-base">
                    Completed +100 XP
                  </span>
                </div>

                {/* Task 2 - Available */}
                <div className="flex items-center justify-between p-4  border-b border-white/10 ">
                  <span className="text-white font-medium text-base">
                    Task 2 - Phone Number
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#96A3F6] font-bold text-base">
                      +200 XP
                    </span>
                    <Button variant={"purple"} disabled>
                      Unlocks in 12:34:25
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4  border-b border-white/10 ">
                  <span className="text-white font-medium text-base">
                    Task 3 - Social
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 bg-gradient-to-b  from-[#11042F] to-[#020106] rounded-2xl p-6 border border-[#2a2a4e]">
            <div className="lg:w-[40%]">
              <h2 className="text-xl font-bold text-white mb-4">REFERRALS</h2>

              <div className="mb-6">
                <p className="text-[#A5A9C1] text-sm mb-2">
                  For Every Successful Referral you Get:
                </p>
                <p className="text-2xl font-bold text-[#EE4FFB]">
                  500 XP points
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 border border-[#6C7793] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#96A3F6] mb-1">
                    {loading ? "-" : referralInfo?.stats.pendingReferrals || 0}
                  </div>
                  <div className="text-[#A5A9C1] text-sm">
                    Pending Referrals
                  </div>
                </div>
                <div className="bg-white/10 border border-[#6C7793] rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-[#96A3F6] mb-1">
                    {loading
                      ? "-"
                      : referralInfo?.stats.successfulReferrals || 0}
                  </div>
                  <div className="text-[#A5A9C1] text-sm">
                    Successful Referrals
                  </div>
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
              <h3 className="text-lg font-bold text-white mb-4">
                Referral History
              </h3>

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
                      <span className="text-white text-sm">
                        {referral.username}
                      </span>
                      <span className="text-[#A5A9C1] text-sm">
                        {formatDate(referral.date)}
                      </span>
                      <div className="flex items-center">
                        {getVerificationIcon(referral.verified)}
                      </div>
                      {getStatusBadge(referral.status)}
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
        </div>
      </div>
    </div>
  );
};

export default App;
