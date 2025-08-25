'use client'

import { useBalance } from 'wagmi'
import { formatUnits } from 'viem'

interface UseTokenBalanceProps {
  address?: `0x${string}`
  token?: `0x${string}` // ERC20 token address, undefined for native token
  chainId?: number
  enabled?: boolean
}

export function useTokenBalance({
  address,
  token,
  chainId,
  enabled = true,
}: UseTokenBalanceProps) {
  const {
    data: balance,
    isLoading,
    error,
    refetch,
  } = useBalance({
    address,
    token,
    chainId,
    query: {
      enabled: !!address && enabled,
    },
  })

  // Format balance for display
  const formattedBalance = balance
    ? formatUnits(balance.value, balance.decimals)
    : '0'

  // Get token symbol
  const symbol = balance?.symbol || 'ETH'

  // Parse balance to number for calculations
  const balanceNumber = parseFloat(formattedBalance)

  return {
    balance,
    formattedBalance,
    symbol,
    balanceNumber,
    decimals: balance?.decimals || 18,
    isLoading,
    error,
    refetch,
  }
}

// Common token addresses for major networks
export const COMMON_TOKENS = {
  // Ethereum Mainnet
  1: {
    USDC: '0xA0b86a33E6441d52C4297Bd76b5B9e9e3a1e87a6' as `0x${string}`,
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as `0x${string}`,
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as `0x${string}`,
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as `0x${string}`,
  },
  // Polygon
  137: {
    USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174' as `0x${string}`,
    USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F' as `0x${string}`,
    DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063' as `0x${string}`,
    WMATIC: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270' as `0x${string}`,
  },
  // Arbitrum
  42161: {
    USDC: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8' as `0x${string}`,
    USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9' as `0x${string}`,
    DAI: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1' as `0x${string}`,
    WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1' as `0x${string}`,
  },
} as const

// Helper function to get native token symbol for a chain
export function getNativeTokenSymbol(chainId: number): string {
  switch (chainId) {
    case 1:
    case 11155111: // Sepolia
      return 'ETH'
    case 137:
      return 'MATIC'
    case 42161:
      return 'ETH'
    case 10:
      return 'ETH'
    case 8453:
      return 'ETH'
    default:
      return 'ETH'
  }
}
