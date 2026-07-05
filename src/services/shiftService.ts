import { mockSchedules } from 'src/mocks/mockSchedule'
import { mockShifts } from 'src/mocks/mockShifts'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'
import { addDaysToDateString } from 'src/utils/dateUtils'

export const getAllShifts = async (): Promise<Shift[]> => {
  return mockShifts
}

export const getShiftsByWeek = async (
  weekStartDate: string,
): Promise<Shift[]> => {
  const weekEndDate = addDaysToDateString(weekStartDate, 6)
  return mockShifts.filter(
    (shift) => shift.date >= weekStartDate && shift.date <= weekEndDate,
  )
}

export const markShiftAsCoverageNeeded = async (
  shiftId: string,
  currentUserId: string,
) => {
  const targetShift = mockShifts.find((shift) => shift.id === shiftId)
  if (!targetShift) {
    throw new Error('Shift not found')
  }
  if (targetShift.assignedUserId !== currentUserId) {
    throw new Error('Access denied')
  }
  if (targetShift.coverageNeeded === true) {
    throw new Error('Shift already offered')
  }
  targetShift.coverageNeeded = true
  return
}
