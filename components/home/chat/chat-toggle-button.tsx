'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChatToggleButtonProps {
  onClick: () => void
  isOpen: boolean
}

export function ChatToggleButton({ onClick, isOpen }: ChatToggleButtonProps) {
  if (isOpen) return null

  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 rounded-full h-14 w-14 p-0 shadow-lg hover:shadow-xl transition-all duration-200"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">Open chat</span>
    </Button>
  )
}
