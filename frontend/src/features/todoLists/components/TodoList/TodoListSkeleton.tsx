export function TodoListSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto bg-white border-2 border-black rounded-2xl shadow-md overflow-hidden font-sans text-black animate-pulse">
      <div className="bg-black px-6 py-4">
        <div className="h-6 w-2/3 bg-slate-500 rounded-full mx-auto" />
      </div>
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
        <div className="flex-1 h-9 bg-slate-200 rounded-full" />
        <div className="w-9 h-9 bg-slate-300 rounded-full" />
      </div>
      <ul className="list-none m-0 p-4 md:p-6 flex flex-col gap-2">
        <li className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded" />
            <div className="h-3 bg-slate-100 rounded w-2/3" />
          </div>
          <div className="w-5 h-5 bg-slate-200 rounded" />
        </li>
        <li className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </div>
          <div className="w-5 h-5 bg-slate-200 rounded" />
        </li>
      </ul>
    </div>
  );
}

