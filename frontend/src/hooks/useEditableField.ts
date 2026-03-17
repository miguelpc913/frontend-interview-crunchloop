import { useState, type ChangeEvent, type KeyboardEvent } from 'react';

interface UseEditableFieldOptions {
  initialValue: string;
  onCommit: (value: string) => void;
}

export function useEditableField({ initialValue, onCommit }: UseEditableFieldOptions) {
  const [value, setValue] = useState(initialValue);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  function handleBlur() {
    const trimmed = value.trim();
    if (trimmed && trimmed !== initialValue) {
      onCommit(trimmed);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      (event.target as HTMLInputElement).blur();
    }
  }

  return {
    value,
    onChange: handleChange,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
  };
}

