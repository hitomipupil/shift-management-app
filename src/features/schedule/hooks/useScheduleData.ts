import { useEffect, useState } from 'react'
import {
  getPendingCoverageRequests,
  getPendingCoverageRequestsByUser,
  getReviewedCoverageRequests,
  getReviewedCoverageRequestsByUser,
} from 'src/services/coverageRequestService'
import { getAllShifts } from 'src/services/shiftService'
import { getUsers } from 'src/services/userService'
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'

export const useScheduleData = (currentUser: User | null) => {
  const [allShifts, setAllShifts] = useState<Shift[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [pendingCoverageRequests, setPendingCoverageRequests] = useState<
    CoverageRequest[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [myPendingCoverageRequests, setMyPendingCoverageRequests] = useState<
    CoverageRequest[]
  >([])
  const [myReviewedCoverageRequests, setMyReviewedCoverageRequests] = useState<
    CoverageRequest[]
  >([])
  const [reviewedCoverageRequests, setReviewedCoverageRequests] = useState<
    CoverageRequest[]
  >([])

  useEffect(() => {
    const fetchSharedData = async () => {
      if (!currentUser) {
        setIsLoading(false)
        return
      }
      try {
        setIsLoading(true)
        const [
          usersData,
          pendingRequestsData,
          allShiftsData,
          myPendingCoverageRequestsData,
          myReviewedCoverageRequestsData,
          reviewedCoverageRequestsData,
        ] = await Promise.all([
          getUsers(),
          getPendingCoverageRequests(),
          getAllShifts(),
          getPendingCoverageRequestsByUser(currentUser.id),
          getReviewedCoverageRequestsByUser(currentUser.id),
          getReviewedCoverageRequests(),
        ])
        setUsers(usersData)
        setPendingCoverageRequests(pendingRequestsData)
        setAllShifts(allShiftsData)
        setMyPendingCoverageRequests(myPendingCoverageRequestsData)
        setMyReviewedCoverageRequests(myReviewedCoverageRequestsData)
        setReviewedCoverageRequests(reviewedCoverageRequestsData)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchSharedData()
  }, [currentUser])

  return {
    allShifts,
    setAllShifts,
    users,
    pendingCoverageRequests,
    setPendingCoverageRequests,
    isLoading,
    myPendingCoverageRequests,
    setMyPendingCoverageRequests,
    myReviewedCoverageRequests,
    reviewedCoverageRequests,
    setReviewedCoverageRequests,
  }
}
