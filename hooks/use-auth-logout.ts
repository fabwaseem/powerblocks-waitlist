import { useCallback } from 'react'
import { useAuthStore } from '@/store/auth'

export const useAuthLogout = () => {
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = useCallback(async () => {
    await logout()
  }, [logout])

  return handleLogout
}
