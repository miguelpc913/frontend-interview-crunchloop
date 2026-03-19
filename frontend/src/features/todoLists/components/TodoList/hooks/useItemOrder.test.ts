import { describe, expect, it, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useItemOrder } from './useItemOrder';
import type { TodoItem } from '../../../types/todoList';

function makeItem(id: number, name = `Item ${id}`): TodoItem {
  return { id, name, description: '', done: false };
}

describe('useItemOrder', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns items in original order when no stored order exists', () => {
    const items = [makeItem(1), makeItem(2), makeItem(3)];
    const { result } = renderHook(() => useItemOrder(99, items));

    expect(result.current.orderedItems.map((i) => i.id)).toEqual([1, 2, 3]);
  });

  it('returns items in stored order from localStorage', () => {
    window.localStorage.setItem('todo-order-99', JSON.stringify([3, 1, 2]));

    const items = [makeItem(1), makeItem(2), makeItem(3)];
    const { result } = renderHook(() => useItemOrder(99, items));

    expect(result.current.orderedItems.map((i) => i.id)).toEqual([3, 1, 2]);
  });

  it('appends new items not in stored order', () => {
    window.localStorage.setItem('todo-order-99', JSON.stringify([2, 1]));

    const items = [makeItem(1), makeItem(2), makeItem(3)];
    const { result } = renderHook(() => useItemOrder(99, items));

    expect(result.current.orderedItems.map((i) => i.id)).toEqual([2, 1, 3]);
  });

  it('removes stale ids from stored order', () => {
    window.localStorage.setItem('todo-order-99', JSON.stringify([3, 2, 1]));

    const items = [makeItem(1), makeItem(3)];
    const { result } = renderHook(() => useItemOrder(99, items));

    expect(result.current.orderedItems.map((i) => i.id)).toEqual([3, 1]);
  });

  it('reorder swaps items and persists to localStorage', () => {
    const items = [makeItem(1), makeItem(2), makeItem(3)];
    const { result } = renderHook(() => useItemOrder(99, items));

    act(() => {
      result.current.reorder(1, 3);
    });

    expect(result.current.orderedItems.map((i) => i.id)).toEqual([2, 3, 1]);

    const stored = JSON.parse(window.localStorage.getItem('todo-order-99')!);
    expect(stored).toEqual([2, 3, 1]);
  });

  it('reorder is a no-op when activeId === overId', () => {
    const items = [makeItem(1), makeItem(2)];
    const { result } = renderHook(() => useItemOrder(99, items));

    act(() => {
      result.current.reorder(1, 1);
    });

    expect(result.current.orderedItems.map((i) => i.id)).toEqual([1, 2]);
  });

  it('handles invalid localStorage gracefully', () => {
    window.localStorage.setItem('todo-order-99', 'not-json');

    const items = [makeItem(1), makeItem(2)];
    const { result } = renderHook(() => useItemOrder(99, items));

    expect(result.current.orderedItems.map((i) => i.id)).toEqual([1, 2]);
  });

  it('handles non-array localStorage value gracefully', () => {
    window.localStorage.setItem('todo-order-99', JSON.stringify({ a: 1 }));

    const items = [makeItem(1), makeItem(2)];
    const { result } = renderHook(() => useItemOrder(99, items));

    expect(result.current.orderedItems.map((i) => i.id)).toEqual([1, 2]);
  });
});
