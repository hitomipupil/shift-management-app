import { Card, CardContent, Typography } from '@mui/material'
import type { Shift } from 'src/types/shift'

type ShiftCardProps = {
  shift: Shift
  assignedUserName: string
}

export const ShiftCard = ({ shift, assignedUserName }: ShiftCardProps) => {
  return (
    <Card>
      <CardContent sx={{ display: 'flex', gap: 2 }}>
        <Typography>{shift.day}</Typography>
        <Typography>{`${shift.startTime} - ${shift.endTime}`}</Typography>
        <Typography>{assignedUserName}</Typography>
      </CardContent>
    </Card>
  )
}
