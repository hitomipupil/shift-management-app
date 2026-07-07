import { useMemo } from 'react'
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'

type UseManagerRequestItemsParams = {
  pendingCoverageRequests: CoverageRequest[]
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
  pendingCoverageRequests,
  reviewedCoverageRequests,
  allShifts,
  users,
}: UseManagerRequestItemsParams) => {
  const pendingRequestItems = useMemo<ManagerRequestItem[]>(() => {
    return pendingCoverageRequests.map((req) => {
      const targetShift = allShifts.find((shift) => shift.id === req.shiftId)
      if (!targetShift) {
        throw new Error('shift not found')
      }
      const assignedEmployee = users.find(
        (user) => user.id === targetShift.assignedUserId,
      )
      if (!assignedEmployee) {
        throw new Error('assigned employee not found')
      }
      const requestedEmployee = users.find(
        (user) => user.id === req.requestedByUserId,
      )
      if (!requestedEmployee) {
        throw new Error('requested employee not found')
      }
      return {
        request: req,
        targetShift,
        assignedEmployee,
        requestedEmployee,
      }
    })
  }, [pendingCoverageRequests, allShifts, users])

  const reviewedRequestItems = useMemo<ReviewedManagerRequestItem[]>(() => {
    return reviewedCoverageRequests.map((req) => {
      const targetShift = allShifts.find((shift) => shift.id === req.shiftId)
      if (!targetShift) {
        throw new Error('shift not found')
      }
      const requestedEmployee = users.find(
        (user) => user.id === req.requestedByUserId,
      )
      if (!requestedEmployee) {
        throw new Error('requested employee not found')
      }
      const reviewedManager = users.find(
        (user) => user.id === req.reviewedByUserId,
      )
      if (!reviewedManager) {
        throw new Error('reviewed manager not found')
      }
      const assignedEmployee = users.find(
        (user) => user.id === req.originalAssignedUserId,
      )
      if (!assignedEmployee) {
        throw new Error('original assigned employee not found')
      }
      return {
        request: req,
        targetShift,
        assignedEmployee,
        requestedEmployee,
        reviewedManager,
      }
    })
  }, [reviewedCoverageRequests, allShifts, users])

  return {
    pendingRequestItems,
    reviewedRequestItems,
  }
}
