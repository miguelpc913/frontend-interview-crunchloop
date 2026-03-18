import type { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';

interface TodoListSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function TodoListSearch({ value, onChange }: TodoListSearchProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

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

