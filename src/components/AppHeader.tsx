import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
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
    <AppBar
      position="static"
      elevation={0}
      color="default"
      sx={{
        bgcolor: 'common.white',
        borderBottom: '1px solid',
        borderColor: 'grey.300',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 500, color: 'primary.main' }}
          >
            Shift Management
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography>{currentUser.name}</Typography>
          <IconButton onClick={handleLogout} aria-label="Logout">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
