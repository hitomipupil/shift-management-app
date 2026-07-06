import { Typography } from '@mui/material'
import { MyCoverageRequestCard } from './MyCoverageRequestCard'
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'
import { useCallback } from 'react'

type MyCoverageRequestsSectionProps = {
  myRequests: CoverageRequest[]
  shifts: Shift[]
  users: User[]
}

type MyRequestData = {
  targetShift: Shift
  originalAssignedEmployee: User
}

export const MyCoverageRequestsSection = ({
  myRequests,
  shifts,
  users,
}: MyCoverageRequestsSectionProps) => {
  const getMyRequestData = useCallback(
    (req: CoverageRequest): MyRequestData => {
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
      return { targetShift, originalAssignedEmployee }
    },
    [shifts, users],
  )
  return (
    <>
      <Typography>My Coverage Requests</Typography>
      {myRequests.length === 0 ? (
        <Typography color="text.secondary">No requests</Typography>
      ) : (
        myRequests.map((req) => {
          const { targetShift, originalAssignedEmployee } = getMyRequestData(req)
          return (
            <MyCoverageRequestCard
              key={req.id}
              request={req}
              originalAssignedEmployee={originalAssignedEmployee}
              targetShift={targetShift}
            />
          )
        })
      )}
    </>
  )
}
