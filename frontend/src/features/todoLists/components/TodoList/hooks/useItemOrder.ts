import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TodoItem } from '@/shared/types/todoList';
import { arrayMove } from '@dnd-kit/sortable';

function getStorageKey(todoListId: number) {
  return `todo-order-${todoListId}`;
}

function readStoredOrder(todoListId: number): number[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(getStorageKey(todoListId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is number => typeof id === 'number');
  } catch {
    return [];
  }
}

function writeStoredOrder(todoListId: number, order: number[]) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(getStorageKey(todoListId), JSON.stringify(order));
  } catch {
    // ignore storage errors
  }
}

export function useItemOrder(todoListId: number, items: TodoItem[]) {
  const [order, setOrder] = useState<number[]>(() => readStoredOrder(todoListId));
  const orderRef = useRef(order);

  useEffect(() => {
    orderRef.current = order;
  }, [order]);

  useEffect(() => {
    if (items.length === 0) return;

    const currentOrder = orderRef.current;
    const currentIds = items.map((item) => item.id);

    const dedupedOrder = Array.from(new Set(currentOrder));
    const filteredOrder = dedupedOrder.filter((id) => currentIds.includes(id));

    const missingIds = currentIds.filter((id) => !filteredOrder.includes(id));
    const nextOrder = [...filteredOrder, ...missingIds];

    if (
      nextOrder.length !== currentOrder.length ||
      nextOrder.some((id, idx) => id !== currentOrder[idx])
    ) {
      setOrder(nextOrder);
      writeStoredOrder(todoListId, nextOrder);
    }
  }, [items, todoListId]);

  const orderedItems = useMemo(() => {
    if (order.length === 0) {
      return items;
    }

    const itemsById = new Map(items.map((item) => [item.id, item]));
    const ordered: TodoItem[] = [];

    for (const id of order) {
      const found = itemsById.get(id);
      if (found) {
        ordered.push(found);
        itemsById.delete(id);
      }
    }

    for (const leftover of itemsById.values()) {
      ordered.push(leftover);
    }

    return ordered;
  }, [items, order]);

  const reorder = useCallback((activeId: number, overId: number) => {
    if (activeId === overId) return;

    const currentIds = items.map((item) => item.id);
    const baseOrder = order.length ? order.slice() : currentIds;

    if (!baseOrder.includes(activeId)) {
      baseOrder.push(activeId);
    }
    if (!baseOrder.includes(overId)) {
      baseOrder.push(overId);
    }
    const oldIndex = baseOrder.indexOf(activeId);
    const newIndex = baseOrder.indexOf(overId);

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
      return;
    }

    const nextOrder = arrayMove(baseOrder, oldIndex, newIndex);
    setOrder(nextOrder);
    writeStoredOrder(todoListId, nextOrder);
  }, [items, order, todoListId]);

  return {
    orderedItems,
    reorder,
  };
}

