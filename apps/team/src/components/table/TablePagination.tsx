"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const t = useTranslate();

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-700">
          {t(localizationConstants.tableRowsPerPage)}
        </span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-9 w-[70px] border-slate-200 focus:ring-0">
            <SelectValue placeholder={String(pageSize)} />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm font-medium text-slate-700">
        {`${t(localizationConstants.tablePageLabel)} ${currentPage} ${t(
          localizationConstants.tablePageOf,
        )} ${totalPages || 1}`}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-slate-200"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">{t(localizationConstants.tableFirstPage)}</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-slate-200"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">{t(localizationConstants.tablePreviousPage)}</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-slate-200"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">{t(localizationConstants.tableNextPage)}</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 border-slate-200"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">{t(localizationConstants.tableLastPage)}</span>
        </Button>
      </div>
    </div>
  );
}
