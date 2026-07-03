# User Stories

## UI Approach

This MVP uses a single-page layout with tabs and dialogs instead of route-based navigation.

- A predefined user selector is shown before entering the app.
- After a user is selected, the app displays the main shift management interface.
- Employee actions and manager actions are shown based on the selected user's role.
- Dialogs are used for shift details, creating shifts, requesting coverage, and reviewing requests.
- Tabs or sections are used to separate schedule, pending requests, and request history.

---

## US-01: User accesses the app as an existing user

As a store staff member,
I want to access the app as an existing user,
so that the application can show the correct information based on who I am.

### UI

- When no user is selected, the app shows a predefined user selector.
- Each selectable user shows a name and role.
- After a user is selected, the app header and role-based main interface are displayed.
- The current user's name and role are visible in the app header.

### Acceptance Criteria

#### AC-01: User selector is shown before entering the app

Given no current user has been selected,
When the user opens the app,
Then the predefined user selector is displayed.

#### AC-02: User can select a predefined user

Given predefined users exist,
When the user selects one of the users,
Then that user becomes the current user.

#### AC-03: Current user information is visible

Given a current user has been selected,
When the main app is displayed,
Then the current user's name and role are visible.

---

## US-02: Employee views the weekly schedule

As an employee,
I want to view the weekly shift schedule,
so that I can understand when I am working and who else is working that week.

### UI

- The schedule view is shown in the main app.
- By default, the app displays the current week.
- The user can move to the previous or next week using arrow buttons.
- The displayed week range is visible.
- The employee's own shifts are shown at the top in a **My Shifts** section.
- All shifts for the displayed week are shown below in a **Weekly Schedule** section.
- At this stage, shifts are displayed as normal assigned shifts. Coverage-related states are introduced in later user stories.

### Acceptance Criteria

#### AC-01: Current week is displayed by default

Given the employee accesses the main app,
When the schedule is displayed,
Then the current week's schedule is shown by default.

#### AC-02: Employee can move between weeks

Given the employee is viewing the weekly schedule,
When the employee clicks the previous or next week button,
Then the displayed week changes accordingly.

#### AC-03: Displayed week range is visible

Given the employee is viewing the weekly schedule,
When the schedule is displayed,
Then the displayed week range is visible.

#### AC-04: Employee can view all shifts for the displayed week

Given shifts exist for the displayed week,
When the weekly schedule is displayed,
Then all shifts for that week are shown.

#### AC-05: Shift details are displayed

Given shifts exist for the displayed week,
When the weekly schedule is displayed,
Then each shift shows the assigned employee, day, start time, and end time.

#### AC-06: Employee's own shifts are shown at the top

Given the employee has assigned shifts in the displayed week,
When the weekly schedule is displayed,
Then those shifts are shown in the My Shifts section above the full weekly schedule.

#### AC-07: Empty state is shown when no shifts exist

Given there are no shifts for the displayed week,
When the employee views the weekly schedule,
Then an empty state is shown.

---

## US-03: Employee offers one of their shifts for coverage

As an employee,
I want to mark one of my assigned shifts as needing coverage,
so that another employee can request to cover it.

### UI

- The employee can click one of their own shift cards.
- A shift details dialog opens.
- If the shift belongs to the employee and is not already marked as Coverage Needed, the dialog shows a **Need Coverage** action.
- The dialog explains that the shift remains assigned to the employee until a manager approves another employee's request.
- After the action is completed, the shift is shown with a **Coverage Needed** label or chip.
- Coverage Needed should not be represented by color alone.

### Acceptance Criteria

#### AC-01: Employee can open their own shift details

Given a shift is assigned to the employee,
When the employee clicks the shift,
Then the shift details dialog is displayed.

#### AC-02: Employee can mark their own shift as Coverage Needed

Given the shift is assigned to the employee and is not already marked as Coverage Needed,
When the employee selects Need Coverage,
Then the shift is shown as Coverage Needed in the schedule.

#### AC-03: Employee cannot mark another employee's shift as Coverage Needed

Given a shift is assigned to another employee,
When the employee views the shift,
Then the Need Coverage action is not available.

#### AC-04: Shift assignment does not change when marked as Coverage Needed

Given the employee marks one of their shifts as Coverage Needed,
When the action is completed,
Then the shift remains assigned to the original employee.

#### AC-05: Already offered shifts cannot be offered again

Given a shift is already marked as Coverage Needed,
When the employee opens the shift details,
Then the Need Coverage action is disabled or hidden.

---

## US-04: Employee requests to cover another employee's shift

