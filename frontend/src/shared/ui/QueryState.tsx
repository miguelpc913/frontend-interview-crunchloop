import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  AlertAction,
} from '@/shared/ui/alert';

interface QueryStateProps {
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  loadingFallback?: ReactNode;
  errorTitle?: string;
  errorMessage?: string;
  children: ReactNode;
}

function DefaultLoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-sm text-muted-foreground">Loading...</div>
    </div>
  );
}

function ErrorFallback({
  title = 'Something went wrong',
  message = 'We could not load the data. Please try again.',
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-xl">
      <Alert variant="destructive" className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-4 w-4" aria-hidden="true" />
        <div className="flex-1 space-y-1">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </div>
        {onRetry && (
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
        )}
      </Alert>
    </div>
  );
}

export function QueryState({
  isLoading,
  isError,
  onRetry,
  loadingFallback,
  errorTitle,
  errorMessage,
  children,
}: QueryStateProps) {
  if (isError) {
    return (
      <ErrorFallback
        title={errorTitle}
        message={errorMessage}
        onRetry={onRetry}
      />
    );
  }

  if (isLoading) {
    return <>{loadingFallback ?? <DefaultLoadingFallback />}</>;
  }

  return <>{children}</>;
}
