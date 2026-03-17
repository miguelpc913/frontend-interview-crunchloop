interface TodoListErrorProps {
  onRetry: () => void;
}

export function TodoListError({ onRetry }: TodoListErrorProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-red-50 border-2 border-red-300 rounded-2xl p-4 text-red-800 flex items-center justify-between">
      <span className="text-sm font-medium">Could not load this todo list.</span>
      <button
        type="button"
        onClick={onRetry}
        className="ml-4 px-3 py-1 text-xs font-semibold rounded-full border border-red-400 text-red-800 hover:bg-red-100"
      >
        Retry
      </button>
    </div>
  );
}

