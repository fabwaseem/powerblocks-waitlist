"use client";

import Loader from "@/components/waitlist/Loader";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, loading, isError } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("accessToken");
    }
  }, [isError]);

  if (isLoading) {
    return <Loader />;
  }

  return children;
}
