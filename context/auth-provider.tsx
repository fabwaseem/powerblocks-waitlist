'use client'

import { ReactNode } from 'react'
import { useInitAuth } from '@/hooks/use-init-auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  useInitAuth()
  return children
}
