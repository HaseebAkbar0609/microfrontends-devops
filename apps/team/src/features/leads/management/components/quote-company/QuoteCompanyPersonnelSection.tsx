"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FilePreviewIcon from "@/features/leads/management/components/FilePreviewIcon";
import {
  getPersonnelColumns,
  personnelRows,
} from "@/features/leads/management/constants/quoteCompanyTab";

function PersonnelTable({ search }: { search: string }) {
  const t = useTranslate();
  const [sorting, setSorting] = useState<SortingState>([]);

  const filteredData = useMemo(() => {
    if (!search) return personnelRows;
    const value = search.toLowerCase();
    return personnelRows.filter((row) =>
      `${row.name} ${row.position} ${row.certifications}`
        .toLowerCase()
        .includes(value)
    );
  }, [search]);

  const columns = useMemo(() => getPersonnelColumns(t), [t]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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

export function QuoteCompanyPersonnelSection({ search }: { search: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xl font-semibold text-slate-900">
        <Translate text={localizationConstants.personnelLabel} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white">
        <PersonnelTable search={search} />
      </div>
    </div>
  );
}
