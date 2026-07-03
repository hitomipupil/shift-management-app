# Shift Management App

## Overview

This application replaces the current group-text workflow used by store staff to manage shift changes.

The MVP focuses on providing a simple approval workflow for shift changes while preventing scheduling conflicts and preserving an approval history.

---

## Assumptions

To reduce ambiguity, the following assumptions were made:

- The application is used by a single store.
- Users already exist in the system.
- There are two roles:
  - Manager
  - Employee
- Managers create schedules and review coverage requests.
- Managers do not work employee shifts in the MVP.
- Only employees can offer shifts for coverage or request to cover shifts.
- Only managers can approve or reject shift change requests.
- Employees can view the weekly schedule for all staff.
- Employees can interact with:
  - their own assigned shifts
  - shifts that have been marked as needing coverage by another employee
- A shift remains assigned to its current employee until a manager approves a change.
- One employee cannot have overlapping approved shifts.

---

## MVP Scope

### Employee

An employee can:

- View the weekly shift schedule
- See their own shifts at the top of the schedule
- Mark one of their assigned shifts as "coverage needed"
- Request to cover a shift that has been marked as needing coverage
- View the status of their own requests

### Manager

A manager can:

- View the weekly shift schedule
- Create and assign weekly shifts
- Review pending shift change requests
- Approve or reject requests
- View the history of approved and rejected requests

---

## Coverage Workflow

### Offer Shift

1. Employee offers one of their assigned shifts.
2. The shift is marked as **Coverage Needed**.
3. The shift remains assigned to the original employee until a manager approves a cover request.

### Claim Shift

1. Another employee requests to cover a shift marked as **Coverage Needed**.
2. A cover request is created with the status `Pending`.
3. The manager reviews the request.
4. If approved, the shift is assigned to the requesting employee.
5. If rejected, the shift remains assigned to the original employee.

---

## Request Status

Requests can have one of the following states:

- Pending
- Approved
- Rejected

---

## Validation Rules

The application validates the following before approving a request:

- Employees cannot request to cover their own shifts.
- A shift can only have one pending request at a time.
- The employee does not already have an overlapping shift.
- The shift is still assigned to the original employee.
- Only managers can approve requests.

---

## Out of Scope

The following features are intentionally excluded from the MVP:

- Withdrawing a coverage request after it has been created
- Direct employee-to-employee shift swap
- Notifications (email / push)
- Multiple stores
- Employee management
- Payroll integration
- Vacation requests
- Drag & drop scheduling
- Recurring shifts
- Calendar synchronization
- Mobile application
- Shift deletion

---

## Future Improvements

Possible future enhancements include:

- Allow employees to withdraw a coverage request before it is claimed.
- Direct shift swap requests
- Notifications
- Multi-store support
- Employee availability
- Shift templates
- Delete shifts

---

## Tech Stack

- React
- TypeScript
- Cloud Firestore
- Material UI
