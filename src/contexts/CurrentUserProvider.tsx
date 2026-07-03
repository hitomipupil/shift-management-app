import { useState, type ReactNode } from 'react'
import { mockUsers } from '../mocks/mockUsers'
import { CurrentUserContext } from './CurrentUserContext'

export const CurrentUserProvider = ({ children }: { children: ReactNode }) => {
  const CURRENT_USER_ID_STORAGE_KEY = 'currentUserId'
  const [currentUserId, setCurrentUserIdState] = useState<string | null>(() => {
    return localStorage.getItem(CURRENT_USER_ID_STORAGE_KEY)
  })

  const currentUser =
    mockUsers.find((user) => user.id === currentUserId) ?? null

  const setCurrentUserId = (userId: string) => {
    const userExists = mockUsers.some((user) => user.id === userId)

    if (!userExists) {
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
