import { useMemo, useState } from 'react'
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'

type UseSelectedShiftDialogParams = {
  users: User[]
  pendingCoverageRequests: CoverageRequest[]
}

export const useSelectedShiftDialog = ({
  users,
  pendingCoverageRequests,
}: UseSelectedShiftDialogParams) => {
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null)
  const [markCoverageNeededErrorMessage, setMarkCoverageNeededErrorMessage] =
    useState<string | null>(null)
  const [requestToCoverErrorMessage, setRequestToCoverErrorMessage] = useState<
    string | null
  >(null)

  const selectedShiftAssignedUser = useMemo(() => {
    if (selectedShift === null) return null
    return (
      users.find((user) => user.id === selectedShift.assignedUserId) ?? null
    )
  }, [selectedShift, users])

  const isSelectedShiftRequestPending = useMemo(() => {
    return (
      selectedShift !== null &&
      pendingCoverageRequests.some(
        (request) => request.shiftId === selectedShift.id,
      )
    )
  }, [selectedShift, pendingCoverageRequests])

  const handleOpenShiftDetails = (shift: Shift) => {
    setMarkCoverageNeededErrorMessage(null)
    setRequestToCoverErrorMessage(null)
    setSelectedShift(shift)
  }

  const handleCloseShiftDetails = () => {
    setSelectedShift(null)
    setMarkCoverageNeededErrorMessage(null)
    setRequestToCoverErrorMessage(null)
  }

  return {
    selectedShift,
    setSelectedShift,
    selectedShiftAssignedUser,
    isSelectedShiftRequestPending,
    markCoverageNeededErrorMessage,
    setMarkCoverageNeededErrorMessage,
    requestToCoverErrorMessage,
    setRequestToCoverErrorMessage,
    handleOpenShiftDetails,
    handleCloseShiftDetails,
  }
}