As an employee,
I want to request to cover another employee's Coverage Needed shift,
so that I can take over the shift if a manager approves my request.

### UI

- The employee can click a shift marked as Coverage Needed.
- A shift details dialog opens.
- If the employee is allowed to request the shift, the dialog shows a **Request to Cover** button and a cancel button.
- The dialog explains that a manager must approve the request before the shift is assigned to the employee.
- A Coverage Needed shift with no pending request is visually distinct from a normal shift and shows a **Coverage Needed** label.
- A Coverage Needed shift with a pending request is visually distinct and shows a **Request Pending** label.

### Acceptance Criteria

#### AC-01: Employee can open only eligible shifts for coverage request

Given a shift is displayed in the weekly schedule,
When an employee wants to request coverage for the shift,
Then the shift can be opened for request only if it is marked as Coverage Needed, has no pending request, and is assigned to another employee.

#### AC-02: Shift can have only one pending request

Given a shift already has a pending coverage request,
When another employee tries to request to cover the same shift,
Then a new pending request is not created.

#### AC-03: Employee cannot request an overlapping shift

Given the employee already has an assigned shift that overlaps with the target shift,
When the employee tries to request to cover the target shift,
Then the request is prevented.

#### AC-04: Coverage request is created as Pending

Given the employee opens an eligible Coverage Needed shift,  
When the employee clicks Request to Cover,  
Then a pending coverage request is created for that shift.

#### AC-05: Creating a request does not change the shift assignment

Given the employee creates a coverage request,
When the request is Pending,
Then the shift remains assigned to the original employee.

#### AC-06: Shift is shown as Request Pending after a request is created

Given a pending coverage request exists for a shift,  
When the weekly schedule is displayed,  
Then the shift is shown as Request Pending and no additional Request to Cover action is available.

---

## US-05: Manager creates weekly shifts

As a manager,
I want to create and assign weekly shifts,
so that employees can see the official schedule.

### UI

- The manager can access the schedule in the main app.
- The manager sees a **Create Shift** button.
- When the manager clicks Create Shift, a dialog opens.
- The manager selects an employee, day, start time, and end time.
- The manager confirms the action by clicking **Create**.
- The created shift appears in the weekly schedule.

### Acceptance Criteria

#### AC-01: Create Shift action is available only to Managers

Given the current user has either the Manager or Employee role,
When the schedule is displayed,
Then the Create Shift action is available only to Managers.

#### AC-02: Manager can open the create shift dialog

Given the current user is a Manager,
When the manager clicks Create Shift,
Then the create shift dialog is displayed.

#### AC-03: Manager can enter required shift details

Given the manager opens the create shift dialog,
When the dialog is displayed,
Then it contains fields for employee, day, start time, and end time, as well as Create and Cancel actions.

#### AC-04: Required fields are validated

Given the manager opens the create shift dialog,
When the assigned employee, day, start time, or end time is missing,
Then the Create action is disabled.

#### AC-05: Overlapping shifts for the same employee are prevented

Given an employee already has a shift during a specific time period,  
When the manager clicks Create for another shift assigned to the same employee with an overlapping time period,  
Then the app prevents the shift from being created and shows a validation message.

#### AC-06: Cancel closes the create shift dialog without creating a shift

Given the manager has opened the create shift dialog,
When the manager clicks Cancel,
Then the dialog is closed and no new shift is created.

#### AC-07: Newly created shifts appear in the weekly schedule

Given the manager creates a valid shift,
When the shift is saved,
Then the new shift appears in the weekly schedule.

#### AC-08: Newly created shifts are not Coverage Needed by default

Given the manager creates a new shift,
When the shift is saved,
Then the shift is not shown as Coverage Needed by default.

---

## US-06: Manager approves or rejects coverage requests

As a manager,
I want to review pending coverage requests,
so that shift changes only become final after approval.

### UI

- The manager can view a **Requests** area in the main app.
- The Requests area is shown below the weekly schedule for managers.
- The Requests area contains **Pending Requests** and **Request History** tabs.
- The manager can click a pending request to open a request details dialog.
- The request details dialog shows the shift details, current assigned employee, requesting employee, and request status.
- The manager can approve or reject the request from the dialog.
- The manager can close the dialog without approving or rejecting.

### Acceptance Criteria

#### AC-01: Approve and Reject actions are available only to Managers

Given the current user has either the Manager or Employee role,
When pending requests are displayed,
Then approve and reject actions are available only to Managers, not for Employees.

#### AC-02: Managers can see all pending requests

Given pending coverage requests exist,
When the manager views the Pending Requests tab in the requests area,
Then all pending requests are displayed.

