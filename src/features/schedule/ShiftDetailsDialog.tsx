import CloseIcon from '@mui/icons-material/Close'
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material'
import { useState } from 'react'
import { DetailRow } from 'src/components/DetailRow'
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
    <Dialog
      onClose={isSubmitting ? undefined : onClose}
      open={open}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle
        sx={{
          pr: 6,
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        Shift Detail
        {isRequestPending ? (
          <Chip label="Request Pending" size="small" color="info" />
        ) : targetShift.coverageNeeded ? (
          <Chip
            label="Coverage Needed"
            size="small"
            color="warning"
            sx={{ color: 'common.white' }}
          />
        ) : null}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
        disabled={isSubmitting}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <DetailRow label="Date" value={targetShift.date} />
        <DetailRow label="Start time" value={targetShift.startTime} />
        <DetailRow label="End time" value={targetShift.endTime} />
        <DetailRow label="Assigned to" value={assignedUser.name} />

        {canMarkCoverageNeeded && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Shift remains assigned to you until a manager approves another
            employee's request
          </Alert>
        )}
        {canRequestToCover && (
          <Alert severity="info" sx={{ mt: 2 }}>
            A manager must approve the request before the shift is assigned to
            the employee
          </Alert>
        )}

        {markCoverageNeededErrorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {markCoverageNeededErrorMessage}
          </Alert>
        )}
        {requestToCoverErrorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {requestToCoverErrorMessage}
          </Alert>
        )}
      </DialogContent>
      {(canMarkCoverageNeeded || canRequestToCover) && (
        <DialogActions>
          {canMarkCoverageNeeded && (
            <Button
              variant="contained"
              onClick={handleCoverageNeeded}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Need Coverage'}
            </Button>
          )}
          {canRequestToCover && (
            <Button
              variant="contained"
              onClick={handleRequestToCover}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Requesting...' : 'Request to cover this shift'}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  )
}
