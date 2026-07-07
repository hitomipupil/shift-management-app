import type { User } from 'src/types/user'
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
  type QueryDocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore'
import { db } from 'src/firebase'
import type { Shift } from 'src/types/shift'
import { httpsCallable } from 'firebase/functions'
import { functions } from 'src/firebase'
import { isPastShift } from 'src/utils/isPastShift'

const mapCoverageRequestDocument = (
  requestDocument: QueryDocumentSnapshot<DocumentData>,
): CoverageRequest => {
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
}

export const getPendingCoverageRequests = async (): Promise<
  CoverageRequest[]
> => {
  const requestsQuery = query(
    collection(db, 'coverageRequests'),
    where('status', '==', 'pending'),
  )
  const requestsSnapshot = await getDocs(requestsQuery)
  return requestsSnapshot.docs.map(mapCoverageRequestDocument)
}

export const getPendingCoverageRequestsByUser = async (
  userId: string,
): Promise<CoverageRequest[]> => {
  const requestsQuery = query(
    collection(db, 'coverageRequests'),
    where('requestedByUserId', '==', userId),
    where('status', '==', 'pending'),
  )

  const requestsSnapshot = await getDocs(requestsQuery)

  return requestsSnapshot.docs.map(mapCoverageRequestDocument)
}

export const getReviewedCoverageRequests = async (): Promise<
  CoverageRequest[]
> => {
  const requestsQuery = query(
    collection(db, 'coverageRequests'),
    where('status', 'in', ['approved', 'rejected']),
  )
  const requestsSnapshot = await getDocs(requestsQuery)
  const reviewedRequests = requestsSnapshot.docs.map(mapCoverageRequestDocument)
  return reviewedRequests.sort((a, b) => {
    if (!a.reviewedAt || !b.reviewedAt) {
      return 0
    }

    return Date.parse(b.reviewedAt) - Date.parse(a.reviewedAt)
  })
}

export const getReviewedCoverageRequestsByUser = async (
  userId: string,
): Promise<CoverageRequest[]> => {
  const requestsQuery = query(
    collection(db, 'coverageRequests'),
    where('requestedByUserId', '==', userId),
    where('status', 'in', ['approved', 'rejected']),
  )

  const requestsSnapshot = await getDocs(requestsQuery)
  const reviewedRequests = requestsSnapshot.docs.map(mapCoverageRequestDocument)
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
  if (isPastShift(targetShift)) {
    throw new Error('Cannot modify a past shift')
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
    mapCoverageRequestDocument,
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

type ApproveCoverageRequestData = {
  requestId: string
}

type ApproveCoverageRequestResult = {
  success: boolean
}

export const approveCoverageRequest = async (
  requestId: string,
): Promise<void> => {
  const approveCoverageRequestCallable = httpsCallable<
    ApproveCoverageRequestData,
    ApproveCoverageRequestResult
  >(functions, 'approveCoverageRequest')

  await approveCoverageRequestCallable({ requestId })
}

export const rejectCoverageRequest = async (
  requestId: string,
  currentUser: User,
): Promise<CoverageRequest> => {
  if (currentUser.role !== 'manager') {
    throw new Error('Only managers can reject requests')
  }
  const reviewedAt = new Date().toISOString()
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
    reviewedAt,
  })

  return {
    id: requestSnapshot.id,
    shiftId: data.shiftId,
    originalAssignedUserId: data.originalAssignedUserId,
    requestedByUserId: data.requestedByUserId,
    status: 'rejected',
    reviewedByUserId: currentUser.id,
    reviewedAt,
    createdAt: data.createdAt,
  }
}
