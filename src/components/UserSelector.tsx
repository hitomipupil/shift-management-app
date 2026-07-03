import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useCurrentUser } from '../contexts/useCurrentUser'
import type { User } from '../types/user'
import { getUsers } from '../services/userService'

export const UserSelector = () => {
  const [selectedUserId, setSelectedUserId] = useState('')
  const { setCurrentUserId } = useCurrentUser()
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers()
        setUsers(data)
      } catch (e) {
        console.error(e)
      }
    }
    fetchUsers()
  }, [])

  const handleClick = () => {
    if (!selectedUserId) {
      return
    }
    setCurrentUserId(selectedUserId)
  }

  return (
    <>
      <Typography>Select User</Typography>
      <FormControl fullWidth>
        <InputLabel id="user-select-label">User</InputLabel>
        <Select
          labelId="user-select-label"
          id="user-select"
          value={selectedUserId}
          label="User"
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          {users.map((user) => {
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
