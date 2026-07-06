# Shift Management App

## Overview

This application replaces the current group-text workflow to manage shift changes.

The MVP focuses on providing a simple approval workflow for shift changes while preventing scheduling conflicts and preserving an approval history.

---

## Demo

Deployed app: https://shift-management-demo.web.app

Demo accounts:

- Manager: `manager1@mail.com` / `manager1`
- Employee 1: `employee1@mail.com` / `employee1`
- Employee 2: `employee2@mail.com` / `employee2`
- Employee 3: `employee3@mail.com` / `employee3`

---

## Assumptions

- The application is used by a single store.
- Users already exist in the system.
- There are two roles:
  - Manager
  - Employee
- Managers create shifts and review coverage requests.
- Managers do not work employee shifts in the MVP.
- Only employees can offer shifts for coverage or request to cover shifts.
- Only managers can approve or reject shift change requests.
- Employees can view the weekly schedule for all staff.
- Employees can interact with:
  - their own assigned shifts
  - shifts that have been marked as needing coverage by another employee
- A shift remains assigned to its current employee until a manager approves a change.
- One employee cannot have overlapping assigned shifts.
- Employees cannot create a coverage request if it overlaps with one of their assigned shifts.
- Employees cannot create a coverage request if it overlaps with another pending coverage request they have already submitted.
- Pending coverage requests are tentative and are not treated as confirmed assigned shifts.
- Shifts start and end on the same calendar date. Overnight shifts are out of scope for the MVP.

---

## Architecture

- Single-page React application without React Router
- Role-based UI rendering for Manager and Employee users
- Firebase Auth is used for demo login accounts
- The Firebase Auth UID is used as the Firestore user document ID
- UI components access data through service functions
- Firestore document IDs are used as application IDs
- Firestore documents do not store duplicate `id` fields
- Firestore Security Rules provide basic authentication and role-based access control

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
- Create and assign shifts for any date
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

The application validates the following when creating or approving a coverage request:

- Employees cannot request to cover their own shifts.
- A shift can only have one pending request at a time.
- Employees cannot create a coverage request if they already have:
  - an assigned shift that overlaps with the target shift.
  - a pending coverage request for another shift that overlaps with the target shift.
- The shift is still assigned to the original employee.
- Only managers can approve requests.

When creating shifts:

- Only managers can create shifts.
- Managers can only assign shifts to employees.
- Required fields must be provided: employee, date, start time, and end time.
- Start time must be before end time.
- Employees cannot have overlapping assigned shifts.
- Pending coverage requests are not included in shift creation overlap validation.

---

## Note on Cloud Functions

The deployed `main` version does not use Cloud Functions.  
It uses Firebase Auth, Firestore Security Rules, and frontend service functions to update Firestore.

A Node.js Cloud Function version of the approve request flow was implemented in the `cloud-functions-approve` branch.  
It was not deployed because Firebase Cloud Functions requires a billing plan.

---

## Out of Scope

- Direct shift swaps
- Notifications
- Multiple stores
- Employee management
- Vacation requests
- Recurring shifts
- Overnight shifts

---

## Future Improvements

- Deploy the Cloud Function approve flow after upgrading Firebase to a billing plan.
- Move more business-critical write operations to Cloud Functions.
- Allow employees to withdraw pending coverage requests.
- Add notifications.
- Add multi-store support.
- Replace demo accounts with production user management.

---

## Tech Stack

- React
- TypeScript
- Vite
- Material UI
- Firebase Auth
- Cloud Firestore
- Firestore Security Rules
- Firebase Hosting
- Firebase Emulator Suite
- Firebase Cloud Functions was explored as a backend improvement but not deployed because it requires a billing plan

---

## Running Locally

Install dependencies:

```bash
npm install
```

Start the Vite dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

By default, local development connects to the configured Firebase project.

Firebase Emulator Suite can also be used for local development by setting:

```env
VITE_USE_FIREBASE_EMULATOR=true
```
