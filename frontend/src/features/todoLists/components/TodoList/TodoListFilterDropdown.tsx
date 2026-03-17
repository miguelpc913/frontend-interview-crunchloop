import { useEffect, useRef, useState } from 'react';
import { Filter } from 'lucide-react';

type FilterMode = 'all' | 'done' | 'not-done';

interface TodoListFilterDropdownProps {
  mode: FilterMode;
  onChangeMode: (mode: FilterMode) => void;
}

export function TodoListFilterDropdown({
  mode,
  onChangeMode,
}: TodoListFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!(event.target instanceof Node)) return;

      if (!containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentLabel =
    mode === 'all' ? 'All tasks' : mode === 'done' ? 'Done' : 'Not done';

  return (
    <div ref={containerRef} className="relative mt-1 md:mt-0">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1.5 text-[11px] font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:ring-slate-600"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <Filter className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{currentLabel}</span>
      </button>
      {isOpen && (
        <ul
          className="absolute right-0 z-10 mt-1 min-w-[9rem] overflow-hidden rounded-lg border border-slate-200 bg-white py-1 text-[11px] shadow-lg shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900"
          role="listbox"
        >
          <li>
            <button
              type="button"
              className={`flex w-full items-center px-3 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 ${
                mode === 'all'
                  ? 'font-semibold text-slate-900 dark:text-slate-50'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
              onClick={() => {
                onChangeMode('all');
                setIsOpen(false);
              }}
            >
              All tasks
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`flex w-full items-center px-3 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 ${
                mode === 'done'
                  ? 'font-semibold text-slate-900 dark:text-slate-50'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
              onClick={() => {
                onChangeMode('done');
                setIsOpen(false);
              }}
            >
              Done
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`flex w-full items-center px-3 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 ${
                mode === 'not-done'
                  ? 'font-semibold text-slate-900 dark:text-slate-50'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
              onClick={() => {
                onChangeMode('not-done');
                setIsOpen(false);
              }}
            >
              Not done
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

