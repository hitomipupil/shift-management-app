import { HttpsError } from 'firebase-functions/https'
import { db } from './firestore'

const hasOverlappingTime = (
  targetStartTime: string,
  targetEndTime: string,
  existingStartTime: string,
  existingEndTime: string,
) => {
  return targetStartTime < existingEndTime && targetEndTime > existingStartTime
}

export const approveCoverageRequestTransaction = async (
  requestId: string,
  managerId: string,
) => {
  const coverageRequestRef = db.collection('coverageRequests').doc(requestId)
  await db.runTransaction(async (transaction) => {
    const coverageRequestSnapshot = await transaction.get(coverageRequestRef)
    if (!coverageRequestSnapshot.exists) {
      throw new HttpsError('not-found', 'Coverage request was not found')
    }
    const coverageRequest = coverageRequestSnapshot.data()
    if (!coverageRequest) {
      throw new HttpsError('not-found', 'Coverage request was not found')
    }
    if (coverageRequest.status !== 'pending') {
      throw new HttpsError(
        'failed-precondition',
        'Request is no longer pending',
      )
    }
    const { shiftId, requestedByUserId, originalAssignedUserId } =
      coverageRequest
    if (typeof shiftId !== 'string') {
      throw new HttpsError('failed-precondition', 'shiftId is invalid')
    }
    if (typeof requestedByUserId !== 'string') {
      throw new HttpsError(
        'failed-precondition',
        'requestedByUserId is invalid',
      )
    }
    if (typeof originalAssignedUserId !== 'string') {
      throw new HttpsError(
        'failed-precondition',
        'originalAssignedUserId is invalid',
      )
    }

    const shiftRef = db.collection('shifts').doc(shiftId)
    const shiftSnapshot = await transaction.get(shiftRef)
    if (!shiftSnapshot.exists) {
      throw new HttpsError('not-found', 'Target shift was not found')
    }
    const shift = shiftSnapshot.data()
    if (!shift) {
      throw new HttpsError('not-found', 'Target shift was not found')
    }
    if (typeof shift.assignedUserId !== 'string') {
      throw new HttpsError('failed-precondition', 'assignedUserId is invalid')
    }
    if (requestedByUserId === originalAssignedUserId) {
      throw new HttpsError(
        'failed-precondition',
        'Original employee cannot request to cover their own shift',
      )
    }
    if (shift.assignedUserId !== originalAssignedUserId) {
      throw new HttpsError(
        'failed-precondition',
        'Shift is no longer assigned to the original employee',
      )
    }

    if (shift.coverageNeeded !== true) {
      throw new HttpsError(
        'failed-precondition',
        'Shift is no longer marked as coverage needed',
      )
    }

    if (typeof shift.date !== 'string') {
      throw new HttpsError('failed-precondition', 'date is invalid')
    }

    if (typeof shift.startTime !== 'string') {
      throw new HttpsError('failed-precondition', 'startTime is invalid')
    }

    if (typeof shift.endTime !== 'string') {
      throw new HttpsError('failed-precondition', 'endTime is invalid')
    }

    const requesterShiftsQuery = db
      .collection('shifts')
      .where('assignedUserId', '==', requestedByUserId)
      .where('date', '==', shift.date)

    const requesterShiftsSnapshot = await transaction.get(requesterShiftsQuery)
    const requesterShifts = requesterShiftsSnapshot.docs.map(
      (shiftDocument) => {
        const data = shiftDocument.data()

        if (typeof data.startTime !== 'string') {
          throw new HttpsError(
            'failed-precondition',
            'Requester shift startTime is invalid',
          )
        }

        if (typeof data.endTime !== 'string') {
          throw new HttpsError(
            'failed-precondition',
            'Requester shift endTime is invalid',
          )
        }

        return {
          startTime: data.startTime,
          endTime: data.endTime,
        }
      },
    )
    const hasOverlappingShift = requesterShifts.some((requestersShift) => {
      return hasOverlappingTime(
        shift.startTime,
        shift.endTime,
        requestersShift.startTime,
        requestersShift.endTime,
      )
    })

    if (hasOverlappingShift) {
      throw new HttpsError(
        'failed-precondition',
        'Requested user already has an overlapping shift',
      )
    }

    transaction.update(coverageRequestRef, {
      status: 'approved',
      reviewedByUserId: managerId,
      reviewedAt: new Date().toISOString(),
    })

    transaction.update(shiftRef, {
      assignedUserId: requestedByUserId,
      coverageNeeded: false,
    })
  })
}
