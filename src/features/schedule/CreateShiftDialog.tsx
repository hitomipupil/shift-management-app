import CloseIcon from '@mui/icons-material/Close'
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import type { User } from 'src/types/user'

type CreateShiftDialogProps = {
  open: boolean
  users: User[]
  onCreateShift: (
    assignedUserId: string,
    date: string,
    startTime: string,
    endTime: string,
  ) => Promise<void>
  onClose: () => void
  createShiftErrorMessage: string | null
}

export const CreateShiftDialog = ({
  open,
  users,
  onCreateShift,
  onClose,
  createShiftErrorMessage,
}: CreateShiftDialogProps) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const employees = users.filter((user) => user.role === 'employee')

  const isCreateDisabled =
    !selectedEmployeeId || !date || !startTime || !endTime

  const resetForm = () => {
    setSelectedEmployeeId('')
    setDate('')
    setStartTime('')
    setEndTime('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle sx={{ pr: 6 }}>Create Shift</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <List sx={{ pt: 0 }}>
        <ListItem
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minWidth: 360,
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="employee-select-label">Employee</InputLabel>
            <Select
              labelId="employee-select-label"
              id="employee-select"
              value={selectedEmployeeId}
              label="Employee"
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
            >
              {employees.map((employee) => {
                return (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
          <TextField
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            type="time"
            label="Start time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            type="time"
            label="End time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <DialogActions sx={{ display: 'flex', flexDirection: 'column' }}>
            <Button
              onClick={() =>
                onCreateShift(selectedEmployeeId, date, startTime, endTime)
              }
              disabled={isCreateDisabled}
            >
              Create
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
            {createShiftErrorMessage && (
              <Typography color="error" variant="body2">
                {createShiftErrorMessage}
              </Typography>
            )}
          </DialogActions>
        </ListItem>
      </List>
    </Dialog>
  )
}
