import { Typography } from '@mui/material'
import type { CoverageRequest } from 'src/types/coverageRequests'
import { PendingRequestCard } from './PendingRequestCard'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'

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
  return (
    <>
      <Typography>Pending Coverage Requests</Typography>
      {pendingRequests.length === 0 ? (
        <Typography color="text.secondary">No requests</Typography>
      ) : (
        pendingRequests.map((req) => {
          const targetShift = shifts.find((shift) => shift.id === req.shiftId)
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
  )
}
