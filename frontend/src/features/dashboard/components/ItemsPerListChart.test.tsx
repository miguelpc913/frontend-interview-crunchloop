import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'

import { renderWithProviders } from '@/test/test-utils'
import { ItemsPerListChart } from './ItemsPerListChart'
import type { ListChartData } from '../hooks/useDashboardData'

const sampleData: ListChartData[] = [
  { id: 1, name: 'Work', done: 3, pending: 2, total: 5, percentage: 60 },
  { id: 2, name: 'Personal', done: 1, pending: 4, total: 5, percentage: 20 },
]

describe('ItemsPerListChart', () => {
  it('renders empty state when data is empty', () => {
    renderWithProviders(<ItemsPerListChart data={[]} />)

    expect(screen.getByText('Items per List')).toBeInTheDocument()
    expect(
      screen.getByText('Done and pending items breakdown'),
    ).toBeInTheDocument()
    expect(screen.getByText('No lists yet')).toBeInTheDocument()
  })

  it('renders chart with title and description when data is provided', () => {
    renderWithProviders(<ItemsPerListChart data={sampleData} />)

    expect(screen.getByText('Items per List')).toBeInTheDocument()
    expect(
      screen.getByText('Done and pending items breakdown'),
    ).toBeInTheDocument()
    expect(screen.queryByText('No lists yet')).not.toBeInTheDocument()
  })
})
