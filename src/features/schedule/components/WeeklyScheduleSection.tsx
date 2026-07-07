import type { Shift } from 'src/types/shift'
import { ShiftCard } from 'src/features/schedule/components/ShiftCard'
import type { User } from 'src/types/user'
import { Box, Typography } from '@mui/material'
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined'
import type { CoverageRequest } from 'src/types/coverageRequests'
import { EmptyState } from 'src/components/EmptyState'

type WeeklyScheduleSectionProps = {
  shifts: Shift[]
  users: User[]
  onShiftClick: (shift: Shift) => void
  coverageRequests: CoverageRequest[]
}

export const WeeklyScheduleSection = ({
  shifts,
  users,
  onShiftClick,
  coverageRequests,
}: WeeklyScheduleSectionProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        Weekly Schedule
      </Typography>
      {shifts.length === 0 ? (
        <EmptyState
          message="No shifts this week"
          icon={<EventBusyOutlinedIcon fontSize="large" />}
        />
      ) : (
        shifts.map((shift) => {
          const assignedUser = users.find(
            (user) => user.id === shift.assignedUserId,
          )

          if (!assignedUser) {
            throw new Error(`Assigned user not found: ${shift.assignedUserId}`)
          }

          return (
            <ShiftCard
              key={shift.id}
              shift={shift}
              assignedUserName={assignedUser.name}
              onShiftClick={onShiftClick}
              isRequestPending={coverageRequests.some(
                (req) => req.shiftId === shift.id,
              )}
            />
          )
        })
      )}
    </Box>
  )
}
