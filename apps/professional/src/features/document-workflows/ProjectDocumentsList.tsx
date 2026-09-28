"use client";
import { useMemo, useState } from "react";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTranslate } from "@/utils/translation/translate";
import type { UploadedProjectDocument } from "@/features/project/services/projectDocumentService";
import { ARCHIVED_STATES, WORKFLOW_PAGE_SIZE } from "./labels";
import { DocumentActions } from "./DocumentActions";
import { DocumentsToolbar } from "./DocumentsToolbar";
import { DocumentWorkflowDialog } from "./DocumentWorkflowDialog";
import { WorkflowStatus } from "./WorkflowStatus";

export function ProjectDocumentsList({ documents, projectId, refresh, refreshing }: {
  documents: UploadedProjectDocument[]; projectId: string; refresh: () => void; refreshing: boolean;
}) {
  const t = useTranslate();
  const [view, setView] = useState("active");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date");
  const [desc, setDesc] = useState(true);
  const sorting = useMemo(() => [{ id: sort, desc }], [sort, desc]);
  const [selected, setSelected] = useState<UploadedProjectDocument | null>(null);
  const data = useMemo(() => documents.filter(document => view === "all" || ARCHIVED_STATES.includes(document.archiveState || "") === (view === "archived")), [documents, view]);
  const columns = useMemo<ColumnDef<UploadedProjectDocument>[]>(() => [
    { accessorKey: "date", header: () => t("dateHeaderLabel"), size: 110 },
    { accessorKey: "documentName", header: () => t("orderDocumentNameHeader"), cell: ({ row }) => <span className="block break-all">{row.original.documentName}<span className="mt-1 block break-all text-xs text-slate-500">{row.original.fileName}</span></span>, size: 350 },
    { accessorKey: "approvalState", header: () => t("dwApproval"), cell: ({ row }) => <WorkflowStatus state={row.original.approvalState} />, size: 170 },
    { accessorKey: "archiveState", header: () => t("dwArchive"), cell: ({ row }) => <WorkflowStatus state={row.original.archiveState} />, size: 170 },
    { id: "actions", header: () => <span className="sr-only">{t("proAdminActions")}</span>, cell: ({ row }) => <DocumentActions document={row.original} open={() => setSelected(row.original)} />, size: 112 },
  ], [t]);
  const table = useReactTable({ data, columns, state: { globalFilter: search, sorting },
    globalFilterFn: (row, _columnId, value) => `${row.original.documentName} ${row.original.fileName}`.toLocaleLowerCase().includes(String(value).trim().toLocaleLowerCase()),
    onGlobalFilterChange: setSearch, getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel(), initialState: { pagination: { pageSize: WORKFLOW_PAGE_SIZE } },
  });
  const rows = table.getRowModel().rows;
  const selectedDocument = documents.find(document => document.id === selected?.id) || selected;
  return <TooltipProvider><div className="min-w-0">
    <Tabs value={view} onValueChange={setView}><TabsList variant="line" className="h-11 max-w-full">
      <TabsTrigger className="h-11" value="active">{t("dwActiveDocuments")}</TabsTrigger><TabsTrigger className="h-11" value="archived">{t("dwArchivedDocuments")}</TabsTrigger><TabsTrigger className="h-11" value="all">{t("dwAllDocuments")}</TabsTrigger>
    </TabsList></Tabs>
    <DocumentsToolbar search={search} setSearch={setSearch} sort={sort} setSort={setSort} desc={desc} setDesc={setDesc} refresh={refresh} refreshing={refreshing} />
    <div className="hidden overflow-x-auto border border-slate-200 bg-white md:block">
      <Table className="w-full table-fixed"><TableHeader>{table.getHeaderGroups().map(group => <TableRow key={group.id}>{group.headers.map(header => <TableHead key={header.id}
        className="px-3" style={{ width: header.id === "documentName" ? undefined : header.getSize() }}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>)}</TableRow>)}</TableHeader>
        <TableBody>{rows.length ? rows.map(row => <TableRow key={row.id}>{row.getVisibleCells().map(cell => <TableCell key={cell.id} className="px-3 py-4 align-top whitespace-normal">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>)}</TableRow>) : <TableRow><TableCell colSpan={columns.length} className="p-8 text-center">{t("noRecordsFound")}</TableCell></TableRow>}</TableBody>
      </Table>
    </div>
    <ul className="divide-y divide-slate-200 border-y border-slate-200 bg-white md:hidden">
      {rows.length ? rows.map(row => <li key={row.id} className="min-w-0 space-y-3 px-3 py-4">
        <div className="flex min-w-0 items-start justify-between gap-2"><div className="min-w-0 flex-1"><p className="break-all text-sm font-medium">{row.original.documentName}</p><p className="mt-1 break-all text-xs text-slate-500">{row.original.date}</p></div><DocumentActions document={row.original} open={() => setSelected(row.original)} /></div>
        <div className="flex flex-wrap gap-4"><div className="min-w-0 space-y-1"><p className="text-xs text-slate-500">{t("dwApproval")}</p><WorkflowStatus state={row.original.approvalState} /></div><div className="min-w-0 space-y-1"><p className="text-xs text-slate-500">{t("dwArchive")}</p><WorkflowStatus state={row.original.archiveState} /></div></div>
      </li>) : <li className="p-6 text-center text-sm text-slate-500">{t("noRecordsFound")}</li>}
    </ul>
    <div className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm text-slate-500">
      <Select value={String(table.getState().pagination.pageSize)} onValueChange={value => table.setPageSize(Number(value))}><SelectTrigger aria-label={t("dwPerPage")} className="h-11 w-20"><SelectValue /></SelectTrigger><SelectContent>{[10,20,50].map(size => <SelectItem key={size} value={String(size)}>{size}</SelectItem>)}</SelectContent></Select>
      <span>{table.getState().pagination.pageIndex + 1} / {Math.max(1, table.getPageCount())}</span>
      <div className="flex gap-2"><Button className="h-11 w-11" size="icon" variant="outline" aria-label={t("proAdminPrevious")} disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}><ChevronLeft /></Button><Button className="h-11 w-11" size="icon" variant="outline" aria-label={t("proAdminNext")} disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}><ChevronRight /></Button></div>
    </div>
    {selectedDocument && <DocumentWorkflowDialog key={selectedDocument.id} target={{ id: selectedDocument.id, projectId, name: selectedDocument.documentName, fileUrl: selectedDocument.fileUrl }} close={() => setSelected(null)} />}
  </div></TooltipProvider>;
}
