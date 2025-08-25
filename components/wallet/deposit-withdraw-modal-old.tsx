// 'use client'

// import {
//   X,
//   ArrowDownToLine,
//   ArrowUpFromLine,
//   Wallet,
//   Copy,
//   ExternalLink,
//   History,
// } from 'lucide-react'
// import { useState, useEffect } from 'react'
// import { useMutation, useQuery } from '@tanstack/react-query'
// import { toast } from 'react-hot-toast'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'

// import { Button } from '@/components/ui/button'
// import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { Badge } from '@/components/ui/badge'

// import { useWallet } from '@/hooks/use-wallet'
// import {
//   useTokenBalance,
//   getNativeTokenSymbol,
//   COMMON_TOKENS,
// } from '@/hooks/use-token-balance'
// import { TransactionHistory } from './transaction-history'
// import { api } from '@/lib/axios'

// // Validation schemas
// const depositSchema = z.object({
//   amount: z
//     .string()
//     .min(1, 'Amount is required')
//     .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
//       message: 'Amount must be a valid positive number',
//     }),
//   token: z.string(),
// })

// const withdrawSchema = z.object({
//   amount: z
//     .string()
//     .min(1, 'Amount is required')
//     .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
//       message: 'Amount must be a valid positive number',
//     }),
//   token: z.string(),
//   destinationAddress: z
//     .string()
//     .min(1, 'Destination address is required')
//     .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
// })

// type DepositFormData = z.infer<typeof depositSchema>
// type WithdrawFormData = z.infer<typeof withdrawSchema>

// interface DepositWithdrawModalProps {
//   open: boolean
//   onOpenChange: (open: boolean) => void
// }

// export function DepositWithdrawModal({
//   open,
//   onOpenChange,
// }: DepositWithdrawModalProps) {
//   const [activeTab, setActiveTab] = useState('deposit')
//   const [isStaking, setIsStaking] = useState(false) // Loading state for deposit process
//   const [isUnstaking, setIsUnstaking] = useState(false) // Loading state for withdraw process
//   const [stakingStep, setStakingStep] = useState<
//     'idle' | 'signing' | 'confirming'
//   >('idle')
//   const [unstakingStep, setUnstakingStep] = useState<
//     'idle' | 'signing' | 'confirming'
//   >('idle')

//   const {
//     isConnected,
//     address,
//     chainId,
//     signMessageOnly,
//     sendTransactionOnly,
//   } = useWallet()

//   // Fetch deposit configuration from backend
//   const {
//     data: depositConfig,
//     isLoading: isLoadingConfig,
//     error: configError,
//   } = useQuery({
//     queryKey: ['deposit-config'],
//     queryFn: async () => {
//       const response = await api.get('/transactions/deposit-config')
//       return response.data
//     },
//     enabled: open, // Only fetch when modal is open
//   })

//   // Get token balance for native token
//   const {
//     formattedBalance: tokenBalance,
//     symbol: tokenSymbol,
//     isLoading: isLoadingBalance,
//   } = useTokenBalance({
//     address: address as `0x${string}` | undefined,
//     chainId: typeof chainId === 'string' ? parseInt(chainId) : chainId,
//     enabled: isConnected && !!address,
//   })

//   // Deposit form
//   const depositForm = useForm<DepositFormData>({
//     resolver: zodResolver(depositSchema),
//     defaultValues: {
//       amount: '',
//       token: 'native',
//     },
//   })

//   // Withdraw form
//   const withdrawForm = useForm<WithdrawFormData>({
//     resolver: zodResolver(withdrawSchema),
//     defaultValues: {
//       amount: '',
//       token: 'native',
//       destinationAddress: '',
//     },
//   })

//   // Reset forms when modal opens/closes
//   useEffect(() => {
//     if (!open) {
//       depositForm.reset()
//       withdrawForm.reset()
//       setIsStaking(false)
//       setIsUnstaking(false)
//       setStakingStep('idle')
//       setUnstakingStep('idle')
//     }
//   }, [open, depositForm, withdrawForm])

//   // Reset forms when switching tabs and set default destination address for withdrawals
//   useEffect(() => {
//     depositForm.reset()
//     withdrawForm.reset({
//       amount: '',
//       token: 'native',
//       destinationAddress: address || '', // Set to connected wallet address
//     })
//     setIsStaking(false)
//     setIsUnstaking(false)
//     setStakingStep('idle')
//     setUnstakingStep('idle')
//   }, [activeTab, depositForm, withdrawForm, address])

