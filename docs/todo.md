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
- [x] Add date utility functions
- [x] Test ACs

Refactor later:

- [x] Add useDisplayedWeek hook
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

- [x] Add approveCoverageRequest to coverageRequestService
- [x] Validate reviewer is a manager
- [x] Validate request exists
- [x] Validate request is still pending
- [x] Validate target shift exists
- [x] Validate shift is still assigned to originalAssignedUserId
- [x] Validate requested user has no overlapping assigned shift
- [x] Update request status to approved on approve
- [x] Set reviewedByUserId and reviewedAt on approve
- [x] Update shift assignedUserId to requestedByUserId on approve
- [x] Set shift coverageNeeded to false on approve
- [x] Add rejectCoverageRequest to coverageRequestService
- [x] Update request status to rejected on reject
- [x] Set reviewedByUserId and reviewedAt on reject
- [x] Keep shift unchanged on reject
- [x] Add ManagerRequestsSection component
- [x] Show ManagerRequestsSection only for manager users
- [x] Display pending requests
- [x] Add RequestCard component
- [x] Add RequestDetailsDialog component
- [x] Add Approve and Reject buttons to RequestDetailsDialog
- [x] Add handleApproveRequest to ScheduleView
- [x] Add handleRejectRequest to ScheduleView
- [x] Reload shifts and pending requests after approve/reject
- [x] Display validation error
- [x] Manually test ACs

## US-06: Employee views their coverage request status

- [x] Add getRequestsByUser to coverageRequestService
- [x] Add myCoverageRequests state in ScheduleView
- [x] Fetch current employee's coverage requests in ScheduleView
- [x] Update myCoverageRequests after creating a coverage request
- [x] Create MyCoverageRequestsSection component
- [x] Show empty state when the employee has no coverage requests
- [x] Display each request's related shift information
- [x] Display the original assigned employee for each request
- [x] Display request status as Pending, Approved, or Rejected
- [x] Add status label or chip to each request
- [x] Render MyCoverageRequestsSection only for employees
- [x] Place MyCoverageRequestsSection below My Shifts
- [x] Add mock data for pending, approved, and rejected requests if needed
- [x] Manually test ACs

## US-07: Manager views request history

- [x] Add getReviewedCoverageRequests to coverageRequestService
- [x] Filter only approved and rejected requests in getReviewedCoverageRequests
- [x] Sort reviewed requests by reviewedAt, newest first
- [x] Add reviewedCoverageRequests state in ScheduleView
- [x] Fetch reviewed coverage requests when ScheduleView loads
- [x] Refresh reviewed coverage requests after approving a request
- [x] Refresh reviewed coverage requests after rejecting a request
- [x] Pass reviewedCoverageRequests to ManagerRequestsSection
- [x] Create RequestHistoryCard for read-only history items
- [x] Display shift details in RequestHistoryCard
- [x] Display requesting employee in RequestHistoryCard
- [x] Display final status chip in RequestHistoryCard
- [x] Display reviewing manager in RequestHistoryCard
- [x] Display review timestamp in RequestHistoryCard
- [x] Render reviewed requests inside the Request History tab
- [x] Show empty state when there is no request history
- [x] Confirm pending requests are not shown in Request History
- [x] Confirm history items have no approve / reject actions
- [ ] Manually test ACs

## US-08

- [x] Add createShift to shiftService
- [x] Add validation in createShift
- [x] Ensure created shifts have coverageNeeded: false
- [ ] Create CreateShiftDialog
- [ ] Add employee, date, start time, and end time fields
- [ ] Add Create button disabled logic
- [ ] Add Create Shift button above WeekNavigator
- [ ] Show Create Shift button only for managers
- [ ] Add create shift dialog open/close state in ScheduleView
- [ ] Connect dialog submit to createShift
- [ ] Show validation error message when creation fails
- [ ] Refresh shifts after creating a shift
- [ ] Manually test ACs
