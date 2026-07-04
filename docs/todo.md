### Documents

- README
- userstory
- specs
- decisions

### Project setup

- set up vite + React + TypeScript
- install MUI
- install firebase
- install prettier

### Implement

## US-01

- [x] Add user type
- [x] Add mockUsers
- [x] Add UserSelector component
- [x] Add CurrentUserContext
- [x] Add CurrentUserProvider
- [x] Add useCurrentUser hook
- [x] Use useCurrentUser in UserSelector
- [x] Add MainApp layout component
- [x] Add AppHeader component
- [x] In App.tsx, render components conditionally
- [x] Test ACs
- [x] Store user to localStorage

## US-02

- [x] Add Schedule type
- [x] Add Shift type
- [x] Add mockSchedules
- [x] Add mockShifts
- [x] Add ScheduleView component
- [x] Add WeekNavigator component
- [x] Add MyShiftsSection component
- [x] Add WeeklyScheduleSection component
- [x] Add ShiftCard component
- [x] Use ScheduleView in MainApp
- [x] Add shiftService
- [ ] Add useDisplayedWeek hook
- [x] Add date utility functions
- [ ] Add useShifts hook
- [x] Test ACs

Refactor later:

- [ ] Add useDisplayedWeek hook
- [ ] Add useShifts hook

## US-03

- [x] Confirm coverageNeeded exists in Shift and mockShifts
- [x] Add markShiftAsCoverageNeeded to shiftService
- [x] Add selectedShift and dialog open/close state in ScheduleView
- [x] Make ShiftCard clickable
- [x] Pass onShiftClick through MyShiftsSection
- [x] Pass onShiftClick through WeeklyScheduleSection
- [x] Create ShiftDetailsDialog
- [x] Add Need Coverage button visibility logic
- [x] Connect button to service function
- [x] Refresh shifts after update
- [x] Add Coverage Needed chip to ShiftCard
- [ ] Manually test ACs
