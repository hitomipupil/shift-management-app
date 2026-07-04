import type { Shift } from 'src/types/shift'

export const mockShifts: Shift[] = [
  {
    id: 'shift-1',
    scheduleId: 'schedule-2026-06-29',
    assignedUserId: 'employee-1',
    coverageNeeded: false,
    day: '2026-06-30',
    startTime: '09:00',
    endTime: '13:00',
  },
  {
    id: 'shift-2',
    scheduleId: 'schedule-2026-06-29',
    assignedUserId: 'employee-2',
    coverageNeeded: false,
    day: '2026-06-30',
    startTime: '13:00',
    endTime: '17:00',
  },
  {
    id: 'shift-3',
    scheduleId: 'schedule-2026-06-29',
    assignedUserId: 'employee-1',
    coverageNeeded: false,
    day: '2026-07-01',
    startTime: '10:00',
    endTime: '14:00',
  },
  {
    id: 'shift-4',
    scheduleId: 'schedule-2026-06-29',
    assignedUserId: 'employee-1',
    coverageNeeded: false,
    day: '2026-07-03',
    startTime: '09:00',
    endTime: '15:00',
  },
  {
    id: 'shift-5',
    scheduleId: 'schedule-2026-06-29',
    assignedUserId: 'employee-2',
    coverageNeeded: false,
    day: '2026-07-04',
    startTime: '11:00',
    endTime: '16:00',
  },
]
