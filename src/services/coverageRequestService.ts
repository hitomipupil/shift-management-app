import { mockCoverageRequests } from '../mocks/mockCoverageRequests'
import { mockShifts } from '../mocks/mockShifts'
import type { CoverageRequest } from '../types/coverageRequests'

export const getPendingCoverageRequests = async (): Promise<
  CoverageRequest[]
> => {
  return mockCoverageRequests.filter((req) => req.status === 'pending')
}

const hasOverlappingTime = (
  targetStartTime: string,
  targetEndTime: string,
  existingStartTime: string,
  existingEndTime: string,
) => {
  return targetStartTime < existingEndTime && targetEndTime > existingStartTime
}

export const createCoverageRequest = async (
  shiftId: string,
  requestedByUserId: string,
): Promise<CoverageRequest> => {
  const targetShift = mockShifts.find((shift) => shift.id === shiftId)
  if (!targetShift) {
    throw new Error('Shift not found')
  }
  if (targetShift.coverageNeeded === false) {
    throw new Error('This shift does not need coverage')
  }
  if (targetShift.assignedUserId === requestedByUserId) {
    throw new Error('You cannot request your own shift')
  }

  const pendingRequests = await getPendingCoverageRequests()
  const hasPendingRequest = pendingRequests.some(
    (request) => request.shiftId === targetShift.id,
  )
  if (hasPendingRequest) {
    throw new Error('This shift has already a pending request')
  }

  const requesterPendingRequests = pendingRequests.filter(
    (request) => request.requestedByUserId === requestedByUserId,
  )

  const requesterPendingRequestShifts = requesterPendingRequests
    .map((request) => mockShifts.find((shift) => shift.id === request.shiftId))
    .filter((shift) => shift !== undefined)

  const hasOverlappingPendingRequest = requesterPendingRequestShifts.some(
    (shift) => {
      if (shift.day !== targetShift.day) {
        return false
      }

      return hasOverlappingTime(
        targetShift.startTime,
        targetShift.endTime,
        shift.startTime,
        shift.endTime,
      )
    },
  )
  if (hasOverlappingPendingRequest) {
    throw new Error(
      'You already have a pending request for another shift at this time',
    )
  }

  const requesterShifts = mockShifts.filter(
    (shift) => shift.assignedUserId === requestedByUserId,
  )

  const hasOverlappingShift = requesterShifts.some((shift) => {
    if (shift.day !== targetShift.day) {
      return false
    }

    return hasOverlappingTime(
      targetShift.startTime,
      targetShift.endTime,
      shift.startTime,
      shift.endTime,
    )
  })

  if (hasOverlappingShift) {
    throw new Error('You already have an overlapping shift')
  }

  const request: CoverageRequest = {
    id: `request-${Date.now()}`,
    shiftId,
    originalAssignedUserId: targetShift.assignedUserId,
    requestedByUserId,
    status: 'pending',
    reviewedByUserId: null,
    reviewedAt: null,
    createdAt: new Date().toISOString(),
  }

  mockCoverageRequests.push(request)
  return request
}
