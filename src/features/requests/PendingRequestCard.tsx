import { Card, CardActionArea, CardContent, Typography } from '@mui/material'
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'

type PendingRequestCardProps = {
  pendingRequest: CoverageRequest
  currentAssignedEmployee: User
  requestedEmployee: User
  targetShift: Shift
  onRequestClick: (request: CoverageRequest) => void
}

export const PendingRequestCard = ({
  pendingRequest,
  currentAssignedEmployee,
  requestedEmployee,
  targetShift,
  onRequestClick,
}: PendingRequestCardProps) => {
  return (
    <Card>
      <CardActionArea onClick={() => onRequestClick(pendingRequest)}>
        <CardContent sx={{ display: 'flex', gap: 2 }}>
          <Typography>{targetShift.day}</Typography>
          <Typography>{`${targetShift.startTime} - ${targetShift.endTime}`}</Typography>
          <Typography>{`${currentAssignedEmployee.name} => ${requestedEmployee.name}`}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
