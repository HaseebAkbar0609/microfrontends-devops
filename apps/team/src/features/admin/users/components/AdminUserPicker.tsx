"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronLeft, ChevronRight, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import localizationConstants from "@/utils/translation/constants";
import type { AdminUserDetail } from "../types/adminUsers.types";
import { useAdminUsers } from "../hooks/useAdminUsers";
import { listParams } from "../utils/adminUserTable";
import { AdminQueryState } from "./AdminQueryState";

export function AdminUserPicker({ user, dirty, showDetails, onToggleDetails }: { user: AdminUserDetail; dirty: boolean; showDetails: boolean; onToggleDetails: () => void }) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const query = useAdminUsers(listParams(page, { search, sort_by: "first_name", sort_dir: "asc" }));
  return (
    <div className="relative mb-4 rounded-lg border border-zinc-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-200 px-4 py-4 text-sm font-semibold text-slate-700"><UserRound className="h-5 w-5" />{t(localizationConstants.userDetailsSelectUser)}</div>
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button type="button" variant="outline" className="h-auto min-h-10 min-w-0 flex-1 justify-between text-left"><span className="min-w-0 whitespace-normal break-words">{user.display_name || `${user.first_name} ${user.last_name}`} <span className="text-slate-400">{user.email}</span></span><ChevronDown className="h-4 w-4 shrink-0" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-80 max-w-[calc(100vw-32px)] bg-white">
            <Input aria-label={t(localizationConstants.searchUsersPlaceholder)} placeholder={t(localizationConstants.searchUsersPlaceholder)} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} onKeyDown={(event) => { if (event.key !== "Escape" && event.key !== "Tab") event.stopPropagation(); }} />
            <AdminQueryState loading={query.isPending} error={query.isError ? localizationConstants.adminUsersLoadError : undefined} empty={!query.isPending && !query.isError && !query.data?.data.length ? localizationConstants.adminNoUsersFound : undefined} onRetry={() => void query.refetch()} />
            {!query.isError && query.data?.data.map((option) => <DropdownMenuItem key={option.id} disabled={option.id === user.id} onSelect={() => {
              if (!dirty || window.confirm(t(localizationConstants.adminDiscardChanges))) router.push(`${pathname}?id=${encodeURIComponent(option.id)}`);
            }}><span className="min-w-0 break-words">{option.display_name || `${option.first_name} ${option.last_name}`}<span className="block text-xs text-slate-500">{option.email}</span></span></DropdownMenuItem>)}
            <div className="flex justify-between gap-2 pt-2">
              <Button type="button" variant="ghost" size="icon" aria-label={t(localizationConstants.adminPreviousPage)} disabled={query.isFetching || page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button type="button" variant="ghost" size="icon" aria-label={t(localizationConstants.adminNextPage)} disabled={query.isFetching || page >= (query.data?.total_pages ?? 1)} onClick={() => setPage(page + 1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button type="button" className="h-10 bg-zinc-900 text-white hover:bg-zinc-800" aria-expanded={showDetails} onClick={onToggleDetails}>{t(localizationConstants.userDetailsShowDetails)}</Button>
      </div>
    </div>
  );
}
