import type { CoverageRequest } from 'src/types/coverageRequests'

export const mockCoverageRequests: CoverageRequest[] = [
  {
    id: 'request-pending-1',
    shiftId: 'shift-coverage-pending',
    originalAssignedUserId: 'employee-2',
    requestedByUserId: 'employee-1',
    status: 'pending',
    reviewedByUserId: null,
    reviewedAt: null,
    createdAt: '2026-07-01T10:00:00.000Z',
  },
  {
    id: 'request-approved-1',
    shiftId: 'shift-approved-1',
    originalAssignedUserId: 'employee-2',
    requestedByUserId: 'employee-1',
    status: 'approved',
    reviewedByUserId: 'manager-1',
    reviewedAt: '2026-07-01T12:00:00.000Z',
    createdAt: '2026-07-01T09:00:00.000Z',
  },
  {
    id: 'request-rejected-1',
    shiftId: 'shift-rejected-1',
    originalAssignedUserId: 'employee-3',
    requestedByUserId: 'employee-1',
    status: 'rejected',
    reviewedByUserId: 'manager-1',
    reviewedAt: '2026-07-01T13:00:00.000Z',
    createdAt: '2026-07-01T08:00:00.000Z',
  },
]
