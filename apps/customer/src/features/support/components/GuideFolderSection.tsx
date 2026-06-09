"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react";

import { cn } from "@/lib/utils";
import { GuideFolder } from "../types";
import { Translate } from "@/utils/translation/translate";

interface GuideFolderSectionProps extends GuideFolder {
  selectedDocument: string;
  onSelectDocument: (document: string) => void;
}

export function GuideFolderSection({
  title,
  count,
  defaultOpen = false,
  items = [],
  selectedDocument,
  onSelectDocument,
}: GuideFolderSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center py-2"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-indigo-600" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
        )}

        {open ? (
          <FolderOpen className="ml-2 h-5 w-5 shrink-0 text-orange-500" />
        ) : (
          <Folder className="ml-2 h-5 w-5 shrink-0 text-slate-400" />
        )}

        <span className="ml-3 flex-1 text-left font-semibold text-slate-800">
          <Translate text={title} />
        </span>

        {count !== undefined && (
          <span className="min-w-[24px] text-right text-slate-500">
            {count}
          </span>
        )}
      </button>

      {open && items.length > 0 && (
        <div className="mt-1 space-y-1">
          {items.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onSelectDocument(item.id)}
              className={cn(
                "flex h-8 w-full items-center rounded-md pl-[55px]",
                selectedDocument === item.id && "bg-slate-200",
              )}
            >
              <span className="flex-1 text-left text-slate-800">
                <Translate text={item.label} />
              </span>

              {item.count !== undefined && (
                <span className="ml-auto text-slate-500">{item.count}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
