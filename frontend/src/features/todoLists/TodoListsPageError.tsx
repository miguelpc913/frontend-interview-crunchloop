import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  AlertAction,
} from '@/components/ui/alert';

interface TodoListsPageErrorProps {
  onRetry: () => void;
}

export function TodoListsPageError({ onRetry }: TodoListsPageErrorProps) {
  return (
    <div className="mx-auto w-full max-w-xl">
      <Alert variant="destructive" className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-4 w-4" aria-hidden="true" />
        <div className="flex-1 space-y-1">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            We could not load your todo lists. Please try again.
          </AlertDescription>
        </div>
        <AlertAction>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-500/70 dark:text-red-100 dark:hover:bg-red-500/20"
          >
            Try again
          </Button>
        </AlertAction>
      </Alert>
    </div>
  );
}