//   // Deposit mutation
//   const depositMutation = useMutation({
//     mutationFn: async (
//       data: DepositFormData & {
//         chainId: number
//         signature: string
//         txHash: string
//         message: string
//       }
//     ) => {
//       console.log(
//         '🌐 Making API request to /transactions/deposit with data:',
//         data
//       )

//       const response = await api.post('/transactions/deposit', data)
//       console.log('✅ API Success response:', response.data)
//       return response.data
//     },
//     onSuccess: (data) => {
//       console.log('🎉 Deposit mutation success:', data)
//       toast.success('Deposit transaction completed successfully!')
//       depositForm.reset()
//       setIsStaking(false)
//       setStakingStep('idle')
//       onOpenChange(false)
//     },
//     onError: (error) => {
//       console.error('❌ Deposit mutation error:', error)
//       toast.error(error.message || 'Deposit failed')
//       setIsStaking(false)
//       setStakingStep('idle')
//     },
//   })

//   // Withdraw mutation
//   const withdrawMutation = useMutation({
//     mutationFn: async (
//       data: WithdrawFormData & {
//         chainId: number
//         signature: string
//         message: string
//       }
//     ) => {
//       const response = await api.post('/transactions/withdraw', data)
//       return response.data
//     },
//     onSuccess: (data) => {
//       toast.success('Withdraw request submitted successfully!')
//       withdrawForm.reset()
//       setIsUnstaking(false)
//       setUnstakingStep('idle')
//       onOpenChange(false)
//     },
//     onError: (error) => {
//       toast.error(error.message || 'Withdraw failed')
//       setIsUnstaking(false)
//       setUnstakingStep('idle')
//     },
//   })

//   const onDepositSubmit = async (data: DepositFormData) => {
//     if (!isConnected || !address || !chainId) {
//       toast.error('Please connect your wallet first')
//       return
//     }

//     if (!depositConfig?.depositAddress) {
//       toast.error('Deposit configuration not loaded. Please try again.')
//       return
//     }

//     if (parseFloat(data.amount) > parseFloat(tokenBalance || '0')) {
//       toast.error('Insufficient balance')
//       return
//     }

//     // Convert chainId to number
//     const numericChainId =
//       typeof chainId === 'string' ? parseInt(chainId) : chainId || 1

//     // Start loading state
//     setIsStaking(true)
//     setStakingStep('signing')

//     try {
//       // Create message to sign
//       const message = `Deposit ${
//         data.amount
//       } ${tokenSymbol} from ${address} at ${new Date().toISOString()}`

//       // Show step 1/2 first
//       toast.loading('Step 1/2: Please sign the message in your wallet', {
//         id: 'deposit-sign',
//       })

//       // First popup: Sign message for verification
//       const signature = await signMessageOnly(message)
//       console.log('✅ Signature received:', signature)

//       // When we reach here, user has signed the message and we're moving to transaction confirmation
//       setStakingStep('confirming')
//       toast.dismiss('deposit-sign')
//       toast.loading('Step 2/2: Please confirm the transaction in your wallet', {
//         id: 'deposit-confirm',
//       })

//       // Second popup: Transaction confirmation
//       const txHash = await sendTransactionOnly(
//         depositConfig.depositAddress, // Use fetched deposit address
//         data.amount
//       )
//       console.log('✅ Transaction hash received:', txHash)

//       if (
//         !signature ||
//         !txHash ||
//         signature.length === 0 ||
//         txHash.length === 0
//       ) {
//         console.log('❌ Missing signature or txHash:', { signature, txHash })
//         toast.dismiss('deposit-confirm')
//         toast.error('Transaction was cancelled')
//         setIsStaking(false)
//         setStakingStep('idle')
//         return
//       }

//       toast.dismiss('deposit-confirm')
//       console.log('🚀 Submitting to API:', {
//         signature,
//         txHash,
//         message,
//         chainId: numericChainId,
//       })

//       // Submit deposit request with both signature and transaction hash
//       depositMutation.mutate({
//         ...data,
//         chainId: numericChainId,
//         signature,
//         txHash,
//         message,
//       })
//     } catch (error) {
//       console.error('❌ Deposit error:', error)
//       const errorMessage =
//         error instanceof Error ? error.message : 'Unknown error'
//       console.error('❌ Error details:', error)
//       toast.dismiss('deposit-sign')
//       toast.dismiss('deposit-confirm')
//       toast.error(`Failed to complete deposit transaction: ${errorMessage}`)
//       setIsStaking(false)
//       setStakingStep('idle')
//     }
//   }

