import { User } from "@/types";
import { api } from "./axios";

export interface SendCodeData {
  username?: string; // Required for signup
  email: string;
  // recaptchaToken: string
  type: "signup" | "signin" | "waitlist";
  referralCode?: string;
}

export interface VerifyCodeData {
  email: string;
  code: string;
  type: "signup" | "signin" | "waitlist";
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    lastLogin?: Date;
    depositWalletAddresses?: {
      evm?: { address: string; totalAmount: number; availableAmount: number };
      solana?: {
        address: string;
        totalAmount: number;
        availableAmount: number;
      };
      tron?: { address: string; totalAmount: number; availableAmount: number };
    };
  };
}

export interface SendCodeResponse {
  message: string;
}

export const authApi = {
  sendCode: async (data: SendCodeData): Promise<SendCodeResponse> => {
    const response = await api.post("/auth/send-code", data);
    return response.data;
  },

  verifyCode: async (data: VerifyCodeData): Promise<AuthResponse> => {
    const response = await api.post("/auth/verify-code", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  getMe: async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};
