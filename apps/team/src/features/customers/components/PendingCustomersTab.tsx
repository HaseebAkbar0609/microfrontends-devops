"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpDown, Ban, EllipsisVertical, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionsToolbar } from "@/components/table/ActionsToolbar";
import { TablePagination } from "@/components/table/TablePagination";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useDebounce } from "@/components/hooks/useDebounce";
import { useQueryParams } from "@/components/hooks/useQueryParams";
import {
  listPendingCustomersAPIAction,
  deletePrivateCustomerAPIAction,
  updatePrivateCustomerStatusAPIAction,
} from "@/api-actions";
import type { PendingCustomer } from "@/features/customers/types/types";

const COLUMNS = [
  { key: "customerNumber", labelKey: localizationConstants.customerNumberLabel, width: "w-[100px]" },
  { key: "name", labelKey: localizationConstants.nameLabel, width: "w-[180px]" },
  { key: "email", labelKey: localizationConstants.emailLabel, width: "w-[200px]" },
  { key: "phone", labelKey: localizationConstants.phoneLabel, width: "w-[136px]" },
  { key: "city", labelKey: localizationConstants.cityLabel, width: "w-[109px]" },
  { key: "lastActivity", labelKey: localizationConstants.lastActivityLabel, width: "w-[180px]" },
  { key: "status", labelKey: localizationConstants.statusLabel, width: "w-[124px]" },
] as const;

export function PendingCustomersTab() {
  const router = useRouter();
  const t = useTranslate();
  const queryClient = useQueryClient();
  const { page, search: searchParam, changeQueries, setPage } = useQueryParams();
  const [searchInput, setSearchInput] = useState(searchParam);
  const [pageSize, setPageSize] = useState(10);

  const debouncedSearch = useDebounce(searchInput, 400);

  const { data, isLoading } = useQuery({
    queryKey: ["pending-customers", page, pageSize, debouncedSearch],
    queryFn: () =>
      listPendingCustomersAPIAction({ page, pageSize, search: debouncedSearch }),
    placeholderData: (prev) => prev,
  });

  const customers = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  async function handleDelete(id: string) {
    const res = await deletePrivateCustomerAPIAction(id);
    if (res.success) {
      toast.success(t("Customer deleted successfully"));
      queryClient.invalidateQueries({ queryKey: ["pending-customers"] });
    } else {
      toast.error(res.error ?? "Failed to delete customer");
    }
  }

  async function handleDeactivate(id: string) {
    const res = await updatePrivateCustomerStatusAPIAction(id, "suspended");
    if (res.success) {
      toast.success(t("Customer deactivated successfully"));
      queryClient.invalidateQueries({ queryKey: ["pending-customers"] });
    } else {
      toast.error(res.error ?? "Failed to deactivate customer");
    }
  }

  function handleSearchChange(value: string) {
    setSearchInput(value);
    changeQueries({ search: value || null, page: null });
  }

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setPage(1);
  }

  return (
    <>
      <ActionsToolbar
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        filters={[]}
        onCreateClick={() => router.push("/customers/private/create")}
      />
      <PendingTable
        customers={customers}
        isLoading={isLoading}
        onOpen={(id) => router.push(`/customers/private/${id}`)}
        onDeactivate={handleDeactivate}
        onDelete={handleDelete}
      />
      <TablePagination
        currentPage={page}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
}

interface PendingTableProps {
  readonly customers: PendingCustomer[];
  readonly isLoading: boolean;
  readonly onOpen: (id: string) => void;
  readonly onDeactivate: (id: string) => void;
  readonly onDelete: (id: string) => void;
}

function PendingTable({
  customers,
  isLoading,
  onOpen,
  onDeactivate,
  onDelete,
}: PendingTableProps) {
  const t = useTranslate();

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-sm text-slate-400">…</p>
      </div>
    );
  }

  if (!customers.length) {
    return (
      <div className="flex h-48 items-center justify-center">
        <p className="text-sm text-slate-500">
          <Translate text={localizationConstants.noCustomersFound} />
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-200 bg-slate-50">
            {COLUMNS.map((col) => (
              <TableHead key={col.key} className={`${col.width} h-10 px-4 text-xs font-semibold text-slate-500`}>
                <button className="flex items-center gap-1">
                  <Translate text={col.labelKey} />
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
            ))}
            <TableHead className="w-17" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id} className="h-14 border-slate-200 hover:bg-slate-50">
              <TableCell className="px-4 text-sm text-slate-600">
                {customer.customerNumber}
              </TableCell>
              <TableCell className="px-4 text-sm font-semibold text-slate-900">
                {customer.name}
              </TableCell>
              <TableCell className="px-4 text-sm text-slate-600">
                {customer.email}
              </TableCell>
              <TableCell className="px-4 text-sm text-slate-600">
                {customer.phone}
              </TableCell>
              <TableCell className="px-4 text-sm text-slate-600">
                {customer.city}
              </TableCell>
              <TableCell className="px-4 text-sm text-slate-600">
                {customer.lastActivity}
              </TableCell>
              <TableCell className="px-4">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: "#FFD700", color: "#111721" }}>
                  <Translate text={localizationConstants.waitingLabel} />
                </span>
              </TableCell>
              <TableCell className="px-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem onClick={() => onOpen(customer.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      <Translate text={localizationConstants.open} />
                    </DropdownMenuItem>
                    <ConfirmDialog
                      title={t(localizationConstants.deactivateCustomerTitle)}
                      description={t(localizationConstants.deactivateCustomerDescription)}
                      confirmText={t(localizationConstants.deactivateLabel)}
                      cancelText={t(localizationConstants.cancelLabel)}
                      onConfirm={() => onDeactivate(customer.id)}
                      trigger={
                        <DropdownMenuItem
                          className="gap-2"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Ban className="h-4 w-4" />
                          <Translate text={localizationConstants.deactivateLabel} />
                        </DropdownMenuItem>
                      }
                    />
                    <ConfirmDialog
                      title={t(localizationConstants.deleteCustomerTitle)}
                      description={t(localizationConstants.deleteCustomerDescription)}
                      confirmText={t(localizationConstants.delete)}
                      cancelText={t(localizationConstants.cancelLabel)}
                      confirmClassName="bg-red-600 hover:bg-red-600/90"
                      onConfirm={() => onDelete(customer.id)}
                      trigger={
                        <DropdownMenuItem
                          className="gap-2 text-red-500 focus:text-red-500"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash2 className="h-4 w-4" />
                          <Translate text={localizationConstants.delete} />
                        </DropdownMenuItem>
                      }
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
