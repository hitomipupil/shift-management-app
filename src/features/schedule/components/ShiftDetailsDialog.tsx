import CloseIcon from '@mui/icons-material/Close'
import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material'
import { useState } from 'react'
import { DetailRow } from 'src/components/DetailRow'
import {
  SHIFT_STATUS_CHIP,
  type StatusChipConfig,
} from 'src/features/requests/utils/requestStatusChip'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'
import { isPastShift } from 'src/utils/isPastShift'

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
  const isPast = isPastShift(targetShift)
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

  const statusChipConfig: StatusChipConfig | null = isRequestPending
    ? SHIFT_STATUS_CHIP.requestPending
    : targetShift.coverageNeeded
      ? SHIFT_STATUS_CHIP.coverageNeeded
      : null

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
        {statusChipConfig && (
          <Chip
            label={statusChipConfig.label}
            size="small"
            color={statusChipConfig.color}
            sx={statusChipConfig.sx}
          />
        )}
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
              disabled={isSubmitting || isPast}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : undefined
              }
            >
              {isSubmitting ? 'Saving...' : 'Need Coverage'}
            </Button>
          )}
          {canRequestToCover && (
            <Button
              variant="contained"
              onClick={handleRequestToCover}
              disabled={isSubmitting || isPast}
              startIcon={
                isSubmitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : undefined
              }
            >
              {isSubmitting ? 'Requesting...' : 'Request to cover this shift'}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  )
}
