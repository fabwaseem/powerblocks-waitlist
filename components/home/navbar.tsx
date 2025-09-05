"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { UserDropdown } from "./user-dropdown";
import { useAuth, useLogout } from "@/hooks/use-auth";

export default function Navbar() {
  const { isAuthenticated, user, loading } = useAuth();
  const { mutate: logout } = useLogout();

  return (
    <>
      <header className="relative z-50 flex max-lg:p-2 pb-6!   w-full shrink-0 items-center justify-between  max-w-[1640px] mx-auto">
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
            <h1 className="text-white text-2xl font-aeon font-bold">
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
                    <UserDropdown user={user} onLogout={() => logout()} />
                  </div>
                ) : (
                  <div className="flex items-center gap-3"></div>
                )}
              </>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
