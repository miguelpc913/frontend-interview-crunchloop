import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'

import { renderWithProviders } from '@/test/test-utils'
import { CompletionRadialChart } from './CompletionRadialChart'
import type { ListChartData } from '../hooks/useDashboardData'

const sampleData: ListChartData[] = [
  { id: 1, name: 'Work', done: 3, pending: 2, total: 5, percentage: 60 },
  { id: 2, name: 'Personal', done: 1, pending: 4, total: 5, percentage: 20 },
]

describe('CompletionRadialChart', () => {
  it('renders empty state when data is empty', () => {
    renderWithProviders(<CompletionRadialChart data={[]} />)

    expect(screen.getByText('Completion Progress')).toBeInTheDocument()
    expect(
      screen.getByText('Percentage complete per list'),
    ).toBeInTheDocument()
    expect(screen.getByText('No lists yet')).toBeInTheDocument()
  })

  it('renders list names and done/total labels', () => {
    renderWithProviders(<CompletionRadialChart data={sampleData} />)

    expect(screen.getByText('Completion Progress')).toBeInTheDocument()
    expect(screen.getByText('Work')).toBeInTheDocument()
    expect(screen.getByText('Personal')).toBeInTheDocument()
    expect(screen.getByText('3/5 done')).toBeInTheDocument()
    expect(screen.getByText('1/5 done')).toBeInTheDocument()
  })

  it('renders percentage labels inside radial charts', () => {
    renderWithProviders(<CompletionRadialChart data={sampleData} />)

    expect(screen.getByText('60%')).toBeInTheDocument()
    expect(screen.getByText('20%')).toBeInTheDocument()
  })
})
