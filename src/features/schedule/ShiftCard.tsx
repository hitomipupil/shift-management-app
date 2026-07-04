import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from '@mui/material'
import type { Shift } from '../../types/shift'

type ShiftCardProps = {
  shift: Shift
  assignedUserName: string
  onShiftClick: (shift: Shift) => void
}

export const ShiftCard = ({
  shift,
  assignedUserName,
  onShiftClick,
}: ShiftCardProps) => {
  return (
    <Card>
      <CardActionArea onClick={() => onShiftClick(shift)}>
        <CardContent sx={{ display: 'flex', gap: 2 }}>
          <Typography>{shift.day}</Typography>
          <Typography>{`${shift.startTime} - ${shift.endTime}`}</Typography>
          <Typography>{assignedUserName}</Typography>
          {shift.coverageNeeded && (
            <Chip label="Coverage Needed" size="small" />
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
