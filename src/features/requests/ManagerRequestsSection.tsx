import { Box, Tab, Tabs, Typography } from '@mui/material'
import type { CoverageRequest } from '../../types/coverageRequests'
import { PendingRequestCard } from './PendingRequestCard'
import type { Shift } from '../../types/shift'
import type { User } from '../../types/user'
import { useState } from 'react'
import { useCurrentUser } from '../../contexts/useCurrentUser'

type ManagerRequestsSectionProps = {
  pendingRequests: CoverageRequest[]
  shifts: Shift[]
  users: User[]
  onRequestClick: (request: CoverageRequest) => void
}

export const ManagerRequestsSection = ({
  pendingRequests,
  shifts,
  users,
  onRequestClick,
}: ManagerRequestsSectionProps) => {
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }
  const { currentUser } = useCurrentUser()
  if (!currentUser) return
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
            <Tab label="Requests history" />
          </Tabs>
        </Box>
      </Box>

      {selectedTab === 0 && (
        <>
          {pendingRequests.length === 0 ? (
            <Typography color="text.secondary">No requests</Typography>
          ) : (
            pendingRequests.map((req) => {
              const targetShift = shifts.find(
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
        <Typography color="text.secondary">
          Request history will be implemented in US-08.
        </Typography>
      )}
    </>
  )
}
