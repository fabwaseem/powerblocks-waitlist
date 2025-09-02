import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, AuthResponse } from "@/lib/auth-api";
import { walletApi } from "@/lib/api/wallet";
import { OAuthProvider } from "@/types";
import { useEffect, useState } from "react";
import { useAuthToken } from "./useAuthToken";

// Query keys for consistent caching
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
  wallet: () => [...authKeys.all, "wallet"] as const,
};

// User interface
interface User {
  id: string;
  username: string;
  email: string;
  referralCode?: string;
  createdAt: Date;
  lastLogin?: Date;
  depositWalletAddresses?: {
    evm?: { address: string; totalAmount: number; availableAmount: number };
    solana?: { address: string; totalAmount: number; availableAmount: number };
    tron?: { address: string; totalAmount: number; availableAmount: number };
  };
  xpPoints?: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
  };
  avatarUrl?: string;
  phoneVerified?: boolean;
  oauthAccounts?: {
    id: string;
    provider: OAuthProvider;
    username: string | null;
    email: string;
    displayName: string;
    avatarUrl: string;
    createdAt: Date;
  }[];
}

export const useUser = () => {
  const hasAccessToken = useAuthToken();
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: authApi.getMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false;
      return failureCount < 3;
    },
    enabled: hasAccessToken,
  });
};

// Hook to check authentication status
export const useAuth = () => {
  const { data: user, isLoading, error, isError, refetch } = useUser();

  return {
    user,
    isAuthenticated: !!user,
    loading: isLoading,
    error: error?.message || null,
    isError,
    refetch,
  };
};

// Hook to logout
export const useLogout = () => {
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      window.location.reload();
    },
    onError: (error) => {
      console.error("Logout error:", error);
    },
  });
};

// Hook to update wallet connection
export const useUpdateWalletConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (walletAddress: string) =>
      walletApi.connectWallet(walletAddress),
    onSuccess: (updatedUser) => {
      // Update user data in cache with new wallet info
      queryClient.setQueryData<User>(authKeys.user(), (oldUser) => {
        if (!oldUser) return oldUser;

        return {
          ...oldUser,
          depositWalletAddresses: updatedUser.depositWalletAddresses,
        };
      });
    },
    onError: (error) => {
      console.error("Failed to update wallet connection:", error);
    },
  });
};

// Hook to disconnect wallet
export const useDisconnectWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Wallet disconnect is handled by frontend only
      // No backend call needed
      return Promise.resolve();
    },
    onSuccess: () => {
      // Update user data in cache to remove wallet address
      queryClient.setQueryData<User>(authKeys.user(), (oldUser) => {
        if (!oldUser) return oldUser;

        return {
          ...oldUser,
          currentWalletAddress: undefined,
        };
      });
    },
  });
};

// Hook to sync wallet status
export const useSyncWalletStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: walletApi.getWalletsInfo,
    onSuccess: (walletInfo) => {
      // Update user data in cache with latest wallet info
      queryClient.setQueryData<User>(authKeys.user(), (oldUser) => {
        if (!oldUser) return oldUser;

        return {
          ...oldUser,
          depositWalletAddresses: walletInfo.depositWalletAddresses,
        };
      });
    },
    onError: (error) => {
      console.error("Failed to sync wallet status:", error);
    },
  });
};

// Hook to refresh auth data
export const useRefreshAuth = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: authKeys.user() });
  };
};

// Hook to clear auth data from cache
export const useClearAuth = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.removeQueries({ queryKey: authKeys.all });
  };
};

// Hook to get wallet info
export const useWalletInfo = () => {
  const { data: user } = useUser();
  return user?.depositWalletAddresses;
};

// Hook to get XP points
export const useXpPoints = () => {
  const { data: user } = useUser();
  return user?.xpPoints || { today: 0, thisWeek: 0, thisMonth: 0, total: 0 };
};

// Hook to get OAuth accounts
export const useOAuthAccounts = () => {
  const { data: user } = useUser();
  return user?.oauthAccounts || [];
};

// Hook to check if phone is verified
export const usePhoneVerified = () => {
  const { data: user } = useUser();
  return user?.phoneVerified || false;
};

// Hook to get avatar URL
export const useAvatarUrl = () => {
  const { data: user } = useUser();
  return user?.avatarUrl;
};

// Hook to get referral code
export const useReferralCode = () => {
  const { data: user } = useUser();
  return user?.referralCode;
};

// Hook to get user creation date
export const useUserCreatedAt = () => {
  const { data: user } = useUser();
  return user?.createdAt;
};

// Hook to get last login date
export const useLastLogin = () => {
  const { data: user } = useUser();
  return user?.lastLogin;
};
