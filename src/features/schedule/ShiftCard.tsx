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
import {
  SHIFT_STATUS_CHIP,
  type StatusChipConfig,
} from 'src/features/requests/requestStatusChip'
import type { Shift } from 'src/types/shift'
import { isPastShift } from 'src/utils/isPastShift'

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
  const isPast = isPastShift(shift)
  const statusChipConfig: StatusChipConfig | null = isRequestPending
    ? SHIFT_STATUS_CHIP.requestPending
    : shift.coverageNeeded
      ? SHIFT_STATUS_CHIP.coverageNeeded
      : null

  return (
    <Card
      variant="outlined"
      sx={
        isPast
          ? { opacity: 0.55, bgcolor: 'action.hover' }
          : undefined
      }
    >
      <CardActionArea onClick={() => onShiftClick(shift)}>
        <CardContent
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            rowGap: 1,
          }}
        >
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

          {statusChipConfig && (
            <Box
              sx={{
                order: { xs: -1, sm: 4 },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              <Chip
                label={statusChipConfig.label}
                size="small"
                color={statusChipConfig.color}
                sx={statusChipConfig.sx}
              />
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 0.75,
              minWidth: 0,
              width: { xs: '100%', sm: 'auto' },
              order: { xs: 1, sm: 3 },
            }}
          >
            <PersonOutlinedIcon fontSize="small" color="action" />
            <Typography variant="body2" noWrap>
              {assignedUserName}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
