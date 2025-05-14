# vpf-todo-app

A feature-rich To-Do application built with modern web technologies, designed for productivity and usability.

<div align="center">
  <img src="public/vite.svg" alt="Vite Logo" width="100" />
  <br />
  <p>
    <strong>vpf-todo-app</strong> - A powerful To-Do application based on Vite PowerFlow
  </p>
</div>

<div align="center">

![Vite](https://img.shields.io/npm/v/vite?color=646CFF&label=Vite&logo=vite&logoColor=white)
![React](https://img.shields.io/npm/v/react?color=61DAFB&label=React&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/npm/v/typescript?color=3178C6&label=TypeScript&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/npm/v/tailwindcss?color=06B6D4&label=Tailwind%20CSS&logo=tailwindcss&logoColor=white)
![Vitest](https://img.shields.io/npm/v/vitest?color=6E9F18&label=Vitest&logo=vitest&logoColor=white)
![Playwright](https://img.shields.io/npm/v/playwright?color=2EAD33&label=Playwright&logo=playwright&logoColor=white)
![ESLint](https://img.shields.io/npm/v/eslint?color=4B32C3&label=ESLint&logo=eslint&logoColor=white)
![License](https://img.shields.io/github/license/shynnobi/vite-powerflow?color=yellow&label=License)

</div>

## ✨ Features

- ⚡️ **Modern Stack**: Built with [Vite](https://vitejs.dev/) (v6+), [React](https://react.dev/) (v19+), and TypeScript
- 🎨 **Elegant UI**: Styled with [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) components
- 🔍 **Powerful Todo Management**:
  - Create, update, and delete todos
  - Mark todos as complete/incomplete
  - Set priority levels and due dates
  - Filter by status (All, Active, Completed)
  - Sort by multiple criteria (created date, priority, due date)
- 📱 **Responsive Design**: Optimized for both desktop and mobile experiences
- 🌓 **Dark/Light Theme**: Seamless theme switching with system preference detection
- ♿ **Accessibility**: WCAG 2.1 compliant with keyboard navigation, ARIA attributes, and screen reader support
- 🧪 **Comprehensive Testing**: Unit tests with [Vitest](https://vitest.dev/) and E2E tests with [Playwright](https://playwright.dev/)
- 📦 **State Management**: Efficient state handling with [Zustand](https://zustand-demo.pmnd.rs/)
- 🚀 **Data Fetching**: Optimized API interactions with [TanStack Query](https://tanstack.com/query)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/vpf-todo-app.git
cd vpf-todo-app

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test          # Run unit tests
pnpm test:e2e      # Run E2E tests

# Build for production
pnpm build
pnpm preview       # Preview production build locally
```

## 🧩 Usage

After starting the application, you can:

1. **Add a new todo**: Enter a task in the input field and press Enter or click the "Add" button
2. **Mark todo as complete**: Click the checkbox next to the todo
3. **Edit a todo**: Click on the todo text to edit it
4. **Delete a todo**: Click the delete button (trash icon) next to the todo
5. **Filter todos**: Use the filter tabs to show All, Active, or Completed todos
6. **Sort todos**: Select a sort criterion and direction from the dropdown menu
7. **Set priority**: Choose Low, Medium, or High priority when creating or editing a todo
8. **Set due date**: Select a due date from the calendar picker when creating or editing a todo

## 📖 Documentation

- [Features](docs/features.md) - Overview of features and technologies included
- [Getting Started](docs/getting-started.md) - Installation and setup instructions
- [Architecture](docs/architecture.md) - Project structure and organization
- [Development Environment](docs/development.md) - Development tools and workflow
- [Configuration](docs/configuration.md) - Overview of configuration files and options
- [Accessibility](docs/accessibility.md) - Accessibility features and compliance
- [Changelog](CHANGELOG.md) - Version history and updates

## 🧪 Testing

```bash
# Run unit tests
pnpm test

# Run unit tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm test:e2e
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">
  <p>
    <small>
      App generated with <a href="https://github.com/shynnobi/vite-powerflow">Vite PowerFlow</a> starter template by <a href="https://github.com/shynnobi">Shynn</a>
      <br/>
      <img src="https://github.com/shynnobi.png" alt="Shynn" width="30" style="border-radius: 50%; vertical-align: middle; margin-top: 10px" />
    </small>
  </p>
</div>
