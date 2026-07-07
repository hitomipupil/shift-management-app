import { useMemo, useState } from 'react'
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'

type UseSelectedRequestDialogParams = {
  users: User[]
  allShifts: Shift[]
}

export const useSelectedRequestDialog = ({
  users,
  allShifts,
}: UseSelectedRequestDialogParams) => {
  const [selectedRequest, setSelectedRequest] =
    useState<CoverageRequest | null>(null)
  const [requestReviewErrorMessage, setRequestReviewErrorMessage] = useState<
    string | null
  >(null)

  const selectedRequestTargetShift = useMemo(() => {
    if (selectedRequest === null) return null
    return (
      allShifts.find((shift) => shift.id === selectedRequest.shiftId) ?? null
    )
  }, [selectedRequest, allShifts])

  const currentAssignedEmployee = useMemo(() => {
    if (selectedRequest === null) return null
    return (
      users.find(
        (user) => user.id === selectedRequest.originalAssignedUserId,
      ) ?? null
    )
  }, [selectedRequest, users])

  const requestedEmployee = useMemo(() => {
    if (selectedRequest === null) return null
    return (
      users.find((user) => user.id === selectedRequest.requestedByUserId) ??
      null
    )
  }, [selectedRequest, users])

  const handleOpenRequestDetails = (request: CoverageRequest) => {
    setRequestReviewErrorMessage(null)
    setSelectedRequest(request)
  }

  const handleCloseRequestDetails = () => {
    setSelectedRequest(null)
    setRequestReviewErrorMessage(null)
  }

  return {
    selectedRequest,
    setSelectedRequest,
    selectedRequestTargetShift,
    currentAssignedEmployee,
    requestedEmployee,
    requestReviewErrorMessage,
    setRequestReviewErrorMessage,
    handleOpenRequestDetails,
    handleCloseRequestDetails,
  }
}
