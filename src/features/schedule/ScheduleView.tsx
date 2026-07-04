import { Box, Typography } from '@mui/material'
import { WeekNavigator } from './WeekNavigator'
import { MyShiftsSection } from './MyShiftsSection'
import { WeeklyScheduleSection } from './WeeklyScheduleSection'
import { useCurrentUser } from '../../contexts/useCurrentUser'
import { useEffect, useState } from 'react'
import {
  getShiftsByWeek,
  markShiftAsCoverageNeeded,
} from '../../services/shiftService'
import { type Shift } from '../../types/shift'
import type { User } from '../../types/user'
import { getUsers } from '../../services/userService'
import {
  addDaysToDateString,
  getCurrentWeekStartDate,
} from '../../utils/dateUtils'
import { ShiftDetailsDialog } from './ShiftDetailsDialog'

export const ScheduleView = () => {
  const { currentUser } = useCurrentUser()
  const [shifts, setShifts] = useState<Shift[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [weekStartDate, setWeekStartDate] = useState<string>(
    getCurrentWeekStartDate(),
  )
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setIsLoading(true)
        const shifts = await getShiftsByWeek(weekStartDate)
        setShifts(shifts)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchUsers = async () => {
      try {
        setIsLoading(true)
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

  const handleMarkCoverageNeeded = async (shiftId: string) => {
    try {
      await markShiftAsCoverageNeeded(shiftId, currentUser.id)
      const updatedShifts = await getShiftsByWeek(weekStartDate)
      setShifts(updatedShifts)
      setSelectedShift(null)
    } catch (e) {
      console.error(e)
    }
  }

  const selectedShiftAssignedUser =
    selectedShift === null
      ? null
      : users.find((user) => user.id === selectedShift.assignedUserId)

  const handleOpenShiftDetails = (shift: Shift) => {
    setSelectedShift(shift)
  }

  const handleCloseShiftDetails = () => {
    setSelectedShift(null)
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
      {isLoading ? (
        <Typography>Loading schedule...</Typography>
      ) : (
        <>
          <WeekNavigator
            weekRangeLabel={weekRangeLabel}
            onPreviousWeek={handlePreviousWeek}
            onNextWeek={handleNextWeek}
          />
          <MyShiftsSection
            currentUser={currentUser}
            myShifts={myShifts}
            onShiftClick={handleOpenShiftDetails}
          />
          <WeeklyScheduleSection
            shifts={shifts}
            users={users}
            onShiftClick={handleOpenShiftDetails}
          />
          {selectedShift && selectedShiftAssignedUser && (
            <ShiftDetailsDialog
              open={selectedShift !== null}
              targetShift={selectedShift}
              currentUser={currentUser}
              assignedUser={selectedShiftAssignedUser}
              onMarkCoverageNeeded={handleMarkCoverageNeeded}
              onClose={handleCloseShiftDetails}
            />
          )}
        </>
      )}
    </Box>
  )
}
