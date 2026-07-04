# Implementation Spec

## Architecture

- Single-page React app
- No React Router
- Role-based UI rendering
- Dialog-based workflows
- Mock data first, Firestore later
- Firestore operations are handled through service functions, not directly inside UI components

---

## State Management

- `CurrentUserContext`
  - selected demo user
  - role-based UI rendering

- Local component state
  - selected shift
  - selected request
  - dialog open / close
  - form values
  - active tab
  - loading states
  - error messages

- Custom hooks
  - displayed week
  - shifts
  - requests

---

## Main Components

```txt
src/
  App.tsx
  components/
    AppHeader.tsx
    UserSelector.tsx
  features/
    layout/
      MainApp.tsx
    schedule/
      ScheduleView.tsx
      WeekNavigator.tsx
      MyShiftsSection.tsx
      WeeklyScheduleSection.tsx
      ShiftCard.tsx
      ShiftDetailsDialog.tsx
      CreateShiftDialog.tsx
    requests/
      MyCoverageRequestsSection.tsx
      ManagerRequestsSection.tsx
      PendingRequestsSection.tsx
      RequestHistorySection.tsx
      RequestDetailsDialog.tsx
      RequestCard.tsx
```

---

## Data Model

```ts
type User = {
  id: string
  name: string
  role: 'manager' | 'employee'
}

type Schedule = {
  id: string
  weekStartDate: string // YYYY-MM-DD
}

type Shift = {
  id: string
  scheduleId: string
  assignedUserId: string
  coverageNeeded: boolean
  day: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
}

type CoverageRequest = {
  id: string
  shiftId: string
  originalAssignedUserId: string
  requestedByUserId: string
  status: 'pending' | 'approved' | 'rejected'
  reviewedByUserId: string | null
  reviewedAt: Timestamp | null
  createdAt: Timestamp
}
```

---

## Derived UI State

- **Normal Shift**
  - `coverageNeeded` is `false`

- **Coverage Needed**
  - `coverageNeeded` is `true`
  - no pending request exists for the shift

- **Request Pending**
  - `coverageNeeded` is `true`
  - a pending request exists for the shift

`Request Pending` is not stored on the shift. It is derived from requests.

---

## Validation Rules

- Employees can only mark their own shifts as Coverage Needed.
- Employees cannot request their own shifts.
- Employees cannot request overlapping shifts.
- A shift can have only one pending request.
- Creating a request does not change the shift assignment.
- Manager approval validates that:
  - the request is still pending
  - the shift is still assigned to `originalAssignedUserId`
  - the requesting employee has no overlapping shift

---

## Service Functions

```txt
userService
- getUsers

shiftService
- getShiftsByWeek
- createShift
- markShiftAsCoverageNeeded

requestService
- getPendingRequests
- getRequestsByUser
- getReviewedRequests
- createCoverageRequest
- approveCoverageRequest
- rejectCoverageRequest
```

---

## Hooks

```txt
useCurrentUser
useDisplayedWeek
useShifts
useRequests
```

---

## Notes

- Mock data should follow the same shape as the Firestore data model.
- `originalAssignedUserId` is stored as a request-time snapshot.
- Firebase Authentication and Cloud Functions are out of scope for the MVP.
- In production, Auth would be added first, followed by stronger server-side validation.
