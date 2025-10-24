import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function DataTableSkeleton({
  // You can add props to customize the skeleton, e.g., row count
  rowCount = 10,
  columnCount = 5,
}: {
  rowCount?: number
  columnCount?: number
}) {
  return (
    <div className="space-y-4">
      {/* Top bar with search and page size controls */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-[250px]" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 w-[70px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>

      {/* The main table skeleton */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columnCount }).map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-6 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rowCount }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: columnCount }).map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls skeleton */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  )
}
