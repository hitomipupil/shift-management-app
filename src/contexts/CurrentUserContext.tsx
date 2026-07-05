import { createContext } from 'react'
import type { User } from 'src/types/user'

export type CurrentUserContextValue = {
  currentUser: User | null
  isLoadingCurrentUser: boolean
  currentUserError: string | null
  logoutCurrentUser: () => Promise<void>
}

export const CurrentUserContext = createContext<CurrentUserContextValue | null>(
  null,
)
