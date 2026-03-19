import { AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/shared/ui/alert';

interface TodoListErrorProps {
  onRetry: () => void;
}

export function TodoListError({ onRetry }: TodoListErrorProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <Alert variant="destructive" className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-4 w-4" aria-hidden="true" />
        <div className="flex-1 space-y-1">
          <AlertTitle>Could not load this todo list</AlertTitle>
          <AlertDescription>
            There was a problem loading this list. You can try again.
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
            Retry
          </Button>
        </AlertAction>
      </Alert>
    </div>
  );
}

