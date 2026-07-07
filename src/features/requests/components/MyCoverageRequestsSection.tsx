import { Box, Tab, Tabs, Typography } from '@mui/material'
import { EmptyState } from 'src/components/EmptyState'
import { EmployeeCoverageRequestCard } from './EmployeeCoverageRequestCard'
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'
import { useState, type SyntheticEvent } from 'react'
import { useMyCoverageRequestItems } from '../hooks/useMyCoverageRequestItems'

type MyCoverageRequestsSectionProps = {
  pendingRequests: CoverageRequest[]
  reviewedRequests: CoverageRequest[]
  shifts: Shift[]
  users: User[]
}

export const MyCoverageRequestsSection = ({
  pendingRequests,
  reviewedRequests,
  shifts,
  users,
}: MyCoverageRequestsSectionProps) => {
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  const { pendingRequestItems, reviewedRequestItems } =
    useMyCoverageRequestItems({
      pendingRequests,
      reviewedRequests,
      shifts,
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
        My Coverage Requests
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            aria-label="my coverage request tabs"
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
              <EmployeeCoverageRequestCard
                key={item.request.id}
                request={item.request}
                originalAssignedEmployee={item.originalAssignedEmployee}
                targetShift={item.targetShift}
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
              <EmployeeCoverageRequestCard
                key={item.request.id}
                request={item.request}
                originalAssignedEmployee={item.originalAssignedEmployee}
                targetShift={item.targetShift}
              />
            ))
          )}
        </>
      )}
    </Box>
  )
}
