import { api } from '@/lib/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface TransactionDto {
  tokenAddress: string
  chainId?: number
}

export interface WithdrawRequest extends TransactionDto {
  amount: number
  address: string
}

export interface WithdrawResponse {
  success: boolean
  message: string
  transactionId?: string
  status: 'pending' | 'approved' | 'rejected'
  requiresApproval?: boolean
}

export interface Transaction {
  id: string
  type: 'withdraw' | 'deposit'
  amount: number
  tokenAddress: string
  chainId: number
  address: string
  status:
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'approved'
    | 'rejected'
  transactionHash?: string
  createdAt: string
  updatedAt: string
  requiresApproval: boolean
  approvedAt?: string
  approvedBy?: string
}

export interface TransactionListResponse {
  transactions: Transaction[]
  total: number
  page: number
  limit: number
}

// Base API functions
export const transactionsApi = {
  // Submit withdrawal request
  withdraw: async (data: WithdrawRequest): Promise<WithdrawResponse> => {
    const response = await api.post<WithdrawResponse>(
      '/transactions/withdraw',
      {
        amount: data.amount,
        toAddress: data.address,
        tokenAddress: data.tokenAddress,
        chainId: data.chainId,
      }
    )
    return response.data
  },

  // Get transaction history for current user
  getTransactions: async (params?: {
    page?: number
    limit?: number
    type?: 'withdraw' | 'deposit'
    status?: string
  }): Promise<TransactionListResponse> => {
    const response = await api.get<TransactionListResponse>('/transactions', {
      params,
    })
    return response.data
  },

  // Get specific transaction by ID
  getTransaction: async (transactionId: string): Promise<Transaction> => {
    const response = await api.get<Transaction>(
      `/transactions/${transactionId}`
    )
    return response.data
  },

  // Cancel pending withdrawal (if allowed)
  cancelWithdraw: async (
    transactionId: string
  ): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/transactions/withdraw/${transactionId}`)
    return response.data
  },
}
