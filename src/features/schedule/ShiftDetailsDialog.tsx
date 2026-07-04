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
} from '@mui/material'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'

type ShiftDetailsDialogProps = {
  open: boolean
  targetShift: Shift
  currentUser: User
  assignedUser: User
  onMarkCoverageNeeded: (shiftId: string) => void
  onClose: () => void
}

export const ShiftDetailsDialog = ({
  open,
  targetShift,
  currentUser,
  assignedUser,
  onMarkCoverageNeeded,
  onClose,
}: ShiftDetailsDialogProps) => {
  const displayCoverageNeededButton =
    targetShift.assignedUserId === currentUser.id && !targetShift.coverageNeeded

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
            {displayCoverageNeededButton && (
              <>
                <Button onClick={() => onMarkCoverageNeeded(targetShift.id)}>
                  Need Coverage
                </Button>
                <ListItemText secondary="shift remains assigned to you until a manager approves another employee's request" />
              </>
            )}

            {targetShift.coverageNeeded && (
              <ListItemText secondary="This shift is already marked as Coverage Needed." />
            )}
          </DialogActions>
        </ListItem>
      </List>
    </Dialog>
  )
}
