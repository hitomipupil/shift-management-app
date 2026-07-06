import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Tooltip,
  Typography,
} from '@mui/material'
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
    <Card variant="outlined">
      <CardActionArea onClick={() => onRequestClick(pendingRequest)}>
        <CardContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <PersonOutlinedIcon fontSize="small" color="action" />
            <Tooltip title="Currently assigned to">
              <Typography variant="body2" noWrap>
                {currentAssignedEmployee.name}
              </Typography>
            </Tooltip>
            <ArrowRightAltIcon fontSize="small" color="action" />
            <Tooltip title="Requested by">
              <Typography variant="body2" noWrap>
                {requestedEmployee.name}
              </Typography>
            </Tooltip>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
