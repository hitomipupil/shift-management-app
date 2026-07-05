import { createContext } from 'react'
import type { User } from 'src/types/user'

export type CurrentUserContextValue = {
  currentUser: User | null
  setCurrentUserId: (userId: string) => Promise<void>
}

export const CurrentUserContext = createContext<CurrentUserContextValue | null>(
  null,
)
