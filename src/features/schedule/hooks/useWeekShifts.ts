import { useEffect, useState } from 'react'
import { getShiftsByWeek } from 'src/services/shiftService'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'

export const useWeekShifts = (
  currentUser: User | null,
  weekStartDate: string,
) => {
  const [shiftsOfThisWeek, setShiftsOfThisWeek] = useState<Shift[]>([])
  const [isWeekLoading, setIsWeekLoading] = useState(false)

  useEffect(() => {
    const fetchWeekShifts = async () => {
      if (!currentUser) {
        return
      }
      try {
        setIsWeekLoading(true)
        const shiftsData = await getShiftsByWeek(weekStartDate)
        setShiftsOfThisWeek(shiftsData)
      } catch (e) {
        console.error(e)
      } finally {
        setIsWeekLoading(false)
      }
    }
    fetchWeekShifts()
  }, [weekStartDate, currentUser])

  return {
    shiftsOfThisWeek,
    setShiftsOfThisWeek,
    isWeekLoading,
  }
}
