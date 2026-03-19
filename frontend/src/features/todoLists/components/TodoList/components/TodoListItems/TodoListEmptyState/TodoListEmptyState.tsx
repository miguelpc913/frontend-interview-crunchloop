interface TodoListEmptyStateProps {
  title: string;
  description: string;
}

export function TodoListEmptyState({ title, description }: TodoListEmptyStateProps) {
  return (
    <li className="flex items-start gap-3 rounded-lg border border-dashed border-border bg-muted/60 px-3 py-3 text-xs text-muted-foreground">
      <span aria-hidden="true" className="mt-1 h-2 w-2 rounded-full bg-muted-foreground/50" />
      <div className="flex-1">
        <p className="font-medium text-foreground">
          {title}
        </p>
        <p>{description}</p>
      </div>
    </li>
  );
}
