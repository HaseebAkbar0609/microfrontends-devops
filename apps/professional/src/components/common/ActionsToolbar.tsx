"use client";

import type { LucideIcon } from "lucide-react";
import { Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Search } from "../search/Search";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

interface ActionsToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  onFilterChange?: (filter: string) => void;
  onCreateClick?: () => void;
  createButtonLabel?: string;
  createButtonIcon?: LucideIcon;
  filterLabel?: string;
  className?: string;
}

export function ActionsToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = localizationConstants.search,
  onFilterChange,
  onCreateClick,
  createButtonLabel = localizationConstants.createNewButtonText,
  createButtonIcon: CreateButtonIcon = Plus,
  filterLabel = localizationConstants.filter,
  className,
}: ActionsToolbarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4  px-5 pt-6 pb-3",
        className
      )}
    >
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <Search
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          className="h-10 w-full max-w-[300px]"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 gap-2 border-border text-secondary font-medium bg-white"
            >
              <Translate text={filterLabel} />
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => onFilterChange?.("all")}>
              Label
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange?.("active")}>
              Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange?.("completed")}>
              Completed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {onCreateClick && (
        <Button
          onClick={onCreateClick}
          className="bg-[#18181B] text-white hover:bg-[#18181B]/90 h-10 px-4 gap-2 rounded-md transition-colors"
        >
          <CreateButtonIcon className="h-4 w-4" />
          <Translate text={createButtonLabel} />
        </Button>
      )}
    </div>
  );
}
