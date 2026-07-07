import type { ChipProps } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import type { CoverageRequestStatus } from 'src/types/coverageRequests'

export type StatusChipConfig = {
  label: string
  color: ChipProps['color']
  sx?: SxProps<Theme>
}

export const REQUEST_STATUS_CHIP: Record<
  CoverageRequestStatus,
  StatusChipConfig
> = {
  pending: { label: 'Pending', color: 'default' },
  approved: { label: 'Approved', color: 'primary' },
  rejected: { label: 'Rejected', color: 'secondary' },
}

export const SHIFT_STATUS_CHIP: Record<
  'requestPending' | 'coverageNeeded',
  StatusChipConfig
> = {
  requestPending: { label: 'Request Pending', color: 'default' },
  coverageNeeded: {
    label: 'Coverage Needed',
    color: 'warning',
    sx: { color: 'common.white' },
  },
}
