import { useDashboardData } from './hooks/useDashboardData';
import { CompletionDonutChart } from './components/CompletionDonutChart/CompletionDonutChart';
import { ItemsPerListChart } from './components/ItemsPerListChart/ItemsPerListChart';
import { CompletionRadialChart } from './components/CompletionRadialChart/CompletionRadialChart';
import { LargestListsChart } from './components/LargestListsChart/LargestListsChart';

export function DashboardPage() {
  const { globalCompletion, perListData, largestLists, isLoading, isError } =
    useDashboardData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm text-muted-foreground">
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sm text-destructive">
          Failed to load dashboard data.
        </div>
      </div>
    );
  }

  return (
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
  );
}
