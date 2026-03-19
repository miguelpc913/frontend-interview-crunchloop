# Todo Lists UI

A production-style frontend for managing todo lists and visualizing completion data.

Built as a take-home submission with a strong focus on:
- feature-oriented architecture
- type-safe React patterns
- resilient async state management with TanStack Query
- accessible and responsive UI behavior
- meaningful unit/integration/E2E coverage

## Tech Stack

- React 18 + TypeScript
- Vite
- TanStack Query + TanStack Router
- React Hook Form + Zod
- shadcn/ui + Tailwind CSS
- Vitest + React Testing Library + MSW
- Playwright

## Local Development

Install dependencies:

```bash
npm install
```

Run app:

```bash
npm run dev
```

Run quality checks:

```bash
npm run lint
npm run test:run
npm run test:e2e
```

## Architecture

The project follows a feature-first structure:

- `src/features/todoLists`: list/task domain, hooks, mutations, schemas, and page orchestration
- `src/features/dashboard`: derived analytics and chart rendering
- `src/shared`: UI primitives, shared utilities, and theme provider
- `src/app`: router setup and layout shell

Key design decisions:
- API calls are centralized in a typed service layer with consistent error handling.
- Query cache is the source of truth for server state.
- Mutations use optimistic updates where it improves perceived responsiveness.
- UI components stay focused on rendering; state orchestration lives in hooks.

## Product Behaviors

- Create, rename, delete lists
- Add, edit, delete, and reorder tasks
- Filter and search tasks per list
- Theme toggle with persisted preference
- Dashboard with completion and size visualizations
- Loading/empty/error states for primary flows

## Quality Notes

- Accessibility: labeled inputs, keyboard-friendly controls, and semantic interactive elements.
- Resilience: failed HTTP responses are surfaced as typed errors instead of silent JSON parsing failures.
- Performance: deferred search filtering and minimized unnecessary memoization.
- Maintainability: reduced duplication and clarified mutation/state boundaries.

## Tradeoffs and Next Steps

Given more time, the highest-value improvements would be:
- persist task order on the backend instead of localStorage-only
- replace `window.confirm` with a richer confirmation dialog pattern
- introduce typed API client tests around retries and network failures
- add virtualization if task counts grow significantly
