import { referralsApi, UserReferralInfo } from "@/lib/api/referrals";
import { api } from "@/lib/axios";
import axios from "axios";
import { create } from "zustand";

interface ReferralState {
  referralInfo: UserReferralInfo | null;
  loading: boolean;
  error: string | null;
  setReferralInfo: (referralInfo: UserReferralInfo | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  fetchReferralInfo: (force?: boolean) => Promise<void>;
  clearReferralInfo: () => void;
  claimReferralReward: (
    referralId: string
  ) => Promise<{ success: boolean; error?: unknown }>;
  claimReferralRewardLoading: boolean;
  setClaimReferralRewardLoading: (loading: boolean) => void;
}

export const useReferralStore = create<ReferralState>()((set, get) => ({
  referralInfo: null,
  loading: false,
  error: null,
  setReferralInfo: (referralInfo) => set({ referralInfo }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  fetchReferralInfo: async (force = false) => {
    // Don't fetch if we already have data and not loading, unless force is true
    if (get().referralInfo && !get().loading && !force) {
      return;
    }

    try {
      set({ loading: true, error: null });
      const data = await referralsApi.getUserReferralInfo();
      set({ referralInfo: data, error: null });
    } catch (err) {
      set({
        error: axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error
          ? err.message
          : "Failed to fetch referral info",
      });
    } finally {
      set({ loading: false });
    }
  },
  clearReferralInfo: () => set({ referralInfo: null, error: null }),
  claimReferralReward: async (referralId) => {
    set({ claimReferralRewardLoading: true });
    try {
      await referralsApi.claimReferralReward({ referralId });
      // Refetch referral info after successful claim
      await get().fetchReferralInfo(true);
      return { success: true };
    } catch (err) {
      set({
        error:
          err instanceof Error
            ? err.message
            : "Failed to claim referral reward",
      });
      return { success: false, error: err };
    } finally {
      set({ claimReferralRewardLoading: false });
    }
  },
  claimReferralRewardLoading: false,
  setClaimReferralRewardLoading: (loading) =>
    set({ claimReferralRewardLoading: loading }),
}));
