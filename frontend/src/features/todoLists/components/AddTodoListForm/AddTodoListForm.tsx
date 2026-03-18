import { Plus } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { useAddTodoListForm } from '../../hooks/useAddTodoListForm';

export function AddTodoListForm() {
  const { name, setName, handleSubmit, isSubmitting, errorMessage } =
    useAddTodoListForm();

  const trimmedName = name.trim();

  return (
    <Card className="w-full max-w-xl mx-auto font-sans text-slate-900 dark:text-slate-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-slate-50 shadow-sm shadow-slate-900/10 dark:bg-slate-100 dark:text-slate-900 dark:shadow-black/20">
            <Plus className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-medium">Add a todo list</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Create a list to start organizing tasks.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="sr-only" htmlFor="new-todo-list-name">
            Todo list name
          </label>
          <Input
            id="new-todo-list-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Work projects"
            disabled={isSubmitting}
            className="h-9"
          />
          <Button
            type="submit"
            disabled={!trimmedName || isSubmitting}
            className="gap-2 md:w-auto"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            {isSubmitting ? 'Adding...' : 'Add list'}
          </Button>
        </form>

        {errorMessage && (
          <Alert variant="destructive" className="mt-3">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

