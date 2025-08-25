import { api } from '@/lib/axios'

export interface WalletConnectionDto {
  walletAddress: string
}

export interface WalletDisconnectResponse {
  success: boolean
  message: string
}

export interface UserWalletInfo {
  id: string
  username: string
  email: string
  depositWalletAddresses?: {
    evm?: { address: string; totalAmount: number; availableAmount: number }
    solana?: { address: string; totalAmount: number; availableAmount: number }
    tron?: { address: string; totalAmount: number; availableAmount: number }
  }
  createdAt: string
  lastLogin?: string
}

export interface UserBalanceEntry {
  currency: string
  balance: number
}

export const walletApi = {
  // Connect wallet to authenticated user
  connectWallet: async (walletAddress: string): Promise<UserWalletInfo> => {
    const response = await api.post<UserWalletInfo>('/auth/connect-wallet', {
      walletAddress,
    })
    return response.data
  },

  // Get current user wallet info
  getWalletsInfo: async (): Promise<UserWalletInfo> => {
    const response = await api.get<UserWalletInfo>('/auth/wallets-info')
    return response.data
  },

  // Get simple balances for current user from UserWallet
  getBalances: async (): Promise<UserBalanceEntry[]> => {
    const response = await api.get<UserBalanceEntry[]>('/wallet/balances')
    return response.data
  },
}
