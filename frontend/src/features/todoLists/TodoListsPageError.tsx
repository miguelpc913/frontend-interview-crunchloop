import { AlertCircle } from 'lucide-react';

interface TodoListsPageErrorProps {
  onRetry: () => void;
}

export function TodoListsPageError({ onRetry }: TodoListsPageErrorProps) {
  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-800 shadow-sm flex items-start gap-3">
      <div className="mt-0.5 text-red-500">
        <AlertCircle className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className="font-medium">
          Something went wrong while loading your todo lists.
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="ml-2 inline-flex items-center rounded-full border border-red-300 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-2 focus-visible:ring-offset-red-50"
      >
        Try again
      </button>
    </div>
  );
}

