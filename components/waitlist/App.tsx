"use client";

import {
  DiscordIcon,
  GoogleIcon,
  InstagramIcon,
  TelegramIcon,
  TiktokIcon,
  XIcon,
} from "@/components/common/icons";
import { Pencil, Sparkles, Trophy, TrendingUp, Calendar } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import CopyButton from "../common/CopyButton";
import Navbar from "../home/navbar";
import { UsernameModal } from "../home/username-modal";
import { Button } from "../ui/button";
import ReferralsCard from "./ReferralsCard";
import TasksSection from "./TasksSection";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

const App = () => {
  const { user } = useAuth();

  const [isEditingUsername, setIsEditingUsername] = useState(false);

  const handleUpdateUsernameSuccess = () => {
    setIsEditingUsername(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f0f23] to-[#1a0a2e] text-white p-4 lg:p-6 relative overflow-hidden">
      <Navbar />

      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-80 h-80 rounded-full bg-gradient-to-r from-[#EE4FFB]/30 to-[#FF6B9D]/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-r from-[#28A9A3]/25 to-[#00D4FF]/20 blur-[140px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-gradient-to-r from-[#FF6B9D]/15 to-[#EE4FFB]/15 blur-[100px] animate-pulse delay-500"></div>
        <div className="absolute top-40 right-40 w-64 h-64 rounded-full bg-gradient-to-r from-[#00D4FF]/20 to-[#28A9A3]/20 blur-[80px] animate-pulse delay-700"></div>
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* content */}
      <div className="max-w-[1640px] mx-auto relative z-10">
        {/* Enhanced Welcome Header */}
        <div className="flex justify-between lg:items-center mb-12 flex-col lg:flex-row gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-white via-[#EE4FFB] to-[#FF6B9D] bg-clip-text text-transparent">
                Hi Dawg, welcome back!
              </h1>
            </div>
            <p className="text-[#A5A9C1] text-lg lg:text-xl">
              Ready to earn some serious XP points? Let's get grinding! 🚀
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-3">
            <Button variant="purple" size={"icon"} asChild>
              <Link href={"https://x.com/Powerblocks_io"} target="_blank">
                <XIcon className="w-6 h-6" />
              </Link>
            </Button>
            <Button variant="purple" size={"icon"} asChild>
              <Link
                href={"https://www.instagram.com/powerblocks.io/"}
                target="_blank"
              >
                <InstagramIcon className="w-6 h-6" />
              </Link>
            </Button>
            <Button variant="purple" size={"icon"} asChild>
              <Link
                href={"https://www.tiktok.com/@powerblocks.io"}
                target="_blank"
              >
                <TiktokIcon className="w-6 h-6" />
              </Link>
            </Button>
            <Button variant="purple" size={"icon"} asChild>
              <Link href={"https://t.me/+slrQQH3pW7A0Njk0"} target="_blank">
                <TelegramIcon className="w-6 h-6" />
              </Link>
            </Button>

            <Button variant="purple" size={"icon"} asChild>
              <Link href={"http://discord.gg/EeeWBTV87z"} target="_blank">
                <DiscordIcon className="w-6 h-6" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Enhanced Profile Card */}
            <div className="bg-gradient-to-br from-[#11042F]/80 to-[#020106]/90 backdrop-blur-xl rounded-3xl p-8 border border-[#2a2a4e]/50 shadow-2xl shadow-[#EE4FFB]/10 relative overflow-hidden group">
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#EE4FFB]/5 to-[#28A9A3]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="flex items-start gap-6 mb-8 relative z-10">
                <div className="size-36 relative rounded-3xl overflow-hidden ring-4 ring-[#EE4FFB]/20 group-hover:ring-[#EE4FFB]/40 transition-all duration-300">
                  <Image
                    src={user?.avatarUrl || "/images/avatar.png"}
                    alt={user?.username || "supa-dwag"}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white font-bold text-xl">
                      {user?.username}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsEditingUsername(true)}
                      className="hover:bg-[#EE4FFB]/20 hover:text-[#EE4FFB] transition-all duration-200"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[#A5A9C1] text-sm bg-[#1a1a2e]/50 px-3 py-1 rounded-full border border-[#2a2a4e]/50">
                      #{user?.id.slice(0, 4)}
                    </span>
                    <CopyButton text={user?.id} />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-6 h-6 text-[#FFD700]" />
                    <span className="text-4xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">
                      {user?.xpPoints?.total}
                    </span>
                  </div>
                  <div className="text-[#A5A9C1] text-sm font-medium">
                    Available PR points
                  </div>
                </div>
              </div>

              {/* Enhanced Stats Row */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center group">
                  <div className="text-sm mb-2 text-[#A5A9C1] font-medium">
                    Today
                  </div>
                  <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl py-4 backdrop-blur-sm group-hover:border-[#EE4FFB]/50 group-hover:bg-gradient-to-br group-hover:from-[#EE4FFB]/10 group-hover:to-[#EE4FFB]/5 transition-all duration-300">
                    <div className="text-2xl font-bold text-white group-hover:text-[#EE4FFB] transition-colors duration-300">
                      {user?.xpPoints?.today}
                    </div>
                    <div className="text-[#A5A9C1] text-xs font-medium">XP</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-sm mb-2 text-[#A5A9C1] font-medium">
                    This Week
                  </div>
                  <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl py-4 backdrop-blur-sm group-hover:border-[#28A9A3]/50 group-hover:bg-gradient-to-br group-hover:from-[#28A9A3]/10 group-hover:to-[#28A9A3]/5 transition-all duration-300">
                    <div className="text-2xl font-bold text-white group-hover:text-[#28A9A3] transition-colors duration-300">
                      {user?.xpPoints?.thisWeek}
                    </div>
                    <div className="text-[#A5A9C1] text-xs font-medium">XP</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="text-sm mb-2 text-[#A5A9C1] font-medium">
                    This Month
                  </div>
                  <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl py-4 backdrop-blur-sm group-hover:border-[#FF6B9D]/50 group-hover:bg-gradient-to-br group-hover:from-[#FF6B9D]/10 group-hover:to-[#FF6B9D]/5 transition-all duration-300">
                    <div className="text-2xl font-bold text-white group-hover:text-[#FF6B9D] transition-colors duration-300">
                      {user?.xpPoints?.thisMonth}
                    </div>
                    <div className="text-[#A5A9C1] text-xs font-medium">XP</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Lifetime XP */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#EE4FFB]/10 to-[#28A9A3]/10 rounded-2xl border border-[#EE4FFB]/20">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#EE4FFB]" />
                  <span className="text-white text-sm font-medium">
                    Lifetime XP points
                  </span>
                </div>
                <span className="text-[#EE4FFB] font-bold text-lg">
                  {user?.xpPoints?.total}
                </span>
              </div>
            </div>

            <TasksSection />
          </div>

          <ReferralsCard />
        </div>
      </div>

      <UsernameModal
        open={isEditingUsername}
        onOpenChange={setIsEditingUsername}
        onSuccess={handleUpdateUsernameSuccess}
        username={user?.username || ""}
        type="update"
      />
    </div>
  );
};

export default App;
