# Utility Scripts

This folder contains utility scripts to enhance the development workflow.

## validate-with-indicators.sh

This script enhances the standard `pnpm validate` command by adding visual indicators for each step of the validation process.

### Features

- ✨ **Visual indicators**: Clearly displays the status of each step (starting, in progress, completed, failed)
- 🔄 **Animated spinner**: A visual indicator during command execution
- 🎨 **Colored output**: Uses colors to easily distinguish between different states
- ❌ **Error display**: In case of failure, shows error details

### Example output

```
* Starting validation
===============================================================
==> Starting: Checking code formatting (Prettier)...
✓ Completed: Checking code formatting (Prettier)
==> Starting: Running static code analysis (ESLint)...
✓ Completed: Running static code analysis (ESLint)
==> Starting: Verifying TypeScript types...
✓ Completed: Verifying TypeScript types
==> Starting: Running unit tests...
✓ Completed: Running unit tests
==> Starting: Running E2E tests...
✓ Completed: Running E2E tests

✅ All checks passed successfully!
===============================================================
```

### Usage

To run validation with visual indicators, use:

```bash
pnpm validate:visual
```

### How it works

The script runs the same commands as `pnpm validate` but adds:

1. A startup message for each step
2. An animated spinner during execution
3. A clearly visible success/failure message
4. Error details in case of failure

If a step fails, the script displays the error details and stops immediately.
