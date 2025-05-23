# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2024-11-03

### Added

- Comprehensive test suite for utility functions (todoUtils, dateUtils, logger)
- Mobile-optimized responsive design for all components
- Dropdown select for filters on mobile screens
- Better touch interactions for small screens

### Changed

- Improved form layouts for mobile viewing
- Enhanced button sizing and spacing for touch interactions
- Optimized UI element positioning on small screens
- Standardized visual styles across screen sizes

### Internal

- Reorganized test structure to follow source code organization
- Improved E2E test reliability on different screen sizes
- Enhanced test coverage for critical business logic

## [0.3.0] - 2024-10-10

### Added

- Extended todo model with detailed properties (description, due date)
- Priority levels system (high, medium, low) with optional null value
- Enhanced editing capabilities with inline editing support
- Improved date handling with DueDatePicker component integration
- Advanced sorting functionality (by priority, creation date, due date)
- Integration of shadcn/ui Checkbox component
- Made creation/modification dates more discreet in edit form
- Standardized development plan versioning

### Changed

- Simplified UI by replacing modal approach with inline editing in TodoItem
- Improved form components for better user experience
- Enhanced visual presentation of todo items with priority indicators

### Fixed

- Updated development plan to correct version inconsistencies

### Internal

- Updated unit and integration tests for new features
- Created comprehensive Storybook stories for all enhanced components

## [0.2.0] - 2024-07-29

### Added

- Implemented persistence with localStorage
- Added todo deletion functionality
- Implemented basic filtering (active/completed)

## [0.1.1-core-assembled] - 2024-04-16

### Added

- Assembled core components (`AddTodoForm`, `TodoList`, `TodoItem`) into a functional UI using `TodoContainer`.
- Integrated the main application UI into the router.

## [0.1.0-core] - 2024-04-16

### Added

- Core Todo application functionality:
  - Add new todos
  - List existing todos
  - Mark todos as complete/incomplete
- Basic state management using Zustand
- Unit and integration tests using Vitest and Testing Library
- Storybook setup with interactive stories for core components
- Initial project structure based on Vite PowerFlow starter
- Comprehensive CI/CD workflow and Git hooks

[Unreleased]: https://github.com/shynnobi/vpf-todo-app/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/shynnobi/vpf-todo-app/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/shynnobi/vpf-todo-app/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/shynnobi/vpf-todo-app/compare/v0.1.1-core-assembled...v0.2.0
[0.1.1-core-assembled]: https://github.com/shynnobi/vpf-todo-app/compare/v0.1.0-core...v0.1.1-core-assembled
[0.1.0-core]: https://github.com/shynnobi/vpf-todo-app/releases/tag/v0.1.0-core