//   const onWithdrawSubmit = async (data: WithdrawFormData) => {
//     if (!isConnected || !address || !chainId) {
//       toast.error('Please connect your wallet first')
//       return
//     }

//     // Convert chainId to number
//     const numericChainId =
//       typeof chainId === 'string' ? parseInt(chainId) : chainId || 1

//     // Start loading state
//     setIsUnstaking(true)
//     setUnstakingStep('signing')

//     try {
//       // Create message to sign for withdraw verification
//       const message = `Withdraw ${data.amount} ${tokenSymbol} to ${
//         data.destinationAddress
//       } from ${address} at ${new Date().toISOString()}`

//       // Show signing step
//       toast.loading('Please sign the withdraw request in your wallet', {
//         id: 'withdraw-sign',
//       })

//       // For withdraws, we only sign the message (no actual transaction yet)
//       // The actual transaction will be processed by admin approval
//       const signature = await signMessageOnly(message)

//       if (!signature) {
//         toast.dismiss('withdraw-sign')
//         toast.error('Message signing was cancelled')
//         setIsUnstaking(false)
//         setUnstakingStep('idle')
//         return
//       }

//       toast.dismiss('withdraw-sign')

//       // Submit withdraw request
//       withdrawMutation.mutate({
//         ...data,
//         chainId: numericChainId,
//         signature,
//         message,
//       })
//     } catch (error) {
//       console.error('Withdraw error:', error)
//       toast.dismiss('withdraw-sign')
//       toast.error('Failed to sign withdraw request')
//       setIsUnstaking(false)
//       setUnstakingStep('idle')
//     }
//   }

//   const copyAddress = async () => {
//     if (!address) return

//     try {
//       await navigator.clipboard.writeText(address)
//       toast.success('Address copied to clipboard')
//     } catch (error) {
//       toast.error('Failed to copy address')
//     }
//   }

//   const getNetworkName = (chainId: string | number | undefined) => {
//     const id = typeof chainId === 'string' ? parseInt(chainId) : chainId
//     switch (id) {
//       case 1:
//         return 'Ethereum'
//       case 137:
//         return 'Polygon'
//       case 42161:
//         return 'Arbitrum'
//       case 10:
//         return 'Optimism'
//       case 8453:
//         return 'Base'
//       case 11155111:
//         return 'Sepolia'
//       default:
//         return 'Unknown'
//     }
//   }

//   const setMaxAmount = (formType: 'deposit' | 'withdraw') => {
//     const balance = parseFloat(tokenBalance || '0')
//     if (balance > 0) {
//       // Leave some for gas fees (0.001 ETH)
//       const maxAmount = Math.max(0, balance - 0.001)
//       if (formType === 'deposit') {
//         depositForm.setValue('amount', maxAmount.toString())
//       } else {
//         withdrawForm.setValue('amount', maxAmount.toString())
//       }
//     }
//   }

//   const getDepositButtonText = () => {
//     if (stakingStep === 'signing') return 'Sign Message...'
//     if (stakingStep === 'confirming') return 'Confirm Transaction...'
//     if (depositMutation.isPending) return 'Processing...'
//     return `Deposit ${tokenSymbol}`
//   }

//   const getWithdrawButtonText = () => {
//     if (unstakingStep === 'signing') return 'Sign Message...'
//     if (withdrawMutation.isPending) return 'Processing...'
//     return `Withdraw ${tokenSymbol}`
//   }

//   const isAnyProcessing =
//     isStaking ||
//     isUnstaking ||
//     depositMutation.isPending ||
//     withdrawMutation.isPending ||
//     isLoadingConfig

//   return (
//     <>
//       <Dialog open={open} onOpenChange={onOpenChange}>
//         <DialogContent
//           className="sm:max-w-2xl bg-neutral-900 border-gray-700 max-h-[90vh] overflow-y-auto"
//           showCloseButton={false}
//         >
//           <div className="flex items-center justify-between">
//             <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
//               <Wallet className="h-5 w-5" />
//               Cashier
//             </DialogTitle>
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={() => onOpenChange(false)}
//               className="text-gray-400 hover:text-white hover:bg-neutral-800"
//               disabled={isAnyProcessing}
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </div>

