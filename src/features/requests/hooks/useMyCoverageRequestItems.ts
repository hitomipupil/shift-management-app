import { useMemo } from 'react'
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'

type UseMyCoverageRequestItemsParams = {
  pendingRequests: CoverageRequest[]
  reviewedRequests: CoverageRequest[]
  shifts: Shift[]
  users: User[]
}

type MyRequestItem = {
  targetShift: Shift
  originalAssignedEmployee: User
  request: CoverageRequest
}

const buildMyRequestItems = (
  requests: CoverageRequest[],
  shifts: Shift[],
  users: User[],
): MyRequestItem[] => {
  return requests.map((req) => {
    const targetShift = shifts.find((shift) => shift.id === req.shiftId)

    if (!targetShift) {
      throw new Error('shift not found')
    }

    const originalAssignedEmployee = users.find(
      (user) => user.id === req.originalAssignedUserId,
    )

    if (!originalAssignedEmployee) {
      throw new Error('original assigned employee not found')
    }

    return { request: req, targetShift, originalAssignedEmployee }
  })
}

export const useMyCoverageRequestItems = ({
  pendingRequests,
  reviewedRequests,
  shifts,
  users,
}: UseMyCoverageRequestItemsParams) => {
  const pendingRequestItems = useMemo<MyRequestItem[]>(() => {
    return buildMyRequestItems(pendingRequests, shifts, users)
  }, [pendingRequests, shifts, users])

  const reviewedRequestItems = useMemo<MyRequestItem[]>(() => {
    return buildMyRequestItems(reviewedRequests, shifts, users)
  }, [reviewedRequests, shifts, users])

  return {
    pendingRequestItems,
    reviewedRequestItems,
  }
}
