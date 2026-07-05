import { useContext } from 'react'
import { CurrentUserContext } from 'src/contexts/CurrentUserContext'

export const useCurrentUser = () => {
  const context = useContext(CurrentUserContext)

  if (!context) {
    throw new Error('useCurrentUser must be used inside CounterProvider')
  }

  return context
}
