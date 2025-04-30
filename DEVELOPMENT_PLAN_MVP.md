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

**Branch: `feat/todo-detail-modal`** (Moved from Phase 4)

- [ ] MODAL-1: Design and implement Todo Detail Modal component UI.
- [ ] MODAL-2: Implement logic to fetch/display full todo details.
- [ ] MODAL-3: Integrate modal triggering (e.g., from TodoItem).
- [ ] MODAL-4: Write unit tests for the Modal component.
- [ ] MODAL-5: Adapt integration tests if necessary.
- [ ] MODAL-STORY: Create Storybook stories for the Modal.
- [ ] MODAL-6: Create PR `feat/todo-detail-modal` → `dev`

**Advanced Data Features & Interactions Version (v0.3.0)** (Target)

- [ ] FEAT-1: Verify advanced feature PRs are merged (Optional Priority, Modal, Due Date)
- [ ] FEAT-2: All tests pass
- [ ] FEAT-3: Create tag `v0.3.0`

## Phase 4: Strategic Refactoring & Feature Enhancements

**Branch: `refactor/behavioral-tests-review`** (Improve Test Robustness)

- [ ] BEHAV-TEST-1: Review `AddTodoForm.test.tsx` for behavioral focus. Refactor if needed.
- [ ] BEHAV-TEST-2: Review `TodoList.test.tsx` for behavioral focus. Refactor if needed.
- [ ] BEHAV-TEST-3: Review `TodoItem.test.tsx` for behavioral focus (consider date picker mock stability). Refactor if needed.
- [ ] BEHAV-TEST-4: Review `TodoFilter.test.tsx` for behavioral focus. Refactor if needed.
- [ ] BEHAV-TEST-5: Review `TodoContainer.test.tsx` (integration) - Coordinate with `refactor/integration-tests`.
- [ ] BEHAV-TEST-6: Create PR `refactor/behavioral-tests-review` → `dev`

**Branch: `refactor/integration-tests`** (Simplify Integration Tests)

- [ ] INTEG-REF-1: Apply simplifications/removals to `TodoContainer.integration.test.tsx` as per TESTING_REFACTOR_PLAN.
  - **Keep:** Initial rendering test.
  - **Simplify:** Addition (check text/checkbox, remove counter).
  - **Simplify:** Multiple additions (check text, remove counter).
  - **Simplify:** Toggle completion (check text/style, remove counter).
  - **Simplify:** Deletion (check disappearance/empty state, remove counter).
  - **Simplify:** Delete one of multiple (check disappearance/presence, remove counter).
  - **Simplify:** Persistence (keep main logic, remove counter).
  - **Simplify:** Filter controls presence (remove count/aria-pressed checks).
  - **Simplify:** Filtering logic (check item presence/absence, remove aria-pressed checks).
  - **Simplify:** Clear completed (check item presence/absence, remove counter checks).
  - **Remove:** Redundant full UI flow test.
  - **Remove:** Tests focusing solely on counters.
- [ ] INTEG-REF-2: Verify the integration test suite passes after changes.
- [ ] INTEG-REF-3: Document identified E2E candidates clearly (See E2E tests below).
- [ ] INTEG-REF-4: Create PR `refactor/integration-tests` → `dev`

**Branch: `feat/e2e-tests`** (Implement End-to-End Tests)

- [ ] E2E-SETUP-1: Choose and install E2E framework (e.g., Playwright).
- [ ] E2E-SETUP-2: Configure base setup, scripts, and CI integration if possible.
- [ ] E2E-IMPL-SCENARIOS: Implement E2E tests for identified candidates:
  - Precise validation of counters (`TodoStats`, filter buttons) after actions.
  - Verification of `aria-pressed` state on filter buttons.
  - Full user flow: Add -> Complete -> Filter (Active) -> All -> Clear Completed -> Delete last.
  - Testing editing, including real DatePicker interaction.
  - Testing deletion confirmation dialog flow.
- [ ] E2E-5: Create PR `feat/e2e-tests` → `dev`

**Branch: `refactor/ui-harmonization`** (Improve UI Consistency)

- [ ] UI-HARM-1: Finalize `lucide-react` icon standardization.
- [ ] UI-HARM-2: Ensure consistent `cursor: pointer` on interactive elements.
- [ ] UI-HARM-3: Harmonize filter/sort button icons & visual styles.
- [ ] UI-HARM-4: Visually verify UI consistency. Adapt snapshots/tests if needed.
- [ ] UI-HARM-5: Create PR `refactor/ui-harmonization` → `dev`

**Branch: `feat/clear-form-fields`** (Reset Add Form Date/Priority)

- [ ] CLEAR-FORM-1: Add 'Clear' button/icon to `AddTodoForm` for Date and Priority fields.
- [ ] CLEAR-FORM-2: Implement logic to reset Date and Priority state in the form.
- [ ] CLEAR-FORM-3: Add unit tests for the clear functionality in `AddTodoForm`.
- [ ] CLEAR-FORM-4: Create PR `feat/clear-form-fields` → `dev`

**Refactored & Enhanced Version (v0.4.0)** (Target)

- [ ] REFACTOR-1: Verify refactoring and new feature PRs are merged.
- [ ] REFACTOR-2: All test suites (Unit, Integration, E2E) pass.
- [ ] REFACTOR-3: Create tag `v0.4.0`

## Phase 5: Polish & Production Readiness

**Branch: `enhance/ui-polish`**

- [ ] POL-1: Implement responsive design improvements.
- [ ] POL-2: Add subtle animations and transitions.
- [ ] POL-3: Improve empty states and loading/error handling visuals.
- [ ] POL-4: Create PR `enhance/ui-polish` → `dev`

**Branch: `enhance/accessibility`**

- [ ] A11Y-1: Thoroughly test and implement keyboard navigation.
- [ ] A11Y-2: Verify and ensure proper ARIA attributes across components.
- [ ] A11Y-3: Test and improve screen reader compatibility.
- [ ] A11Y-4: Create PR `enhance/accessibility` → `dev`

**Branch: `enhance/documentation`**

- [ ] DOC-1: Update README with comprehensive usage instructions and feature list.
- [ ] DOC-2: Add/Improve JSDoc comments throughout the codebase.
- [ ] DOC-3: Create architecture overview document if needed.
- [ ] DOC-4: Create PR `enhance/documentation` → `dev`

**Production Ready Version (v1.0.0)** (Target)

- [ ] PROD-1: Verify polish and documentation PRs are merged.
- [ ] PROD-2: Final round of testing across all levels.
- [ ] PROD-3: Create tag `v1.0.0`
