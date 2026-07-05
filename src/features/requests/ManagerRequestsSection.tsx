import { Box, Tab, Tabs, Typography } from '@mui/material'
import type { CoverageRequest } from 'src/types/coverageRequests'
import { PendingRequestCard } from 'src/features/requests/PendingRequestCard'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'
import { useState, type SyntheticEvent } from 'react'
import { RequestHistoryCard } from './RequestHistoryCard'

type ManagerRequestsSectionProps = {
  pendingRequests: CoverageRequest[]
  allShifts: Shift[]
  users: User[]
  onRequestClick: (request: CoverageRequest) => void
  reviewedCoverageRequests: CoverageRequest[]
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
  return (
    <>
      <Typography>Requests</Typography>
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
          {pendingRequests.length === 0 ? (
            <Typography color="text.secondary">No requests</Typography>
          ) : (
            pendingRequests.map((req) => {
              const targetShift = allShifts.find(
                (shift) => shift.id === req.shiftId,
              )
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
              return (
                <PendingRequestCard
                  key={req.id}
                  pendingRequest={req}
                  currentAssignedEmployee={currentAssignedEmployee}
                  requestedEmployee={requestedEmployee}
                  targetShift={targetShift}
                  onRequestClick={onRequestClick}
                />
              )
            })
          )}
        </>
      )}
      {selectedTab === 1 && (
        <>
          {reviewedCoverageRequests.length === 0 ? (
            <Typography color="text.secondary">No request history</Typography>
          ) : (
            reviewedCoverageRequests.map((req) => {
              const targetShift = allShifts.find(
                (shift) => shift.id === req.shiftId,
              )
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
              return (
                <RequestHistoryCard
                  key={req.id}
                  request={req}
                  targetShift={targetShift}
                  requestedEmployee={requestedEmployee}
                  reviewedManager={reviewedManager}
                  originallyAssignedEmployee={originallyAssignedEmployee}
                />
              )
            })
          )}
        </>
      )}
    </>
  )
}
