import '@testing-library/jest-dom/vitest'

import { afterAll, afterEach, beforeAll, vi } from 'vitest'

import { server } from './server'
import { resetTodoLists } from './handlers'

vi.mock('@dnd-kit/core', () => {
  return {
    DndContext: (props: { children: unknown }) => props.children,
    KeyboardSensor: {},
    PointerSensor: {},
    closestCenter: {},
    useSensor: () => ({}),
    useSensors: (...args: unknown[]) => args,
  }
})

vi.mock('@dnd-kit/sortable', () => {
  return {
    SortableContext: (props: { children: unknown }) => props.children,
    verticalListSortingStrategy: {},
    useSortable: () => {
      return {
        attributes: {},
        listeners: {},
        setNodeRef: vi.fn(),
        transform: null,
        transition: undefined,
        isDragging: false,
      }
    },
    arrayMove: <T,>(arr: T[], from: number, to: number) => {
      const next = [...arr]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    },
  }
})

vi.mock('@dnd-kit/utilities', () => {
  return {
    CSS: {
      Transform: {
        toString: () => undefined,
      },
    },
  }
})

vi.mock('recharts', async () => {
  const React = await import('react')
  const passthrough = (name: string) =>
    ({ children, ...props }: Record<string, unknown>) =>
      React.createElement('div', { 'data-testid': name, ...props }, children as React.ReactNode)

  const self = (name: string) =>
    (props: Record<string, unknown>) =>
      React.createElement('div', { 'data-testid': name, ...props })

  return {
    ResponsiveContainer: passthrough('responsive-container'),
    BarChart: passthrough('bar-chart'),
    Bar: self('bar'),
    PieChart: passthrough('pie-chart'),
    Pie: self('pie'),
    RadialBarChart: passthrough('radial-bar-chart'),
    RadialBar: self('radial-bar'),
    CartesianGrid: self('cartesian-grid'),
    XAxis: self('x-axis'),
    YAxis: self('y-axis'),
    Tooltip: self('tooltip'),
    Legend: self('legend'),
    Label: ({ content }: { content?: (props: { viewBox: { cx: number; cy: number } }) => React.ReactNode }) => {
      if (typeof content === 'function') {
        return React.createElement(React.Fragment, null, content({ viewBox: { cx: 100, cy: 100 } }))
      }
      return null
    },
    PolarAngleAxis: self('polar-angle-axis'),
  }
})

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  server.resetHandlers()
  resetTodoLists()
})

afterAll(() => {
  server.close()
})

