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
import { type CoverageRequest } from '../../types/coverageRequests'
import {
  createCoverageRequest,
  getPendingCoverageRequests,
} from '../../services/coverageRequestService'
import { ManagerRequestsSection } from '../requests/ManagerRequestsSection'

export const ScheduleView = () => {
  const { currentUser } = useCurrentUser()
  const [shifts, setShifts] = useState<Shift[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [weekStartDate, setWeekStartDate] = useState<string>(
    getCurrentWeekStartDate(),
  )
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
  const [coverageRequests, setCoverageRequests] = useState<CoverageRequest[]>(
    [],
  )
  const [isLoading, setIsLoading] = useState(true)
  const [requestErrorMessage, setRequestErrorMessage] = useState<string | null>(
    null,
  )

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setIsLoading(true)
        const [shiftsData, usersData, pendingRequestsData] = await Promise.all([
          getShiftsByWeek(weekStartDate),
          getUsers(),
          getPendingCoverageRequests(),
        ])

        setShifts(shiftsData)
        setUsers(usersData)
        setCoverageRequests(pendingRequestsData)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchScheduleData()
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

  const handleRequestToCover = async (shiftId: string) => {
    try {
      await createCoverageRequest(shiftId, currentUser.id)
      setRequestErrorMessage(null)
      const updatedCoverageRequests = await getPendingCoverageRequests()
      setCoverageRequests(updatedCoverageRequests)
      setSelectedShift(null)
    } catch (e) {
      if (e instanceof Error) {
        setRequestErrorMessage(e.message)
      } else {
        setRequestErrorMessage('Something went wrong')
      }
    }
  }

  const selectedShiftAssignedUser =
    selectedShift === null
      ? null
      : users.find((user) => user.id === selectedShift.assignedUserId)

  const isSelectedShiftRequestPending =
    selectedShift !== null &&
    coverageRequests.some((request) => request.shiftId === selectedShift.id)

  const handleOpenShiftDetails = (shift: Shift) => {
    setSelectedShift(shift)
  }

  const handleCloseShiftDetails = () => {
    setSelectedShift(null)
    setRequestErrorMessage(null)
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
          {currentUser.role === 'employee' && (
            <MyShiftsSection
              currentUser={currentUser}
              myShifts={myShifts}
              onShiftClick={handleOpenShiftDetails}
              coverageRequests={coverageRequests}
            />
          )}
          <WeeklyScheduleSection
            shifts={shifts}
            users={users}
            onShiftClick={handleOpenShiftDetails}
            coverageRequests={coverageRequests}
          />

          {currentUser.role === 'manager' && (
            <ManagerRequestsSection pendingRequests={coverageRequests} />
          )}
          {selectedShift && selectedShiftAssignedUser && (
            <ShiftDetailsDialog
              open={selectedShift !== null}
              targetShift={selectedShift}
              currentUser={currentUser}
              assignedUser={selectedShiftAssignedUser}
              onMarkCoverageNeeded={handleMarkCoverageNeeded}
              onClose={handleCloseShiftDetails}
              onRequestToCover={handleRequestToCover}
              isRequestPending={isSelectedShiftRequestPending}
              requestErrorMessage={requestErrorMessage}
            />
          )}
        </>
      )}
    </Box>
  )
}
