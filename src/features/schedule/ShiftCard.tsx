import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from '@mui/material'
import type { Shift } from 'src/types/shift'

type ShiftCardProps = {
  shift: Shift
  assignedUserName: string
  onShiftClick: (shift: Shift) => void
  isRequestPending: boolean
}

export const ShiftCard = ({
  shift,
  assignedUserName,
  onShiftClick,
  isRequestPending,
}: ShiftCardProps) => {
  return (
    <Card variant="outlined">
      <CardActionArea onClick={() => onShiftClick(shift)}>
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              minWidth: 96,
            }}
          >
            <CalendarTodayIcon fontSize="small" color="action" />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {shift.date}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2">
              {`${shift.startTime} - ${shift.endTime}`}
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              minWidth: 0,
            }}
          >
            <PersonOutlinedIcon fontSize="small" color="action" />
            <Typography variant="body2" noWrap>
              {assignedUserName}
            </Typography>
          </Box>

          {isRequestPending ? (
            <Chip label="Request Pending" size="small" color="info" />
          ) : shift.coverageNeeded ? (
            <Chip label="Coverage Needed" size="small" color="warning" />
          ) : null}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
