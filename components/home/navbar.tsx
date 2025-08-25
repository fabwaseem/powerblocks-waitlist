"use client";

import { useAuthLogout } from "@/hooks/use-auth-logout";
import { useAuthStore } from "@/store/auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AuthModal } from "./auth-modal";
import { UserDropdown } from "./user-dropdown";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const { isAuthenticated, user, loading } = useAuthStore();
  const handleLogout = useAuthLogout();

  const onLogout = async () => {
    await handleLogout();
    setIsUserDropdownOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex h-32 w-full shrink-0 items-center justify-between  px-4 md:px-6 max-w-[1640px] mx-auto">
        {/* Desktop Left Section */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center gap-2">
            <Image
              src="/images/logo.svg"
              alt="Powerblocks"
              width={33}
              height={42}
              className="size-10"
            />
            <h1 className="text-white text-2xl font-aeon ik-bold">
              Powerblocks
            </h1>
          </Link>
        </div>

        {/* Right Section - Auth */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3">
            {!loading && (
              <>
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-3">
                    <UserDropdown user={user} onLogout={onLogout} />
                    {/* <DropdownMenu onOpenChange={setIsUserDropdownOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="text-white flex hover:bg-neutral-700 items-center gap-2 hidden sm:flex"
                        >
                          <User className="w-4 h-4" />
                          {user.username}
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isUserDropdownOpen ? 'rotate-180' : 'rotate-0'
                            }`}
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem disabled className="text-gray-400">
                          {user.email}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="hover:bg-neutral-800 focus:bg-neutral-800 cursor-pointer"
                          onClick={onLogout}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    {/* <Button
                      onClick={() => setAuthModalOpen(true)}
                    >
                      Join Pre-Launch
                    </Button> */}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
