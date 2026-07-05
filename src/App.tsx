import { UserSelector } from './components/UserSelector'
import { CurrentUserProvider } from './contexts/CurrentUserProvider'
import { useCurrentUser } from './contexts/useCurrentUser'
import { MainApp } from './features/layout/MainApp'

const AppContent = () => {
  const { currentUser } = useCurrentUser()
  if (!currentUser) {
    return <UserSelector />
  }
  return <MainApp />
}

export const App = () => {
  return (
    <CurrentUserProvider>
      <AppContent />
    </CurrentUserProvider>
  )
}
