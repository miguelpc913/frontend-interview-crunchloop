import { useCallback } from 'react';
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';

interface UseTodoListDndOptions {
  isReorderEnabled: boolean;
  reorder: (activeId: number, overId: number) => void;
}

export function useTodoListDnd({
  isReorderEnabled,
  reorder,
}: UseTodoListDndOptions) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor),
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    if (!isReorderEnabled) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    reorder(active.id as number, over.id as number);
  }, [isReorderEnabled, reorder]);

  return {
    sensors,
    handleDragEnd,
  };
}
