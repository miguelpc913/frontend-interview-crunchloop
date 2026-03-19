import { Card, CardContent, CardHeader } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export function TodoListSkeleton() {
  return (
    <Card className="mx-auto w-full max-w-md font-sans text-foreground">
      <CardHeader className="border-b border-border bg-card/90 pt-4 pb-3">
        <Skeleton className="h-6 w-1/2 rounded-full" />
      </CardHeader>
      <CardContent className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 flex-1 rounded-xl" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </CardContent>
      <CardContent className="px-4 pb-4 pt-3 md:p-5">
        <ul className="m-0 flex list-none flex-col gap-2.5">
          <li className="flex items-start gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-3 w-2/3 rounded" />
            </div>
            <Skeleton className="h-5 w-5 rounded-full" />
          </li>
          <li className="flex items-start gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2 rounded" />
              <Skeleton className="h-3 w-1/3 rounded" />
            </div>
            <Skeleton className="h-5 w-5 rounded-full" />
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}

