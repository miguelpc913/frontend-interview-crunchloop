import { Moon, Sun } from 'lucide-react';
import { TodoListsPage } from './features/todoLists/TodoListsPage';
import { useTheme } from './theme/theme-context.tsx';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
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
    </button>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 md:px-6 md:py-8">
        <header className="mb-4 flex items-center justify-between md:mb-6">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Tasks
            </span>
            <h1 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Todo lists
            </h1>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1">
          <TodoListsPage />
        </main>
      </div>
    </div>
  );
}

export default App;
