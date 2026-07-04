import type { Shift } from 'src/types/shift'
import { ShiftCard } from './ShiftCard'
import type { User } from 'src/types/user'
import { Typography } from '@mui/material'

type WeeklyScheduleSectionProps = {
  shifts: Shift[]
  users: User[]
  onShiftClick: (shift: Shift) => void
}

export const WeeklyScheduleSection = ({
  shifts,
  users,
  onShiftClick,
}: WeeklyScheduleSectionProps) => {
  return (
    <>
      <Typography>Weekly Schedule</Typography>
      {shifts.length === 0 ? (
        <Typography color="text.secondary">No shifts this week.</Typography>
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
            />
          )
        })
      )}
    </>
  )
}
