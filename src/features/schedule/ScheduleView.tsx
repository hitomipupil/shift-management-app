import { Box, Button, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { WeekNavigator } from 'src/features/schedule/WeekNavigator'
import { MyShiftsSection } from 'src/features/schedule/MyShiftsSection'
import { WeeklyScheduleSection } from 'src/features/schedule/WeeklyScheduleSection'
import { useCurrentUser } from 'src/contexts/useCurrentUser'
import { useMemo, useState } from 'react'
import {
  createShift,
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
import { CreateShiftDialog } from './CreateShiftDialog'

export const ScheduleView = () => {
  const { currentUser } = useCurrentUser()
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
  const [selectedRequest, setSelectedRequest] =
    useState<CoverageRequest | null>(null)
  const [markCoverageNeededErrorMessage, setMarkCoverageNeededErrorMessage] =
    useState<string | null>(null)
  const [requestToCoverErrorMessage, setRequestToCoverErrorMessage] = useState<
    string | null
  >(null)
  const [requestReviewErrorMessage, setRequestReviewErrorMessage] = useState<
    string | null
  >(null)
  const [createShiftDialogOpen, setCreateShiftDialogOpen] =
    useState<boolean>(false)
  const [createShiftErrorMessage, setCreateShiftErrorMessage] = useState<
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

  const isEmployee = currentUser.role === 'employee'
  const isManager = currentUser.role === 'manager'

  const myShifts = useMemo(() => {
    return shiftsOfThisWeek.filter(
      (shift) => shift.assignedUserId === currentUser.id,
    )
  }, [shiftsOfThisWeek, currentUser.id])

  const handleMarkCoverageNeeded = async (shiftId: string) => {
    try {
      setMarkCoverageNeededErrorMessage(null)
      await markShiftAsCoverageNeeded(shiftId, currentUser.id)
      setSelectedShift(null)
      const updatedShifts = await getShiftsByWeek(weekStartDate)
      setShiftsOfThisWeek(updatedShifts)
    } catch (e) {
      if (e instanceof Error) {
        setMarkCoverageNeededErrorMessage(e.message)
      } else {
        setMarkCoverageNeededErrorMessage('Something went wrong')
      }
    }
  }

  const handleRequestToCover = async (shiftId: string) => {
    try {
      setRequestToCoverErrorMessage(null)
      await createCoverageRequest(shiftId, currentUser)
      setSelectedShift(null)
      const updatedCoverageRequests = await getPendingCoverageRequests()
      setPendingCoverageRequests(updatedCoverageRequests)
      const updatedMyCoverageRequests = await getRequestsByUser(currentUser.id)
      setMyCoverageRequests(updatedMyCoverageRequests)
    } catch (e) {
      if (e instanceof Error) {
        setRequestToCoverErrorMessage(e.message)
      } else {
        setRequestToCoverErrorMessage('Something went wrong')
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
    setMarkCoverageNeededErrorMessage(null)
    setRequestToCoverErrorMessage(null)
    setSelectedShift(shift)
  }

  const handleCloseShiftDetails = () => {
    setSelectedShift(null)
    setMarkCoverageNeededErrorMessage(null)
    setRequestToCoverErrorMessage(null)
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
      setRequestReviewErrorMessage(null)
      await approveCoverageRequest(requestId, currentUser)
      setSelectedRequest(null)
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
      setRequestReviewErrorMessage(null)
      await rejectCoverageRequest(requestId, currentUser)
      setSelectedRequest(null)
      const [updatedCoverageRequests, updatedReviewedCoverageRequests] =
        await Promise.all([
          getPendingCoverageRequests(),
          getReviewedCoverageRequests(),
        ])
      setPendingCoverageRequests(updatedCoverageRequests)
      setReviewedCoverageRequests(updatedReviewedCoverageRequests)
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

  const handleCreateShift = async (
    assignedUserId: string,
    date: string,
    startTime: string,
    endTime: string,
  ) => {
    try {
      setCreateShiftErrorMessage(null)
      await createShift(currentUser, assignedUserId, date, startTime, endTime)
      setCreateShiftDialogOpen(false)
      const [updatedShiftsOfThisWeek, updatedAllShifts] = await Promise.all([
        getShiftsByWeek(weekStartDate),
        getAllShifts(),
      ])
      setShiftsOfThisWeek(updatedShiftsOfThisWeek)
      setAllShifts(updatedAllShifts)
    } catch (e) {
      if (e instanceof Error) {
        setCreateShiftErrorMessage(e.message)
      } else {
        setCreateShiftErrorMessage('Something went wrong')
      }
    }
  }

  const handleCreateShiftDialogClose = () => {
    setCreateShiftErrorMessage(null)
    setCreateShiftDialogOpen(false)
  }

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
          {isManager && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setCreateShiftDialogOpen(true)}
              sx={{ alignSelf: 'flex-end' }}
            >
              Create Shift
            </Button>
          )}
          <WeekNavigator
            weekRangeLabel={weekRangeLabel}
            onPreviousWeek={handlePreviousWeek}
            onNextWeek={handleNextWeek}
          />
          {isEmployee && (
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
          {isEmployee && (
            <MyCoverageRequestsSection
              myRequests={myCoverageRequests}
              shifts={allShifts}
              users={users}
            />
          )}
          {isManager && (
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
              markCoverageNeededErrorMessage={markCoverageNeededErrorMessage}
              requestToCoverErrorMessage={requestToCoverErrorMessage}
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
          {createShiftDialogOpen && (
            <CreateShiftDialog
              open={createShiftDialogOpen}
              users={users}
              onCreateShift={handleCreateShift}
              onClose={handleCreateShiftDialogClose}
              createShiftErrorMessage={createShiftErrorMessage}
            />
          )}
        </>
      )}
    </Box>
  )
}
