import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

type FilterMode = 'all' | 'done' | 'not-done';

interface TodoListFilterDropdownProps {
  mode: FilterMode;
  onChangeMode: (mode: FilterMode) => void;
}

export function TodoListFilterDropdown({
  mode,
  onChangeMode,
}: TodoListFilterDropdownProps) {
  const currentLabel =
    mode === 'all' ? 'All tasks' : mode === 'done' ? 'Done' : 'Not done';
  const isFiltered = mode !== 'all';

  return (
    
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          variant="outline"
          size="sm"
          className="mt-1 inline-flex items-center gap-1.5 text-[11px] md:mt-0"
        >
          <Filter className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{currentLabel}</span>
          {isFiltered && (
            <Badge variant="outline" className="ml-1 text-[10px]">
              Filter
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[9rem] text-[11px]">
        <DropdownMenuLabel>Show</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={mode}
          onValueChange={(value) => onChangeMode(value as FilterMode)}
        >
          <DropdownMenuRadioItem value="all">All tasks</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="done">Done</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="not-done">
            Not done
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

