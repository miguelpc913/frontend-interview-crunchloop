import { ListTodo, BarChart3 } from 'lucide-react';
import { Outlet } from '@tanstack/react-router';
import { ThemeToggle } from './components/ThemeToggle';
import { NavLink } from './components/NavLink';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 md:px-6 md:py-8">
        <header className="mb-4 flex items-center justify-between md:mb-6">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Tasks
              </span>
              <h1 className="text-base font-semibold">
                Todo lists
              </h1>
            </div>
            <nav className="ml-4 flex items-center gap-1 rounded-xl border border-border bg-muted/70 p-1">
              <NavLink to="/">
                <ListTodo className="h-3.5 w-3.5" />
                Lists
              </NavLink>
              <NavLink to="/dashboard">
                <BarChart3 className="h-3.5 w-3.5" />
                Dashboard
              </NavLink>
            </nav>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default App;
