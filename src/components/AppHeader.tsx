import { Box, Typography } from '@mui/material'
import { useCurrentUser } from '../contexts/useCurrentUser'

export const AppHeader = () => {
  const { currentUser } = useCurrentUser()
  return (
    <Box sx={{ flexDirection: 'row' }}>
      <Typography variant="h6" component="div">
        Shift Management App
      </Typography>
      <Typography>{`${currentUser.name} - ${currentUser.role}`}</Typography>
    </Box>
  )
}