//           {!isConnected ? (
//             <div className="text-center py-8">
//               <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//               <p className="text-gray-400 mb-4">
//                 Please connect your wallet to continue
//               </p>
//               <Button
//                 onClick={() => onOpenChange(false)}
//                 variant="outline"
//                 className="border-gray-700 text-white hover:bg-neutral-800"
//               >
//                 Connect Wallet
//               </Button>
//             </div>
//           ) : isLoadingConfig ? (
//             <div className="text-center py-8">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4" />
//               <p className="text-gray-400">Loading deposit configuration...</p>
//             </div>
//           ) : configError ? (
//             <div className="text-center py-8">
//               <p className="text-red-400 mb-4">
//                 Failed to load deposit configuration. Please try again.
//               </p>
//               <Button
//                 onClick={() => onOpenChange(false)}
//                 variant="outline"
//                 className="border-gray-700 text-white hover:bg-neutral-800"
//               >
//                 Close
//               </Button>
//             </div>
//           ) : (
//             <>
//               {/* Wallet Info */}
//               <div className="bg-neutral-800 rounded-lg p-4 mb-6">
//                 {/* <div className="flex justify-between items-center mb-2">
//                   <span className="text-gray-400 text-sm">
//                     Connected Wallet
//                   </span>
//                   <Badge variant="secondary" className="text-xs">
//                     {getNetworkName(chainId)}
//                   </Badge>
//                 </div> */}
//                 <div className="flex items-center gap-2 mb-2">
//                   <span className="text-white font-mono text-sm">
//                     {address?.slice(0, 6)}...{address?.slice(-4)}
//                   </span>
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     onClick={copyAddress}
//                     className="h-6 w-6 text-gray-400 hover:text-white"
//                     disabled={isAnyProcessing}
//                   >
//                     <Copy className="h-3 w-3" />
//                   </Button>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-400 text-sm">Balance</span>
//                   <span className="text-white font-medium">
//                     {isLoadingBalance
//                       ? '...'
//                       : `${parseFloat(tokenBalance || '0').toFixed(
//                           4
//                         )} ${tokenSymbol}`}
//                   </span>
//                 </div>
//               </div>

//               <Tabs
//                 value={activeTab}
//                 onValueChange={setActiveTab}
//                 className="w-full"
//               >
//                 <TabsList className="grid w-full grid-cols-3 bg-neutral-800">
//                   <TabsTrigger
//                     value="deposit"
//                     className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-neutral-700"
//                     disabled={isAnyProcessing}
//                   >
//                     <ArrowDownToLine className="h-4 w-4 mr-2" />
//                     Deposit
//                   </TabsTrigger>
//                   <TabsTrigger
//                     value="withdraw"
//                     className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-neutral-700"
//                     disabled={isAnyProcessing}
//                   >
//                     <ArrowUpFromLine className="h-4 w-4 mr-2" />
//                     Withdraw
//                   </TabsTrigger>
//                   <TabsTrigger
//                     value="history"
//                     className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-neutral-700"
//                     disabled={isAnyProcessing}
//                   >
//                     <History className="h-4 w-4 mr-2" />
//                     History
//                   </TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="deposit" className="space-y-4 mt-6">
//                   <form
//                     onSubmit={depositForm.handleSubmit(onDepositSubmit)}
//                     className="space-y-4"
//                   >
//                     <div className="space-y-2">
//                       <Label htmlFor="deposit-amount" className="text-white">
//                         Amount to Deposit
//                       </Label>
//                       <div className="relative">
//                         <Input
//                           id="deposit-amount"
//                           type="number"
//                           step="any"
//                           placeholder="0.0"
//                           className="bg-neutral-800 border-gray-700 text-white pr-20"
//                           disabled={isAnyProcessing}
//                           {...depositForm.register('amount')}
//                         />
//                         <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
//                           {/* <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => setMaxAmount('deposit')}
//                             className="text-xs text-purple-400 hover:text-purple-300 px-2 py-1 h-auto"
//                             disabled={isAnyProcessing}
//                           >
//                             MAX
//                           </Button> */}
//                           <span className="text-gray-400 text-sm">
//                             {tokenSymbol}
//                           </span>
//                         </div>
//                       </div>
//                       {depositForm.formState.errors.amount && (
//                         <p className="text-red-400 text-sm">
//                           {depositForm.formState.errors.amount.message}
//                         </p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="deposit-address" className="text-white">
//                         Deposit Address
//                       </Label>
//                       <Input
//                         id="deposit-address"
//                         type="text"
//                         placeholder="Loading..."
//                         value={depositConfig?.depositAddress || ''}
//                         className="bg-neutral-800 border-gray-700 text-white font-mono"
//                         disabled={true}
//                         readOnly
//                       />
//                       <p className="text-gray-400 text-xs">
//                         Your tokens will be sent to this platform address.
//                       </p>
//                     </div>

