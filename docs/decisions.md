# Design Decisions

## Request-driven workflow

Shift changes are modeled around coverage requests rather than directly modifying shifts.

A shift remains assigned to the original employee until a manager approves a request. This prevents the schedule from changing before managerial approval and keeps the official schedule clear.

---

## No direct swap in the MVP

The MVP supports a coverage request workflow instead of direct employee-to-employee swaps.

An employee can mark one of their own shifts as needing coverage, and another employee can request to cover it. Direct shift swaps are considered a future enhancement.

---

## Manager approval before reassignment

The shift's assigned employee is updated only after a manager approves a coverage request.

This keeps the workflow predictable and prevents employees from changing the official schedule without approval.

---

## Requests retained for audit history

Coverage requests are retained after approval or rejection.

This provides an audit trail showing who requested the change, who reviewed it, when it was reviewed, and whether it was approved or rejected.

---

## Original assigned employee snapshot

Each coverage request stores `originalAssignedUserId` as a snapshot of the shift's assigned employee at the time the request is created.

This helps validate that the shift is still assigned to the original employee before approval and makes request history easier to understand after the shift assignment changes.

---

## Simplified shift model

All shifts are assigned to an employee.

Instead of storing a full shift status such as `open`, `assigned`, or `pending`, the shift only stores whether it needs coverage using `coverageNeeded`.

The request entity manages the approval workflow.

---

## Derived shift display state

Some shift display states are derived from shifts and requests rather than stored directly.

- A normal shift is shown when `coverageNeeded` is `false`.
- A Coverage Needed shift is shown when `coverageNeeded` is `true` and no pending request exists.
- A Request Pending shift is shown when `coverageNeeded` is `true` and a pending request exists.

`Request Pending` is not stored on the shift document. It is derived from related pending requests to avoid duplicated state.

---

## Shared schedule view

Managers and employees use the same weekly schedule view.

Employees see their own shifts at the top for convenience, while all staff shifts are shown in the weekly schedule. Managers use the same schedule view to understand current assignments and create new shifts.

---

## Single-page layout

The MVP uses a single-page React layout instead of route-based navigation.

Tabs and sections are used to separate schedule, pending requests, and request history. Dialogs are used for shift details, creating shifts, requesting coverage, and reviewing requests.

This keeps the MVP simple and avoids unnecessary routing complexity.

---

## Role-based UI rendering

The selected demo user determines which actions are available in the UI.

Employees can offer their own shifts for coverage and request to cover eligible shifts. Managers can create shifts and approve or reject coverage requests.

Production-level authentication is out of scope for the MVP.

---

## Service functions instead of direct Firestore access in components

Firestore operations are kept in service functions rather than being called directly from UI components.

This keeps components focused on UI behavior and makes it easier to later replace direct Firestore access with Cloud Functions or backend APIs if needed.

---

## Hooks and Context instead of Redux

Redux is not used in the MVP.

The app uses React Context for the selected current user, custom hooks for shift and request data, and local component state for UI-only state such as dialogs, selected items, form values, and active tabs.

This keeps state management lightweight for the MVP.

---

## Mock data first, Firestore later

Initial employee-facing schedule features may use mock data.

Mock data follows the same shape as the planned Firestore data model so that it can be replaced with Firestore data without significantly changing the UI structure.

---

## Firebase Authentication and Cloud Functions out of scope

Firebase Authentication and Cloud Functions are intentionally excluded from the MVP to keep the scope manageable within the coding challenge timeframe.

In a production version, Firebase Authentication would be added first to support trusted user identity and role-based permissions. Critical workflows such as creating coverage requests and approving or rejecting requests could then be moved to Cloud Functions or a backend service for stronger server-side validation.

---

## Technology choice

React, TypeScript, Cloud Firestore, and Material UI were chosen to deliver a structured MVP within the challenge timeframe using technologies I am confident with.

Next.js and a custom Node.js backend were not introduced because they would add scope and complexity without being necessary for the MVP.

---

## Shift as the source of truth

The MVP does not use a separate `Schedule` entity. Weekly schedules are derived from `Shift.date`.

This keeps the data model simple. A separate `Schedule` entity can be added later if weekly schedules need draft, publish, or template workflows.

---

## Pending requests are tentative

Pending coverage requests are not treated as assigned shifts.

When creating a shift, the app checks overlaps only against confirmed assigned shifts. If a pending request later conflicts with a new shift, approval validation prevents it from being approved.
