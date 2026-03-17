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

