import { useState, type ReactNode } from 'react'
import { mockUsers } from '../mocks/mockUsers'
import { CurrentUserContext } from './CurrentUserContext'

export const CurrentUserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const currentUser =
    mockUsers.find((user) => user.id === currentUserId) ?? null

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUserId }}>
      {children}
    </CurrentUserContext.Provider>
  )
}
