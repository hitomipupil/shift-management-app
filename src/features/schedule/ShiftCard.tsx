import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from '@mui/material'
import type { Shift } from 'src/types/shift'

type ShiftCardProps = {
  shift: Shift
  assignedUserName: string
  onShiftClick: (shift: Shift) => void
  isRequestPending: boolean
}

export const ShiftCard = ({
  shift,
  assignedUserName,
  onShiftClick,
  isRequestPending,
}: ShiftCardProps) => {
  return (
    <Card>
      <CardActionArea onClick={() => onShiftClick(shift)}>
        <CardContent sx={{ display: 'flex', gap: 2 }}>
          <Typography>{shift.date}</Typography>
          <Typography>{`${shift.startTime} - ${shift.endTime}`}</Typography>
          <Typography>{assignedUserName}</Typography>
          {isRequestPending ? (
            <Chip label="Request Pending" size="small" />
          ) : shift.coverageNeeded ? (
            <Chip label="Coverage Needed" size="small" color="warning" />
          ) : null}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
