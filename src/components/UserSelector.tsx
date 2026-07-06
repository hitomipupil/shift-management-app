import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { demoLoginUsers } from 'src/config/demoLoginUsers'
import { loginWithEmailAndPassword } from 'src/services/authService'

export const UserSelector = () => {
  const [selectedEmail, setSelectedEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleClick = async () => {
    if (!selectedEmail) {
      return
    }
    const selectedDemoUser = demoLoginUsers.find(
      (user) => user.email === selectedEmail,
    )
    if (!selectedDemoUser) {
      setErrorMessage('Selected demo user was not found')
      return
    }

    try {
      setIsLoggingIn(true)
      setErrorMessage(null)
      await loginWithEmailAndPassword(
        selectedDemoUser.email,
        selectedDemoUser.password,
      )
    } catch (error) {
      console.error(error)
      setErrorMessage('Failed to log in')
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          p: 4,
          width: '100%',
          maxWidth: 320,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Shift Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select a user to log in
          </Typography>
        </Box>
        <FormControl fullWidth>
          <InputLabel id="user-select-label">User</InputLabel>
          <Select
            labelId="user-select-label"
            id="user-select"
            value={selectedEmail}
            label="User"
            onChange={(e) => setSelectedEmail(e.target.value)}
          >
            {demoLoginUsers.map((user) => {
              return (
                <MenuItem key={user.email} value={user.email}>
                  {user.label}
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>

        {errorMessage && <Typography color="error">{errorMessage}</Typography>}

        <Button
          variant="contained"
          fullWidth
          disabled={!selectedEmail || isLoggingIn}
          onClick={handleClick}
        >
          {isLoggingIn ? 'Logging in...' : 'Go to App'}
        </Button>
      </Paper>
    </Box>
  )
}
