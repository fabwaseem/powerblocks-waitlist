"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  LogOut,
  User,
  CreditCard,
  Gift,
  Users,
  Settings,
  Mail,
  Crown,
  Sparkles,
} from "lucide-react";

interface UserDropdownProps {
  user: {
    username: string;
    email: string;
  };
  onLogout: () => void;
}

export function UserDropdown({ user, onLogout }: UserDropdownProps) {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <DropdownMenu onOpenChange={setIsUserDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-white flex hover:bg-white/10 items-center gap-3 hidden sm:flex bg-gradient-to-r from-white/5 to-white/10 border border-white/20 rounded-2xl px-4 py-5 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#EE4FFB]/25 group"
        >
          <div className="size-6 bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] rounded-full flex items-center justify-center text-xs  text-white shadow-lg shadow-[#EE4FFB]/25 group-hover:shadow-[#EE4FFB]/40 transition-all duration-300">
            {getInitials(user.username)}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-white font-semibold text-sm">
              {user.username}
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-all duration-300 ${
              isUserDropdownOpen
                ? "rotate-180 text-[#EE4FFB]"
                : "rotate-0 text-[#A5A9C1]"
            }`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 bg-gradient-to-br from-[#11042F]/95 to-[#020106]/95 backdrop-blur-xl border border-[#2a2a4e]/50 rounded-2xl shadow-2xl shadow-[#EE4FFB]/10 p-2"
        align="end"
      >
        {/* User Info Header */}
        <div className="px-3 py-4 border-b border-white/10 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-[#EE4FFB]/25">
              {getInitials(user.username)}
            </div>
            <div className="flex-1 max-w-[150px]">
              <div className="text-white font-semibold text-sm">
                {user.username}
              </div>
              <div className="text-[#A5A9C1] text-xs truncate">
                {user.email}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-1">
          {/* <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-[#EE4FFB]/10 hover:to-[#FF6B9D]/10 focus:bg-gradient-to-r focus:from-[#EE4FFB]/10 focus:to-[#FF6B9D]/10 cursor-pointer rounded-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 w-full">
              <div className="p-1.5 bg-gradient-to-r from-[#28A9A3] to-[#00D4FF] rounded-lg group-hover:scale-110 transition-transform duration-300">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium">Profile</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-[#EE4FFB]/10 hover:to-[#FF6B9D]/10 focus:bg-gradient-to-r focus:from-[#EE4FFB]/10 focus:to-[#FF6B9D]/10 cursor-pointer rounded-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 w-full">
              <div className="p-1.5 bg-gradient-to-r from-[#96A3F6] to-[#6C7793] rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium">Messages</span>
              <div className="ml-auto">
                <div className="w-2 h-2 bg-gradient-to-r from-[#EE4FFB] to-[#FF6B9D] rounded-full animate-pulse"></div>
              </div>
            </div>
          </DropdownMenuItem> */}

          {/* <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-[#EE4FFB]/10 hover:to-[#FF6B9D]/10 focus:bg-gradient-to-r focus:from-[#EE4FFB]/10 focus:to-[#FF6B9D]/10 cursor-pointer rounded-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 w-full">
              <div className="p-1.5 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium">Rewards</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-[#EE4FFB]/10 hover:to-[#FF6B9D]/10 focus:bg-gradient-to-r focus:from-[#EE4FFB]/10 focus:to-[#FF6B9D]/10 cursor-pointer rounded-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 w-full">
              <div className="p-1.5 bg-gradient-to-r from-[#28A9A3] to-[#00D4FF] rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium">Referrals</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className="hover:bg-gradient-to-r hover:from-[#EE4FFB]/10 hover:to-[#FF6B9D]/10 focus:bg-gradient-to-r focus:from-[#EE4FFB]/10 focus:to-[#FF6B9D]/10 cursor-pointer rounded-xl transition-all duration-300 group">
            <div className="flex items-center gap-3 w-full">
              <div className="p-1.5 bg-gradient-to-r from-[#96A3F6] to-[#6C7793] rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium">Settings</span>
            </div>
          </DropdownMenuItem> */}
        </div>

        {/* <DropdownMenuSeparator className="bg-white/10 my-2" /> */}

        {/* Logout Button */}
        <DropdownMenuItem
          className="hover:bg-gradient-to-r hover:from-red-500/20 hover:to-red-600/20 focus:bg-gradient-to-r focus:from-red-500/20 focus:to-red-600/20 cursor-pointer rounded-xl transition-all duration-300 group"
          onClick={onLogout}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="p-1.5 bg-gradient-to-r from-red-500 to-red-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <LogOut className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-medium">Logout</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
