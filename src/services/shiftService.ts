import { mockSchedules } from '../mocks/mockSchedule'
import { mockShifts } from '../mocks/mockShifts'
import type { Shift } from '../types/shift'

export const getAllShifts = async (): Promise<Shift[]> => {
  return mockShifts
}

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
