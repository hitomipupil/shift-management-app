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
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'

type RequestDetailsDialogProps = {
  open: boolean
  onClose: () => void
  targetRequest: CoverageRequest
  targetShift: Shift
  onApprove: (requestId: string) => Promise<void>
  onReject: (requestId: string) => Promise<void>
}

export const RequestDetailsDialog = ({
  open,
  onClose,
  targetRequest,
  targetShift,
  onApprove,
  onReject,
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
          <ListItemText primary={`shift day: ${targetShift.day}`} />
          <ListItemText primary={`start time: ${targetShift.startTime}`} />
          <ListItemText primary={`end time: ${targetShift.endTime}`} />
          <ListItemText
            primary={`currently assigned to: ${targetRequest.originalAssignedUserId}`}
          />
          <ListItemText
            primary={`coverage requested by: ${targetRequest.requestedByUserId}`}
          />
          <DialogActions sx={{ display: 'flex', flexDirection: 'column' }}>
            <Button onClick={() => onApprove(targetRequest.id)}>Approve</Button>
            <Button onClick={() => onReject(targetRequest.id)}>Reject</Button>
          </DialogActions>
        </ListItem>
      </List>
    </Dialog>
  )
}
