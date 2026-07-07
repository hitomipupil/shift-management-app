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

  const handleToday = () => {
    setWeekStartDate(getWeekStartDate(new Date()))
  }

  const weekEndDate = addDaysToDateString(weekStartDate, 6)
  const weekRangeLabel = `${weekStartDate} - ${weekEndDate}`
  const isCurrentWeek = weekStartDate === getWeekStartDate(new Date())

  return {
    weekStartDate,
    weekRangeLabel,
    isCurrentWeek,
    handlePreviousWeek,
    handleNextWeek,
    handleToday,
  }
}
