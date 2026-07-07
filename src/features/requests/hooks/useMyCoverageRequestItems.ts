import { useMemo } from 'react'
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'

type UseMyCoverageRequestItemsParams = {
  myRequests: CoverageRequest[]
  shifts: Shift[]
  users: User[]
}

type MyRequestItem = {
  targetShift: Shift
  originalAssignedEmployee: User
  request: CoverageRequest
}

export const useMyCoverageRequestItems = ({
  myRequests,
  shifts,
  users,
}: UseMyCoverageRequestItemsParams) => {
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

  return {
    pendingRequestItems,
    reviewedRequestItems,
  }
}
