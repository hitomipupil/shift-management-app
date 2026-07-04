type CoverageRequestStatus = 'pending' | 'approved' | 'rejected'

export type CoverageRequest = {
  id: string
  shiftId: string
  originalAssignedUserId: string
  requestedByUserId: string
  status: CoverageRequestStatus
  reviewedByUserId: string | null
  reviewedAt: string | null
  createdAt: string
}
