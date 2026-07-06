import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'
import { ShiftCard } from 'src/features/schedule/ShiftCard'
import { Box, Typography } from '@mui/material'
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined'
import type { CoverageRequest } from 'src/types/coverageRequests'
import { EmptyState } from 'src/components/EmptyState'

type MyShiftsSectionProps = {
  currentUser: User
  myShifts: Shift[]
  onShiftClick: (shift: Shift) => void
  coverageRequests: CoverageRequest[]
}

export const MyShiftsSection = ({
  currentUser,
  myShifts,
  onShiftClick,
  coverageRequests,
}: MyShiftsSectionProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        My Shifts
      </Typography>
      {myShifts.length === 0 ? (
        <EmptyState
          message="You have no shifts this week."
          icon={<EventBusyOutlinedIcon fontSize="large" />}
        />
      ) : (
        myShifts.map((myShift) => (
          <ShiftCard
            key={myShift.id}
            shift={myShift}
            assignedUserName={currentUser.name}
            onShiftClick={onShiftClick}
            isRequestPending={coverageRequests.some(
              (req) => req.shiftId === myShift.id,
            )}
          />
        ))
      )}
    </Box>
  )
}
