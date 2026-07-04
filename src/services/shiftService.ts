import { mockSchedules } from '../mocks/mockSchedule'
import { mockShifts } from '../mocks/mockShifts'
import type { Shift } from '../types/shift'

export const getShiftsByWeek = async (
  weekStartDate: string,
): Promise<Shift[]> => {
  const schedule = mockSchedules.find(
    (schedule) => schedule.weekStartDate === weekStartDate,
  )
  if (!schedule) {
    return []
  }
  const shifts = mockShifts.filter((shift) => shift.scheduleId === schedule.id)

  return shifts
}
