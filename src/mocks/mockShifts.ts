import type { Shift } from 'src/types/shift'

export const mockShifts: Shift[] = [
  {
    id: 'shift-coverage-pending',
    scheduleId: 'schedule-2026-06-29',
    assignedUserId: 'employee-2',
    coverageNeeded: true,
    day: '2026-07-01',
    startTime: '10:00',
    endTime: '14:00',
  },
  {
    id: 'shift-approved-1',
    scheduleId: 'schedule-2026-06-29',
    assignedUserId: 'employee-1',
    coverageNeeded: false,
    day: '2026-07-02',
    startTime: '10:00',
    endTime: '14:00',
  },
  {
    id: 'shift-rejected-1',
    scheduleId: 'schedule-2026-06-29',
    assignedUserId: 'employee-3',
    coverageNeeded: true,
    day: '2026-07-03',
    startTime: '10:00',
    endTime: '14:00',
  },
]
