import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'

import { renderWithProviders } from '@/test/test-utils'
import { LargestListsChart } from './LargestListsChart'
import type { ListChartData } from '../hooks/useDashboardData'

const sampleData: ListChartData[] = [
  { id: 1, name: 'Work', done: 3, pending: 2, total: 5, percentage: 60 },
  { id: 2, name: 'Personal', done: 1, pending: 4, total: 5, percentage: 20 },
]

describe('LargestListsChart', () => {
  it('renders empty state when data is empty', () => {
    renderWithProviders(<LargestListsChart data={[]} />)

    expect(screen.getByText('Largest Lists')).toBeInTheDocument()
    expect(
      screen.getByText('Lists ranked by total items'),
    ).toBeInTheDocument()
    expect(screen.getByText('No lists yet')).toBeInTheDocument()
  })

  it('renders chart with title and description when data is provided', () => {
    renderWithProviders(<LargestListsChart data={sampleData} />)

    expect(screen.getByText('Largest Lists')).toBeInTheDocument()
    expect(
      screen.getByText('Lists ranked by total items'),
    ).toBeInTheDocument()
    expect(screen.queryByText('No lists yet')).not.toBeInTheDocument()
  })
})
