"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import Image from "next/image";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  getReferenceImageColumns,
  referenceImageRows,
} from "@/features/leads/management/constants/quoteReferencesTab";

function ReferenceImagesTable() {
  const t = useTranslate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo(() => getReferenceImageColumns(t), [t]);

  const table = useReactTable({
    data: referenceImageRows,
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
                  {cell.column.id === "images" ? (
                    <div className="flex flex-wrap gap-3">
                      {row.original.images.map((src, index) => (
                        <div
                          key={`${row.original.id}-${index}`}
                          className=" overflow-hidden rounded-sm border border-slate-200"
                        >
                          <Image
                            src={src}
                            alt="Reference"
                            height={100}
                            width={180}
                            className="h-25 w-45 object-cover"
                          />
                        </div>
                      ))}
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

export function QuoteReferencesImagesSection() {
  return (
    <div className="space-y-3">
      <div className="text-xl font-semibold text-slate-900">
        <Translate text={localizationConstants.referenceImagesTitle} />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white">
        <ReferenceImagesTable />
      </div>
    </div>
  );
}
