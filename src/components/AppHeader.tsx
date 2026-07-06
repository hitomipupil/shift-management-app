import { AppBar, Box, Chip, IconButton, Toolbar, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useCurrentUser } from 'src/contexts/useCurrentUser'
import { AppLogo } from 'src/components/AppLogo'

const roleLabels = {
  manager: 'Manager',
  employee: 'Employee',
} as const

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
      position="sticky"
      elevation={0}
      color="default"
      sx={{
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        bgcolor: 'common.white',
        borderBottom: '1px solid',
        borderColor: 'grey.300',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AppLogo />
          <Typography
            variant="h6"
            component="div"
            sx={{ fontWeight: 500, color: 'primary.main' }}
          >
            Shift Manager
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography sx={{ fontWeight: 500 }}>{currentUser.name}</Typography>
          <Chip
            label={roleLabels[currentUser.role]}
            size="small"
            color={currentUser.role === 'manager' ? 'primary' : 'default'}
            variant={currentUser.role === 'manager' ? 'filled' : 'outlined'}
          />
          <IconButton onClick={handleLogout} aria-label="Logout">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
