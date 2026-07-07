import type { Shift } from 'src/types/shift'

export const isPastShift = (shift: Shift): boolean => {
  const now = new Date()

  const today = now.toISOString().slice(0, 10)
  const currentTime = now.toTimeString().slice(0, 5)

  if (shift.date < today) {
    return true
  }

  if (shift.date === today && shift.endTime <= currentTime) {
    return true
  }

  return false
}
