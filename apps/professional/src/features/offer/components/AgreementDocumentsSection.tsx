"use client";

import { useState } from "react";
import { FilePlus, ChevronUp, ChevronDown, X, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const AVAILABLE_DOCUMENTS = [
  "Document 1",
  "Document 2",
  "Document 3",
  "Allmänna bestämmelser",
  "Arbetsmiljöplan",
  "Kvalitetsplan",
];

const AVAILABLE_TEMPLATES = [
  "ABT92 (AB06)",
  "AB04",
  "Hantverkarformuläret 17",
  "ABS 18",
  "Underentreprenörsavtal",
];

interface Props {
  documents: string[];
  templates: string[];
}

export function AgreementDocumentsSection({
  documents: initialDocs,
  templates: initialTemplates,
}: Props) {
  const t = useTranslate();
  const [open, setOpen] = useState(true);
  const [docs, setDocs] = useState(initialDocs);
  const [templates, setTemplates] = useState(initialTemplates);
  const [docsMenuOpen, setDocsMenuOpen] = useState(false);
  const [templatesMenuOpen, setTemplatesMenuOpen] = useState(false);

  function toggleDoc(doc: string) {
    if (docs.includes(doc)) {
      setDocs((prev) => prev.filter((item) => item !== doc));
      showToast("info", `Removed ${doc}`);
    } else {
      setDocs((prev) => [...prev, doc]);
      showToast("success", `Added ${doc}`);
    }
  }

  function removeDoc(doc: string, e?: React.MouseEvent) {
    e?.stopPropagation();
    setDocs((prev) => prev.filter((item) => item !== doc));
    showToast("info", `Removed ${doc}`);
  }

  function toggleTemplate(tpl: string) {
    if (templates.includes(tpl)) {
      setTemplates((prev) => prev.filter((item) => item !== tpl));
      showToast("info", `Removed ${tpl}`);
    } else {
      setTemplates((prev) => [...prev, tpl]);
      showToast("success", `Added ${tpl}`);
    }
  }

  function removeTemplate(tpl: string, e?: React.MouseEvent) {
    e?.stopPropagation();
    setTemplates((prev) => prev.filter((item) => item !== tpl));
    showToast("info", `Removed ${tpl}`);
  }

  function handleDownloadTemplates() {
    if (templates.length === 0) {
      showToast("error", "No contract templates available to download.");
      return;
    }

    templates.forEach((tpl) => {
      const sanitizedName = tpl.replace(/[^a-zA-Z0-9_-]/g, "_");
      const fileContent = `=====================================================
CONTRACT TEMPLATE: ${tpl}
TIMEFLOW AGREEMENT SYSTEM
=====================================================

Standard Avtalsmall / Contract Document: ${tpl}
Datum / Date: ${new Date().toISOString().split("T")[0]}

Parter / Parties:
- Beställare / Customer
- Entreprenör / Contractor

Allmänna bestämmelser och villkor gäller enligt ${tpl}.
Detta dokument är en officiell avtalsmall från TimeFlow System.
=====================================================`;

      const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${sanitizedName}_Mall.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
    });

    showToast("success", `Downloaded ${templates.length} contract template(s) successfully!`);
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        aria-expanded={open}
        className={cn(
          "flex w-full cursor-pointer items-center gap-4 p-4",
          open && "border-b border-slate-200",
        )}
        onClick={() => setOpen((v) => !v)}
      >
        <FilePlus size={21} className="shrink-0 text-slate-700" />
        <span className="flex-1 text-left text-base font-medium text-slate-800">
          {t(localizationConstants.agreementDocuments) || "Documents"}
        </span>
        {open ? (
          <ChevronUp size={18} className="shrink-0 text-zinc-500" />
        ) : (
          <ChevronDown size={18} className="shrink-0 text-zinc-500" />
        )}
      </button>

      {open && (
        <div className="space-y-4 p-4">
          {/* Attach standard attachments */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-950">
              {t(localizationConstants.agreementAttachStandard) || "Attach standard attachments to the contract"}
            </label>

            <DropdownMenu open={docsMenuOpen} onOpenChange={setDocsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <div className="flex min-h-9 w-full items-center justify-between rounded border border-slate-200 bg-white px-3 py-1.5 cursor-pointer hover:border-slate-300 transition-colors">
                  <div className="flex flex-wrap items-center gap-1.5 flex-1">
                    {docs.map((doc) => (
                      <span
                        key={doc}
                        className="inline-flex items-center gap-1.5 rounded-[4px] bg-slate-100 px-2 py-0.5 text-xs font-normal text-slate-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {doc}
                        <button
                          type="button"
                          aria-label={`Remove ${doc}`}
                          className="cursor-pointer text-slate-400 hover:text-slate-700 transition-colors"
                          onClick={(e) => removeDoc(doc, e)}
                        >
                          <X size={11} aria-hidden={true} />
                        </button>
                      </span>
                    ))}
                    {docs.length === 0 && (
                      <span className="text-xs text-slate-400">Select standard attachments...</span>
                    )}
                  </div>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-slate-400 shrink-0 ml-2 transition-transform duration-200",
                      docsMenuOpen && "rotate-180"
                    )}
                  />
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel className="text-xs font-medium text-slate-500">
                  Standard Attachments
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {AVAILABLE_DOCUMENTS.map((doc) => (
                  <DropdownMenuCheckboxItem
                    key={doc}
                    checked={docs.includes(doc)}
                    onCheckedChange={() => toggleDoc(doc)}
                    className="text-xs cursor-pointer"
                  >
                    {doc}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Download contract templates */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-950">
              {t(localizationConstants.agreementDownloadTemplates) || "Download contract templates"}
            </label>
            <div className="flex items-center gap-3">
              <DropdownMenu open={templatesMenuOpen} onOpenChange={setTemplatesMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <div className="flex min-h-9 flex-1 items-center justify-between rounded border border-slate-200 bg-white px-3 py-1.5 cursor-pointer hover:border-slate-300 transition-colors">
                    <div className="flex flex-wrap items-center gap-1.5 flex-1">
                      {templates.map((tpl) => (
                        <span
                          key={tpl}
                          className="inline-flex items-center gap-1.5 rounded-[4px] bg-slate-100 px-2 py-0.5 text-xs font-normal text-slate-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {tpl}
                          <button
                            type="button"
                            aria-label={`Remove template ${tpl}`}
                            className="cursor-pointer text-slate-400 hover:text-slate-700 transition-colors"
                            onClick={(e) => removeTemplate(tpl, e)}
                          >
                            <X size={11} aria-hidden={true} />
                          </button>
                        </span>
                      ))}
                      {templates.length === 0 && (
                        <span className="text-xs text-slate-400">Select contract templates...</span>
                      )}
                    </div>
                    <ChevronDown
                      size={16}
                      className={cn(
                        "text-slate-400 shrink-0 ml-2 transition-transform duration-200",
                        templatesMenuOpen && "rotate-180"
                      )}
                    />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuLabel className="text-xs font-medium text-slate-500">
                    Contract Templates
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {AVAILABLE_TEMPLATES.map((tpl) => (
                    <DropdownMenuCheckboxItem
                      key={tpl}
                      checked={templates.includes(tpl)}
                      onCheckedChange={() => toggleTemplate(tpl)}
                      className="text-xs cursor-pointer"
                    >
                      {tpl}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                type="button"
                onClick={handleDownloadTemplates}
                className="h-9 shrink-0 cursor-pointer gap-2 rounded bg-[#111721] px-4 text-xs font-medium text-white hover:bg-slate-800 shadow-none"
              >
                <Download size={14} aria-hidden={true} />
                {t(localizationConstants.agreementDownload) || "Download"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

