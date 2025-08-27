"use client";

import {
  DiscordIcon,
  GoogleIcon,
  TelegramIcon,
  XIcon,
} from "@/components/common/icons";
import { useAuthStore } from "@/store/auth";
import { useReferralStore } from "@/store/referrals";
import { useTaskStore } from "@/store/tasks";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import CopyButton from "../common/CopyButton";
import { Button } from "../ui/button";
import ReferralsCard from "./ReferralsCard";
import TasksSection from "./TasksSection";
import Navbar from "../home/navbar";

const App = () => {
  const { user, isAuthenticated } = useAuthStore();
  const {
    referralInfo,
    loading,
    fetchReferralInfo,
    clearReferralInfo,
    claimReferralReward,
    claimReferralRewardLoading,
  } = useReferralStore();
  const { checkAuth } = useAuthStore();
  const {
    tasks,
    loading: tasksLoading,
    fetchTasks,
    completeTask,
    completingTask,
  } = useTaskStore();
  const [newUsername, setNewUsername] = useState(user?.username);

  useEffect(() => {
    if (user) {
      setNewUsername(user.username);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchReferralInfo();
      fetchTasks();
    } else {
      clearReferralInfo();
    }
  }, [isAuthenticated, user, fetchReferralInfo, clearReferralInfo]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 lg:p-6 relative">
      <Navbar />

      {/* glowing bg elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-50 left-55 w-266 h-30 rounded-full bg-[#EE4FFB]/20 blur-[100px]"></div>
        <div className="absolute bottom-10 -right-10 w-200 h-50 rounded-full bg-[#EE4FFB]/10 blur-[100px]"></div>
        <div className="absolute top-90 left-20 w-160 h-80 rounded-full bg-[#28A9A3]/20 blur-[100px]"></div>
      </div>

      {/* content */}
      <div className="max-w-[1640px] mx-auto relative z-10">
        {/* Welcome Header */}
        <div className="flex justify-between lg:items-center mb-8 flex-col lg:flex-row gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
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
                    <div className="text-2xl font-bold text-white">
                      {user?.xpPoints?.today}
                    </div>
                    <div className="text-[#A5A9C1] text-xs">XP</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className=" text-sm mb-1">This Week</div>
                  <div className="bg-white/10 border border-white/10 rounded-lg py-3">
                    <div className="text-2xl font-bold text-white">
                      {user?.xpPoints?.thisWeek}
                    </div>
                    <div className="text-[#A5A9C1] text-xs">XP</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm mb-1">This Month</div>
                  <div className="bg-white/10 border border-white/10 rounded-lg py-3">
                    <div className="text-2xl font-bold text-white">
                      {user?.xpPoints?.thisMonth}
                    </div>
                    <div className="text-[#A5A9C1] text-xs">XP</div>
                  </div>
                </div>
              </div>

              {/* Lifetime XP */}
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">Lifetime XP points</span>
                <span className="text-[#EE4FFB] font-bold">
                  {user?.xpPoints?.total}
                </span>
              </div>
            </div>

            <TasksSection />
          </div>

          <ReferralsCard />
        </div>
      </div>
    </div>
  );
};

export default App;
