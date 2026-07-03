import { useContext } from 'react'
import { CurrentUserContext } from './CurrentUserContext'

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext)

  if (!context) {
    throw new Error('useCurrentUser must be used inside CounterProvider')
  }

  return context
}
