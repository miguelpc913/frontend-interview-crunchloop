import { useDashboardData } from './hooks/useDashboardData';
import { CompletionDonutChart } from './components/CompletionDonutChart/CompletionDonutChart';
import { ItemsPerListChart } from './components/ItemsPerListChart/ItemsPerListChart';
import { CompletionRadialChart } from './components/CompletionRadialChart/CompletionRadialChart';
import { LargestListsChart } from './components/LargestListsChart/LargestListsChart';
import { QueryState } from '@/shared/ui/QueryState';
import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

function DashboardSkeleton() {
  return (
    <div className="space-y-6 py-2 md:py-4">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mx-auto aspect-square h-56 w-56 rounded-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-56 w-full" />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-60" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export function DashboardPage() {
  const { globalCompletion, perListData, largestLists, isLoading, isError } =
    useDashboardData();

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
