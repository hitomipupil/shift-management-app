import type { User } from 'src/types/user'
import { mockCoverageRequests } from 'src/mocks/mockCoverageRequests'
import { mockShifts } from 'src/mocks/mockShifts'
import type { CoverageRequest } from 'src/types/coverageRequests'

export const getPendingCoverageRequests = async (): Promise<
  CoverageRequest[]
> => {
  return mockCoverageRequests.filter((req) => req.status === 'pending')
}

export const getRequestsByUser = async (
  userId: string,
): Promise<CoverageRequest[]> => {
  return mockCoverageRequests.filter((req) => req.requestedByUserId === userId)
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
  currentUser: User,
): Promise<CoverageRequest> => {
  if (currentUser.role !== 'employee') {
    throw new Error('Only employees can request coverage')
  }
  const requestedByUserId = currentUser.id
  const targetShift = mockShifts.find((shift) => shift.id === shiftId)
  if (!targetShift) {
    throw new Error('Shift not found')
  }
  if (targetShift.coverageNeeded === false) {
    throw new Error('This shift does not need coverage')
  }
  if (targetShift.assignedUserId === currentUser.id) {
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

export const approveCoverageRequest = async (
  requestId: string,
  currentUser: User,
): Promise<CoverageRequest> => {
  if (currentUser.role !== 'manager') {
    throw new Error('Only managers can approve requests')
  }
  const targetRequest = mockCoverageRequests.find((req) => req.id === requestId)
  if (!targetRequest) {
    throw new Error('Request not found')
  }
  if (targetRequest.status !== 'pending') {
    throw new Error('Request is no longer pending')
  }
  const targetShift = mockShifts.find(
    (shift) => shift.id === targetRequest.shiftId,
  )
  if (!targetShift) {
    throw new Error('Shift not found')
  }
  if (targetShift.assignedUserId !== targetRequest.originalAssignedUserId) {
    throw new Error('Shift is no longer assigned to the original employee')
  }

  const requesterShifts = mockShifts.filter(
    (shift) => shift.assignedUserId === targetRequest.requestedByUserId,
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
    throw new Error('Requested user already has an overlapping shift')
  }

  targetRequest.status = 'approved'
  targetRequest.reviewedByUserId = currentUser.id
  targetRequest.reviewedAt = new Date().toISOString()

  targetShift.assignedUserId = targetRequest.requestedByUserId
  targetShift.coverageNeeded = false

  return targetRequest
}

export const rejectCoverageRequest = async (
  requestId: string,
  currentUser: User,
): Promise<CoverageRequest> => {
  if (currentUser.role !== 'manager') {
    throw new Error('Only managers can reject requests')
  }
  const targetRequest = mockCoverageRequests.find((req) => req.id === requestId)
  if (!targetRequest) {
    throw new Error('Request not found')
  }
  if (targetRequest.status !== 'pending') {
    throw new Error('Request is no longer pending')
  }

  targetRequest.status = 'rejected'
  targetRequest.reviewedByUserId = currentUser.id
  targetRequest.reviewedAt = new Date().toISOString()

  return targetRequest
}
