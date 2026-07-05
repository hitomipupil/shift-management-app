import { mockShifts } from 'src/mocks/mockShifts'
import { mockUsers } from 'src/mocks/mockUsers'
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

export const createShift = async (
  currentUser: User,
  assignedUserId: string,
  date: string,
  startTime: string,
  endTime: string,
) => {
  if (currentUser.role !== 'manager') {
    throw new Error('Only managers can create shifts')
  }
  if (!assignedUserId || !date || !startTime || !endTime) {
    throw new Error('All fields are required')
  }
  const assignedUser = mockUsers.find((user) => user.id === assignedUserId)
  if (!assignedUser) {
    throw new Error('Assigned user was not found')
  }
  if (assignedUser.role !== 'employee') {
    throw new Error('Only employees can be assigned to shifts')
  }
  if (startTime >= endTime) {
    throw new Error('Start time must be before end time')
  }
  const hasOverlappingShift = mockShifts.some((shift) => {
    return (
      shift.assignedUserId === assignedUserId &&
      shift.date === date &&
      startTime < shift.endTime &&
      endTime > shift.startTime
    )
  })

  if (hasOverlappingShift) {
    throw new Error('This employee already has an overlapping shift')
  }

  const shift: Shift = {
    id: `shift-${Date.now()}`,
    assignedUserId,
    coverageNeeded: false,
    date,
    startTime,
    endTime,
  }
  mockShifts.push(shift)
  return shift
}
