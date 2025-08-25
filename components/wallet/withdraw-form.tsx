'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { useWithdrawMutation } from '@/hooks/use-transactions'
import toast from 'react-hot-toast'
import { WithdrawRequest } from '@/lib/api/transactions'
import { Loader2 } from 'lucide-react'

// Dummy token data - will be replaced with CoinGecko API later
const tokensByChain: Record<
  number,
  {
    address: string
    symbol: string
    name: string
    icon: string
    isNative?: boolean
  }[]
> = {
  84532: [
    // Base Sepolia
    {
      address: '0x0000000000000000000000000000000000000000', // Native ETH
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '⚡',
      isNative: true,
    },
    {
      address: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
      symbol: 'USDC',
      name: 'USD Coin',
      icon: '💵',
    },
    {
      address: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      name: 'Wrapped Ether',
      icon: '🔗',
    },
  ],
  11155111: [
    // Eth Sepolia
    {
      address: '0x0000000000000000000000000000000000000000', // Native ETH
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '⚡',
      isNative: true,
    },
    {
      address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
      symbol: 'WETH',
      name: 'Wrapped Ether',
      icon: '🔗',
    },
    {
      address: '0x779877A7B0D9E8603169DdbD7836e478b4624789',
      symbol: 'LINK',
      name: 'ChainLink Token',
      icon: '🔗',
    },
  ],
}

const chains = [
  { id: 84532, name: 'Base Sepolia', currency: 'evm' },
  { id: 11155111, name: 'Ethereum Sepolia', currency: 'evm' },
]

export default function WithdrawForm({
  setCurrency,
}: {
  setCurrency: (currency: string) => void
}) {
  const form = useForm({
    mode: 'onChange',
    defaultValues: {
      currency: 'evm',
      chainId: '84532',
      tokenAddress: '',
      amount: '',
      address: '',
    },
  })

  const { watch, setValue } = form
  const watchedChainId = watch('chainId')
  const watchedTokenAddress = watch('tokenAddress')

  const handleChainChange = (chainId: string) => {
    setValue('chainId', chainId)
    setValue('tokenAddress', '') // Reset token selection when chain changes
  }

  const availableTokens = watchedChainId
    ? tokensByChain[Number.parseInt(watchedChainId)] || []
    : []

  const withdrawMutation = useWithdrawMutation({
    onSuccess: (data) => {
      form.reset() // Reset form only when request is successful
    },
    onError: (error) => {
      console.error('Withdrawal failed:', error)
    },
  })

  const onSubmit = (data: any) => {
    const withdrawalData = {
      amount: Number.parseFloat(data.amount),
      address: data.address,
      chainId: Number.parseInt(data.chainId),
      tokenAddress: data.tokenAddress,
    }

    console.log('Withdrawal data:', withdrawalData)

    // ✅ Call mutation directly here
    withdrawMutation.mutate(withdrawalData, {
      onSuccess: () => {
        toast.success('Withdrawal request submitted successfully!')
      },
    })
  }

  return (
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="bg-neutral-800 rounded-lg p-4">
            <div className="flex flex-col gap-2 justify-start items-start">
              <span className="text-gray-400 text-xs uppercase">
                Choose a currency to withdraw
              </span>

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setCurrency(value)
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full dark:bg-neutral-900 hover:dark:bg-neutral-900">
                          <SelectValue placeholder="Select a currency type" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 active:bg-neutral-900">
                          <SelectItem value="evm">EVM</SelectItem>
                          <SelectItem value="solana">SOLANA</SelectItem>
                          <SelectItem value="tron">TRON</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="chainId"
                rules={{ required: 'Network is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="text-gray-400 text-xs uppercase">
                        Choose a network *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          handleChainChange(value)
                        }}
                        value={field.value}
                        disabled={
                          !form.watch('currency') ||
                          form.watch('currency') !== 'evm'
                        }
                      >
                        <SelectTrigger className="w-full dark:bg-neutral-900 hover:dark:bg-neutral-900">
                          <SelectValue placeholder="Select a network" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900">
                          {chains.map((chain) => (
                            <SelectItem
                              key={chain.id}
                              value={chain.id.toString()}
                            >
                              <div className="flex items-center gap-2">
                                {chain.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tokenAddress"
                rules={{ required: 'Token is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <span className="text-gray-400 text-xs uppercase">
                        Choose a token *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        // disabled={!watchedChainId}
                        disabled={
                          !form.watch('currency') ||
                          form.watch('currency') !== 'evm'
                        }
                      >
                        <SelectTrigger className="w-full dark:bg-neutral-900 hover:dark:bg-neutral-900">
                          <SelectValue placeholder="Select a token" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900">
                          {availableTokens.map((token) => (
                            <SelectItem
                              key={token.address}
                              value={token.address}
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex flex-col">
                                  <div className="flex items-center gap-1">
                                    <span className="font-medium">
                                      {token.symbol}
                                    </span>
                                    {token.isNative && (
                                      <span className="text-xs bg-brand-pink text-white px-1 py-0.5 rounded">
                                        Native
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="bg-neutral-800 rounded-lg p-4">
            <div className="flex flex-col gap-2 justify-start items-start">
              <span className="text-gray-400 text-xs uppercase">
                Withdrawal Details
              </span>
              <div className="flex flex-col gap-2 w-full">
                <FormField
                  control={form.control}
                  name="amount"
                  rules={{
                    required: 'Amount is required',
                    validate: (value) => {
                      const num = Number.parseFloat(value)
                      if (isNaN(num) || num <= 0) {
                        return 'Amount must be a valid positive number'
                      }
                      return true
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          id="withdraw-amount"
                          type="number"
                          step="any"
                          placeholder="0.1"
                          className="dark:bg-neutral-900 border-gray-700 text-white pr-20 w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  rules={{
                    required: 'Wallet address is required',
                    validate: (value) => {
                      if (!value.startsWith('0x') || value.length !== 42) {
                        return 'Invalid wallet address format'
                      }
                      return true
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wallet Address</FormLabel>
                      <FormControl>
                        <Input
                          id="withdraw-address"
                          type="text"
                          placeholder="0x..."
                          className="dark:bg-neutral-900 border-gray-700 text-white w-full"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={
                    !form.formState.isValid ||
                    form.formState.isSubmitting ||
                    withdrawMutation.isPending
                  }
                  className="w-full flex items-center justify-center gap-2 bg-gradient-brand-pink text-white font-semibold py-3 cursor-pointer"
                >
                  {withdrawMutation.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  <span>Withdraw</span>
                </Button>
              </div>
              <p className="text-gray-400 text-xs">
                Over 10 USD will need admin approval.{' '}
                <span className="text-[#6F6BFF]">
                  POWERBLOCKS does not process withdrawals of less than 5 USD
                </span>
              </p>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
