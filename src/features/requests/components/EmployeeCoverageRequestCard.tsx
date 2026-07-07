import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Tooltip,
  Typography,
} from '@mui/material'
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'
import { REQUEST_STATUS_CHIP } from '../utils/requestStatusChip'

type EmployeeCoverageRequestCardProps = {
  request: CoverageRequest
  originalAssignedEmployee: User
  targetShift: Shift
}

export const EmployeeCoverageRequestCard = ({
  request,
  originalAssignedEmployee,
  targetShift,
}: EmployeeCoverageRequestCardProps) => {
  const { label, color } = REQUEST_STATUS_CHIP[request.status]
  return (
    <Card variant="outlined">
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
          <Tooltip title="Originally assigned to">
            <Typography variant="body2" noWrap>
              {originalAssignedEmployee.name}
            </Typography>
          </Tooltip>
          <ArrowRightAltIcon fontSize="small" color="action" />
          <Tooltip title="Requested by">
            <Typography variant="body2" noWrap>
              You
            </Typography>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  )
}
