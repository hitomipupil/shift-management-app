import { Card, CardContent, Chip, Typography } from '@mui/material'
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'

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
  const statusLabel =
    request.status.charAt(0).toUpperCase() + request.status.slice(1)
  return (
    <Card>
      <CardContent sx={{ display: 'flex', gap: 2 }}>
        <Typography>{targetShift.date}</Typography>
        <Typography>{`${targetShift.startTime} - ${targetShift.endTime}`}</Typography>
        <Typography>{`originally assigned to: ${originalAssignedEmployee.name}`}</Typography>
        <Chip
          label={statusLabel}
          size="small"
          color={
            request.status === 'approved'
              ? 'primary'
              : request.status === 'rejected'
                ? 'secondary'
                : 'default'
          }
        />
      </CardContent>
    </Card>
  )
}
