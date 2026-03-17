import { TodoList } from './components/TodoList/TodoList';
import { useApp } from './useApp';

function App() {
  const { todoLists, isLoading, isError, refetch } = useApp();

  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center p-6">
      <div className="w-full max-w-3xl space-y-4">
        {isLoading && (
          <>
            <div className="w-full max-w-md mx-auto bg-slate-200 border-2 border-slate-300 rounded-2xl h-40 animate-pulse" />
            <div className="w-full max-w-md mx-auto bg-slate-200 border-2 border-slate-300 rounded-2xl h-40 animate-pulse" />
          </>
        )}

        {isError && (
          <div className="w-full max-w-md mx-auto bg-red-50 border-2 border-red-300 rounded-2xl p-4 text-red-800 flex items-center justify-between">
            <span className="text-sm font-medium">
              Something went wrong while loading your todo lists.
            </span>
            <button
              type="button"
              onClick={() => refetch()}
              className="ml-4 px-3 py-1 text-xs font-semibold rounded-full border border-red-400 text-red-800 hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading &&
          !isError &&
          todoLists.map((list) => (
            <TodoList key={list.id} todoListId={list.id} />
          ))}
      </div>
    </div>
  );
}

export default App;
