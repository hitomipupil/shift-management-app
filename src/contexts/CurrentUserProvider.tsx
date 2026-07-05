import { useEffect, useState, type ReactNode } from 'react'
import { CurrentUserContext } from 'src/contexts/CurrentUserContext'
import { logout, subscribeToAuthUser } from 'src/services/authService'
import { getUserById } from 'src/services/userService'
import type { User } from 'src/types/user'

type CurrentUserProviderProps = {
  children: ReactNode
}

export const CurrentUserProvider = ({ children }: CurrentUserProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoadingCurrentUser, setIsLoadingCurrentUser] = useState(true)
  const [currentUserError, setCurrentUserError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToAuthUser(async (authUser) => {
      setIsLoadingCurrentUser(true)
      setCurrentUserError(null)

      try {
        if (!authUser) {
          setCurrentUser(null)
          return
        }

        const user = await getUserById(authUser.uid)

        if (!user) {
          setCurrentUser(null)
          setCurrentUserError('User profile was not found')
          return
        }

        setCurrentUser(user)
      } catch (error) {
        console.error(error)
        setCurrentUser(null)
        setCurrentUserError('Failed to load current user')
      } finally {
        setIsLoadingCurrentUser(false)
      }
    })

    return unsubscribe
  }, [])

  const logoutCurrentUser = async () => {
    await logout()
  }

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        isLoadingCurrentUser,
        currentUserError,
        logoutCurrentUser,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  )
}
