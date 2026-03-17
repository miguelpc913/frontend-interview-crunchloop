import { AlertCircle } from 'lucide-react';

interface TodoListErrorProps {
  onRetry: () => void;
}

export function TodoListError({ onRetry }: TodoListErrorProps) {
  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-800 shadow-sm flex items-start gap-3 dark:border-red-500/60 dark:bg-red-500/10 dark:text-red-100">
      <div className="mt-0.5 text-red-500">
        <AlertCircle className="h-4 w-4" aria-hidden="true" />
      </div>
      <span className="flex-1 text-sm font-medium">Could not load this todo list.</span>
      <button
        type="button"
        onClick={onRetry}
        className="ml-2 inline-flex items-center rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-red-50 dark:border-red-500/70 dark:text-red-100 dark:hover:bg-red-500/20 dark:focus-visible:ring-red-500"
      >
        Retry
      </button>
    </div>
  );
}

