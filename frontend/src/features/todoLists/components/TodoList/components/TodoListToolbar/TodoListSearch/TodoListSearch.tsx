import { Input } from '@/shared/ui/input';

interface TodoListSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function TodoListSearch({ value, onChange }: TodoListSearchProps) {
  return (
    <Input
      className="h-8 w-full text-xs font-sans placeholder:italic"
      type="text"
      placeholder="Search in this list..."
      aria-label="Search tasks"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

