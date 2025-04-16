# Tests Structure

This folder contains all the tests for the project, organized by type:

## Test Types

### Unit Tests (`/unit`)

- Individual tests for components and functions
- Extension: `.test.tsx` or `.test.ts`
- Uses: Vitest + Testing Library
- Focus: Isolated component behavior
- Approach: BDD (Behavior-Driven Development) with Given-When-Then format

### Integration Tests (`/integration`)

- Tests interactions between components
- Extension: `.integration.test.tsx`
- Uses: Vitest + Testing Library + MSW (for API mocking)
- Focus: Complete flows and component interactions
- Approach: BDD (Behavior-Driven Development) with Given-When-Then format
- Example cases:
  - Complex forms
  - Navigation flows
  - Interactions with global state
  - API integration (mocked)

### E2E Tests (`/e2e`)

- End-to-end tests
- Extension: `.spec.ts`
- Uses: Playwright
- Focus: Full user journeys

## Configuration

### Unit & Integration Tests

```bash
pnpm test
```

```bash
pnpm test:watch
```

```bash
pnpm test:coverage
```

### E2E Tests

```bash
pnpm test:e2e
```

```bash
pnpm test:e2e:ui
```

## Best Practices

### Unit Tests

- One test per behavior
- Maximum isolation
- Use mocks for dependencies
- Follow the Given-When-Then pattern (BDD approach)
- Comment each test step with Given/When/Then

### Integration Tests

- Test complete flows
- Use MSW to mock API calls
- Focus on user interactions
- Verify intermediate states
- Follow the Given-When-Then pattern (BDD approach)
- Comment each test step with Given/When/Then

### E2E Tests

- Complete user scenarios
- Multi-page tests
- Verify redirections
- Test critical flows

## Test File Structure

```
tests/
├── unit/             # Unit tests
│   ├── components/   # Component tests
│   ├── hooks/        # Hook tests
│   └── utils/        # Utility function tests
├── integration/      # Integration tests
│   ├── flows/        # Full flow tests
│   └── features/     # Feature tests
└── e2e/              # End-to-end tests
    └── specs/        # E2E specifications
```

## Behavior-Driven Development (BDD) Approach

All unit and integration tests follow the BDD approach using the Given-When-Then format:

1. **Given**: Initial context setup (preconditions)
2. **When**: Action being performed
3. **Then**: Expected outcomes to verify

Each test contains comments explicitly marking these three sections for clarity and consistency.

## Tools & Dependencies

- **Vitest**: Test framework
- **Testing Library**: React testing utilities
- **MSW**: API request mocking
- **Playwright**: E2E testing
- **jest-dom**: Additional DOM assertions
