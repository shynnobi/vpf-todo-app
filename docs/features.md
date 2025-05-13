# Features

vpf-todo-app is a feature-rich task management application built with modern web technologies. Here's what it offers:

## Todo Management Features

- ✏️ **Create & Edit Tasks** - Create new tasks and edit existing ones
- ✅ **Task Completion** - Mark tasks as complete or incomplete with a simple checkbox
- 🚫 **Task Deletion** - Remove unwanted tasks from your list
- 📝 **Task Details** - Add descriptions to provide more context about your tasks
- 🔍 **Filtering** - Filter tasks by status (All, Active, Completed)
- 🔢 **Sorting Options** - Sort tasks by:
  - Title (alphabetically)
  - Priority (high to low or low to high)
  - Due date (earliest to latest or latest to earliest)
  - Creation date (newest to oldest or oldest to newest)
- ⭐ **Priority Levels** - Assign Low, Medium, or High priority to tasks
- 📅 **Due Dates** - Set due dates for your tasks with a date picker
- 🎯 **Visual Indicators** - Color-coded priorities and strikethrough for completed tasks
- 📱 **Responsive Design** - Optimized for both desktop and mobile devices
- 🌓 **Theme Switching** - Toggle between light and dark themes

## Persistent Storage

- 💾 **Local Storage** - Your todos are saved in the browser's local storage
- 🔄 **Automatic Saving** - Changes are automatically persisted

## Technical Implementation

### Core Technologies

- ⚡️ [Vite](https://vitejs.dev/) (v6+) - Lightning fast build tool
- ⚛️ [React](https://react.dev/) (v19+) - UI library with functional components and hooks
- 📝 [TypeScript](https://www.typescriptlang.org/) - Type safety throughout the codebase

### UI & Styling

- 🎨 [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- 🎭 [shadcn/ui](https://ui.shadcn.com/) - Accessible and customizable components
- 🌓 Dark mode with system preference detection

### State Management

- 📦 [Zustand](https://zustand-demo.pmnd.rs/) - Simple, fast state management
- 🔄 Optimized rendering with useMemo and selective state subscriptions

### Code Quality

- 🧪 Unit and integration tests with [Vitest](https://vitest.dev/)
- 🎭 End-to-end testing with [Playwright](https://playwright.dev/)
- 📝 [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for code quality
- 📚 Extensive JSDoc comments for better code documentation
