import { Label, PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';
import { ChartContainer, type ChartConfig } from '@/shared/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import type { ListChartData } from '../../hooks/useDashboardData';

const COLORS = [
  'oklch(0.623 0.214 259.815)',
  'oklch(0.723 0.191 149.58)',
  'oklch(0.705 0.213 47.604)',
  'oklch(0.645 0.246 16.439)',
  'oklch(0.546 0.245 262.881)',
];

interface CompletionRadialChartProps {
  data: ListChartData[];
}

export function CompletionRadialChart({ data }: CompletionRadialChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Completion Progress</CardTitle>
          <CardDescription>Percentage complete per list</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <p className="text-sm text-muted-foreground">No lists yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Completion Progress</CardTitle>
        <CardDescription>Percentage complete per list</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {data.map((list, index) => (
            <RadialProgressItem
              key={list.id}
              name={list.name}
              percentage={list.percentage}
              done={list.done}
              total={list.total}
              color={COLORS[index % COLORS.length]}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RadialProgressItem({
  name,
  percentage,
  done,
  total,
  color,
}: {
  name: string;
  percentage: number;
  done: number;
  total: number;
  color: string;
}) {
  const chartConfig = {
    progress: { label: 'Progress', color },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col items-center gap-1">
      <ChartContainer config={chartConfig} className="aspect-square h-[120px]">
        <RadialBarChart
          data={[{ progress: percentage, fill: 'var(--color-progress)' }]}
          startAngle={90}
          endAngle={-270}
          innerRadius={38}
          outerRadius={52}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} angleAxisId={0} />
          <RadialBar dataKey="progress" background cornerRadius={10} angleAxisId={0} />
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground text-lg font-bold"
                  >
                    {percentage}%
                  </text>
                );
              }
            }}
          />
        </RadialBarChart>
      </ChartContainer>
      <span className="max-w-full truncate text-sm font-medium text-foreground">{name}</span>
      <span className="text-xs text-muted-foreground">
        {done}/{total} done
      </span>
    </div>
  );
}
