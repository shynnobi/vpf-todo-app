# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

## [0.2.0] - 2024-07-29

### Added

- Todo list persistence using LocalStorage (`feat/persistence`).
- Ability to delete individual todo items (`feat/todo-deletion`).
- Basic filtering functionality (All, Active, Completed) (`feat/basic-filtering`).
- Storybook stories for the `TodoFilter` component.

### Changed

- Updated dependencies based on Dependabot alerts (multiple updates).
- Refactored unit tests (`TodoContainer`, `todoStore`) for improved maintainability.
- Refactored component prop interfaces and type definitions for better organization.
- Simplified `todoStore` implementation.

### Internal

- Updated test configurations and integration tests to accommodate new features.

## [0.1.1-core-assembled] - 2025-04-16

### Added

- Assembled core components (`AddTodoForm`, `TodoList`, `TodoItem`) into a functional UI using `TodoContainer`.
- Integrated the main application UI into the router.

## [0.1.0-core] - 2025-04-16

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
