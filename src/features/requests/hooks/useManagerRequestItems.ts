import { useMemo } from 'react'
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'

type UseManagerRequestItemsParams = {
  pendingRequests: CoverageRequest[]
  reviewedCoverageRequests: CoverageRequest[]
  allShifts: Shift[]
  users: User[]
}

type ManagerRequestItem = {
  request: CoverageRequest
  targetShift: Shift
  assignedEmployee: User
  requestedEmployee: User
}

type ReviewedManagerRequestItem = ManagerRequestItem & {
  reviewedManager: User
}

export const useManagerRequestItems = ({
  pendingRequests,
  reviewedCoverageRequests,
  allShifts,
  users,
}: UseManagerRequestItemsParams) => {
  const pendingRequestItems = useMemo<ManagerRequestItem[]>(() => {
    return pendingRequests
      .map((req) => {
        const targetShift = allShifts.find((shift) => shift.id === req.shiftId)
        if (!targetShift) {
          return null
        }
        const assignedEmployee = users.find(
          (user) => user.id === targetShift.assignedUserId,
        )
        const requestedEmployee = users.find(
          (user) => user.id === req.requestedByUserId,
        )
        if (!assignedEmployee || !requestedEmployee) {
          return null
        }
        return {
          request: req,
          targetShift,
          assignedEmployee,
          requestedEmployee,
        }
      })
      .filter((item): item is ManagerRequestItem => item !== null)
  }, [pendingRequests, allShifts, users])

  const reviewedRequestItems = useMemo<ReviewedManagerRequestItem[]>(() => {
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
        const assignedEmployee = users.find(
          (user) => user.id === req.originalAssignedUserId,
        )
        if (!requestedEmployee || !reviewedManager || !assignedEmployee) {
          return null
        }
        return {
          request: req,
          targetShift,
          assignedEmployee,
          requestedEmployee,
          reviewedManager,
        }
      })
      .filter((item): item is ReviewedManagerRequestItem => item !== null)
  }, [reviewedCoverageRequests, allShifts, users])

  return {
    pendingRequestItems,
    reviewedRequestItems,
  }
}
