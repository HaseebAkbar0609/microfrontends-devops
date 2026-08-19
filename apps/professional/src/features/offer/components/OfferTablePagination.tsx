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
    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 pt-2 pb-6">
      <div className="flex items-center gap-2">
        <span className="text-slate-500">{t(localizationConstants.rowsPerPageLabel) || "Rader per sida:"}</span>
        <span className="flex h-8 w-14 items-center justify-between rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-700 shadow-sm">
          {rowsPerPage}
          <ChevronsUpDown size={13} className="text-slate-400" />
        </span>
      </div>
      <span className="text-slate-500">
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
        >
          «
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          ‹
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          ›
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
        >
          »
        </Button>
      </div>
    </div>
  );
}
