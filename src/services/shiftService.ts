import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from 'src/firebase'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'
import { addDaysToDateString } from 'src/utils/dateUtils'
import { isPastShift } from 'src/utils/isPastShift'
import { getUserById } from './userService'

const sortShiftsByDateAndTime = (shifts: Shift[]): Shift[] => {
  return [...shifts].sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date)
    }

    return a.startTime.localeCompare(b.startTime)
  })
}

export const getAllShifts = async (): Promise<Shift[]> => {
  const shiftsSnapshot = await getDocs(collection(db, 'shifts'))

  const shifts = shiftsSnapshot.docs.map((shiftDocument) => {
    const data = shiftDocument.data()

    return {
      id: shiftDocument.id,
      assignedUserId: data.assignedUserId,
      coverageNeeded: data.coverageNeeded,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
    } as Shift
  })

  return sortShiftsByDateAndTime(shifts)
}

export const getShiftsByWeek = async (
  weekStartDate: string,
): Promise<Shift[]> => {
  const weekEndDate = addDaysToDateString(weekStartDate, 6)

  const shiftsQuery = query(
    collection(db, 'shifts'),
    where('date', '>=', weekStartDate),
    where('date', '<=', weekEndDate),
  )

  const shiftsSnapshot = await getDocs(shiftsQuery)

  return shiftsSnapshot.docs.map((shiftDocument) => {
    const data = shiftDocument.data()

    return {
      id: shiftDocument.id,
      assignedUserId: data.assignedUserId,
      coverageNeeded: data.coverageNeeded,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
    } as Shift
  })
}

export const markShiftAsCoverageNeeded = async (
  shiftId: string,
  currentUserId: string,
): Promise<void> => {
  const shiftRef = doc(db, 'shifts', shiftId)
  const shiftSnapshot = await getDoc(shiftRef)
  if (!shiftSnapshot.exists()) {
    throw new Error('Shift not found')
  }
  const data = shiftSnapshot.data()
  if (data.assignedUserId !== currentUserId) {
    throw new Error('Access denied')
  }
  if (data.coverageNeeded === true) {
    throw new Error('Shift already offered')
  }
  const shift: Shift = {
    id: shiftSnapshot.id,
    assignedUserId: data.assignedUserId,
    coverageNeeded: data.coverageNeeded,
    date: data.date,
    startTime: data.startTime,
    endTime: data.endTime,
  }
  if (isPastShift(shift)) {
    throw new Error('Cannot modify a past shift')
  }
  await updateDoc(shiftRef, {
    coverageNeeded: true,
  })
}

export const createShift = async (
  currentUser: User,
  assignedUserId: string,
  date: string,
  startTime: string,
  endTime: string,
): Promise<Shift> => {
  if (currentUser.role !== 'manager') {
    throw new Error('Only managers can create shifts')
  }
  if (!assignedUserId || !date || !startTime || !endTime) {
    throw new Error('All fields are required')
  }
  const assignedUser = await getUserById(assignedUserId)
  if (!assignedUser) {
    throw new Error('Assigned user was not found')
  }
  if (assignedUser.role !== 'employee') {
    throw new Error('Only employees can be assigned to shifts')
  }
  if (startTime >= endTime) {
    throw new Error('Start time must be before end time')
  }

  const shiftsQuery = query(
    collection(db, 'shifts'),
    where('assignedUserId', '==', assignedUserId),
    where('date', '==', date),
  )

  const shiftsSnapshot = await getDocs(shiftsQuery)

  const hasOverlappingShift = shiftsSnapshot.docs.some((shiftDoc) => {
    const data = shiftDoc.data()
    return startTime < data.endTime && endTime > data.startTime
  })

  if (hasOverlappingShift) {
    throw new Error('This employee already has an overlapping shift')
  }

  const newShiftData = {
    assignedUserId,
    coverageNeeded: false,
    date,
    startTime,
    endTime,
  }
  const shiftDocumentRef = await addDoc(collection(db, 'shifts'), newShiftData)
  return {
    id: shiftDocumentRef.id,
    ...newShiftData,
  }
}
