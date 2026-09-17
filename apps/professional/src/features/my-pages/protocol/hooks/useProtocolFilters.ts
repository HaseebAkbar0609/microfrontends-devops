"use client";
import { useState } from "react";
import { useTableSort } from "@/hooks/useTableSort";
import { recordPage, useMyPagesQuery } from "../../shared/api";
import { Protocol, ProtocolStatus, ProtocolType } from "../constants/data";

export type ProtocolSortField = "date" | "title" | "status" | "department" | "type";
export type ProtocolFilter = "all" | "archived" | ProtocolStatus | ProtocolType;
export function useProtocolFilters() {
  const [search, setSearchState] = useState("");
  const [filter, setFilterState] = useState<ProtocolFilter>("all");
  const { sortField, sortDir, toggleSort: sort } = useTableSort<ProtocolSortField>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(10);
  const params = { page, page_size: pageSize, search: search.trim(), sort: sortField ?? "date", direction: sortDir ?? "desc",
    status: ["notSent", "sent", "received"].includes(filter) ? filter : undefined,
    record_type: ["standard", "action"].includes(filter) ? filter : undefined, archived: filter === "archived" ? "true" : "false" };
  const queryResult = useMyPagesQuery(["protocols", params], () => recordPage<Protocol>("protocol", params));
  return {
    search, setSearch: (value: string) => { setSearchState(value); setPage(1); },
    filter, setFilter: (value: ProtocolFilter) => { setFilterState(value); setPage(1); },
    sortField, sortDir, toggleSort: (field: ProtocolSortField) => { sort(field); setPage(1); },
    page, setPage, pageSize, setPageSize: (value: number) => { setPageSizeState(value); setPage(1); },
    paged: queryResult.data?.items ?? [], totalPages: Math.max(1, Math.ceil((queryResult.data?.total ?? 0) / pageSize)), queryResult,
  };
}
