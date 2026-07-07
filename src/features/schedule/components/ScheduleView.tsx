import { Box, Button, CircularProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { WeekNavigator } from 'src/features/schedule/components/WeekNavigator'
import { MyShiftsSection } from 'src/features/schedule/components/MyShiftsSection'
import { WeeklyScheduleSection } from 'src/features/schedule/components/WeeklyScheduleSection'
import { useCurrentUser } from 'src/contexts/useCurrentUser'
import { useMemo, useState } from 'react'
import {
  createShift,
  getAllShifts,
  getShiftsByWeek,
  markShiftAsCoverageNeeded,
} from 'src/services/shiftService'
import { ShiftDetailsDialog } from 'src/features/schedule/components/ShiftDetailsDialog'
import {
  approveCoverageRequest,
  createCoverageRequest,
  getPendingCoverageRequests,
  getPendingCoverageRequestsByUser,
  getReviewedCoverageRequests,
  rejectCoverageRequest,
} from 'src/services/coverageRequestService'
import { useDisplayedWeek } from 'src/features/schedule/hooks/useDisplayedWeek'
import { useScheduleData } from '../hooks/useScheduleData'
import { useWeekShifts } from '../hooks/useWeekShifts'
import { CreateShiftDialog } from './CreateShiftDialog'
import { useSelectedShiftDialog } from '../hooks/useSelectedShiftDialog'
import { useSelectedRequestDialog } from '../hooks/useSelectedRequestDialog'
import { ManagerRequestsSection } from '../../requests/components/ManagerRequestsSection'
import { MyCoverageRequestsSection } from '../../requests/components/MyCoverageRequestsSection'
import { RequestDetailsDialog } from '../../requests/components/RequestDetailsDialog'

export const ScheduleView = () => {
  const { currentUser } = useCurrentUser()
  const [createShiftDialogOpen, setCreateShiftDialogOpen] =
    useState<boolean>(false)
  const [createShiftErrorMessage, setCreateShiftErrorMessage] = useState<
    string | null
  >(null)
  const {
    weekStartDate,
    weekRangeLabel,
    isCurrentWeek,
    handlePreviousWeek,
    handleNextWeek,
    handleToday,
  } = useDisplayedWeek()
  const { shiftsOfThisWeek, setShiftsOfThisWeek, isWeekLoading } =
    useWeekShifts(currentUser, weekStartDate)
  const {
    allShifts,
    setAllShifts,
    users,
    pendingCoverageRequests,
    setPendingCoverageRequests,
    isLoading,
    myPendingCoverageRequests,
    setMyPendingCoverageRequests,
    myReviewedCoverageRequests,
    reviewedCoverageRequests,
    setReviewedCoverageRequests,
  } = useScheduleData(currentUser)

  if (!currentUser) {
    throw new Error('Current user is required to view schedule')
  }

  const {
    selectedShift,
    setSelectedShift,
    selectedShiftAssignedUser,
    isSelectedShiftRequestPending,
    markCoverageNeededErrorMessage,
    setMarkCoverageNeededErrorMessage,
    requestToCoverErrorMessage,
    setRequestToCoverErrorMessage,
    handleOpenShiftDetails,
    handleCloseShiftDetails,
  } = useSelectedShiftDialog({
    users,
    pendingCoverageRequests,
  })

  const {
    selectedRequest,
    setSelectedRequest,
    selectedRequestTargetShift,
    currentAssignedEmployee,
    requestedEmployee,
    requestReviewErrorMessage,
    setRequestReviewErrorMessage,
    handleOpenRequestDetails,
    handleCloseRequestDetails,
  } = useSelectedRequestDialog({
    users,
    allShifts,
  })

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
      const [updatedCoverageRequests, updatedMyPendingCoverageRequests] =
        await Promise.all([
          getPendingCoverageRequests(),
          getPendingCoverageRequestsByUser(currentUser.id),
        ])
      setPendingCoverageRequests(updatedCoverageRequests)
      setMyPendingCoverageRequests(updatedMyPendingCoverageRequests)
    } catch (e) {
      if (e instanceof Error) {
        setRequestToCoverErrorMessage(e.message)
      } else {
        setRequestToCoverErrorMessage('Something went wrong')
      }
    }
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
        p: { xs: 1.5, sm: 2, md: 3 },
        width: '100%',
        maxWidth: 900,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 3, md: 5 },
      }}
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { sm: 'center' },
              gap: { xs: 2, sm: 1 },
            }}
          >
            <Box sx={{ flex: 1 }}>
              <WeekNavigator
                weekRangeLabel={weekRangeLabel}
                isCurrentWeek={isCurrentWeek}
                onPreviousWeek={handlePreviousWeek}
                onNextWeek={handleNextWeek}
                onToday={handleToday}
              />
            </Box>
            {isManager && (
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => setCreateShiftDialogOpen(true)}
                sx={{ alignSelf: { xs: 'flex-end', sm: 'auto' } }}
              >
                Create Shift
              </Button>
            )}
          </Box>
          {isWeekLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <>
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
            </>
          )}
          {isEmployee && (
            <MyCoverageRequestsSection
              pendingRequests={myPendingCoverageRequests}
              reviewedRequests={myReviewedCoverageRequests}
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
