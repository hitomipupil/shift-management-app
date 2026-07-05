import { Card, CardContent, Chip, Typography } from '@mui/material'
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'
import { formatDateTime } from 'src/utils/dateUtils'

type RequestHistoryCardProps = {
  request: CoverageRequest
  targetShift: Shift
  requestedEmployee: User
  reviewedManager: User
  originallyAssignedEmployee: User
}

export const RequestHistoryCard = ({
  request,
  targetShift,
  requestedEmployee,
  reviewedManager,
  originallyAssignedEmployee,
}: RequestHistoryCardProps) => {
  const statusLabel =
    request.status.charAt(0).toUpperCase() + request.status.slice(1)
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Chip label={statusLabel} size="small" />
        <Typography>
          {targetShift.day} {targetShift.startTime} - {targetShift.endTime}
        </Typography>
        <Typography>
          originally assigned to: {originallyAssignedEmployee.name}
        </Typography>
        <Typography>requested by: {requestedEmployee.name}</Typography>
        <Typography>coverage reviewed by: {reviewedManager.name}</Typography>
        <Typography color="text.secondary">
          reviewed at: {formatDateTime(request.reviewedAt)}
        </Typography>
      </CardContent>
    </Card>
  )
}
