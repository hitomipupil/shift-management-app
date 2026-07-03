import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { mockUsers } from '../mocks/mockUsers'
import { useCurrentUser } from 'src/contexts/useCurrentUser'

export const UserSelector = () => {
  const [selectedUserId, setSelectedUserId] = useState('')
  const { setCurrentUserId, currentUser } = useCurrentUser()
  const handleClick = () => {
    if (!selectedUserId) {
      return
    }
    setCurrentUserId(selectedUserId)
    console.log('currentUser: ', currentUser)
  }
  return (
    <>
      <Typography>Select User</Typography>
      <FormControl fullWidth>
        <InputLabel id="user">User</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedUserId}
          label="User"
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          {mockUsers.map((user) => {
            return (
              <MenuItem
                key={user.id}
                value={user.id}
              >{`${user.name} - ${user.role}`}</MenuItem>
            )
          })}
        </Select>
      </FormControl>
      <Button disabled={!selectedUserId} onClick={handleClick}>
        Go to App
      </Button>
    </>
  )
}
