import { HttpsError } from 'firebase-functions/https'
import { getUserById } from '../db/userRepository'
import { approveCoverageRequestTransaction } from '../db/coverageRequestRepository'

export const approveCoverageRequestService = async (
  requestId: string,
  managerId: string,
) => {
  const manager = await getUserById(managerId)

  if (manager?.role !== 'manager') {
    throw new HttpsError(
      'permission-denied',
      'Only managers can approve coverage requests',
    )
  }

  await approveCoverageRequestTransaction(requestId, managerId)
}
