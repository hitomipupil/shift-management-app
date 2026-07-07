import { Box, Tab, Tabs, Typography } from '@mui/material'
import { EmptyState } from 'src/components/EmptyState'
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'
import { useState, type SyntheticEvent } from 'react'
import { ManagerCoverageRequestCard } from './ManagerCoverageRequestCard'
import { useManagerRequestItems } from '../hooks/useManagerRequestItems'

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
  const { pendingRequestItems, reviewedRequestItems } = useManagerRequestItems({
    pendingRequests,
    reviewedCoverageRequests,
    allShifts,
    users,
  })

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
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
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
              <ManagerCoverageRequestCard
                key={item.request.id}
                request={item.request}
                targetShift={item.targetShift}
                assignedEmployee={item.assignedEmployee}
                requestedEmployee={item.requestedEmployee}
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
              <ManagerCoverageRequestCard
                key={item.request.id}
                request={item.request}
                targetShift={item.targetShift}
                assignedEmployee={item.assignedEmployee}
                requestedEmployee={item.requestedEmployee}
                reviewedManager={item.reviewedManager}
              />
            ))
          )}
        </>
      )}
    </Box>
  )
}
