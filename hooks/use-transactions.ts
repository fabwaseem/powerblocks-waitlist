import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { WithdrawRequest, WithdrawResponse } from '@/lib/api/transactions'
import { transactionsApi } from '@/lib/api/transactions'

// React Query Hooks
export const useWithdrawMutation = (options?: {
  onSuccess?: (data: WithdrawResponse) => void
  onError?: (error: Error) => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: WithdrawRequest) => {
      return await transactionsApi.withdraw(data)
    },
    onSuccess: (data) => {
      // Invalidate transactions query to refetch latest data
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      options?.onSuccess?.(data)
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}

export const useTransactionsQuery = (params?: {
  page?: number
  limit?: number
  type?: 'withdraw' | 'deposit'
  status?: string
}) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => transactionsApi.getTransactions(params),
    staleTime: 30000, // 30 seconds
  })
}

export const useTransactionQuery = (transactionId: string) => {
  return useQuery({
    queryKey: ['transaction', transactionId],
    queryFn: () => transactionsApi.getTransaction(transactionId),
    enabled: !!transactionId,
  })
}

export const useCancelWithdrawMutation = (options?: {
  onSuccess?: (data: { success: boolean; message: string }) => void
  onError?: (error: Error) => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (transactionId: string) => {
      return await transactionsApi.cancelWithdraw(transactionId)
    },
    onSuccess: (data) => {
      // Invalidate transactions query to refetch latest data
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      options?.onSuccess?.(data)
    },
    onError: (error) => {
      options?.onError?.(error)
    },
  })
}
