import { Box, Typography } from '@mui/material'
import { WeekNavigator } from './WeekNavigator'
import { MyShiftsSection } from './MyShiftsSection'
import { WeeklyScheduleSection } from './WeeklyScheduleSection'
import { useCurrentUser } from '../../contexts/useCurrentUser'
import { useEffect, useState } from 'react'
import {
  getAllShifts,
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
  approveCoverageRequest,
  createCoverageRequest,
  getPendingCoverageRequests,
  rejectCoverageRequest,
} from '../../services/coverageRequestService'
import { ManagerRequestsSection } from '../requests/ManagerRequestsSection'
import { RequestDetailsDialog } from '../requests/RequestDetailsDialog'

export const ScheduleView = () => {
  const { currentUser } = useCurrentUser()
  const [shiftsOfThisWeek, setShiftsOfThisWeek] = useState<Shift[]>([])
  const [allShifts, setAllShifts] = useState<Shift[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [weekStartDate, setWeekStartDate] = useState<string>(
    getCurrentWeekStartDate(),
  )
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
  const [pendingCoverageRequests, setPendingCoverageRequests] = useState<
    CoverageRequest[]
  >([])
  const [selectedRequest, setSelectedRequest] =
    useState<CoverageRequest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [coverageRequestErrorMessage, setCoverageRequestErrorMessage] =
    useState<string | null>(null)
  const [requestReviewErrorMessage, setRequestReviewErrorMessage] = useState<
    string | null
  >(null)

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setIsLoading(true)
        const [shiftsData, usersData, pendingRequestsData, allShiftsData] =
          await Promise.all([
            getShiftsByWeek(weekStartDate),
            getUsers(),
            getPendingCoverageRequests(),
            getAllShifts(),
          ])

        setShiftsOfThisWeek(shiftsData)
        setUsers(usersData)
        setPendingCoverageRequests(pendingRequestsData)
        setAllShifts(allShiftsData)
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

  const myShifts = shiftsOfThisWeek.filter(
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
      setShiftsOfThisWeek(updatedShifts)
      setSelectedShift(null)
    } catch (e) {
      console.error(e)
    }
  }

  const handleRequestToCover = async (shiftId: string) => {
    try {
      await createCoverageRequest(shiftId, currentUser)
      setCoverageRequestErrorMessage(null)
      const updatedCoverageRequests = await getPendingCoverageRequests()
      setPendingCoverageRequests(updatedCoverageRequests)
      setSelectedShift(null)
    } catch (e) {
      if (e instanceof Error) {
        setCoverageRequestErrorMessage(e.message)
      } else {
        setCoverageRequestErrorMessage('Something went wrong')
      }
    }
  }

  const selectedShiftAssignedUser =
    selectedShift === null
      ? null
      : (users.find((user) => user.id === selectedShift.assignedUserId) ?? null)

  const isSelectedShiftRequestPending =
    selectedShift !== null &&
    pendingCoverageRequests.some(
      (request) => request.shiftId === selectedShift.id,
    )

  const handleOpenShiftDetails = (shift: Shift) => {
    setSelectedShift(shift)
  }

  const handleCloseShiftDetails = () => {
    setSelectedShift(null)
    setCoverageRequestErrorMessage(null)
  }

  const handleOpenRequestDetails = (request: CoverageRequest) => {
    setSelectedRequest(request)
  }

  const handleCloseRequestDetails = () => {
    setSelectedRequest(null)
    setRequestReviewErrorMessage(null)
  }

  const handleApproveRequest = async (requestId: string) => {
    try {
      await approveCoverageRequest(requestId, currentUser)
      const [
        updatedShiftsOfThisWeek,
        updatedAllShifts,
        updatedCoverageRequests,
      ] = await Promise.all([
        getShiftsByWeek(weekStartDate),
        getAllShifts(),
        getPendingCoverageRequests(),
      ])
      setShiftsOfThisWeek(updatedShiftsOfThisWeek)
      setAllShifts(updatedAllShifts)
      setPendingCoverageRequests(updatedCoverageRequests)
      setSelectedRequest(null)
    } catch (e) {
      if (e instanceof Error) {
        setRequestReviewErrorMessage(e.message)
      } else {
        setRequestReviewErrorMessage('Something went wrong')
      }
    }
  }

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectCoverageRequest(requestId, currentUser)
      const updatedCoverageRequests = await getPendingCoverageRequests()
      setPendingCoverageRequests(updatedCoverageRequests)
      setSelectedRequest(null)
    } catch (e) {
      if (e instanceof Error) {
        setRequestReviewErrorMessage(e.message)
      } else {
        setRequestReviewErrorMessage('Something went wrong')
      }
    }
  }

  const selectedRequestTargetShift =
    selectedRequest === null
      ? null
      : (allShifts.find((shift) => shift.id === selectedRequest.shiftId) ??
        null)

  const currentAssignedEmployee =
    selectedRequest === null
      ? null
      : (users.find(
          (user) => user.id === selectedRequest.originalAssignedUserId,
        ) ?? null)

  const requestedEmployee =
    selectedRequest === null
      ? null
      : (users.find((user) => user.id === selectedRequest.requestedByUserId) ??
        null)

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
              coverageRequests={pendingCoverageRequests}
            />
          )}
          <WeeklyScheduleSection
            shifts={shiftsOfThisWeek}
            users={users}
            onShiftClick={handleOpenShiftDetails}
            coverageRequests={pendingCoverageRequests}
          />

          {currentUser.role === 'manager' && (
            <ManagerRequestsSection
              pendingRequests={pendingCoverageRequests}
              shifts={allShifts}
              users={users}
              onRequestClick={handleOpenRequestDetails}
            />
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
              requestErrorMessage={coverageRequestErrorMessage}
            />
          )}
          {selectedRequest &&
            selectedRequestTargetShift &&
            currentAssignedEmployee &&
            requestedEmployee && (
              <RequestDetailsDialog
                open={selectedRequest !== null}
                onClose={handleCloseRequestDetails}
                targetRequest={selectedRequest}
                targetShift={selectedRequestTargetShift}
                currentAssignedEmployee={currentAssignedEmployee}
                requestedEmployee={requestedEmployee}
                onApprove={handleApproveRequest}
                onReject={handleRejectRequest}
                requestReviewErrorMessage={requestReviewErrorMessage}
              />
            )}
        </>
      )}
    </Box>
  )
}
