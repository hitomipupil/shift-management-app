import { Typography } from '@mui/material'
import { UserSelector } from 'src/components/UserSelector'
import { CurrentUserProvider } from 'src/contexts/CurrentUserProvider'
import { useCurrentUser } from 'src/contexts/useCurrentUser'
import { MainApp } from 'src/features/layout/MainApp'

const AppContent = () => {
  const { currentUser, isLoadingCurrentUser, currentUserError } =
    useCurrentUser()

  if (isLoadingCurrentUser) {
    return <Typography>Loading...</Typography>
  }

  if (currentUserError) {
    return <Typography color="error">{currentUserError}</Typography>
  }

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
