# Shift Management App

## Overview

This application replaces a group-text workflow for managing shift changes in a store.

The MVP provides a simple approval flow for shift coverage requests. It helps managers track who is working, prevents overlapping assignments, and keeps a review history of approved and rejected requests.

---

## Demo

Deployed app: https://shift-management-demo.web.app

Demo accounts:

- Manager: `manager1@mail.com` / `manager1`
- Employee 1: `employee1@mail.com` / `employee1`
- Employee 2: `employee2@mail.com` / `employee2`
- Employee 3: `employee3@mail.com` / `employee3`

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

---

## Assumptions

To keep the MVP focused, the following assumptions were made:

- The app is used by a single store.
- Users already exist in the system.
- There are two roles: Manager and Employee.
- Managers create shifts and review coverage requests.
- Employees can view the weekly schedule for all staff.
- Employees can offer their own shifts for coverage.
- Employees can request to cover shifts marked as coverage needed.
- A shift remains assigned to the original employee until a manager approves a request.
- Employees cannot have overlapping assigned shifts.
- Overnight shifts, recurring shifts, vacation requests, and multi-store support are out of scope.

---

## Core Features

### Employee

Employees can:

- View the weekly shift schedule
- See their own shifts separately
- Mark one of their assigned shifts as coverage needed
- Request to cover a shift marked as coverage needed
- View the status of their own requests

### Manager

Managers can:

- View the weekly shift schedule
- Create and assign shifts
- Review pending coverage requests
- Approve or reject requests
- View approved and rejected request history

---

## Coverage Workflow

1. An employee marks one of their assigned shifts as **Coverage Needed**.
2. Another employee requests to cover that shift.
3. A coverage request is created with the status `pending`.
4. A manager reviews the request.
5. If approved, the shift is assigned to the requesting employee.
6. If rejected, the shift remains assigned to the original employee.

Request statuses:

- `pending`
- `approved`
- `rejected`

---

## Key Validation Rules

The app validates the following rules:

- Only managers can create shifts.
- Only managers can approve or reject coverage requests.
- Managers can only assign shifts to employees.
- Employees cannot request to cover their own shifts.
- A shift can only have one pending coverage request at a time.
- Employees cannot have overlapping assigned shifts.
- Employees cannot create a coverage request that overlaps with one of their assigned shifts.
- Employees cannot create a coverage request that overlaps with another pending request they already submitted.
- A request can only be approved if it is still pending.
- A request can only be approved if the shift is still assigned to the original employee.
- Shift start time must be before end time.

---

## Architecture

The app is intentionally kept simple for the MVP:

- Single-page React application
- No React Router
- No Redux
- Role-based UI rendering for Manager and Employee users
- Dialog-based workflows for shift and request actions
- Firebase Auth for login
- Firebase Auth UID is used as the Firestore `users/{uid}` document ID
- UI components access Firebase through service functions
- Firestore document IDs are used as application IDs
- Firestore Security Rules provide authentication and role-based access control

The service function layer acts as the boundary between React components and Firebase. This keeps UI components focused on rendering and user interactions, while Firestore reads and writes are centralized in one place.

---

## Data Model

### users

```ts
type User = {
  id: string
  name: string
  role: 'manager' | 'employee'
}
```

### shifts

```ts
type Shift = {
  id: string
  assignedUserId: string
  coverageNeeded: boolean
  date: string
  startTime: string
  endTime: string
}
```

### coverageRequests

```ts
type CoverageRequest = {
  id: string
  shiftId: string
  originalAssignedUserId: string
  requestedByUserId: string
  status: 'pending' | 'approved' | 'rejected'
  reviewedByUserId: string | null
  reviewedAt: string | null
  createdAt: string
}
```

Firestore documents do not store duplicate `id` fields. The document ID is used as the application ID.

---

## Note on Cloud Functions

The deployed `main` version does not use Cloud Functions.

It uses Firebase Auth, Firestore Security Rules, frontend service functions, and Firestore transactions for the approval flow.

A Node.js Cloud Function version of the approve request flow was implemented in the `cloud-functions-approve` branch. It was not deployed because Firebase Cloud Functions requires a billing plan.

In a production version, business-critical write operations such as approving requests would be good candidates for Cloud Functions.

---

## Future Improvements

Given more time, I would improve the app by adding:

- Cloud Function based approval and rejection workflows
- Firestore `Timestamp` / `serverTimestamp`
- Automated tests for service functions and Firestore Security Rules
- Employee request withdrawal
- Notifications for managers and employees
- Multi-store support
- Production user management
- Better mobile responsive design
- Pagination or filtering for long request histories

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
