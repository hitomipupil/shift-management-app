import { useState } from 'react'
import { addDaysToDateString, getWeekStartDate } from 'src/utils/dateUtils'

export const useDisplayedWeek = () => {
  const [weekStartDate, setWeekStartDate] = useState<string>(
    getWeekStartDate(new Date()),
  )

  const handlePreviousWeek = () => {
    setWeekStartDate((current) => addDaysToDateString(current, -7))
  }

  const handleNextWeek = () => {
    setWeekStartDate((current) => addDaysToDateString(current, 7))
  }

  const weekEndDate = addDaysToDateString(weekStartDate, 6)
  const weekRangeLabel = `${weekStartDate} - ${weekEndDate}`

  return {
    weekStartDate,
    weekRangeLabel,
    handlePreviousWeek,
    handleNextWeek,
  }
}
