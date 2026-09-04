"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FilePreviewIcon from "@/features/leads/management/components/FilePreviewIcon";
import {
  certificateRows,
  getCertificateColumns,
} from "@/features/leads/management/constants/quoteCompanyTab";

function CertificateTable({ search, category }: { search: string; category: string }) {
  const t = useTranslate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const filteredData = useMemo(() => {
    if (category === "all") return certificateRows;
    return certificateRows.filter((row) => row.category === category);
  }, [category]);

  const columns = useMemo(() => getCertificateColumns(t), [t]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter: search, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const searchValue = String(filterValue).toLowerCase();
      return (
        row.original.certificate.toLowerCase().includes(searchValue) ||
        t(row.original.textKey).toLowerCase().includes(searchValue) ||
        row.original.date.toLowerCase().includes(searchValue)
      );
    },
  });

  return (
    <Table className="text-sm">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="bg-slate-50">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500"
                onClick={header.column.getToggleSortingHandler()}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="hover:bg-slate-50/70">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="px-4 py-4">
                  {cell.column.id === "fileType" ? (
                    <div className="flex items-center gap-2">
                      <FilePreviewIcon fileType={row.original.fileType} />
                    </div>
                  ) : (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="py-10 text-center text-sm text-slate-500"
            >
              <Translate text={localizationConstants.noResultsFound} />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export function QuoteCompanyCertificatesSection({
  search,
  category,
}: {
  search: string;
  category: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xl font-semibold text-slate-900">
        <Translate text={localizationConstants.companyCertificatesTitle} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white">
        <CertificateTable search={search} category={category || "all"} />
      </div>
    </div>
  );
}
