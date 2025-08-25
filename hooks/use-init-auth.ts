import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth'

export const useInitAuth = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])
}
