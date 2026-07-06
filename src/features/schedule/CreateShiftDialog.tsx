import CloseIcon from '@mui/icons-material/Close'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const employees = users.filter((user) => user.role === 'employee')
  const hasInvalidTimeRange =
    startTime !== '' && endTime !== '' && startTime >= endTime
  const isCreateDisabled =
    !selectedEmployeeId ||
    !date ||
    !startTime ||
    !endTime ||
    isSubmitting ||
    hasInvalidTimeRange

  const handleSubmit = async () => {
    if (isCreateDisabled) {
      return
    }
    try {
      setIsSubmitting(true)
      await onCreateShift(selectedEmployeeId, date, startTime, endTime)
    } finally {
      setIsSubmitting(false)
    }
  }

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
    <Dialog
      onClose={isSubmitting ? undefined : handleClose}
      open={open}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ pr: 6, fontWeight: 'bold' }}>Create Shift</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
        disabled={isSubmitting}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <FormControl fullWidth margin="normal">
          <InputLabel id="employee-select-label">Employee</InputLabel>
          <Select
            labelId="employee-select-label"
            id="employee-select"
            value={selectedEmployeeId}
            label="Employee"
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            disabled={isSubmitting}
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
          margin="normal"
          slotProps={{ inputLabel: { shrink: true } }}
          disabled={isSubmitting}
        />
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <TextField
            type="time"
            label="Start time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            fullWidth
            margin="normal"
            slotProps={{ inputLabel: { shrink: true } }}
            disabled={isSubmitting}
          />
          <TextField
            type="time"
            label="End time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            fullWidth
            margin="normal"
            slotProps={{ inputLabel: { shrink: true } }}
            disabled={isSubmitting}
            error={hasInvalidTimeRange}
            helperText={
              hasInvalidTimeRange ? 'End time must be after start time' : ''
            }
          />
        </Box>
        {createShiftErrorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {createShiftErrorMessage}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isCreateDisabled}
        >
          {isSubmitting ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
