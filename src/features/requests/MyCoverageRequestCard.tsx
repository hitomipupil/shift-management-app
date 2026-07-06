import { Card, CardContent, Chip, Typography } from '@mui/material'
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'
import { REQUEST_STATUS_CHIP } from './requestStatusChip'

type MyCoverageRequestCardProps = {
  request: CoverageRequest
  originalAssignedEmployee: User
  targetShift: Shift
}

export const MyCoverageRequestCard = ({
  request,
  originalAssignedEmployee,
  targetShift,
}: MyCoverageRequestCardProps) => {
  const { label, color } = REQUEST_STATUS_CHIP[request.status]
  return (
    <Card>
      <CardContent sx={{ display: 'flex', gap: 2 }}>
        <Typography>{targetShift.date}</Typography>
        <Typography>{`${targetShift.startTime} - ${targetShift.endTime}`}</Typography>
        <Typography>{`originally assigned to: ${originalAssignedEmployee.name}`}</Typography>
        <Chip label={label} size="small" color={color} />
      </CardContent>
    </Card>
  )
}
