## Refactoring Plan - Branch `refactor-advanced-filtering`

**Objective:** Reimplement and enhance task management features cleanly and with robust testing, starting from the stable state `c45f33c`.

**Guiding Principles:**

- **Test-Driven (where relevant):** Write or adapt tests _before_ or _during_ the implementation of each feature.
- **Test Validation:** Ensure all tests (unit and integration) related to the feature pass and cover relevant use cases.
- **Atomic Commits:** Create a distinct and descriptive commit for each feature once it is implemented _and_ tested.
- **Test Strategy Review:** Re-evaluate which tests belong to unit, integration, or potentially End-to-End (E2E) testing as complexity grows, ensuring the right level of testing for each feature.

**Features to Implement/Improve:**

- [ ] **1. Deletion Confirmation:**
  - [ ] Implement the confirmation dialog (`AlertDialog` from `shadcn/ui`) in `TodoItem`.
  - [ ] Verify/adapt `TodoItem` unit tests to cover confirmation/cancellation.
  - [ ] Verify/adapt `TodoContainer` integration tests to simulate deletion confirmation.
- [ ] **2. Calendar (`DatePicker`):**
  - [ ] Reintroduce the `DatePicker` component from `shadcn/ui`.
  - [ ] Integrate `DatePicker` into `TodoItem`'s edit mode for selecting due dates.
  - [ ] Add a 'Today' button for quick selection.re
  - [ ] Configure the `DatePicker` to disable dates before today.
  - [ ] Implement a robust testing strategy for `DatePicker` within `TodoItem` (potentially mocking as previously discussed).
  - [ ] Verify/adapt impacted unit and integration tests.
- [ ] **3. Due Date in `AddTodoForm`:**
  - [ ] Add the `DatePicker` component to the `AddTodoForm`.
  - [ ] Update the store logic (`useTodoStore`) to handle `dueDate` on addition.
  - [ ] Verify/adapt unit tests for `AddTodoForm` and the store.
  - [ ] Verify/adapt `TodoContainer` integration tests.
- [ ] **4. UI Harmonization (Icons & Buttons):**
  - [ ] Standardize all icons using `lucide-react`, replacing any icons from other libraries.
  - [ ] Ensure interactive elements (buttons, clickable icons) have `cursor: pointer`.
  - [ ] Add appropriate icons (e.g., chevrons) to filter/sort buttons.
  - [ ] Harmonize the visual style (size, padding, variants) of feature buttons (filters, sort, add).
  - [ ] Visually verify changes and adapt tests if CSS selectors or snapshots are impacted.
- [ ] **5. "Clear" Button for Filters/Sorts:**
  - [ ] Add a button to reset active filters and/or sorts.
  - [ ] Implement the reset logic in the store or container component.
  - [ ] Add/adapt tests for this functionality.
- [ ] **6. Advanced Date Filters:**
  - [ ] Add date filtering options (Overdue, Today, This week, This month) to the UI (`TodoFilter`?).
  - [ ] Implement the corresponding filtering logic in the store (`useTodoStore`).
  - [ ] Add unit tests for the new store filtering logic.
  - [ ] Add/adapt integration tests to cover these new filters.
