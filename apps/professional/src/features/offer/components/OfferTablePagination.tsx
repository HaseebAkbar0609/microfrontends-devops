"use client";

import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface Props {
  page: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
}

export function OfferTablePagination({
  page,
  totalPages,
  rowsPerPage,
  onPageChange,
}: Props) {
  const t = useTranslate();
  return (
    <div className="flex items-center justify-between text-sm text-slate-600">
      <div className="flex items-center gap-2">
        <span>{t(localizationConstants.rowsPerPageLabel)}</span>
        <span className="flex h-8 w-16 items-center justify-between rounded border border-slate-200 px-2 text-sm">
          {rowsPerPage}
          <ChevronsUpDown size={12} className="text-slate-400" />
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
          >
            «
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            ‹
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            ›
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
          >
            »
          </Button>
        </div>
      </div>
    </div>
  );
}
