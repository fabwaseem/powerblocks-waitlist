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
  fetchReferralInfo: () => Promise<void>;
  clearReferralInfo: () => void;
}

export const useReferralStore = create<ReferralState>()((set, get) => ({
  referralInfo: null,
  loading: false,
  error: null,
  setReferralInfo: (referralInfo) => set({ referralInfo }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  fetchReferralInfo: async () => {
    // Don't fetch if we already have data and not loading
    if (get().referralInfo && !get().loading) {
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
}));
