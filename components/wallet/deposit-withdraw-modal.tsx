'use client'

import { X, Wallet, Copy, Check } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import Image from 'next/image'
import WithdrawForm from './withdraw-form'

const actions = [
  {
    label: 'Deposit',
    icon: (
      <svg
        width="23"
        height="32"
        viewBox="0 0 23 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
      >
        <path
          d="M21.4229 14.7857L14.669 21.5396L7.91524 14.7857"
          stroke="white"
          strokeWidth="2.25127"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.16143 1.27843H5.66397C8.05226 1.27843 10.3427 2.22717 12.0315 3.91595C13.7203 5.60473 14.669 7.89521 14.669 10.2835V21.5398M21.4229 23.7911L14.669 30.5449L7.91524 23.7911"
          stroke="white"
          strokeWidth="2.25127"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Withdraw',
    icon: (
      <svg
        width="23"
        height="32"
        viewBox="0 0 23 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
      >
        <path
          d="M21.7002 17.2392L14.9464 10.4854L8.19259 17.2392"
          stroke="#B5B5B5"
          strokeWidth="2.25127"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M1.43879 30.746H5.94133C8.32962 30.746 10.6201 29.7972 12.3089 28.1084C13.9976 26.4197 14.9464 24.1292 14.9464 21.7409V10.4846M21.7002 8.23329L14.9464 1.47949L8.19259 8.23329"
          stroke="#B5B5B5"
          strokeWidth="2.25127"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Buy Crypto',
    icon: (
      <svg
        width="25"
        height="25"
        viewBox="0 0 25 25"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
      >
        <path
          d="M8.07019 14.8455C11.743 14.8455 14.7205 11.868 14.7205 8.19519C14.7205 4.52235 11.743 1.54492 8.07019 1.54492C4.39735 1.54492 1.41992 4.52235 1.41992 8.19519C1.41992 11.868 4.39735 14.8455 8.07019 14.8455Z"
          stroke="#B5B5B5"
          strokeWidth="2.21676"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.2538 10.8216C20.3016 11.2123 21.2339 11.8608 21.9646 12.7072C22.6954 13.5536 23.2008 14.5707 23.4343 15.6642C23.6678 16.7578 23.6218 17.8926 23.3006 18.9636C22.9793 20.0347 22.3931 21.0074 21.5963 21.7919C20.7995 22.5764 19.8177 23.1473 18.7417 23.4519C17.6658 23.7564 16.5304 23.7847 15.4407 23.5341C14.3509 23.2836 13.3419 22.7623 12.5069 22.0185C11.672 21.2746 11.0381 20.3323 10.6639 19.2786M6.96191 5.97803H8.07029V10.4115"
          stroke="#B5B5B5"
          strokeWidth="2.21676"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.7238 14.7119L18.4996 15.4989L15.374 18.6245"
          stroke="#B5B5B5"
          strokeWidth="2.21676"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

export function DepositWithdrawModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [activeTab, setActiveTab] = useState('deposit')
  const { isAuthenticated, user } = useAuthStore()
  const [activeAction, setActiveAction] = useState(actions[0])
  const [currency, setCurrency] = useState('evm')
  const [copiedDeposit, setCopiedDeposit] = useState(false)
  const copyTimeoutRef = useRef<number | null>(null)

  const handleCopyDepositAddress = async () => {
    if (
      !user?.depositWalletAddresses?.[
        currency as keyof typeof user.depositWalletAddresses
      ]?.address
    )
      return
    try {
      await navigator.clipboard.writeText(
        user.depositWalletAddresses?.[
          currency as keyof typeof user.depositWalletAddresses
        ]?.address ?? ''
      )
      setCopiedDeposit(true)
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current)
      copyTimeoutRef.current = window.setTimeout(() => {
        setCopiedDeposit(false)
      }, 1500)
    } catch (e) {
      // no-op
    }
  }

  useEffect(() => {
    if (!open) {
      setActiveTab('deposit')
    }
  }, [open])

  useEffect(() => {
    setCurrency('evm')
  }, [activeTab])

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-2xl bg-neutral-900 border-gray-700 max-h-[90vh] overflow-y-auto"
          showCloseButton={false}
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Cashier
            </DialogTitle>
            <Button
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-white hover:bg-neutral-800 bg-neutral-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <>
            <div className="bg-neutral-800 rounded-lg p-6">
              <div className="flex flex-col gap-1 justify-start items-start">
                <span className="text-gray-400 text-xs uppercase">
                  Estimated Balance
                </span>
                <span className="text-white font-bold text-xl">
                  {`$ ${Number(
                    user?.depositWalletAddresses?.[
                      currency as keyof typeof user.depositWalletAddresses
                    ]?.availableAmount
                  )?.toFixed(4)}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              {actions.map((action, idx) => {
                const isActive = action.label === activeAction.label

                return (
                  <div
                    key={idx}
                    className={cn(
                      'p-1.5 px-2 text-sm flex items-center gap-2 uppercase rounded-md border text-white cursor-pointer transition-all duration-300',
                      isActive
                        ? 'border-[#EE4FFB] bg-gradient-to-r from-[#EE4FFB]/30 to-[#8D2F95]/30 shadow-[0_0_11.68px_2.34px_rgba(104,100,246,0.25)]'
                        : 'bg-neutral-800 border-neutral-700 hover:border-[#EE4FFB] hover:bg-gradient-to-r from-[#EE4FFB]/30 to-[#8D2F95]/30'
                    )}
                    onClick={() => {
                      setActiveAction(action)
                      setActiveTab(action.label.toLowerCase())
                    }}
                  >
                    {action.icon}
                    {action.label}
                  </div>
                )
              })}
            </div>

            {activeAction.label === 'Deposit' && (
              <div className="flex flex-col gap-4">
                <div className="bg-neutral-800 rounded-lg p-4">
                  <div className="flex flex-col gap-2 justify-start items-start">
                    <span className="text-gray-400 text-xs uppercase">
                      Currency to Deposit
                    </span>

                    <Select onValueChange={setCurrency} defaultValue={currency}>
                      <SelectTrigger
                        className="w-full dark:bg-neutral-900 hover:dark:bg-neutral-900"
                        defaultValue="evm"
                      >
                        <SelectValue placeholder="Select a timezone" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-900 active:bg-neutral-900">
                        <SelectItem value="evm">
                          <div className="flex items-center gap-2">
                            <div className="p-[4px] rounded-full bg-neutral-700 w-5 h-5 flex items-center justify-center">
                              <Image
                                src="/images/crypto/eth-icon.svg"
                                alt="EVM"
                                width={20}
                                height={20}
                                className="w-full h-full"
                              />
                            </div>
                            <span>EVM</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="solana">
                          <div className="flex items-center gap-2">
                            <div className="p-[4px] rounded-full bg-neutral-700 w-5 h-5 flex items-center justify-center">
                              <Image
                                src="/images/crypto/solana-icon.svg"
                                alt="SOLANA"
                                width={20}
                                height={20}
                                className="w-full h-full"
                              />
                            </div>
                            <span>SOLANA</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="tron">
                          <div className="flex items-center gap-2">
                            <div className="p-[4px] rounded-full bg-neutral-700 w-5 h-5 flex items-center justify-center">
                              <Image
                                src="/images/crypto/tron-icon.svg"
                                alt="TRON"
                                width={20}
                                height={20}
                                className="w-full h-full"
                              />
                            </div>
                            <span>TRON</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="bg-neutral-800 rounded-lg p-4">
                  <div className="flex flex-col gap-2 justify-start items-start">
                    <span className="text-gray-400 text-xs uppercase">
                      Deposit Address
                    </span>
                    <div className="flex gap-2 w-full">
                      <div className="bg-neutral-900 border-neutral-700 border text-white text-sm p-2 px-2 rounded-md w-full">
                        {
                          user?.depositWalletAddresses?.[
                            currency as keyof typeof user.depositWalletAddresses
                          ]?.address
                        }
                      </div>

                      {copiedDeposit ? (
                        <div className="flex items-center justify-center gap-2 cursor-pointer bg-neutral-900 rounded-md p-2 px-2.5 border-neutral-700 border">
                          <Check className="h-4 w-4 text-green-500" />
                        </div>
                      ) : (
                        <div
                          className="flex items-center justify-center gap-2 cursor-pointer bg-neutral-900 rounded-md p-2 px-2.5 border-neutral-700 border"
                          onClick={handleCopyDepositAddress}
                        >
                          <Copy className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 text-xs">
                      Deposit to this address must be sent on Bitcoin network to
                      be accepted.{' '}
                      <span className="text-[#6F6BFF]">
                        POWERBLOCKS does not process deposits of less than 10
                        USD
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeAction.label === 'Withdraw' && (
              <WithdrawForm setCurrency={setCurrency} />
            )}

            {/* {activeAction.label === 'Withdraw' && (
              <div className="flex flex-col gap-4">
                <div className="bg-neutral-800 rounded-lg p-4">
                  <div className="flex flex-col gap-2 justify-start items-start">
                    <span className="text-gray-400 text-xs uppercase">
                      Choose a currency to withdraw
                    </span>

                    <Select onValueChange={setCurrency} defaultValue={currency}>
                      <SelectTrigger
                        className="w-full dark:bg-neutral-900 hover:dark:bg-neutral-900"
                        defaultValue="evm"
                      >
                        <SelectValue placeholder="Select a timezone" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-900 active:bg-neutral-900">
                        <SelectItem value="evm">EVM</SelectItem>
                        <SelectItem value="solana">SOLANA</SelectItem>
                        <SelectItem value="tron">TRON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex flex-col gap-2 justify-start items-start">
                      <span className="text-gray-400 text-xs uppercase">
                        Choose a network *
                      </span>
                      <Select
                        onValueChange={handleChainChange}
                        value={selectedChainId.toString()}
                        defaultValue={selectedChainId.toString()}
                      >
                        <SelectTrigger
                          className={`w-full dark:bg-neutral-900 hover:dark:bg-neutral-900 ${
                            form.formState.errors.chainId
                              ? 'border-red-500'
                              : ''
                          }`}
                        >
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
                      {form.formState.errors.chainId && (
                        <span className="text-red-500 text-xs">
                          Network is required
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 justify-start items-start">
                      <span className="text-gray-400 text-xs uppercase">
                        Choose a token *
                      </span>
                      <Select
                        onValueChange={handleTokenChange}
                        value={selectedToken}
                        disabled={!selectedChainId}
                      >
                        <SelectTrigger
                          className={`w-full dark:bg-neutral-900 hover:dark:bg-neutral-900 ${
                            form.formState.errors.tokenAddress
                              ? 'border-red-500'
                              : ''
                          }`}
                        >
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
                                      <span className="text-xs bg-blue-600 text-white px-1 py-0.5 rounded">
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
                      {form.formState.errors.tokenAddress && (
                        <span className="text-red-500 text-xs">
                          Token is required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-neutral-800 rounded-lg p-4">
                  <div className="flex flex-col gap-2 justify-start items-start">
                    <span className="text-gray-400 text-xs uppercase">
                      Withdrawal Details
                    </span>
                    <Form {...form}>
                      <form
                        onSubmit={onSubmit}
                        className="flex flex-col gap-2 w-full"
                      >
                        <FormField
                          control={form.control}
                          name="amount"
                          rules={{ required: 'Amount is required' }}
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
                          rules={{ required: 'Address is required' }}
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
                            form.formState.isSubmitting
                          }
                          className="w-full bg-[linear-gradient(to_right,_#6A2A97_0%,_#C753FD_53%,_#FA96FF_100%)] text-white font-semibold py-3"
                        >
                          Withdraw
                        </Button>
                      </form>
                    </Form>
                    <p className="text-gray-400 text-xs">
                      Over 10 USD will need admin approval.{' '}
                      <span className="text-[#6F6BFF]">
                        POWERBLOCKS does not process withdrawals of less than 5
                        USD
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )} */}
          </>
        </DialogContent>
      </Dialog>
    </>
  )
}
