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
      <DropdownMenuTrigger asChild className="border border-neutral-600">
        <Button
          variant="ghost"
          className="text-white flex hover:bg-neutral-700 items-center gap-2 hidden sm:flex"
        >
          <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium text-white">
            {getInitials(user.username)}
          </div>
          {user.username}
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isUserDropdownOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        {/* <DropdownMenuItem disabled className="text-gray-400">
          {user.email}
        </DropdownMenuItem>

        <DropdownMenuSeparator /> */}

        <DropdownMenuItem className="hover:bg-neutral-800 focus:bg-neutral-800 cursor-pointer">
          <User className="w-4 h-4 mr-3" />
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-neutral-800 focus:bg-neutral-800 cursor-pointer">
          <Mail className="w-4 h-4 mr-3" />
          Messages
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="hover:bg-neutral-800 focus:bg-neutral-800 cursor-pointer"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-3" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
