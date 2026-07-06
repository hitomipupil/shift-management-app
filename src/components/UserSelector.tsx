import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
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
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        width: 240,
        mx: 'auto',
      }}
    >
      <Typography>Select User</Typography>
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

      <Button disabled={!selectedEmail || isLoggingIn} onClick={handleClick}>
        {isLoggingIn ? 'Logging in...' : 'Go to App'}
      </Button>
    </Box>
  )
}
