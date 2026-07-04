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
  requestErrorMessage: string
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
  requestErrorMessage,
}: ShiftDetailsDialogProps) => {
  const isOwnShift = targetShift.assignedUserId === currentUser.id
  const canMarkCoverageNeeded = isOwnShift && !targetShift.coverageNeeded
  const canRequestToCover =
    !isOwnShift && targetShift.coverageNeeded && !isRequestPending

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle sx={{ pr: 6 }}>Shift Detail</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
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
                <Button onClick={() => onMarkCoverageNeeded(targetShift.id)}>
                  Need Coverage
                </Button>
                <ListItemText secondary="shift remains assigned to you until a manager approves another employee's request" />
              </>
            )}
            {canRequestToCover && (
              <Button onClick={() => onRequestToCover(targetShift.id)}>
                Request to cover this shift
              </Button>
            )}

            {isRequestPending ? (
              <ListItemText
                secondary={`A coverage request is already pending for this shift.`}
              />
            ) : targetShift.coverageNeeded ? (
              <ListItemText secondary="This shift is marked as Coverage Needed." />
            ) : null}
            {requestErrorMessage && (
              <Typography color="error" variant="body2">
                {requestErrorMessage}
              </Typography>
            )}
          </DialogActions>
        </ListItem>
      </List>
    </Dialog>
  )
}
