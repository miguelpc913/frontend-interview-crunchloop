import { useDashboardData } from './hooks/useDashboardData';
import { CompletionDonutChart } from './components/CompletionDonutChart/CompletionDonutChart';
import { ItemsPerListChart } from './components/ItemsPerListChart/ItemsPerListChart';
import { CompletionRadialChart } from './components/CompletionRadialChart/CompletionRadialChart';
import { LargestListsChart } from './components/LargestListsChart/LargestListsChart';
import { DashboardSkeleton } from './components/DashboardSkeleton/DashboardSkeleton';
import { QueryState } from '@/shared/ui/QueryState';

export function DashboardPage() {
  const { globalCompletion, perListData, largestLists, isLoading, isError } = useDashboardData();

  return (
    <QueryState
      isLoading={isLoading}
      isError={isError}
      errorMessage="Failed to load dashboard data."
      loadingFallback={<DashboardSkeleton />}
    >
      <div className="space-y-6 py-2 md:py-4">
        <div className="grid gap-6 md:grid-cols-2">
          <CompletionDonutChart
            done={globalCompletion.done}
            pending={globalCompletion.pending}
            total={globalCompletion.total}
          />
          <ItemsPerListChart data={perListData} />
        </div>
        <CompletionRadialChart data={perListData} />
        <LargestListsChart data={largestLists} />
      </div>
    </QueryState>
  );
}
