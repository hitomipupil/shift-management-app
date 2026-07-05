import { Box, Typography } from '@mui/material'
import { useCurrentUser } from 'src/contexts/useCurrentUser'

export const AppHeader = () => {
  const { currentUser } = useCurrentUser()

  if (!currentUser) {
    throw new Error('AppHeader requires a signed-in user')
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
      <Typography>{`${currentUser.name} - ${currentUser.role}`}</Typography>
    </Box>
  )
}
