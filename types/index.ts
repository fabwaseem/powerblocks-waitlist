export enum OAuthProvider {
  GOOGLE = "GOOGLE",
  TWITTER = "TWITTER",
  INSTAGRAM = "INSTAGRAM",
  DISCORD = "DISCORD",
  TELEGRAM = "TELEGRAM",
}

export interface User {
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
