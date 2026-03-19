import { Plus } from 'lucide-react';

import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';

import { useAddTodoListForm } from './useAddTodoListForm';

export function AddTodoListForm() {
  const { form, handleSubmit, isSubmitting, errorMessage } =
    useAddTodoListForm();
  const {
    register,
    formState: { errors, isValid },
  } = form;

  return (
    <Card className="mx-auto w-full max-w-xl font-sans text-foreground">
      <CardContent className="p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <Plus className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-medium">Add a todo list</p>
            <p className="text-xs text-muted-foreground">
              Create a list to start organizing tasks.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 md:flex-row md:items-center"
        >
          <label className="sr-only" htmlFor="new-todo-list-name">
            Todo list name
          </label>
          <Input
            id="new-todo-list-name"
            type="text"
            {...register('name')}
            placeholder="e.g. Work projects"
            disabled={isSubmitting}
            className="h-9"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">
              {errors.name.message}
            </p>
          )}
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
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

