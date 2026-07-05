import { Typography } from '@mui/material'
import type { CoverageRequest } from 'src/types/coverageRequests'
import { PendingRequestCard } from './PendingRequestCard'

type ManagerRequestsSectionProps = {
  pendingRequests: CoverageRequest[]
}

export const ManagerRequestsSection = ({
  pendingRequests,
}: ManagerRequestsSectionProps) => {
  return (
    <>
      <Typography>Coverage Requests</Typography>
      {pendingRequests.length === 0 ? (
        <Typography color="text.secondary">No requests</Typography>
      ) : (
        pendingRequests.map((req) => (
          <PendingRequestCard key={req.id} pendingRequest={req} />
        ))
      )}
    </>
  )
}
