import type { ChipProps } from '@mui/material'
import type { CoverageRequestStatus } from 'src/types/coverageRequests'

export const REQUEST_STATUS_CHIP: Record<
  CoverageRequestStatus,
  { label: string; color: ChipProps['color'] }
> = {
  pending: { label: 'Pending', color: 'info' },
  approved: { label: 'Approved', color: 'primary' },
  rejected: { label: 'Rejected', color: 'secondary' },
}
