import { walletApi } from "@/lib/api/wallet";
import { api } from "@/lib/axios";
import { OAuthProvider } from "@/types";
import axios from "axios";
import { create } from "zustand";

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

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  updateWalletConnection: (walletAddress: string) => Promise<void>;
  disconnectWallet: () => Promise<void>;
  syncWalletStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  setUser: (user) => set({ user }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  checkAuth: async () => {
    try {
      const response = await api.get<User>("/auth/me", { showToast: false });
      set({
        user: response.data,
        isAuthenticated: true,
        error: null,
      });
    } catch (err) {
      set({
        user: null,
        isAuthenticated: false,
        error: axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error
          ? err.message
          : "Authentication failed",
      });
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    try {
      await api.post("/auth/logout");
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
    } catch (err) {
      console.error("Logout error:", err);
      set({
        error: axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error
          ? err.message
          : "Logout failed",
      });
    }
  },
  updateWalletConnection: async (walletAddress: string) => {
    try {
      if (!get().isAuthenticated) {
        // If user is not authenticated, we can't update wallet connection yet
        // This will be handled when they sign in
        return;
      }

      const updatedUser = await walletApi.connectWallet(walletAddress);
      set((state) => ({
        user: state.user
          ? {
              ...state.user,
              depositWalletAddresses: updatedUser.depositWalletAddresses,
            }
          : state.user,
      }));
    } catch (err) {
      console.error("Failed to update wallet connection:", err);
      set({
        error: axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error
          ? err.message
          : "Failed to update wallet connection",
      });
    }
  },
  disconnectWallet: async () => {
    // Wallet disconnect is handled by frontend only
    // Just update the local state, no backend call needed
    set((state) => ({
      user: state.user
        ? {
            ...state.user,
            // Keep walletConnected true (persistent) but clear address for UI
            currentWalletAddress: undefined,
          }
        : state.user,
    }));
  },
  syncWalletStatus: async () => {
    try {
      if (!get().isAuthenticated) {
        return;
      }

      const walletInfo = await walletApi.getWalletsInfo();
      set((state) => ({
        user: state.user
          ? {
              ...state.user,
              depositWalletAddresses: walletInfo.depositWalletAddresses,
            }
          : state.user,
      }));
    } catch (err) {
      console.error("Failed to sync wallet status:", err);
    }
  },
}));
