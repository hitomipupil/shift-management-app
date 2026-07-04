import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'
import { ShiftCard } from './ShiftCard'
import { Typography } from '@mui/material'
import type { CoverageRequest } from 'src/types/coverageRequests'

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
    <>
      <Typography>My Shifts</Typography>
      {myShifts.length === 0 ? (
        <Typography color="text.secondary">
          You have no shifts this week.
        </Typography>
      ) : (
        myShifts.map((myShift) => (
          <ShiftCard
            key={myShift.id}
            shift={myShift}
            assignedUserName={currentUser.name}
            onShiftClick={onShiftClick}
            isPending={coverageRequests.some(
              (req) => req.shiftId === myShift.id,
            )}
          />
        ))
      )}
    </>
  )
}
