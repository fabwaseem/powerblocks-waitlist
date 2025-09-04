import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { referralsApi, UserReferralInfo } from "@/lib/api/referrals";
import { authKeys } from "./use-auth";
import toast from "react-hot-toast";

// Query keys for consistent caching
export const referralKeys = {
  all: ["referrals"] as const,
  info: () => [...referralKeys.all, "info"] as const,
  history: () => [...referralKeys.all, "history"] as const,
  stats: () => [...referralKeys.all, "stats"] as const,
};

// Hook to fetch user referral info
export const useReferralInfo = () => {
  return useQuery({
    queryKey: referralKeys.info(),
    queryFn: referralsApi.getUserReferralInfo,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to get referral history
export const useReferralHistory = () => {
  const { data: referralInfo } = useReferralInfo();
  return referralInfo?.history || [];
};

// Hook to get referral stats
export const useReferralStats = () => {
  const { data: referralInfo } = useReferralInfo();
  return referralInfo?.stats || { pendingReferrals: 0, successfulReferrals: 0 };
};

// Hook to get referral code
export const useReferralCode = () => {
  const { data: referralInfo } = useReferralInfo();
  return referralInfo?.referralCode || "";
};

// Hook to claim referral reward
export const useClaimReferralReward = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (referralId: string) =>
      referralsApi.claimReferralReward({ referralId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: referralKeys.info() });
      toast.success("Referral reward claimed successfully");
    },
    onError: (error) => {
      console.error("Failed to claim referral reward:", error);
      toast.error("Failed to claim referral reward");
    },
  });
};

// Hook to refresh referral data
export const useRefreshReferrals = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: referralKeys.info() });
  };
};

// Hook to clear referral data from cache
export const useClearReferrals = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.removeQueries({ queryKey: referralKeys.info() });
  };
};

// Hook to get claimable referrals
export const useClaimableReferrals = () => {
  const { data: referralInfo } = useReferralInfo();

  if (!referralInfo?.history) return [];

  return referralInfo.history.filter(
    (referral) => referral.status === "CLAIMABLE"
  );
};

// Hook to get pending referrals
export const usePendingReferrals = () => {
  const { data: referralInfo } = useReferralInfo();

  if (!referralInfo?.history) return [];

  return referralInfo.history.filter(
    (referral) => referral.status === "PENDING"
  );
};

// Hook to get collected referrals
export const useCollectedReferrals = () => {
  const { data: referralInfo } = useReferralInfo();

  if (!referralInfo?.history) return [];

  return referralInfo.history.filter(
    (referral) => referral.status === "COLLECTED"
  );
};

// Hook to get total referral count
export const useTotalReferralCount = () => {
  const { data: referralInfo } = useReferralInfo();

  if (!referralInfo?.history) return 0;

  return referralInfo.history.length;
};

// Hook to get total rewards earned
export const useTotalRewardsEarned = () => {
  const { data: referralInfo } = useReferralInfo();

  if (!referralInfo?.history) return "0";

  return referralInfo.history
    .filter((referral) => referral.status === "COLLECTED")
    .reduce((total, referral) => {
      const reward = parseFloat(referral.reward) || 0;
      return total + reward;
    }, 0)
    .toFixed(2);
};

// Hook to get pending rewards
export const usePendingRewards = () => {
  const { data: referralInfo } = useReferralInfo();

  if (!referralInfo?.history) return "0";

  return referralInfo.history
    .filter((referral) => referral.status === "CLAIMABLE")
    .reduce((total, referral) => {
      const reward = parseFloat(referral.reward) || 0;
      return total + reward;
    }, 0)
    .toFixed(2);
};

/**
 * LEGACY COMPATIBILITY HOOK
 * This hook provides a similar API to the old Zustand store for easier migration
 */
export const useReferralStore = () => {
  const { data: referralInfo, isLoading: loading, error } = useReferralInfo();
  const { mutate: claimReferralReward, isPending: claimReferralRewardLoading } =
    useClaimReferralReward();
  const refreshReferrals = useRefreshReferrals();
  const clearReferrals = useClearReferrals();

  const setReferralInfo = () => {
    // No-op in React Query - data is managed automatically
    console.warn(
      "setReferralInfo is deprecated in React Query. Data is managed automatically."
    );
  };

  const setError = () => {
    // No-op in React Query - errors are managed automatically
    console.warn(
      "setError is deprecated in React Query. Errors are managed automatically."
    );
  };

  const setLoading = () => {
    // No-op in React Query - loading states are managed automatically
    console.warn(
      "setLoading is deprecated in React Query. Loading states are managed automatically."
    );
  };

  const setClaimReferralRewardLoading = () => {
    // No-op in React Query - mutation states are managed automatically
    console.warn(
      "setClaimReferralRewardLoading is deprecated in React Query. Mutation states are managed automatically."
    );
  };

  const fetchReferralInfo = async (force = false) => {
    if (force) {
      refreshReferrals();
    }
    // In React Query, data is fetched automatically when the component mounts
    // and when the query is invalidated
  };

  const clearReferralInfo = () => {
    clearReferrals();
  };

  const claimReferralRewardAction = async (referralId: string) => {
    return new Promise<{ success: boolean; error?: unknown }>((resolve) => {
      claimReferralReward(referralId, {
        onSuccess: () => resolve({ success: true }),
        onError: (error) => resolve({ success: false, error }),
      });
    });
  };

  return {
    // Data
    referralInfo,

    // Loading states
    loading,
    claimReferralRewardLoading,

    // Error state
    error: error?.message || null,

    // Actions (deprecated but provided for compatibility)
    setReferralInfo,
    setError,
    setLoading,
    setClaimReferralRewardLoading,

    // API actions
    fetchReferralInfo,
    clearReferralInfo,
    claimReferralReward: claimReferralRewardAction,
  };
};
