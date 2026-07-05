import type { CoverageRequest } from 'src/types/coverageRequests'

export const mockCoverageRequests: CoverageRequest[] = [
  {
    id: 'req-1',
    shiftId: 'shift-1',
    originalAssignedUserId: 'employee-1',
    requestedByUserId: 'employee-2',
    status: 'pending',
    reviewedByUserId: null,
    reviewedAt: null,
    createdAt: '2026-06-29',
  },
]
