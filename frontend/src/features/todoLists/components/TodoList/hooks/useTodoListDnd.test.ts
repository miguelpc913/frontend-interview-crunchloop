import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useTodoListDnd } from './useTodoListDnd';

describe('useTodoListDnd', () => {
  it('calls reorder with active and over ids', () => {
    const reorder = vi.fn();
    const { result } = renderHook(() => useTodoListDnd({ isReorderEnabled: true, reorder }));

    result.current.handleDragEnd({
      active: { id: 1 },
      over: { id: 2 },
    } as never);

    expect(reorder).toHaveBeenCalledWith(1, 2);
  });

  it('does not call reorder when reorder is disabled', () => {
    const reorder = vi.fn();
    const { result } = renderHook(() => useTodoListDnd({ isReorderEnabled: false, reorder }));

    result.current.handleDragEnd({
      active: { id: 1 },
      over: { id: 2 },
    } as never);

    expect(reorder).not.toHaveBeenCalled();
  });

  it('does not call reorder when active and over ids are equal', () => {
    const reorder = vi.fn();
    const { result } = renderHook(() => useTodoListDnd({ isReorderEnabled: true, reorder }));

    result.current.handleDragEnd({
      active: { id: 2 },
      over: { id: 2 },
    } as never);

    expect(reorder).not.toHaveBeenCalled();
  });

  it('does not call reorder when over is null', () => {
    const reorder = vi.fn();
    const { result } = renderHook(() => useTodoListDnd({ isReorderEnabled: true, reorder }));

    result.current.handleDragEnd({
      active: { id: 1 },
      over: null,
    } as never);

    expect(reorder).not.toHaveBeenCalled();
  });
});
