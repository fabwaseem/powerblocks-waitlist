'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ExternalLink,
  Copy,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { toast } from 'react-hot-toast'

interface Transaction {
  id: string
  type: 'DEPOSIT' | 'WITHDRAW'
  status:
    | 'PENDING'
    | 'APPROVED'
    | 'PROCESSING'
    | 'COMPLETED'
    | 'FAILED'
    | 'CANCELLED'
  amount: string
  token: string
  chainId: number
  walletAddress: string
  destinationAddress?: string
  txHash?: string
  createdAt: string
  updatedAt: string
}

interface TransactionResponse {
  transactions: Transaction[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export function TransactionHistory() {
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  const { data, isLoading, error, refetch } = useQuery<TransactionResponse>({
    queryKey: ['transactions', currentPage],
    queryFn: async () => {
      const response = await api.get(
        `/transactions/my?page=${currentPage}&limit=${limit}`
      )
      return response.data
    },
  })

  const getStatusBadge = (status: Transaction['status']) => {
    const statusConfig = {
      PENDING: {
        variant: 'secondary' as const,
        color: 'text-yellow-600',
        label: 'Pending',
      },
      APPROVED: {
        variant: 'secondary' as const,
        color: 'text-blue-600',
        label: 'Approved',
      },
      PROCESSING: {
        variant: 'secondary' as const,
        color: 'text-purple-600',
        label: 'Processing',
      },
      COMPLETED: {
        variant: 'default' as const,
        color: 'text-green-600',
        label: 'Completed',
      },
      FAILED: {
        variant: 'destructive' as const,
        color: 'text-red-600',
        label: 'Failed',
      },
      CANCELLED: {
        variant: 'outline' as const,
        color: 'text-gray-600',
        label: 'Cancelled',
      },
    }

    const config = statusConfig[status]
    return (
      <Badge variant={config.variant} className={`${config.color} text-xs`}>
        {config.label}
      </Badge>
    )
  }

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1:
        return 'Ethereum'
      case 137:
        return 'Polygon'
      case 42161:
        return 'Arbitrum'
      case 10:
        return 'Optimism'
      case 8453:
        return 'Base'
      case 11155111:
        return 'Sepolia'
      default:
        return `Chain ${chainId}`
    }
  }

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard`)
    } catch (error) {
      toast.error(`Failed to copy ${label}`)
    }
  }

  const openInExplorer = (txHash: string, chainId: number) => {
    let explorerUrl = ''

    switch (chainId) {
      case 1:
        explorerUrl = `https://etherscan.io/tx/${txHash}`
        break
      case 137:
        explorerUrl = `https://polygonscan.com/tx/${txHash}`
        break
      case 42161:
        explorerUrl = `https://arbiscan.io/tx/${txHash}`
        break
      case 10:
        explorerUrl = `https://optimistic.etherscan.io/tx/${txHash}`
        break
      case 8453:
        explorerUrl = `https://basescan.org/tx/${txHash}`
        break
      case 11155111:
        explorerUrl = `https://sepolia.etherscan.io/tx/${txHash}`
        break
      default:
        toast.error('Explorer not available for this network')
        return
    }

    window.open(explorerUrl, '_blank')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Failed to load transactions</p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data?.transactions?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-400">No transactions found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-white">Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-700">
          {data.transactions.map((transaction) => (
            <div key={transaction.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      transaction.type === 'DEPOSIT'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {transaction.type === 'DEPOSIT' ? (
                      <ArrowDownToLine className="h-4 w-4" />
                    ) : (
                      <ArrowUpFromLine className="h-4 w-4" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-medium">
                        {transaction.type === 'DEPOSIT'
                          ? 'Deposit'
                          : 'Withdraw'}
                      </span>
                      {getStatusBadge(transaction.status)}
                    </div>

                    <div className="text-sm text-gray-400 space-y-1">
                      <div>
                        Amount: {parseFloat(transaction.amount).toFixed(4)}{' '}
                        {transaction.token.toUpperCase()}
                      </div>
                      <div>Network: {getNetworkName(transaction.chainId)}</div>
                      <div>Date: {formatDate(transaction.createdAt)}</div>

                      {transaction.destinationAddress && (
                        <div className="flex items-center gap-1">
                          <span>To:</span>
                          <span className="font-mono">
                            {transaction.destinationAddress.slice(0, 6)}...
                            {transaction.destinationAddress.slice(-4)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0"
                            onClick={() =>
                              copyToClipboard(
                                transaction.destinationAddress!,
                                'Address'
                              )
                            }
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      )}

                      {transaction.txHash && (
                        <div className="flex items-center gap-1">
                          <span>Tx:</span>
                          <span className="font-mono">
                            {transaction.txHash.slice(0, 6)}...
                            {transaction.txHash.slice(-4)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0"
                            onClick={() =>
                              copyToClipboard(
                                transaction.txHash!,
                                'Transaction hash'
                              )
                            }
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0"
                            onClick={() =>
                              openInExplorer(
                                transaction.txHash!,
                                transaction.chainId
                              )
                            }
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-white font-medium">
                    {transaction.type === 'DEPOSIT' ? '+' : '-'}
                    {parseFloat(transaction.amount).toFixed(4)}
                  </div>
                  <div className="text-xs text-gray-400">
                    {transaction.token.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {data.pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Page {data.pagination.page} of {data.pagination.pages}(
              {data.pagination.total} total)
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === data.pagination.pages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
