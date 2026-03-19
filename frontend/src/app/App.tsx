import { Moon, Sun, ListTodo, BarChart3 } from 'lucide-react';
import { Link, Outlet } from '@tanstack/react-router';
import { useTheme } from '@/shared/theme/theme-context';
import { Button } from '@/shared/ui/button';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="rounded-full bg-white/80 text-xs text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-slate-700"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <span className="mr-1.5 flex items-center">
        {isDark ? (
          <Sun className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Moon className="h-3.5 w-3.5" aria-hidden="true" />
        )}
      </span>
      <span className="hidden sm:inline">
        {isDark ? 'Light mode' : 'Dark mode'}
      </span>
    </Button>
  );
}

function NavLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 [&.active]:bg-white [&.active]:text-slate-900 [&.active]:shadow-sm dark:[&.active]:bg-slate-800 dark:[&.active]:text-slate-100"
      activeProps={{ className: 'active' }}
    >
      {children}
    </Link>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 md:px-6 md:py-8">
        <header className="mb-4 flex items-center justify-between md:mb-6">
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Tasks
              </span>
              <h1 className="text-base font-semibold text-slate-900 dark:text-slate-50">
                Todo lists
              </h1>
            </div>
            <nav className="ml-4 flex items-center gap-1 rounded-xl bg-slate-200/60 p-1 dark:bg-slate-800/60">
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
