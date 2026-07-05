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
}

export const RequestHistoryCard = ({
  request,
  targetShift,
  requestedEmployee,
  reviewedManager,
}: RequestHistoryCardProps) => {
  return (
    <Card>
      <CardContent sx={{ display: 'flex', gap: 2 }}>
        <Chip label={request.status} size="small" />
        <Typography>{targetShift.day}</Typography>
        <Typography>{`${targetShift.startTime} - ${targetShift.endTime}`}</Typography>
        <Typography>{requestedEmployee.name}</Typography>
        <Typography>{`reviewed by: ${reviewedManager.name}`}</Typography>
        <Typography>{`reviewed at: ${formatDateTime(request.reviewedAt)}`}</Typography>
      </CardContent>
    </Card>
  )
}
