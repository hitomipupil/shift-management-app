import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import CloseIcon from '@mui/icons-material/Close'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { DetailRow } from 'src/components/DetailRow'
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'

type RequestDetailsDialogProps = {
  open: boolean
  onClose: () => void
  targetRequest: CoverageRequest
  targetShift: Shift
  currentAssignedEmployee: User
  requestedEmployee: User
  onApprove: (requestId: string) => Promise<void>
  onReject: (requestId: string) => Promise<void>
  requestReviewErrorMessage: string | null
}

export const RequestDetailsDialog = ({
  open,
  onClose,
  targetRequest,
  targetShift,
  currentAssignedEmployee,
  requestedEmployee,
  onApprove,
  onReject,
  requestReviewErrorMessage,
}: RequestDetailsDialogProps) => {
  const [pendingAction, setPendingAction] = useState<
    'approve' | 'reject' | null
  >(null)
  const isReviewing = pendingAction !== null
  const isApproving = pendingAction === 'approve'
  const isRejecting = pendingAction === 'reject'

  const handleApprove = async () => {
    try {
      setPendingAction('approve')
      await onApprove(targetRequest.id)
    } finally {
      setPendingAction(null)
    }
  }

  const handleReject = async () => {
    try {
      setPendingAction('reject')
      await onReject(targetRequest.id)
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <Dialog
      onClose={isReviewing ? undefined : onClose}
      open={open}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ pr: 6, fontWeight: 'bold' }}>
        Request Detail
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
        disabled={isReviewing}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <DetailRow label="Shift date" value={targetShift.date} />
        <DetailRow label="Start time" value={targetShift.startTime} />
        <DetailRow label="End time" value={targetShift.endTime} />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mt: 2,
            p: 1.5,
            borderRadius: 1,
            bgcolor: 'action.hover',
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary">
              Currently assigned
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
              {currentAssignedEmployee.name}
            </Typography>
          </Box>
          <ArrowRightAltIcon color="action" />
          <Box sx={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary">
              Requested by
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
              {requestedEmployee.name}
            </Typography>
          </Box>
        </Box>

        {requestReviewErrorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {requestReviewErrorMessage}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button disabled={isReviewing} onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="outlined"
          color="error"
          disabled={isReviewing}
          onClick={handleReject}
        >
          {isRejecting ? 'Rejecting...' : 'Reject'}
        </Button>
        <Button
          variant="contained"
          disabled={isReviewing}
          onClick={handleApprove}
        >
          {isApproving ? 'Approving...' : 'Approve'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
