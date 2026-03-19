import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/shared/theme/theme-context';
import { Button } from '@/shared/ui/button';

export function ThemeToggle() {
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
