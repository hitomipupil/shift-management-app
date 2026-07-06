import { Box, Tab, Tabs, Typography } from '@mui/material'
import { EmptyState } from 'src/components/EmptyState'
import type { CoverageRequest } from 'src/types/coverageRequests'
import { PendingRequestCard } from 'src/features/requests/PendingRequestCard'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'
import { useMemo, useState, type SyntheticEvent } from 'react'
import { RequestHistoryCard } from './RequestHistoryCard'

type ManagerRequestsSectionProps = {
  pendingRequests: CoverageRequest[]
  allShifts: Shift[]
  users: User[]
  onRequestClick: (request: CoverageRequest) => void
  reviewedCoverageRequests: CoverageRequest[]
}

type PendingRequestItem = {
  targetShift: Shift
  currentAssignedEmployee: User
  requestedEmployee: User
  request: CoverageRequest
}

type ReviewedRequestItem = {
  targetShift: Shift
  requestedEmployee: User
  reviewedManager: User
  originallyAssignedEmployee: User
  request: CoverageRequest
}

export const ManagerRequestsSection = ({
  pendingRequests,
  allShifts,
  users,
  onRequestClick,
  reviewedCoverageRequests,
}: ManagerRequestsSectionProps) => {
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }
  const pendingRequestItems = useMemo<PendingRequestItem[]>(() => {
    return pendingRequests
      .map((req) => {
        const targetShift = allShifts.find((shift) => shift.id === req.shiftId)
        if (!targetShift) {
          return null
        }
        const currentAssignedEmployee = users.find(
          (user) => user.id === targetShift.assignedUserId,
        )
        const requestedEmployee = users.find(
          (user) => user.id === req.requestedByUserId,
        )
        if (!currentAssignedEmployee || !requestedEmployee) {
          return null
        }
        return {
          request: req,
          targetShift,
          currentAssignedEmployee,
          requestedEmployee,
        }
      })
      .filter((item): item is PendingRequestItem => item !== null)
  }, [pendingRequests, allShifts, users])

  const reviewedRequestItems = useMemo<ReviewedRequestItem[]>(() => {
    return reviewedCoverageRequests
      .map((req) => {
        const targetShift = allShifts.find((shift) => shift.id === req.shiftId)
        if (!targetShift) {
          return null
        }
        const requestedEmployee = users.find(
          (user) => user.id === req.requestedByUserId,
        )
        const reviewedManager = users.find(
          (user) => user.id === req.reviewedByUserId,
        )
        const originallyAssignedEmployee = users.find(
          (user) => user.id === req.originalAssignedUserId,
        )
        if (
          !requestedEmployee ||
          !reviewedManager ||
          !originallyAssignedEmployee
        ) {
          return null
        }
        return {
          request: req,
          targetShift,
          requestedEmployee,
          reviewedManager,
          originallyAssignedEmployee,
        }
      })
      .filter((item): item is ReviewedRequestItem => item !== null)
  }, [reviewedCoverageRequests, allShifts, users])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Typography sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        Requests
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            aria-label="request tabs"
          >
            <Tab label="Pending Requests" />
            <Tab label="Request History" />
          </Tabs>
        </Box>
      </Box>

      {selectedTab === 0 && (
        <>
          {pendingRequestItems.length === 0 ? (
            <EmptyState message="No requests" />
          ) : (
            pendingRequestItems.map((item) => (
              <PendingRequestCard
                key={item.request.id}
                pendingRequest={item.request}
                currentAssignedEmployee={item.currentAssignedEmployee}
                requestedEmployee={item.requestedEmployee}
                targetShift={item.targetShift}
                onRequestClick={onRequestClick}
              />
            ))
          )}
        </>
      )}
      {selectedTab === 1 && (
        <>
          {reviewedRequestItems.length === 0 ? (
            <EmptyState message="No request history" />
          ) : (
            reviewedRequestItems.map((item) => (
              <RequestHistoryCard
                key={item.request.id}
                request={item.request}
                targetShift={item.targetShift}
                requestedEmployee={item.requestedEmployee}
                reviewedManager={item.reviewedManager}
                originallyAssignedEmployee={item.originallyAssignedEmployee}
              />
            ))
          )}
        </>
      )}
    </Box>
  )
}
