'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { walletApi, type UserBalanceEntry } from '@/lib/api/wallet'
import { useAuthStore } from '@/store/auth'
import { EthIcon, SolanaIcon, TronIcon } from '../common/icons'

// Chain configuration
const chainConfig = {
  evm: { name: 'EVM', icon: <EthIcon className="w-4 h-4" /> },
  solana: { name: 'Solana', icon: <SolanaIcon className="w-4 h-4" /> },
  tron: { name: 'Tron', icon: <TronIcon className="w-4 h-4" /> },
} as const

type ChainType = keyof typeof chainConfig

interface ChainBalance {
  chain: ChainType
  availableAmount: number
  currency: string
}

const formatTriggerBalance = (value: number): string => {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 4,
    useGrouping: false,
  })
}

const formatContentBalance = (value: number): string => {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 8,
    useGrouping: false,
  })
}

export function ChainBalanceSelector({
  setDepositWithdrawModalOpen,
}: {
  setDepositWithdrawModalOpen: (open: boolean) => void
}) {
  const [selectedChain, setSelectedChain] = useState<string>('total')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { isAuthenticated, user } = useAuthStore()

  // Calculate chain balances from user data
  const chainBalances = useMemo((): ChainBalance[] => {
    if (!user?.depositWalletAddresses) return []

    const balances: ChainBalance[] = []
    const chains: ChainType[] = ['evm', 'solana', 'tron']

    chains.forEach((chain) => {
      const walletData = user.depositWalletAddresses?.[chain]
      if (walletData?.availableAmount) {
        balances.push({
          chain,
          availableAmount: Number(walletData.availableAmount),
          currency: 'USD', // Assuming USD for now, adjust as needed
        })
      }
    })

    return balances
  }, [user?.depositWalletAddresses])

  // Calculate total balance across all chains
  const totalBalance = useMemo(() => {
    return chainBalances.reduce(
      (sum, balance) => sum + balance.availableAmount,
      0
    )
  }, [chainBalances])

  // Get current selection for display
  const currentSelection = useMemo(() => {
    if (selectedChain === 'total') {
      return {
        displayName: 'Total Balance',
        balance: totalBalance,
        currency: 'USD',
        icon: '',
      }
    }

    const chainBalance = chainBalances.find((b) => b.chain === selectedChain)
    if (chainBalance) {
      return {
        displayName: chainConfig[chainBalance.chain].name,
        balance: chainBalance.availableAmount,
        currency: chainBalance.currency,
        icon: chainConfig[chainBalance.chain].icon,
      }
    }

    return null
  }, [selectedChain, chainBalances, totalBalance])

  // Set default selection when balances load
  useEffect(() => {
    if (chainBalances.length > 0 && selectedChain === '') {
      setSelectedChain('total')
    }
  }, [chainBalances, selectedChain])

  return (
    <div className="flex items-center bg-gray-800 rounded-md overflow-hidden">
      {/* Balance Display with Dropdown */}
      <Select
        value={selectedChain}
        onValueChange={setSelectedChain}
        onOpenChange={setIsOpen}
      >
        <SelectTrigger className="flex-1 bg-transparent border-none text-white focus:outline-none foucs:ring-0 focus-visible:ring-0 active:outline-none active:ring-0 active:ring-offset-0 text-xl font-semibold px-4 py-4 h-auto focus:ring-0 focus:ring-offset-0 [&>svg]:hidden">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 !text-[16px]">
              <span className="text-lg">{currentSelection?.icon ?? '🪙'}</span>
              <SelectValue className="!text-[16px]">
                {loading
                  ? 'Loading...'
                  : currentSelection
                  ? `$ ${formatTriggerBalance(currentSelection.balance)}`
                  : 'No balances'}
              </SelectValue>
            </div>
            <div className="text-gray-400 ml-2">
              {isOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          {/* Total Balance Option */}
          {/* <SelectItem
            value="total"
            className="text-white hover:bg-gray-700 focus:bg-gray-700"
            showCheck={false}
          >
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <span className="font-semibold">
                  $ {formatContentBalance(totalBalance)}
                </span>
                <span className="text-sm text-gray-400">Total Balance</span>
              </div>
            </div>
          </SelectItem> */}

          {/* Individual Chain Balances */}
          {chainBalances.map((balance) => (
            <SelectItem
              key={balance.chain}
              value={balance.chain}
              className="text-white hover:bg-gray-700 focus:bg-gray-700"
              showCheck={false}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {chainConfig[balance.chain].icon}
                </span>
                <div className="flex flex-col">
                  <span className="font-semibold">
                    $ {formatContentBalance(balance.availableAmount)}
                  </span>
                  {/* <span className="text-sm text-gray-400">
                    {chainConfig[balance.chain].name}
                  </span> */}
                </div>
              </div>
            </SelectItem>
          ))}

          {/* Show message if no balances */}
          {chainBalances.length === 0 && (
            <SelectItem
              value="no-balance"
              disabled
              className="text-gray-400"
              showCheck={false}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🪙</span>
                <span>No balances available</span>
              </div>
            </SelectItem>
          )}
        </SelectContent>
      </Select>

      {/* Plus Button */}
      <Button
        size="icon"
        className="bg-gradient-brand-pink text-white rounded-md h-8 w-8 flex-shrink-0 cursor-pointer"
        onClick={() => setDepositWithdrawModalOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}

// 'use client'

// import { useEffect, useMemo, useState } from 'react'
// import { ChevronDown, ChevronUp, Plus } from 'lucide-react'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { Button } from '@/components/ui/button'
// import { walletApi, type UserBalanceEntry } from '@/lib/api/wallet'
// import { useAuthStore } from '@/store/auth'

// // Simple icon mapping by currency symbol; extend as needed
// const currencyIcon: Record<string, string> = {
//   USD: '💵',
//   USDC: '🪙',
//   ETH: '⟠',
//   MATIC: '⬟',
//   ARB: '◆',
//   OP: '🔴',
//   BASE: '🔵',
// }

// const formatTriggerBalance = (value: number): string => {
//   return value.toLocaleString(undefined, {
//     maximumFractionDigits: 5,
//     useGrouping: false,
//   })
// }

// const formatContentBalance = (value: number): string => {
//   return value.toLocaleString(undefined, {
//     maximumFractionDigits: 8,
//     useGrouping: false,
//   })
// }

// export function ChainBalanceSelector({
//   setDepositWithdrawModalOpen,
// }: {
//   setDepositWithdrawModalOpen: (open: boolean) => void
// }) {
//   const [selectedCurrency, setSelectedCurrency] = useState<string>('')
//   const [isOpen, setIsOpen] = useState<boolean>(false)
//   const [balances, setBalances] = useState<UserBalanceEntry[]>([])
//   const [loading, setLoading] = useState<boolean>(false)
//   const { isAuthenticated, user } = useAuthStore()

//   return (
//     <div className="flex items-center bg-gray-800 rounded-md overflow-hidden">
//       {/* Balance Display with Dropdown - now includes the chevron icon */}
//       <Select
//         value={selectedCurrency}
//         onValueChange={setSelectedCurrency}
//         onOpenChange={setIsOpen}
//       >
//         <SelectTrigger className="flex-1 bg-transparent border-none text-white focus:outline-none foucs:ring-0 focus-visible:ring-0 active:outline-none active:ring-0 active:ring-offset-0 text-xl font-semibold px-4 py-4 h-auto focus:ring-0 focus:ring-offset-0 [&>svg]:hidden">
//           <div className="flex items-center justify-between w-full">
//             <div className="flex items-center gap-3 !text-[16px]">
//               <span className="text-lg">
//                 {current ? currencyIcon[current.currency] ?? '🪙' : '🪙'}
//               </span>
//               <SelectValue className="!text-[16px]">
//                 {loading
//                   ? 'Loading...'
//                   : current
//                   ? `${formatTriggerBalance(current.balance)} ${
//                       current.currency
//                     }`
//                   : 'No balances'}
//               </SelectValue>
//             </div>
//             <div className="text-gray-400 ml-2">
//               {isOpen ? (
//                 <ChevronUp className="h-5 w-5" />
//               ) : (
//                 <ChevronDown className="h-5 w-5" />
//               )}
//             </div>
//           </div>
//         </SelectTrigger>
//         <SelectContent className="bg-gray-800 border-gray-700">
//           {balances.map((entry) => (
//             <SelectItem
//               key={entry.currency}
//               value={entry.currency}
//               className="text-white hover:bg-gray-700 focus:bg-gray-700"
//               showCheck={false}
//             >
//               <div className="flex items-center gap-3">
//                 <span className="text-lg">
//                   {currencyIcon[entry.currency] ?? '🪙'}
//                 </span>
//                 <div className="flex flex-col">
//                   <span className="font-semibold">
//                     {formatContentBalance(entry.balance)}
//                   </span>
//                   <span className="text-sm text-gray-400">
//                     {entry.currency}
//                   </span>
//                 </div>
//               </div>
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>

//       {/* Plus Button */}
//       <Button
//         size="icon"
//         className="bg-[linear-gradient(to_right,_#6A2A97_0%,_#C753FD_53%,_#FA96FF_100%)] text-white rounded-md h-8 w-8 flex-shrink-0 cursor-pointer"
//         onClick={() => setDepositWithdrawModalOpen(true)}
//       >
//         <Plus className="h-6 w-6" />
//       </Button>
//     </div>
//   )
// }
