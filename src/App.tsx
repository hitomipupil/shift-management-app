import { UserSelector } from 'src/components/UserSelector'
import { CurrentUserProvider } from 'src/contexts/CurrentUserProvider'
import { useCurrentUser } from 'src/contexts/useCurrentUser'
import { MainApp } from 'src/features/layout/MainApp'

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
