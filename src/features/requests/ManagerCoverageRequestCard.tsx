import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Tooltip,
  Typography,
} from '@mui/material'
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'
import { formatDateTime } from 'src/utils/dateUtils'
import { REQUEST_STATUS_CHIP } from './requestStatusChip'

type ManagerCoverageRequestCardProps = {
  request: CoverageRequest
  targetShift: Shift
  assignedEmployee: User
  requestedEmployee: User
  reviewedManager?: User
  onRequestClick?: (request: CoverageRequest) => void
}

export const ManagerCoverageRequestCard = ({
  request,
  targetShift,
  assignedEmployee,
  requestedEmployee,
  reviewedManager,
  onRequestClick,
}: ManagerCoverageRequestCardProps) => {
  const { label, color } = REQUEST_STATUS_CHIP[request.status]
  const isPending = request.status === 'pending'
  const assignedEmployeeTooltip = isPending
    ? 'Currently assigned to'
    : 'Originally assigned to'

  const cardContent = (
    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <CalendarTodayIcon fontSize="small" color="action" />
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {targetShift.date}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <AccessTimeIcon fontSize="small" color="action" />
          <Typography variant="body2">
            {`${targetShift.startTime} - ${targetShift.endTime}`}
          </Typography>
        </Box>

        <Box
          sx={{
            order: { xs: -1, sm: 0 },
            width: { xs: '100%', sm: 'auto' },
            ml: { sm: 'auto' },
          }}
        >
          <Chip label={label} size="small" color={color} />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 0.75,
        }}
      >
        <PersonOutlinedIcon fontSize="small" color="action" />
        <Tooltip title={assignedEmployeeTooltip}>
          <Typography variant="body2" noWrap>
            {assignedEmployee.name}
          </Typography>
        </Tooltip>
        <ArrowRightAltIcon fontSize="small" color="action" />
        <Tooltip title="Requested by">
          <Typography variant="body2" noWrap>
            {requestedEmployee.name}
          </Typography>
        </Tooltip>
      </Box>

      {!isPending && reviewedManager && (
        <Typography variant="caption" color="text.secondary">
          Reviewed by {reviewedManager.name} ·{' '}
          {formatDateTime(request.reviewedAt)}
        </Typography>
      )}
    </CardContent>
  )

  return (
    <Card variant="outlined">
      {onRequestClick ? (
        <CardActionArea onClick={() => onRequestClick(request)}>
          {cardContent}
        </CardActionArea>
      ) : (
        cardContent
      )}
    </Card>
  )
}
