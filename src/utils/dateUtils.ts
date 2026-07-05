const formatDateToDateString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const getWeekStartDate = (date: Date): string => {
  const dayOfWeek = date.getDay()

  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1

  const monday = new Date(date)
  monday.setDate(date.getDate() - daysFromMonday)

  return formatDateToDateString(monday)
}

export const addDaysToDateString = (
  dateString: string,
  days: number,
): string => {
  const date = new Date(`${dateString}T00:00:00`)
  date.setDate(date.getDate() + days)

  return formatDateToDateString(date)
}

export const formatDateTime = (dateTimeString: string | null): string => {
  if (!dateTimeString) {
    return 'No date'
  }

  return new Date(dateTimeString).toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}
