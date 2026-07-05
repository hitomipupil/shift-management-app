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
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle sx={{ pr: 6 }}>Request Detail</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <List sx={{ pt: 0 }}>
        <ListItem sx={{ display: 'flex', flexDirection: 'column' }}>
          <ListItemText primary={`shift date: ${targetShift.date}`} />
          <ListItemText primary={`start time: ${targetShift.startTime}`} />
          <ListItemText primary={`end time: ${targetShift.endTime}`} />
          <ListItemText
            primary={`currently assigned to: ${currentAssignedEmployee.name}`}
          />
          <ListItemText
            primary={`coverage requested by: ${requestedEmployee.name}`}
          />
          <DialogActions sx={{ display: 'flex', flexDirection: 'column' }}>
            <Button onClick={() => onApprove(targetRequest.id)}>Approve</Button>
            <Button onClick={() => onReject(targetRequest.id)}>Reject</Button>
            <Button onClick={onClose}>Cancel</Button>
            {requestReviewErrorMessage && (
              <Typography color="error" variant="body2">
                {requestReviewErrorMessage}
              </Typography>
            )}
          </DialogActions>
        </ListItem>
      </List>
    </Dialog>
  )
}
