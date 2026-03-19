interface TodoListEmptyStateProps {
  title: string;
  description: string;
}

export function TodoListEmptyState({ title, description }: TodoListEmptyStateProps) {
  return (
    <li className="flex items-start gap-3 rounded-lg border border-dashed border-slate-200/80 bg-slate-50/60 px-3 py-3 text-xs text-slate-500 dark:border-slate-700/80 dark:bg-slate-900/60 dark:text-slate-400">
      <span className="mt-0.5 h-5 w-5 rounded-full border border-slate-300/70 bg-white/80 dark:border-slate-600/80 dark:bg-slate-900/90" />
      <div className="flex-1">
        <p className="font-medium text-slate-600 dark:text-slate-300">
          {title}
        </p>
        <p>{description}</p>
      </div>
    </li>
  );
}
