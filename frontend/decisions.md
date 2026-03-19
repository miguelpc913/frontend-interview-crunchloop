# Project Decisions (Frontend)

> Scope: This file tracks important architectural and product decisions for the **frontend** repo only. It is based on implementation work and agent-assisted sessions for this project.

## Table of contents

- [Architecture & State Management](#architecture--state-management)
- [UI/UX & Design System](#uiux--design-system)
- [Data Fetching & APIs](#data-fetching--apis)
- [Testing & Quality](#testing--quality)
- [Tooling & Workflow](#tooling--workflow)

---

## How to add a new decision

Use this template for each new decision:

### [YYYY-MM-DD] Short decision name

- **Context**
  - Why this decision was needed.
- **Decision**
  - What was decided.
- **Rationale**
  - Key reasons and trade-offs.
- **Status**: Proposed | Accepted | Deprecated | Replaced
- **Related**
  - Optional links to issues, PRs, or relevant discussions.

---

## Architecture & State Management

### [2026-03-17] React 18 with feature-based structure

- **Context**
  - We needed a simple, modern foundation for the todo lists UI that would be easy to extend.
- **Decision**
  - Use React 18 with functional components and a feature-based folder structure (e.g. `src/features/todoLists`).
- **Rationale**
  - Aligns with modern React best practices and keeps related UI, logic, and types co-located per feature.
  - Makes it easier for new contributors to find code for a given domain (like todo lists) without understanding the entire app.
- **Status**: Accepted
- **Related**
  - `package.json` React 18 setup.

### [2026-03-18] TanStack Router for client-side routing

- **Context**
  - The app grew beyond a single page (todo lists + dashboard) and needed a proper routing solution with type-safe navigation.
- **Decision**
  - Use TanStack Router (`@tanstack/react-router`) for all client-side routing and navigation.
- **Rationale**
  - Provides fully type-safe route definitions and navigation, catching broken links at compile time.
  - Integrates naturally with the existing TanStack ecosystem (TanStack Query).
  - File-based or code-based route trees keep the routing configuration co-located and easy to extend.
- **Status**: Accepted
- **Related**
  - `src/router.tsx`
  - `package.json` `@tanstack/react-router` dependency.

### [2026-03-17] React Query hooks for todo features

- **Context**
  - We needed a consistent way to manage server state for all todo list operations (lists and items) without scattering fetch logic across components.
- **Decision**
  - Use dedicated React Query hooks (e.g. `useTodoListsPage`, `useTodoList`) as the single interface for reading and mutating todo data.
- **Rationale**
  - Centralizes data-fetching and caching concerns per feature, simplifying components and making behaviors like refetching and cache updates predictable.
  - Makes it easier to adjust query keys, stale times, and mutation strategies without touching presentation components.
- **Status**: Accepted
- **Related**
  - `src/features/todoLists/useTodoListsPage.ts`
  - `src/features/todoLists/components/TodoList/useTodoList.ts`

---

## UI/UX & Design System

### [2026-03-17] TailwindCSS for styling the UI

- **Context**
  - We needed a fast way to build a responsive, modern UI for the todo lists without maintaining a large custom CSS codebase.
- **Decision**
  - Use TailwindCSS as the primary styling solution for this frontend.
- **Rationale**
  - Utility classes speed up iteration and keep styles close to the components.
  - Tailwind integrates well with Vite and React and is widely used and documented.
- **Status**: Accepted
- **Related**
  - `package.json` Tailwind dependencies.

### [2026-03-18] shadcn/ui with Radix UI and Lucide icons

- **Context**
  - We needed a consistent, accessible component library that could be customized without fighting upstream abstractions.
- **Decision**
  - Use shadcn/ui as the primary component library, built on Radix UI primitives, styled with TailwindCSS, and using Lucide React for iconography. Supporting utilities include `class-variance-authority`, `clsx`, and `tailwind-merge`.
- **Rationale**
  - shadcn/ui copies component source into the project, giving full ownership and easy customization without version-lock to a package.
  - Radix UI provides accessible, unstyled primitives (dropdowns, checkboxes, tooltips, etc.) so we don't have to build accessibility from scratch.
  - Lucide React offers a large, tree-shakable icon set with consistent design.
  - CVA + clsx + tailwind-merge keep variant logic and class merging clean and predictable.
- **Status**: Accepted
- **Related**
  - `src/components/ui/` directory.
  - `components.json` shadcn/ui configuration.
  - `package.json` `radix-ui`, `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge` dependencies.

### [2026-03-17] Separate skeleton and error views

- **Context**
  - Loading and error UX was previously mixed into core list components, making them harder to read and reuse.
- **Decision**
  - Extract dedicated skeleton and error components for todo lists and the todo lists page, and have container components choose which view to render.
- **Rationale**
  - Keeps core list components focused on the “loaded” state while still providing rich loading and error experiences.
  - Makes it easy to reuse consistent skeletons and error treatments across the app.
- **Status**: Accepted
- **Related**
  - `src/features/todoLists/TodoListsPageSkeleton.tsx`
  - `src/features/todoLists/TodoListsPageError.tsx`
  - `src/features/todoLists/components/TodoList/TodoList.tsx`

---

## Data Fetching & APIs

### [2026-03-17] TanStack Query for server state

- **Context**
  - The todo lists UI needs robust data fetching with caching, loading, and error handling that scales beyond simple `useEffect` calls.
- **Decision**
  - Use TanStack Query for all asynchronous server state and data fetching in the frontend.
- **Rationale**
  - Provides built-in caching, refetching, and error handling patterns with minimal boilerplate.
  - Aligns with modern React data fetching practices and keeps server state concerns separate from local UI state.
- **Status**: Accepted
- **Related**
  - `package.json` `@tanstack/react-query` dependency.

### [2026-03-17] Optimistic updates with toast feedback

- **Context**
  - Todo create/update/delete operations should feel instant while still surfacing failures clearly to the user.
- **Decision**
  - Use React Query mutations with optimistic updates where appropriate, combined with `react-hot-toast` notifications for successes and errors.
- **Rationale**
  - Optimistic updates keep the UI snappy and responsive even with network latency.
  - Toasts provide clear, non-blocking feedback without cluttering the views with error text.
- **Status**: Accepted
- **Related**
  - `src/features/todoLists/components/TodoList/useTodoList.ts`
  - `src/features/todoLists/useTodoListsPage.ts`

### [2026-03-18] React Hook Form with Zod validation

- **Context**
  - The app now has multiple forms (create todo list, add todo item, edit names/descriptions) and we needed a consistent, performant form handling strategy with schema-based validation.
- **Decision**
  - Use React Hook Form (`react-hook-form`) with Zod schemas via `@hookform/resolvers` for all form state management and validation.
- **Rationale**
  - React Hook Form minimizes re-renders by using uncontrolled inputs under the hood, keeping forms fast even as complexity grows.
  - Zod schemas provide a single source of truth for validation rules that can be shared between forms, and the resolver integration wires them into React Hook Form seamlessly.
  - Type inference from Zod schemas (`z.infer`) keeps form value types in sync with validation rules automatically.
- **Status**: Accepted
- **Related**
  - `src/features/todoLists/schemas/todoList.schemas.ts`
  - `src/features/todoLists/hooks/useAddTodoListForm.ts`
  - `src/features/todoLists/components/AddTodoListForm/AddTodoListForm.tsx`
  - `package.json` `react-hook-form`, `@hookform/resolvers`, `zod` dependencies.

### [2026-03-18] Recharts for dashboard visualizations

- **Context**
  - A new dashboard page was added to show completion metrics and per-list statistics, requiring chart components.
- **Decision**
  - Use Recharts (`recharts`) for all data visualization in the dashboard feature.
- **Rationale**
  - Recharts is a composable, React-native charting library built on D3 that fits naturally into a component-based architecture.
  - Provides responsive, declarative chart components (bar, pie, radial, etc.) with minimal configuration.
  - Works well with shadcn/ui's chart wrapper components for consistent theming.
- **Status**: Accepted
- **Related**
  - `src/features/dashboard/DashboardPage.tsx`
  - `src/components/ui/chart.tsx`
  - `package.json` `recharts` dependency.

### [2026-03-17] Drag-and-drop ordering with DnD Kit

- **Context**
  - Todo list items should be reorderable by users without requiring backend changes to support an explicit `order` field.
- **Decision**
  - Use DnD Kit (`@dnd-kit/core`, `@dnd-kit/sortable`) to implement drag-and-drop reordering on the client, persisting a per-list order of item IDs in `localStorage`.
- **Rationale**
  - Keeps the backend API unchanged while still allowing a rich drag-and-drop UX.
  - Local persistence via `localStorage` is sufficient for this app and avoids adding server complexity.
  - DnD Kit provides accessible keyboard and pointer interactions with minimal custom code.
- **Status**: Accepted
- **Related**
  - `src/features/todoLists/hooks/use-item-order.ts`
  - `src/features/todoLists/components/TodoList/TodoList.tsx`
  - `src/features/todoLists/components/TodoListItem/TodoListItem.tsx`

---

## Testing & Quality

### [2026-03-17] ESLint as baseline quality gate

- **Context**
  - We wanted consistent code style and basic static analysis to catch issues early in this small frontend project.
- **Decision**
  - Use ESLint (with React and TypeScript-oriented rules) as the primary linting tool for this repo.
- **Rationale**
  - ESLint integrates well with TypeScript, React, and Vite and is easy to automate via scripts and CI.
  - Keeps the project maintainable as it grows by enforcing consistent patterns.
- **Status**: Accepted
- **Related**
  - `package.json` `lint` script and ESLint dependencies.

---

## Tooling & Workflow

### [2026-03-17] Vite as the build tool

- **Context**
  - We needed fast local development and a simple build pipeline for a React + TypeScript todo lists UI.
- **Decision**
  - Use Vite as the dev server and build tool for this frontend.
- **Rationale**
  - Vite offers very fast dev startup and HMR compared to older bundlers.
  - First-class support for React and TypeScript with minimal configuration.
- **Status**: Accepted
- **Related**
  - `package.json` Vite scripts and dependencies.

### [2026-03-17] ThemeProvider with Tailwind dark mode

- **Context**
  - We wanted first-class light/dark theme support with persistence and alignment to system preferences, while keeping styling within Tailwind.
- **Decision**
  - Use Tailwind’s `darkMode: 'class'` configuration together with a custom `ThemeProvider` that toggles a `dark` class on `document.documentElement` and stores the user preference.
- **Rationale**
  - Keeps theming simple and CSS-driven while still allowing a global React context and hook (`useTheme`) for UI elements like toggles.
  - Respects users’ system theme by default and remembers explicit choices via `localStorage`.
- **Status**: Accepted
- **Related**
  - `tailwind.config.ts`
  - `src/theme/ThemeProvider.tsx`
  - `src/main.tsx`


