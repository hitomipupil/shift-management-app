import { Box, Typography } from '@mui/material'
import { WeekNavigator } from 'src/features/schedule/WeekNavigator'
import { MyShiftsSection } from 'src/features/schedule/MyShiftsSection'
import { WeeklyScheduleSection } from 'src/features/schedule/WeeklyScheduleSection'
import { useCurrentUser } from 'src/contexts/useCurrentUser'
import { useState } from 'react'
import {
  getAllShifts,
  getShiftsByWeek,
  markShiftAsCoverageNeeded,
} from 'src/services/shiftService'
import { type Shift } from 'src/types/shift'
import { ShiftDetailsDialog } from 'src/features/schedule/ShiftDetailsDialog'
import { type CoverageRequest } from 'src/types/coverageRequests'
import {
  approveCoverageRequest,
  createCoverageRequest,
  getPendingCoverageRequests,
  getRequestsByUser,
  getReviewedCoverageRequests,
  rejectCoverageRequest,
} from 'src/services/coverageRequestService'
import { ManagerRequestsSection } from 'src/features/requests/ManagerRequestsSection'
import { RequestDetailsDialog } from 'src/features/requests/RequestDetailsDialog'
import { useDisplayedWeek } from 'src/features/schedule/useDisplayedWeek'
import { MyCoverageRequestsSection } from '../requests/MyCoverageRequestsSection'
import { useScheduleData } from './useScheduleData'

export const ScheduleView = () => {
  const { currentUser } = useCurrentUser()
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
  const [selectedRequest, setSelectedRequest] =
    useState<CoverageRequest | null>(null)
  const [coverageRequestErrorMessage, setCoverageRequestErrorMessage] =
    useState<string | null>(null)
  const [requestReviewErrorMessage, setRequestReviewErrorMessage] = useState<
    string | null
  >(null)
  const { weekStartDate, weekRangeLabel, handlePreviousWeek, handleNextWeek } =
    useDisplayedWeek()
  const {
    shiftsOfThisWeek,
    setShiftsOfThisWeek,
    allShifts,
    setAllShifts,
    users,
    pendingCoverageRequests,
    setPendingCoverageRequests,
    isLoading,
    myCoverageRequests,
    setMyCoverageRequests,
    reviewedCoverageRequests,
    setReviewedCoverageRequests,
  } = useScheduleData(currentUser, weekStartDate)

  if (!currentUser) {
    throw new Error('Current user is required to view schedule')
  }

  const myShifts = shiftsOfThisWeek.filter(
    (shift) => shift.assignedUserId === currentUser.id,
  )

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
      const updatedMyCoverageRequests = await getRequestsByUser(currentUser.id)
      setMyCoverageRequests(updatedMyCoverageRequests)
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
        updatedPendingCoverageRequests,
        updatedReviewedCoverageRequests,
      ] = await Promise.all([
        getShiftsByWeek(weekStartDate),
        getAllShifts(),
        getPendingCoverageRequests(),
        getReviewedCoverageRequests(),
      ])
      setShiftsOfThisWeek(updatedShiftsOfThisWeek)
      setAllShifts(updatedAllShifts)
      setPendingCoverageRequests(updatedPendingCoverageRequests)
      setReviewedCoverageRequests(updatedReviewedCoverageRequests)
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
      const [updatedCoverageRequests, updatedReviewedCoverageRequests] =
        await Promise.all([
          getPendingCoverageRequests(),
          getReviewedCoverageRequests(),
        ])
      setPendingCoverageRequests(updatedCoverageRequests)
      setReviewedCoverageRequests(updatedReviewedCoverageRequests)
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
          {currentUser.role === 'employee' && (
            <MyCoverageRequestsSection
              myRequests={myCoverageRequests}
              shifts={allShifts}
              users={users}
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
              allShifts={allShifts}
              users={users}
              onRequestClick={handleOpenRequestDetails}
              reviewedCoverageRequests={reviewedCoverageRequests}
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
