import type { User } from 'src/types/user'
import { mockCoverageRequests } from 'src/mocks/mockCoverageRequests'
import { mockShifts } from 'src/mocks/mockShifts'
import type { CoverageRequest } from 'src/types/coverageRequests'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from 'src/firebase'
import type { Shift } from 'src/types/shift'

const getAllCoverageRequests = async (): Promise<CoverageRequest[]> => {
  const requestsSnapshot = await getDocs(collection(db, 'coverageRequests'))

  return requestsSnapshot.docs.map((requestDocument) => {
    const data = requestDocument.data()

    return {
      id: requestDocument.id,
      shiftId: data.shiftId,
      originalAssignedUserId: data.originalAssignedUserId,
      requestedByUserId: data.requestedByUserId,
      status: data.status,
      reviewedByUserId: data.reviewedByUserId,
      reviewedAt: data.reviewedAt,
      createdAt: data.createdAt,
    } as CoverageRequest
  })
}

export const getPendingCoverageRequests = async (): Promise<
  CoverageRequest[]
> => {
  const requests = await getAllCoverageRequests()
  return requests.filter((req) => req.status === 'pending')
}
export const getRequestsByUser = async (
  userId: string,
): Promise<CoverageRequest[]> => {
  const requests = await getAllCoverageRequests()
  return requests.filter((req) => req.requestedByUserId === userId)
}

export const getReviewedCoverageRequests = async (): Promise<
  CoverageRequest[]
> => {
  const requests = await getAllCoverageRequests()
  const reviewedRequests = requests.filter(
    (req) => req.status === 'approved' || req.status === 'rejected',
  )
  return reviewedRequests.sort((a, b) => {
    if (!a.reviewedAt || !b.reviewedAt) {
      return 0
    }
    return Date.parse(b.reviewedAt) - Date.parse(a.reviewedAt)
  })
}

const hasOverlappingTime = (
  targetStartTime: string,
  targetEndTime: string,
  existingStartTime: string,
  existingEndTime: string,
) => {
  return targetStartTime < existingEndTime && targetEndTime > existingStartTime
}

const getShiftById = async (shiftId: string): Promise<Shift | null> => {
  const shiftSnapshot = await getDoc(doc(db, 'shifts', shiftId))

  if (!shiftSnapshot.exists()) {
    return null
  }

  const data = shiftSnapshot.data()

  return {
    id: shiftSnapshot.id,
    assignedUserId: data.assignedUserId,
    coverageNeeded: data.coverageNeeded,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
  } as Shift
}

export const createCoverageRequest = async (
  shiftId: string,
  currentUser: User,
): Promise<CoverageRequest> => {
  if (currentUser.role !== 'employee') {
    throw new Error('Only employees can request coverage')
  }
  const requestedByUserId = currentUser.id
  const targetShift = await getShiftById(shiftId)
  if (!targetShift) {
    throw new Error('Shift not found')
  }
  if (targetShift.coverageNeeded === false) {
    throw new Error('This shift does not need coverage')
  }
  if (targetShift.assignedUserId === currentUser.id) {
    throw new Error('You cannot request your own shift')
  }

  const existingPendingRequestQuery = query(
    collection(db, 'coverageRequests'),
    where('shiftId', '==', shiftId),
    where('status', '==', 'pending'),
  )

  const existingPendingRequestSnapshot = await getDocs(
    existingPendingRequestQuery,
  )
  if (!existingPendingRequestSnapshot.empty) {
    throw new Error('This shift has already a pending request')
  }

  const requesterPendingRequestsQuery = query(
    collection(db, 'coverageRequests'),
    where('requestedByUserId', '==', requestedByUserId),
    where('status', '==', 'pending'),
  )

  const requesterPendingRequestsSnapshot = await getDocs(
    requesterPendingRequestsQuery,
  )

  const requesterPendingRequests = requesterPendingRequestsSnapshot.docs.map(
    (requestDocument) => {
      const data = requestDocument.data()

      return {
        id: requestDocument.id,
        shiftId: data.shiftId,
        originalAssignedUserId: data.originalAssignedUserId,
        requestedByUserId: data.requestedByUserId,
        status: data.status,
        reviewedByUserId: data.reviewedByUserId,
        reviewedAt: data.reviewedAt,
        createdAt: data.createdAt,
      } as CoverageRequest
    },
  )

  const requesterPendingRequestShifts = await Promise.all(
    requesterPendingRequests.map((request) => getShiftById(request.shiftId)),
  )

  const existingPendingRequestShifts = requesterPendingRequestShifts.filter(
    (shift): shift is Shift => shift !== null,
  )

  const hasOverlappingPendingRequest = existingPendingRequestShifts.some(
    (shift) => {
      if (shift.date !== targetShift.date) {
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

  const requesterShiftsQuery = query(
    collection(db, 'shifts'),
    where('assignedUserId', '==', requestedByUserId),
    where('date', '==', targetShift.date),
  )

  const requesterShiftsSnapshot = await getDocs(requesterShiftsQuery)

  const requesterShifts = requesterShiftsSnapshot.docs.map((shiftDoc) => {
    const data = shiftDoc.data()
    return {
      id: shiftDoc.id,
      assignedUserId: data.assignedUserId,
      coverageNeeded: data.coverageNeeded,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
    } as Shift
  })

  const hasOverlappingShift = requesterShifts.some((shift) => {
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

  const newRequestData = {
    shiftId,
    originalAssignedUserId: targetShift.assignedUserId,
    requestedByUserId,
    status: 'pending' as const,
    reviewedByUserId: null,
    reviewedAt: null,
    createdAt: new Date().toISOString(),
  }

  const requestDocumentRef = await addDoc(
    collection(db, 'coverageRequests'),
    newRequestData,
  )

  return {
    id: requestDocumentRef.id,
    ...newRequestData,
  }
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
    if (shift.date !== targetShift.date) {
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
  const requestRef = doc(db, 'coverageRequests', requestId)
  const requestSnapshot = await getDoc(requestRef)
  if (!requestSnapshot.exists()) {
    throw new Error('Request not found')
  }
  const data = requestSnapshot.data()
  if (data.status !== 'pending') {
    throw new Error('Request is no longer pending')
  }

  await updateDoc(requestRef, {
    status: 'rejected',
    reviewedByUserId: currentUser.id,
    reviewedAt: new Date().toISOString(),
  })

  return {
    id: requestSnapshot.id,
    shiftId: data.shiftId,
    originalAssignedUserId: data.originalAssignedUserId,
    requestedByUserId: data.requestedByUserId,
    status: 'rejected',
    reviewedByUserId: currentUser.id,
    reviewedAt: data.reviewedAt,
    createdAt: data.createdAt,
  }
}
