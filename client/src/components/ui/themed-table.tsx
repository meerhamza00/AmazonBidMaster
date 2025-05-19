import React from 'react';
import { useTheme } from '@/hooks/use-theme';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface ThemedTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
  }[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  highlightOnHover?: boolean;
  striped?: boolean;
  compact?: boolean;
  className?: string;
}

export function ThemedTable<T>({
  data,
  columns,
  onRowClick,
  isLoading = false,
  emptyState,
  highlightOnHover = true,
  striped = true,
  compact = false,
  className,
}: ThemedTableProps<T>) {
  const { isDark } = useTheme();

  // Handle empty state
  if (!isLoading && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        {emptyState || (
          <div className="text-muted-foreground">
            <p>No data available</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-auto", className)}>
      <Table>
        <TableHeader className={cn(
          "bg-muted/50",
          isDark ? "bg-muted/30" : "bg-muted/80"
        )}>
          <TableRow>
            {columns.map((column) => (
              <TableHead 
                key={column.header} 
                className={cn(
                  "font-semibold",
                  compact ? "py-2" : "py-3",
                  column.className
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Loading state
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`loading-${index}`}>
                {columns.map((column, colIndex) => (
                  <TableCell 
                    key={`loading-cell-${colIndex}`}
                    className={cn(
                      "animate-pulse",
                      compact ? "py-2" : "py-3",
                      column.className
                    )}
                  >
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            // Data rows
            data.map((item, index) => (
              <TableRow 
                key={index}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                className={cn(
                  onRowClick && "cursor-pointer",
                  highlightOnHover && "hover:bg-muted/50",
                  striped && index % 2 === 1 && (isDark ? "bg-muted/10" : "bg-muted/30"),
                )}
              >
                {columns.map((column) => (
                  <TableCell 
                    key={`${index}-${String(column.accessorKey)}`}
                    className={cn(
                      compact ? "py-2" : "py-3",
                      column.className
                    )}
                  >
                    {column.cell 
                      ? column.cell(item) 
                      : item[column.accessorKey] as React.ReactNode}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}