//                     <div className="bg-neutral-800 rounded-lg p-3">
//                       <p className="text-gray-400 text-sm mb-1">
//                         This will deposit your {tokenSymbol} tokens to the
//                         platform on {getNetworkName(chainId)}.
//                       </p>
//                       {/* <p className="text-gray-400 text-xs">
//                         You&apos;ll see two wallet popups: signature
//                         verification and transaction confirmation.
//                       </p> */}
//                     </div>

//                     <Button
//                       type="submit"
//                       className="w-full bg-purple-600 hover:bg-purple-700 text-white"
//                       disabled={isAnyProcessing}
//                     >
//                       {isStaking || depositMutation.isPending ? (
//                         <>
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
//                           {getDepositButtonText()}
//                         </>
//                       ) : (
//                         <>
//                           <ArrowDownToLine className="h-4 w-4 mr-2" />
//                           {getDepositButtonText()}
//                         </>
//                       )}
//                     </Button>
//                   </form>
//                 </TabsContent>

//                 <TabsContent value="withdraw" className="space-y-4 mt-6">
//                   <form
//                     onSubmit={withdrawForm.handleSubmit(onWithdrawSubmit)}
//                     className="space-y-4"
//                   >
//                     <div className="space-y-2">
//                       <Label htmlFor="withdraw-amount" className="text-white">
//                         Amount to Withdraw
//                       </Label>
//                       <div className="relative">
//                         <Input
//                           id="withdraw-amount"
//                           type="number"
//                           step="any"
//                           placeholder="0.0"
//                           className="bg-neutral-800 border-gray-700 text-white pr-20"
//                           disabled={isAnyProcessing}
//                           {...withdrawForm.register('amount')}
//                         />
//                         <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
//                           {/* <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => setMaxAmount('withdraw')}
//                             className="text-xs text-purple-400 hover:text-purple-300 px-2 py-1 h-auto"
//                             disabled={isAnyProcessing}
//                           >
//                             MAX
//                           </Button> */}
//                           <span className="text-gray-400 text-sm">
//                             {tokenSymbol}
//                           </span>
//                         </div>
//                       </div>
//                       {withdrawForm.formState.errors.amount && (
//                         <p className="text-red-400 text-sm">
//                           {withdrawForm.formState.errors.amount.message}
//                         </p>
//                       )}
//                     </div>

//                     <div className="space-y-2">
//                       <Label
//                         htmlFor="destination-address"
//                         className="text-white"
//                       >
//                         Destination Address
//                       </Label>
//                       <Input
//                         id="destination-address"
//                         type="text"
//                         placeholder="0x..."
//                         value={address || ''}
//                         className="bg-neutral-800 border-gray-700 text-white font-mono"
//                         disabled={true}
//                         {...withdrawForm.register('destinationAddress')}
//                       />
//                       <p className="text-gray-400 text-xs">
//                         Withdrawals will be sent to your connected wallet
//                         address.
//                       </p>
//                       {withdrawForm.formState.errors.destinationAddress && (
//                         <p className="text-red-400 text-sm">
//                           {
//                             withdrawForm.formState.errors.destinationAddress
//                               .message
//                           }
//                         </p>
//                       )}
//                     </div>

//                     <div className="bg-neutral-800 rounded-lg p-3">
//                       <p className="text-yellow-400 text-sm mb-1">
//                         ℹ️ Withdrawals will be sent to your connected wallet
//                         address.
//                       </p>
//                       <p className="text-gray-400 text-xs">
//                         Withdrawals require admin approval and wallet signature
//                         verification.
//                       </p>
//                     </div>

//                     <Button
//                       type="submit"
//                       className="w-full bg-red-600 hover:bg-red-700 text-white"
//                       disabled={isAnyProcessing}
//                     >
//                       {isUnstaking || withdrawMutation.isPending ? (
//                         <>
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
//                           {getWithdrawButtonText()}
//                         </>
//                       ) : (
//                         <>
//                           <ArrowUpFromLine className="h-4 w-4 mr-2" />
//                           {getWithdrawButtonText()}
//                         </>
//                       )}
//                     </Button>
//                   </form>
//                 </TabsContent>

//                 <TabsContent value="history" className="mt-6">
//                   <TransactionHistory />
//                 </TabsContent>
//               </Tabs>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }
