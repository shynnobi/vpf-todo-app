# MVP-Oriented Todo Application Development Plan (Consolidated)

> **Note**: This development plan follows an MVP approach with incremental delivery of complete user features and strategic refactoring phases.

## Phase 0: Epic Definition & Roadmapping

**Branch: `chore/initial-setup`**

- [x] EPIC-1: Define user stories and acceptance criteria
- [x] EPIC-2: Create user flow diagrams
- [x] EPIC-3: Define MVP scope and feature prioritization
- [x] EPIC-4: Identify technical constraints and requirements

## Phase 1: Foundation & Core Functionality MVP

**Branch: `mvp/core-foundation`**

- [x] FOUND-1: Define minimal Todo model (id, title, completed only)
- [x] FOUND-2: Write tests for basic store operations (add/complete)
- [x] FOUND-3: Implement basic store operations
- [x] FOUND-4: Create PR `mvp/core-foundation` → `dev`

**Branch: `mvp/add-todo-feature`**

- [x] ADD-1: Write tests for "Add Todo" feature
- [x] ADD-2: Implement minimal AddTodo form component
- [x] ADD-3: Implement store integration for adding todos
- [x] ADD-4: Create PR `mvp/add-todo-feature` → `dev`

**Branch: `mvp/list-todos-feature`**

- [x] LIST-1: Write tests for "List Todos" feature
- [x] LIST-2: Implement minimal TodoList component
- [x] LIST-3: Implement store integration for listing todos
- [x] LIST-4: Create PR `mvp/list-todos-feature` → `dev`

**Branch: `mvp/complete-todo-feature`**

- [x] COMP-1: Write tests for "Complete Todo" feature
- [x] COMP-2: Implement completion toggle in TodoItem
- [x] COMP-3: Implement store integration for toggling completion
- [x] COMP-4: PR not needed, feature implemented earlier

**Branch: `feat/app-assembly`**

- [x] ASMBLY-1: Create a container component (e.g., `TodoContainer`) that integrates `AddTodoForm` and `TodoList`.
- [x] ASMBLY-2: Render the container component within `App.tsx`.
- [x] ASMBLY-3: Write basic integration tests for the assembled UI.
- [x] ASMBLY-4: Create PR `feat/app-assembly` → `dev`.

**First Usable Version (v0.1.1-core-assembled)**

- [x] MVP-1: Verify core functionality PRs are merged
- [x] MVP-2: All tests pass for core features
- [x] MVP-3: Create tag `v0.1.0-core` _(Initial core tag created)_
- [x] MVP-4: Create tag `v0.1.1-core-assembled`

## Phase 2: Essential Enhancements

**Branch: `feat/persistence`**

- [x] PERS-1: Write tests for localStorage persistence
- [x] PERS-2: Implement saving/loading from localStorage
- [x] PERS-3: Create PR `feat/persistence` → `dev`

**Branch: `feat/todo-deletion`**

