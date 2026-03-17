export function TodoListSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm shadow-slate-900/5 ring-1 ring-slate-950/[0.02] overflow-hidden font-sans text-slate-900 animate-pulse dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-black/20 dark:ring-slate-50/5">
      <div className="px-4 pt-4 pb-3 border-b border-slate-100 bg-white/90 dark:border-slate-800 dark:bg-slate-900/90">
        <div className="h-6 w-1/2 rounded-full bg-slate-200/80 dark:bg-slate-700/60" />
      </div>
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        <div className="flex-1 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80" />
        <div className="h-9 w-9 rounded-lg bg-slate-200 dark:bg-slate-700/80" />
      </div>
      <ul className="list-none m-0 p-4 md:p-5 flex flex-col gap-2.5">
        <li className="flex items-start gap-3">
          <div className="h-6 w-6 rounded-full border border-slate-200 dark:border-slate-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 rounded bg-slate-100 dark:bg-slate-800/80" />
            <div className="h-3 w-2/3 rounded bg-slate-100 dark:bg-slate-800/80" />
          </div>
          <div className="h-5 w-5 rounded-full bg-slate-100 dark:bg-slate-800/80" />
        </li>
        <li className="flex items-start gap-3">
          <div className="h-6 w-6 rounded-full border border-slate-200 dark:border-slate-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 rounded bg-slate-100 dark:bg-slate-800/80" />
            <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-800/80" />
          </div>
          <div className="h-5 w-5 rounded-full bg-slate-100 dark:bg-slate-800/80" />
        </li>
      </ul>
    </div>
  );
}

