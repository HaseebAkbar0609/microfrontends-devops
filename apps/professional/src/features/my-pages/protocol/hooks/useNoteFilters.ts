"use client";
import { useState } from "react";
import { useTableSort } from "@/hooks/useTableSort";
import { recordPage, useMyPagesQuery } from "../../shared/api";
import { ProtocolNote } from "../constants/data";
export type NoteSortField = "date" | "name";
export function useNoteFilters() {
  const [search, setSearchState] = useState("");
  const { sortField, sortDir, toggleSort: sort } = useTableSort<NoteSortField>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(10);
  const params = { page, page_size: pageSize, search: search.trim(), sort: sortField === "name" ? "title" : "date", direction: sortDir ?? "desc" };
  const queryResult = useMyPagesQuery(["notes", params], () => recordPage<ProtocolNote>("note", params));
  return {
    search, setSearch: (value: string) => { setSearchState(value); setPage(1); }, sortField, sortDir,
    toggleSort: (field: NoteSortField) => { sort(field); setPage(1); }, page, setPage, pageSize,
    setPageSize: (value: number) => { setPageSizeState(value); setPage(1); },
    paged: queryResult.data?.items ?? [], totalPages: Math.max(1, Math.ceil((queryResult.data?.total ?? 0) / pageSize)), queryResult,
  };
}
