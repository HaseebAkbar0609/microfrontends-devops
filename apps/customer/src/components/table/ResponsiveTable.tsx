"use client";

import type { ReactNode } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type ResponsiveTableColumn<TData> = {
  id: string;
  header: ReactNode;
  cell: (row: TData) => ReactNode;
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  onHeaderClick?: () => void;
};

interface ResponsiveTableProps<TData> {
  data: TData[];
  columns: ResponsiveTableColumn<TData>[];
  getRowKey: (row: TData) => string;
  emptyContent: ReactNode;
  containerClassName?: string;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string | ((row: TData, index: number) => string);
}

export function ResponsiveTable<TData>({
  data,
  columns,
  getRowKey,
  emptyContent,
  containerClassName,
  tableClassName,
  headerClassName,
  rowClassName,
}: ResponsiveTableProps<TData>) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-md border border-slate-200 bg-white",
        containerClassName,
      )}
    >
      <Table className={cn("w-full table-auto", tableClassName)}>
        <TableHeader className={headerClassName}>
          <TableRow className="border-slate-200 hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.id}
                onClick={column.onHeaderClick}
                className={cn(
                  column.className,
                  column.onHeaderClick && "cursor-pointer select-none",
                  column.headerClassName,
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <TableRow
                key={getRowKey(row)}
                className={cn(
                  "border-b border-slate-100 odd:bg-white even:bg-slate-50/40 hover:bg-slate-100/60",
                  typeof rowClassName === "function"
                    ? rowClassName(row, index)
                    : rowClassName,
                )}
              >
                {columns.map((column) => (
                  <TableCell
                    key={`${getRowKey(row)}-${column.id}`}
                    className={cn(column.className, column.cellClassName)}
                  >
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-slate-500"
              >
                {emptyContent}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
