import type { ChangeEvent } from 'react';

interface TodoListSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function TodoListSearch({ value, onChange }: TodoListSearchProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <input
      className="w-full rounded-lg border border-slate-200 bg-white/80 px-2.5 py-1.5 text-xs font-sans text-slate-900 placeholder:italic placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200 focus-visible:border-slate-300 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus-visible:ring-slate-600 dark:focus-visible:border-slate-500"
      type="text"
      placeholder="Search in this list..."
      value={value}
      onChange={handleChange}
    />
  );
}

