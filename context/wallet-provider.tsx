'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, useContext, type ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { wagmiConfig } from '@/lib/wallet-config'

// Create QueryClient instance
const queryClient = new QueryClient()

// Create wallet context
const WalletContext = createContext<object>({})

export const useWallet = () => {
  return useContext(WalletContext)
}

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletContext.Provider value={{}}>{children}</WalletContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