#### AC-03: Manager can open request details

Given pending coverage requests exist,
When the manager clicks a pending request,
Then the request details dialog is displayed.

#### AC-04: Pending request details are displayed

Given the manager opens a pending request,
When the request details are displayed,
Then the manager can see the shift details, current assigned employee, requesting employee, and request status.

#### AC-05: Request must still be pending before approval

Given the manager tries to approve a request,
When the request is no longer pending,
Then the approval is prevented.

#### AC-06: Shift must still be assigned to the original employee before approval

Given the manager tries to approve a request,
When the shift is no longer assigned to the original employee,
Then the approval is prevented.

#### AC-07: Requesting employee must not have an overlapping shift before approval

Given the manager tries to approve a request,
When the requesting employee already has an overlapping assigned shift,
Then the approval is prevented.

#### AC-08: Approved request updates the request

Given a request is valid and pending,
When the manager approves the request,
Then the request is marked as Approved and review information is saved.

#### AC-09: Approved request updates the shift

Given a request is approved,
When the approval is completed,
Then the shift is assigned to the requesting employee and is no longer shown as Coverage Needed or Request Pending.

#### AC-10: Rejected request updates the request

Given a request is pending,
When the manager rejects the request,
Then the request is marked as Rejected and review information is saved.

#### AC-11: Rejected request does not change the shift assignment

Given a request is rejected,
When the rejection is completed,
Then the shift assignment does not change.

#### AC-12: Rejected request makes the shift available for new coverage requests again

Given a request is rejected,
When the rejection is completed,
Then the shift is shown as Coverage Needed and no longer shown as Request Pending.

#### AC-13: Reviewed requests cannot be edited afterward

Given a request has been approved or rejected,
When the manager views the request,
Then the request cannot be edited afterward.

#### AC-14: Manager can close the request details dialog without reviewing

Given the manager has opened a request details dialog,  
When the manager closes the dialog without approving or rejecting,  
Then the request remains Pending.

---

## US-07: Employee views their coverage request status

As an employee,
I want to see the status of my coverage requests on the schedule page,
so that I know whether my requests are pending, approved, or rejected.

### UI

- The schedule page for employee includes a **My Coverage Requests** section.
- This section shows only requests submitted by the current employee.
- Each request shows the related shift, assigned employee before approval, and request status.
- Status is shown with text labels.
- Approved and Rejected are shown as request statuses.
- If a request is approved, the shift appears as a normal assigned shift for the new employee.
- If a request is rejected, the original shift assignment remains unchanged.

### Acceptance Criteria

#### AC-01: Employee can see their submitted coverage requests

Given the employee has submitted coverage requests,
When the employee views the schedule page,
Then the requests are shown in the My Coverage Requests section.

#### AC-02: Pending request status is visible

Given the employee has a pending coverage request,
When the request is displayed,
Then the request status is shown as Pending.

#### AC-03: Approved request status is visible

Given the employee has an approved coverage request,
When the request is displayed,
Then the request status is shown as Approved.

#### AC-04: Rejected request status is visible

Given the employee has a rejected coverage request,
When the request is displayed,
Then the request status is shown as Rejected.

#### AC-05: Approved request is reflected in the schedule

Given the employee's coverage request has been approved,
When the weekly schedule is displayed,
Then the shift is shown as assigned to the employee.

#### AC-06: Rejected request does not change the shift assignment

Given the employee's coverage request has been rejected,
When the weekly schedule is displayed,
Then the shift assignment remains unchanged.

---

## US-08: Manager views request history

As a manager,
I want to view approved and rejected coverage requests,
so that there is a clear record of who approved what.

### UI

- The manager can view a **Request History** tab in the Requests area.
- The history shows approved and rejected requests.
- Pending requests are not shown in the history section.
- Each history item is read-only.
- The manager can see who requested the change and who reviewed it.

### Acceptance Criteria

#### AC-01: Manager can view approved and rejected requests

Given approved or rejected requests exist,
When the manager views Request History,
Then past approved and rejected requests are displayed.

#### AC-02: Pending requests are not shown in history

Given pending requests exist,
When the manager views Request History,
Then pending requests are not displayed in the history section.

#### AC-03: History item details are displayed

Given request history is displayed,
When the manager views a history item,
Then it shows the shift details, requesting employee, final status, reviewing manager, and review timestamp.

#### AC-04: Request history is read-only

Given a request is shown in request history,
When the manager views the request,
Then the request is read-only.

#### AC-05: Reviewed requests are not deleted

Given a request has been approved or rejected,
When the app stores request history,
Then the request is not deleted from the system.
