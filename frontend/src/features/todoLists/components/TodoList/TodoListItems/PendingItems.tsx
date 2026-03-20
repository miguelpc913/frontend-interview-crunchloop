export interface PendingItem {
  mutationId: number;
  name: string;
}

export function PendingItems({ items }: { items: PendingItem[] }) {
  return (
    <>
      {items.map((item) => (
        <li
          key={item.mutationId}
          data-testid="pending-todo-item"
          className={
            'rounded-lg border border-dashed border-border bg-muted/60 px-3 py-2.5 text-xs text-muted-foreground opacity-50'
          }
        >
          {item.name}
        </li>
      ))}
    </>
  );
}
