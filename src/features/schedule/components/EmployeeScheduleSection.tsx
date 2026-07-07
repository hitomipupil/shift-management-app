import { Box, Tab, Tabs } from '@mui/material'
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined'
import { useMemo, useState, type SyntheticEvent } from 'react'
import { EmptyState } from 'src/components/EmptyState'
import type { CoverageRequest } from 'src/types/coverageRequests'
import type { Shift } from 'src/types/shift'
import type { User } from 'src/types/user'
import { isPastShift } from 'src/utils/isPastShift'
import { MyShiftsSection } from './MyShiftsSection'
import { WeeklyScheduleSection } from './WeeklyScheduleSection'

type EmployeeScheduleSectionProps = {
  currentUser: User
  myShifts: Shift[]
  shifts: Shift[]
  users: User[]
  onShiftClick: (shift: Shift) => void
  coverageRequests: CoverageRequest[]
}

export const EmployeeScheduleSection = ({
  currentUser,
  myShifts,
  shifts,
  users,
  onShiftClick,
  coverageRequests,
}: EmployeeScheduleSectionProps) => {
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  const availableToCoverShifts = useMemo(() => {
    return shifts.filter((shift) => {
      const hasPendingRequest = coverageRequests.some(
        (request) => request.shiftId === shift.id,
      )

      return (
        shift.coverageNeeded &&
        shift.assignedUserId !== currentUser.id &&
        !hasPendingRequest &&
        !isPastShift(shift)
      )
    })
  }, [shifts, coverageRequests, currentUser.id])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            aria-label="employee schedule tabs"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab label="My Shifts" />
            <Tab label="Weekly Schedule" />
            <Tab label="Available to Cover" />
          </Tabs>
        </Box>
      </Box>

      {selectedTab === 0 && (
        <MyShiftsSection
          currentUser={currentUser}
          myShifts={myShifts}
          onShiftClick={onShiftClick}
          coverageRequests={coverageRequests}
          hideTitle
        />
      )}
      {selectedTab === 1 && (
        <WeeklyScheduleSection
          shifts={shifts}
          users={users}
          onShiftClick={onShiftClick}
          coverageRequests={coverageRequests}
          hideTitle
        />
      )}
      {selectedTab === 2 &&
        (availableToCoverShifts.length === 0 ? (
          <EmptyState
            message="No available shifts to cover this week"
            icon={<EventBusyOutlinedIcon fontSize="large" />}
          />
        ) : (
          <WeeklyScheduleSection
            shifts={availableToCoverShifts}
            users={users}
            onShiftClick={onShiftClick}
            coverageRequests={coverageRequests}
            hideTitle
          />
        ))}
    </Box>
  )
}
