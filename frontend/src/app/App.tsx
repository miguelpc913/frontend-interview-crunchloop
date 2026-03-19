import { ListTodo, BarChart3 } from 'lucide-react';
import { Outlet } from '@tanstack/react-router';
import { ThemeToggle } from './components/ThemeToggle';
import { NavLink } from './components/NavLink';

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
