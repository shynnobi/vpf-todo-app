# User Stories - Todo Application

This document describes the user stories and acceptance criteria for the Todo application, organized by priority.

## Essential Features (MVP)

### US-1: Task Creation

**As a** user,
**I want** to create a new task,
**So that** I can keep track of things I need to do.

**Acceptance Criteria:**

- A form allows entering a task title
- The form includes a submit button to create the task
- A newly created task appears immediately in the list
- A newly created task is marked as "incomplete" by default
- The input field is cleared after task creation
- The task title is required (minimum 1 character)
- A visual notification confirms successful task creation

### US-2: Task Display

**As a** user,
**I want** to see all my tasks in a list,
**So that** I can visualize everything I need to do.

**Acceptance Criteria:**

- All tasks are displayed in a list
- Each task displays its title and status (complete or incomplete)
- Tasks are sorted by default by creation order (most recent at the bottom)
- A message is displayed when the list is empty
- The list refreshes automatically when tasks are added, modified, or deleted

### US-3: Marking Tasks as Completed

**As a** user,
**I want** to mark a task as completed,
**So that** I can track my progress.

**Acceptance Criteria:**

- Each task has a checkbox to change its state
- The visual state of the task clearly changes when marked as completed (e.g., strikethrough, grayed out)
- State changes are saved immediately
- It's possible to change a completed task back to "incomplete"

### US-4: Task Deletion

**As a** user,
**I want** to delete a task,
**So that** I can remove items that are no longer relevant.

**Acceptance Criteria:**

- Each task has a delete button or icon
- Confirmation is requested before permanent deletion
- The task disappears from the list after deletion
- A notification confirms successful deletion

### US-5: Data Persistence

**As a** user,
**I want** my tasks to be saved between sessions,
**So that** I don't lose my data when I leave the application.

**Acceptance Criteria:**

- Tasks are saved in the browser's localStorage
- Tasks are automatically retrieved when loading the application
- Saving is automatic with each modification (addition, modification, deletion)
- The user is notified in case of saving error

## Advanced Features (Post-MVP)

### US-6: Task Filtering

**As a** user,
**I want** to filter my tasks by status (completed, incomplete, all),
**So that** I can focus on relevant tasks.

**Acceptance Criteria:**

- Filtering options are available (All / Active / Completed)
- The applied filter is visually indicated
- The list updates instantly when a filter is applied
- The selected filter persists when the page is reloaded

### US-7: Task Editing

**As a** user,
**I want** to modify the title of an existing task,
**So that** I can correct errors or clarify the description.

**Acceptance Criteria:**

- Each task can be set to edit mode (double-click or dedicated button)
- In edit mode, the title can be modified in an input field
- The modification is confirmed by pressing Enter or a confirmation button
- Editing can be canceled by pressing Escape or a cancel button
- An empty task (after editing) is not accepted

### US-8: Adding Priorities to Tasks

**As a** user,
**I want** to assign a priority to my tasks,
**So that** I can better organize my work.

**Acceptance Criteria:**

- Ability to assign a priority (Low / Medium / High)
- The interface visually displays the priority (colors, icons)
- Priority can be modified after creation
- Option to sort tasks by priority
- Default priority = Medium

### US-9: Adding Due Dates

**As a** user,
**I want** to add a due date to my tasks,
**So that** I can track deadlines.

**Acceptance Criteria:**

- Interface to select a date (calendar)
- Visual display of the due date on each task
- Visual indication of overdue tasks
- Ability to sort by due date
- Option to filter tasks with approaching deadlines

### US-10: Dark/Light Theme

**As a** user,
**I want** to choose between a light and dark theme,
**So that** I can adapt the interface to my preferences and usage conditions.

**Acceptance Criteria:**

- Accessible theme toggle button
- Smooth visual transition between themes
- Theme preference saved between sessions
- Respect of system preference by default (prefers-color-scheme)