- [x] DEL-1: Write tests for "Delete Todo" feature
- [x] DEL-2: Implement delete button in TodoItem
- [x] DEL-3: Implement store integration for deleting
- [ ] DEL-CONFIRM-TESTS: Verify/Adapt tests for deletion confirmation dialog (Post-implementation check from REFACTORING_PLAN#1)
- [x] DEL-4: Create PR `feat/todo-deletion` → `dev` (Dialog added later)

**Branch: `feat/basic-filtering`**

- [x] FILT-1: Write tests for "Filter Todos" feature (active/completed)
- [x] FILT-2: Implement basic filter controls (`TodoFilter`)
- [x] FILT-3: Implement store integration for filtering
- [x] FILT-STORY: Create Storybook stories for TodoFilter component
- [x] FILT-4: Create PR `feat/basic-filtering` → `dev`

**Enhanced Usable Version (v0.2.0)**

- [x] ENH-1: Verify enhancement PRs are merged
- [x] ENH-2: All tests pass
- [x] ENH-3: Create tag `v0.2.0`

## Phase 3: Advanced Data Features & Core Interactions

**Branch: `feat/todo-details`** (Included Description & Initial Due Date Logic)

- [x] DET-1: Write/Adapt store tests for description and due date handling
- [x] DET-2: Extend Todo model with description and due date
- [x] DET-3: Adapt store functions for new fields (make DET-1 pass)
- [x] DET-4: Write tests for enhanced Todo editing UI/interaction
- [x] DET-5: Implement detailed Todo edit form component
- [x] DET-6: Update TodoItem to display additional details & integrate edit form
- [x] DET-STORY: Create Storybook stories for updated TodoItem and new Edit Form
- [x] DET-7: Create PR `feat/todo-details` → `dev` (Initial PR merged)

**Branch: `feat/prioritization`**

- [x] PRIO-1: Write tests for priority features (add, edit, sort)
- [x] PRIO-2: Extend Todo model with priority levels
- [x] PRIO-3: Implement sorting by priority (in store)
- [x] PRIO-4: Implement priority selector in forms
- [x] PRIO-5: Implement priority display in TodoItem
- [x] PRIO-STORY: Create/Update Storybook stories for AddTodoForm & TodoItem
- [x] PRIO-6: Create PR `feat/prioritization` → `dev`

**Branch: `feat/optional-priority`**

- [x] OPT-PRIO-1: Adapt tests for optional priority (add, edit, sort, display)
- [x] OPT-PRIO-2: Update Todo model & types (`priority?: PriorityLevel | null`)
- [x] OPT-PRIO-3: Adapt store logic (add/edit/sort) to handle `null` priority
- [x] OPT-PRIO-4: Update forms to allow selecting "No Priority" (`null`)
- [x] OPT-PRIO-5: Update display components to handle `null` priority
- [x] OPT-PRIO-STORY: Update Storybook stories (AddTodoForm, TodoItem) for optional priority
- [x] OPT-PRIO-6: Create PR `feat/optional-priority` → `dev` (Marked as done)

**Branch: `feat/add-due-date`** (Moved from Phase 4 & Consolidated Calendar Work)

- [x] DATE-1: Finaliser `DatePicker` integration in `AddTodoForm`.
- [x] DATE-2: Finaliser `DatePicker` integration in `TodoItem` edit mode.
- [x] DATE-3: Ensure store logic correctly handles `dueDate` on addition and update.
- [x] DATE-4: Write/Adapt stable unit tests for `DueDatePicker` component.
- [x] DATE-5: Write/Adapt relevant integration tests covering date addition/editing.
- [x] DATE-6: Create PR `feat/add-due-date` → `dev`

**Branch: `feat/interactive-todo-modal`**

> **Implementation approach change (2023-10-20)**: After UX evaluation, we opted for direct inline editing in `TodoItem` instead of a modal approach. This simpler solution improves the user experience and reduces code complexity.

- [x] INLINE-EDIT-1: Remove complex modal in favor of simpler inline editing in `TodoItem`
- [x] INLINE-EDIT-2: Implement inline editing for all fields directly in the list view
- [x] INLINE-EDIT-3: Implement save and cancel functionality for in-place edits
- [x] INLINE-EDIT-4: Update unit and integration tests for inline editing approach
- [x] INLINE-EDIT-5: Adapt E2E tests to reflect the new approach
- [x] INLINE-EDIT-6: Create PR `feat/interactive-todo-modal` → `dev`

**Advanced Data Features & Interactions Version (v0.3.0)**

- [x] FEAT-1: Verify advanced feature PRs are merged (Optional Priority, Inline Editing, Due Date)
- [x] FEAT-2: All tests pass
- [x] FEAT-3: Create tag `v0.3.0`

## Phase 4: Refinements & Polish

**Branch: `feat/responsive-improvements`**

- [x] UI-1: Replace native checkbox with shadcn/ui Checkbox component
- [x] UI-2: Make creation/modification dates more discreet in edit form
- [x] UI-3: Finalize `lucide-react` icon standardization throughout the application
- [x] UI-4: Ensure consistent spacing, margins and visual style
- [x] UI-5: Improve responsive design for mobile devices
- [x] UI-6: Create PR `feat/responsive-improvements` → `dev`

**Branch: `enhance/test-coverage`**

- [x] TEST-1: Review test coverage and identify critical gaps (if any)
- [x] TEST-2: Add targeted tests for any uncovered scenarios
- [x] TEST-3: Ensure all E2E tests match the current application behavior
- [x] TEST-4: Create PR `enhance/test-coverage` → `dev`

**Refined Version (v0.4.0)**

- [x] REFINE-1: Verify UI and test enhancement PRs are merged
- [x] REFINE-2: All test suites (Unit, Integration, E2E) pass
- [x] REFINE-3: Create tag `v0.4.0`

## Phase 5: Final Production Readiness

**Branch: `enhance/documentation`**

- [ ] DOC-1: Update README with comprehensive usage instructions and feature list
- [ ] DOC-2: Add/Improve JSDoc comments throughout the codebase
- [ ] DOC-3: Create PR `enhance/documentation` → `dev`

**Branch: `enhance/accessibility`**

- [ ] A11Y-1: Verify keyboard navigation throughout the application
- [ ] A11Y-2: Ensure proper ARIA attributes across components
- [ ] A11Y-3: Test and improve screen reader compatibility
- [ ] A11Y-4: Create PR `enhance/accessibility` → `dev`

**Production Ready Version (v1.0.0)**

- [ ] PROD-1: Verify documentation and accessibility PRs are merged
- [ ] PROD-2: Final round of testing across all levels
- [ ] PROD-3: Create tag `v1.0.0`
