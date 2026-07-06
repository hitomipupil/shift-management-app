import CloseIcon from '@mui/icons-material/Close'
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'

type ShiftDetailsDialogProps = {
  open: boolean
  targetShift: Shift
  currentUser: User
  assignedUser: User
  onMarkCoverageNeeded: (shiftId: string) => Promise<void>
  onClose: () => void
  onRequestToCover: (shiftId: string) => Promise<void>
  isRequestPending: boolean
  markCoverageNeededErrorMessage: string | null
  requestToCoverErrorMessage: string | null
}

export const ShiftDetailsDialog = ({
  open,
  targetShift,
  currentUser,
  assignedUser,
  onMarkCoverageNeeded,
  onClose,
  onRequestToCover,
  isRequestPending,
  markCoverageNeededErrorMessage,
  requestToCoverErrorMessage,
}: ShiftDetailsDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEmployee = currentUser.role === 'employee'
  const isOwnShift = targetShift.assignedUserId === currentUser.id
  const canMarkCoverageNeeded =
    isEmployee && isOwnShift && !targetShift.coverageNeeded
  const canRequestToCover =
    isEmployee && !isOwnShift && targetShift.coverageNeeded && !isRequestPending

  const handleCoverageNeeded = async () => {
    try {
      setIsSubmitting(true)
      await onMarkCoverageNeeded(targetShift.id)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRequestToCover = async () => {
    try {
      setIsSubmitting(true)
      await onRequestToCover(targetShift.id)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog onClose={isSubmitting ? undefined : onClose} open={open}>
      <DialogTitle sx={{ pr: 6 }}>Shift Detail</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
        disabled={isSubmitting}
      >
        <CloseIcon />
      </IconButton>
      <List sx={{ pt: 0 }}>
        <ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
          <ListItemText primary={`start time: ${targetShift.startTime}`} />
          <ListItemText primary={`end time: ${targetShift.endTime}`} />
          <ListItemText primary={`assigned to: ${assignedUser.name}`} />
          <DialogActions sx={{ display: 'flex', flexDirection: 'column' }}>
            {canMarkCoverageNeeded && (
              <>
                <Button onClick={handleCoverageNeeded} disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Need Coverage'}
                </Button>
                <ListItemText secondary="Shift remains assigned to you until a manager approves another employee's request" />
              </>
            )}
            {canRequestToCover && (
              <>
                <Button onClick={handleRequestToCover} disabled={isSubmitting}>
                  {isSubmitting
                    ? 'Requesting...'
                    : 'Request to cover this shift'}
                </Button>
                <ListItemText secondary="A manager must approve the request before the shift is assigned to the employee" />
              </>
            )}
            {isRequestPending ? (
              <ListItemText
                secondary={
                  'A coverage request is already pending for this shift'
                }
              />
            ) : targetShift.coverageNeeded ? (
              <ListItemText secondary="This shift is marked as Coverage Needed" />
            ) : null}
            {markCoverageNeededErrorMessage && (
              <Typography color="error" variant="body2">
                {markCoverageNeededErrorMessage}
              </Typography>
            )}
            {requestToCoverErrorMessage && (
              <Typography color="error" variant="body2">
                {requestToCoverErrorMessage}
              </Typography>
            )}
          </DialogActions>
        </ListItem>
      </List>
    </Dialog>
  )
}
