import { Box } from '@mui/material'
import { WeekNavigator } from './WeekNavigator'
import { MyShiftsSection } from './MyShiftsSection'
import { WeeklyScheduleSection } from './WeeklyScheduleSection'
import { useCurrentUser } from '../../contexts/useCurrentUser'
import { useEffect, useState } from 'react'
import { getShiftsByWeek } from '../../services/shiftService'
import { type Shift } from '../../types/shift'
import type { User } from '../../types/user'
import { getUsers } from '../../services/userService'
import {
  addDaysToDateString,
  getCurrentWeekStartDate,
} from '../../utils/dateUtils'

export const ScheduleView = () => {
  const { currentUser } = useCurrentUser()
  const [shifts, setShifts] = useState<Shift[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [weekStartDate, setWeekStartDate] = useState<string>(
    getCurrentWeekStartDate(),
  )

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const shifts = await getShiftsByWeek(weekStartDate)
        setShifts(shifts)
      } catch (e) {
        console.error(e)
      }
    }

    const fetchUsers = async () => {
      try {
        const data = await getUsers()
        setUsers(data)
      } catch (e) {
        console.error(e)
      }
    }
    fetchShifts()
    fetchUsers()
  }, [weekStartDate])

  if (!currentUser) {
    throw new Error('Current user is required to view schedule')
  }

  const myShifts = shifts.filter(
    (shift) => shift.assignedUserId === currentUser.id,
  )

  const handlePreviousWeek = () => {
    setWeekStartDate((current) => addDaysToDateString(current, -7))
  }

  const handleNextWeek = () => {
    setWeekStartDate((current) => addDaysToDateString(current, 7))
  }

  const weekEndDate = addDaysToDateString(weekStartDate, 6)
  const weekRangeLabel = `${weekStartDate} - ${weekEndDate}`

  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <WeekNavigator
        weekRangeLabel={weekRangeLabel}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
      />
      <MyShiftsSection currentUser={currentUser} myShifts={myShifts} />
      <WeeklyScheduleSection shifts={shifts} users={users} />
    </Box>
  )
}
