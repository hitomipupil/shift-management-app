import { HttpsError, onCall } from 'firebase-functions/https'
import { approveCoverageRequestService } from '../service/coverageRequestService'

export const approveCoverageRequest = onCall(async (request) => {
  const managerId = request.auth?.uid
  if (!managerId) {
    throw new HttpsError('unauthenticated', 'You must be logged in')
  }

  const requestId = request.data?.requestId
  if (typeof requestId !== 'string' || requestId.trim() === '') {
    throw new HttpsError('invalid-argument', 'requestId is required')
  }

  await approveCoverageRequestService(requestId, managerId)

  return { success: true }
})
