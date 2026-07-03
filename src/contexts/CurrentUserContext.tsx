import { createContext } from 'react'
import type { User } from '../types/user'

export type CurrentUserContextValue = {
  currentUser: User | null
  setCurrentUserId: (userId: string) => void
}

export const CurrentUserContext = createContext<CurrentUserContextValue | null>(
  null,
)
