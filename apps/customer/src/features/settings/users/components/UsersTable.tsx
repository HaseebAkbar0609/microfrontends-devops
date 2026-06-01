"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Pencil,
  CircleMinus,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQueryParams } from "@/hooks/useQueryParams";

import { User, UserColumnField } from "../types/types";

import { USERS_COLUMNS } from "../constants";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import useModal from "@/features/auth/hooks/useModal";
import { MODAL_CONSTANTS, ModalType } from "@/constants/constant";
import { activeInactiveCompanyUserAPIAction } from "@/api-actions";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formatDistanceToNow = (date: Date) => {
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));

  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) return `${diffDays} days ago`;

  const diffMonths = Math.round(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} months ago`;

  const diffYears = Math.round(diffMonths / 12);
  return `${diffYears} years ago`;
};

interface UsersTableProps {
  data: User[];
  /** Called after archive/delete succeeds so the list can reload */
  onRefresh?: () => void;
}

const getStatusVariant = (userStatus: string) => {
  switch (userStatus) {
    case "active":
      return "success";
    default:
      return "warning";
  }
};

/** Table columns only (not every `User` key such as `id` / `project_type`) */
type UsersTableColumnField = (typeof USERS_COLUMNS)[number]["field"];

/** Layout: avoid table-fixed equal columns + nowrap overflow into adjacent cells */
const COLUMN_LAYOUT: Record<UsersTableColumnField, { head: string; cell: string }> = {
  first_name: {
    head: "min-w-[12rem] w-[20%]",
    cell: "min-w-[12rem] max-w-[28rem] whitespace-normal break-words align-top text-left leading-snug",
  },
  date_created: {
    head: "w-[4.5rem] min-w-[4rem]",
    cell: "whitespace-nowrap align-top",
  },
  account_type: {
    head: "w-[4.5rem] min-w-[4rem]",
    cell: "whitespace-nowrap align-top",
  },
  last_login: {
    head: "w-[4.5rem] min-w-[4rem]",
    cell: "whitespace-nowrap align-top",
  },
  status: {
    head: "w-[9.5rem] min-w-[8.5rem]",
    cell: "whitespace-nowrap align-top",
  },
  actions: {
    head: "w-20 min-w-[5rem]",
    cell: "whitespace-nowrap align-top",
  },
};

const SortIconElement = ({
  field,
  sortBy,
  sortOrder,
}: {
  field: string;
  sortBy: string;
  sortOrder: string;
}) => {
  if (sortBy !== field) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />;
  return sortOrder === "asc" ? (
    <ArrowUp className="ml-1 h-3.5 w-3.5 text-primary" />
  ) : (
    <ArrowDown className="ml-1 h-3.5 w-3.5 text-primary" />
  );
};

const ActionsDropdown = ({ user: _user, onRefresh }: { user: User; onRefresh?: () => void }) => {
  const { t } = useTranslation();
  const { isOpen, openModal, closeModal, type, modalId } = useModal<ModalType>();
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    if (!type || !modalId) return;

    setIsPending(true);
    try {
      const result = await activeInactiveCompanyUserAPIAction(modalId);
      if (result.success) {
        onRefresh?.();
        closeModal();
      }
    } finally {
      setIsPending(false);
    }
  };

  const isAdminUser = _user.account_type === "admin";
  const showActiveUser = !isAdminUser && _user.status === "deactivated";
  const showDeactivateUser = !isAdminUser && _user.status === "active";
  const isActivating = type === MODAL_CONSTANTS.ACTIVE;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-accent-foreground hover:text-accent-foreground bg-muted rounded-md"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem asChild className="gap-2 cursor-pointer py-2 group">
            <Link href={`/settings/users/${_user.id}`} className="flex items-center w-full">
              <Pencil className="h-4 w-4 text-accent-foreground group-hover:text-accent-foreground transition-colors" />
              {t(localizationConstants.edit)}
            </Link>
          </DropdownMenuItem>
          {showActiveUser && (
            <DropdownMenuItem
              className="gap-2 cursor-pointer py-2 group"
              onClick={() => openModal(MODAL_CONSTANTS.ACTIVE, _user.id)}
            >
              <RotateCcw className="h-4 w-4 text-accent-foreground group-hover:text-accent-foreground transition-colors" />
              {t(localizationConstants.activateUser)}
            </DropdownMenuItem>
          )}
          {showDeactivateUser && (
            <DropdownMenuItem
              className="gap-2 cursor-pointer py-2 group"
              onClick={() => openModal(MODAL_CONSTANTS.DEACTIVATE, _user.id)}
            >
              <CircleMinus className="h-4 w-4 text-accent-foreground group-hover:text-accent-foreground transition-colors" />
              {t(localizationConstants.deactivateUser)}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isOpen} onOpenChange={closeModal}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-slate-800">
              {t(
                isActivating
                  ? localizationConstants.activateUserConfirmTitle
                  : localizationConstants.deactivateUserConfirmTitle,
              )}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500">
              {t(
                isActivating
                  ? localizationConstants.activateUserConfirmDescription
                  : localizationConstants.deactivateUserConfirmDescription,
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel onClick={closeModal} className="min-w-24">
              {t(localizationConstants.cancel)}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault();
                void handleConfirm();
              }}
              className={`min-w-24 ${
                isActivating
                  ? "bg-slate-900 hover:bg-slate-800 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {t(
                isActivating
                  ? localizationConstants.activateUser
                  : localizationConstants.deactivateUser,
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export function UsersTable({ data, onRefresh }: UsersTableProps) {
  const { query, changeQueries } = useQueryParams();
  const router = useRouter();

  const sortBy = query.get("sort_by") || "";
  const sortOrder = query.get("sort_order") || "";

  useEffect(() => {
    data.forEach((user) => {
      router.prefetch(`/settings/users/${user.id}`);
    });
  }, [data, router]);

  const handleSort = useCallback(
    (field: string) => {
      if (field === "actions") return;

      let nextOrder: string | null = "asc";
      if (sortBy === field) {
        if (sortOrder === "asc") nextOrder = "desc";
        else if (sortOrder === "desc") {
          nextOrder = null;
        }
      }

      changeQueries({
        sort_by: nextOrder ? field : null,
        sort_order: nextOrder,
      });
    },
    [sortBy, sortOrder, changeQueries],
  );

  const renderCell = useCallback(
    (user: User, columnKey: UserColumnField) => {
      switch (columnKey) {
        case "first_name":
          return (
            <span className="text-slate-950 font-medium">
              {user.first_name} {user.last_name}
            </span>
          );
        case "date_created":
          return <span className="text-slate-600 block">{user[columnKey]}</span>;
        case "account_type":
          const labelKey =
            user.account_type == "admin"
              ? localizationConstants.userAccountAdmin
              : localizationConstants.userAccountUsers;

          return (
            <span className="text-slate-600 block">
              <Translate text={labelKey} />
            </span>
          );
        case "last_login":
          const dateLastLogin = new Date(user[columnKey]);
          return <span className="text-slate-600 block">{formatDistanceToNow(dateLastLogin)}</span>;
        case "status": {
          const labelKey =
            user.status == "active"
              ? localizationConstants.userStatusActive
              : localizationConstants.userStatusDeactivated;
          return (
            <Badge
              variant={getStatusVariant(user.status)}
              className="rounded-[6px] px-2.5 py-0.5 whitespace-nowrap capitalize"
            >
              <Translate text={labelKey} />
            </Badge>
          );
        }
        case "actions":
          return <ActionsDropdown user={user} onRefresh={onRefresh} />;
        default:
          return null;
      }
    },
    [onRefresh],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full bg-white rounded-md border border-slate-200 overflow-hidden">
        <Table className="w-full min-w-[56rem] table-auto">
          <colgroup>
            {USERS_COLUMNS.map((col) => (
              <col key={col.field} className={COLUMN_LAYOUT[col.field].head} />
            ))}
          </colgroup>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-slate-200">
              {USERS_COLUMNS.map((col) => (
                <TableHead
                  key={col.field}
                  className={cn(
                    "cursor-pointer select-none text-slate-500 font-medium py-3.5 px-4 h-auto text-left",
                    COLUMN_LAYOUT[col.field].head,
                    col.field === "actions" && "cursor-default",
                    "whitespace-nowrap",
                  )}
                  onClick={() => handleSort(col.field)}
                >
                  <div
                    className={cn(
                      "flex items-center gap-1 min-w-0",
                      col.field === "actions" && "justify-end",
                    )}
                  >
                    <Translate text={col.label} />
                    {col.field !== "actions" && (
                      <SortIconElement field={col.field} sortBy={sortBy} sortOrder={sortOrder} />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
              <TableRow
                key={user.id}
                className="border-b border-slate-100 odd:bg-white even:bg-slate-50/40 hover:bg-slate-100/60"
              >
                {USERS_COLUMNS.map((col) => (
                  <TableCell
                    key={`${user.id}-${col.field}`}
                    className={cn(
                      "py-3.5 px-4",
                      COLUMN_LAYOUT[col.field].cell,
                      col.field === "actions" && "text-right",
                    )}
                  >
                    {renderCell(user, col.field)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={USERS_COLUMNS.length}
                  className="h-32 text-center text-slate-500"
                >
                  <Translate text={localizationConstants.noUsersFound} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
