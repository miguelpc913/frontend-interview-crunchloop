import { useCallback, type ChangeEvent } from 'react';
import { Input } from '@/shared/ui/input';

interface TodoListSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function TodoListSearch({ value, onChange }: TodoListSearchProps) {
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  }, [onChange]);

  return (
    <Input
      className="h-8 w-full text-xs font-sans placeholder:italic"
      type="text"
      placeholder="Search in this list..."
      value={value}
      onChange={handleChange}
    />
  );
}

