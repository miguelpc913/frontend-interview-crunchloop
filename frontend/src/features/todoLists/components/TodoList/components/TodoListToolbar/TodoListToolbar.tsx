import type { FilterMode } from '../../types';
import { TodoListSearch } from './TodoListSearch/TodoListSearch';
import { TodoListFilterDropdown } from './TodoListFilterDropdown/TodoListFilterDropdown';

interface TodoListToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterMode: FilterMode;
  onFilterChange: (mode: FilterMode) => void;
}

export function TodoListToolbar({
  searchQuery,
  onSearchChange,
  filterMode,
  onFilterChange,
}: TodoListToolbarProps) {
  return (
    <div className="relative z-10 px-3.5 pt-3.5 text-xs text-slate-600 backdrop-blur-sm md:px-4 md:pt-4 dark:text-slate-300">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <TodoListSearch
            value={searchQuery}
            onChange={onSearchChange}
          />
        </div>
        <TodoListFilterDropdown
          mode={filterMode}
          onChangeMode={onFilterChange}
        />
      </div>
    </div>
  );
}
