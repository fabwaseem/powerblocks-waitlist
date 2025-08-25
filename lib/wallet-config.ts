import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {
  mainnet,
  arbitrum,
  polygon,
  optimism,
  base,
  sepolia,
} from 'viem/chains'
import type { AppKitNetwork } from '@reown/appkit/networks'

// Environment detection
const getEnvironment = () => {
  if (process.env.NODE_ENV === 'test') return 'test'
  if (process.env.NODE_ENV === 'development') return 'development'
  return 'production'
}

// Configuration validation
const validateConfig = () => {
  if (!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID) {
    throw new Error(
      'NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not defined. Please set it in your environment variables'
    )
  }
}

// Define the networks we want to support
const networks = [
  mainnet,
  arbitrum,
  polygon,
  optimism,
  base,
  ...(getEnvironment() === 'development' ? [sepolia] : []),
] as [AppKitNetwork, ...AppKitNetwork[]]

// Initialize configuration
const initializeWalletConfig = () => {
  validateConfig()
  const env = getEnvironment()
  const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!

  // Create Wagmi adapter
  const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
  })

  // Initialize AppKit
  const appKit = createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    defaultNetwork: env === 'production' ? mainnet : sepolia,
    metadata: {
      name: 'Powerblock',
      description: 'Powerblock - Connect your EVM wallet',
      url:
        typeof window !== 'undefined'
          ? window.location.origin
          : 'https://powerblock.com',
      icons: ['https://powerblock.com/icon.png'],
    },
    features: {
      analytics: env === 'production',
      email: false,
      socials: [],
      swaps: false,
      onramp: false,
    },
  })

  return {
    env,
    appKit,
    wagmiAdapter,
    networks,
    projectId,
  }
}

// Export initialized configuration
export const {
  env,
  appKit,
  wagmiAdapter,
  networks: supportedNetworks,
  projectId,
} = initializeWalletConfig()

// Export wagmi config for use in providers
export const wagmiConfig = wagmiAdapter.wagmiConfig
