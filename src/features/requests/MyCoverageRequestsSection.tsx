import { Box, Tab, Tabs, Typography } from '@mui/material'
import { EmptyState } from 'src/components/EmptyState'
import { MyCoverageRequestCard } from './MyCoverageRequestCard'
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'
import { useMemo, useState, type SyntheticEvent } from 'react'

type MyCoverageRequestsSectionProps = {
  myRequests: CoverageRequest[]
  shifts: Shift[]
  users: User[]
}

type MyRequestItem = {
  targetShift: Shift
  originalAssignedEmployee: User
  request: CoverageRequest
}

export const MyCoverageRequestsSection = ({
  myRequests,
  shifts,
  users,
}: MyCoverageRequestsSectionProps) => {
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  const myRequestItems = useMemo<MyRequestItem[]>(() => {
    return myRequests.map((req) => {
      const targetShift = shifts.find((shift) => shift.id === req.shiftId)
      if (!targetShift) {
        throw new Error('shift not found')
      }
      const originalAssignedEmployee = users.find(
        (user) => user.id === req.originalAssignedUserId,
      )
      if (!originalAssignedEmployee) {
        throw new Error('shift not found')
      }
      return { request: req, targetShift, originalAssignedEmployee }
    })
  }, [myRequests, shifts, users])

  const pendingRequestItems = useMemo<MyRequestItem[]>(() => {
    return myRequestItems.filter((item) => item.request.status === 'pending')
  }, [myRequestItems])

  const reviewedRequestItems = useMemo<MyRequestItem[]>(() => {
    return myRequestItems.filter((item) => item.request.status !== 'pending')
  }, [myRequestItems])

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
              <MyCoverageRequestCard
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
              <MyCoverageRequestCard
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
