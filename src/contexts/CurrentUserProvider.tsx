import { useEffect, useState, type ReactNode } from 'react'
import { CurrentUserContext } from './CurrentUserContext'
import { getUserById, userExists } from '../services/userService'
import type { User } from '../types/user'

const CURRENT_USER_ID_STORAGE_KEY = 'currentUserId'

export const CurrentUserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUserId, setCurrentUserIdState] = useState<string | null>(() => {
    return localStorage.getItem(CURRENT_USER_ID_STORAGE_KEY)
  })

  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!currentUserId) {
        setCurrentUser(null)
        return
      }
      const user = await getUserById(currentUserId)
      setCurrentUser(user)
    }
    fetchCurrentUser()
  }, [currentUserId])

  const setCurrentUserId = async (userId: string) => {
    const exists = await userExists(userId)
    if (!exists) {
      return
    }

    localStorage.setItem(CURRENT_USER_ID_STORAGE_KEY, userId)
    setCurrentUserIdState(userId)
  }

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUserId }}>
      {children}
    </CurrentUserContext.Provider>
  )
}
