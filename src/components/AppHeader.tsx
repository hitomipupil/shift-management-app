import { Box, Button, Typography } from '@mui/material'
import { useCurrentUser } from 'src/contexts/useCurrentUser'

export const AppHeader = () => {
  const { currentUser, logoutCurrentUser } = useCurrentUser()

  if (!currentUser) {
    throw new Error('AppHeader requires a signed-in user')
  }

  const handleLogout = async () => {
    await logoutCurrentUser()
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" component="div">
        Shift Management
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography>{`${currentUser.name} - ${currentUser.role}`}</Typography>
        <Button onClick={handleLogout}>Logout</Button>
      </Box>
    </Box>
  )
}
