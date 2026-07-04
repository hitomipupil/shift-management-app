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
- [x] Manually test ACs

## US-04

- [x] Add coverageRequest type
- [x] Add MockCoverageRequests
- [x] Add getPendingCoverageRequests to requestService
- [x] Add createCoverageRequest to requestService
- [x] Add coverageRequests state to ScheduleView
- [x] load pending request
- [x] Derive request Pending
- [x] Add request Pending chip to ShiftCard
- [x] Add Request to Cover button to ShiftDetailsDialog
- [x] Add handleRequestToCover
- [x] Display validation error
- [ ] Manually test ACs

## US-05

- [ ] Add approveCoverageRequest to coverageRequestService
- [ ] Add rejectCoverageRequest to coverageRequestService
- [ ] Validate reviewer is a manager
- [ ] Validate request exists
- [ ] Validate request is still pending
- [ ] Validate target shift exists
- [ ] Validate shift is still assigned to originalAssignedUserId
- [ ] Validate requested user has no overlapping assigned shift
- [ ] Update request status to approved on approve
- [ ] Set reviewedByUserId and reviewedAt on approve
- [ ] Update shift assignedUserId to requestedByUserId on approve
- [ ] Set shift coverageNeeded to false on approve
- [ ] Update request status to rejected on reject
- [ ] Set reviewedByUserId and reviewedAt on reject
- [ ] Keep shift unchanged on reject
- [ ] Add ManagerRequestsSection component
- [ ] Show ManagerRequestsSection only for manager users
- [ ] Display pending requests
- [ ] Add RequestCard component
- [ ] Add RequestDetailsDialog component
- [ ] Add Approve and Reject buttons to RequestDetailsDialog
- [ ] Add handleApproveRequest to ScheduleView
- [ ] Add handleRejectRequest to ScheduleView
- [ ] Reload shifts and pending requests after approve/reject
- [ ] Display validation error
- [ ] Manually test ACs
