"use client";

import React from "react";
import { FileText, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { DocFileIcon } from "@/components/ui/DocFileIcon";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export interface PreviewableDoc {
  id?: string;
  label: string;
  name?: string;
  namn?: string;
  type?: "pdf" | "doc" | "other" | string;
  datum?: string;
  date?: string;
  url?: string;
  size?: string;
}

interface B2BDocumentPreviewModalProps {
  document: PreviewableDoc | null;
  onClose: () => void;
  onDownload?: (label: string, url?: string) => void;
}

export function B2BDocumentPreviewModal({
  document,
  onClose,
  onDownload,
}: B2BDocumentPreviewModalProps) {
  const t = useTranslate();
  if (!document) return null;

  const docName = document.namn || document.name || document.label;
  const docDate = document.datum || document.date || "2024-06-10";
  const docType =
    document.type === "doc" || document.label.endsWith(".doc") || document.label.endsWith(".docx")
      ? "doc"
      : document.type === "pdf" || document.label.endsWith(".pdf")
      ? "pdf"
      : "other";

  const handleDownload = () => {
    if (onDownload) {
      onDownload(document.label, document.url);
    } else {
      showToast("success", `Laddar ner "${document.label}"...`);
    }
  };

  return (
    <Dialog open={!!document} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-white border border-slate-200 rounded-xl p-6 shadow-xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
          <DialogTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 truncate">
            <FileText className="h-5 w-5 text-slate-700 shrink-0" />
            <span className="truncate">{docName}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Document Preview Box */}
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200/80 rounded-lg text-center gap-3 my-3">
          <div className="flex items-center justify-center">
            {docType === "doc" ? (
              <DocFileIcon className="h-16 w-14" />
            ) : (
              <PdfFileIcon className="h-16 w-14" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{document.label}</p>
            <p className="text-xs text-slate-500 mt-1">
              Format: {docType.toUpperCase()} • Datum: {docDate} • Storlek: {document.size || "1.4 MB"}
            </p>
          </div>

          <div className="w-full bg-white border border-slate-200 rounded p-3 text-left mt-2">
            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mb-1">
              Dokumentinnehåll & villkor
            </div>
            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
              Detta dokument innehåller gällande avtalsvillkor, specifikationer och bilagor kopplade till projektet. Granska detaljerna noggrant före godkännande och signering.
            </p>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-medium mt-1">
            <Eye className="h-3 w-3" /> Förhandsgranskning aktiv
          </span>
        </div>

        <DialogFooter className="flex items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="text-xs font-medium cursor-pointer rounded-lg border-slate-200"
          >
            {t(localizationConstants.actionClose) || "Stäng"}
          </Button>
          <Button
            type="button"
            onClick={handleDownload}
            className="bg-slate-900 text-white text-xs font-medium gap-1.5 hover:bg-slate-800 cursor-pointer rounded-lg shadow-xs"
          >
            <Download className="h-3.5 w-3.5" />
            {t(localizationConstants.b2bAvtalDownload) || "Ladda ner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
