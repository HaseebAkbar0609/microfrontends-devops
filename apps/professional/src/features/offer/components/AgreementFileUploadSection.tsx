"use client";

import { useState } from "react";
import { UploadCloud, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export function AgreementFileUploadSection() {
  const t = useTranslate();
  const [open, setOpen] = useState(true);
  const [fileName, setFileName] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      e.target.value = "";
      setFileName(null);
      return;
    }
    setFileName(file.name);
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-4 px-4 py-4"
        onClick={() => setOpen((v) => !v)}
      >
        <UploadCloud size={18} className="shrink-0 text-slate-700" />
        <span className="text-base font-medium text-slate-800">
          {t(localizationConstants.agreementFileUpload)}
        </span>
        <span className="ml-auto">
          {open ? (
            <ChevronUp size={16} className="text-zinc-500" />
          ) : (
            <ChevronDown size={16} className="text-zinc-500" />
          )}
        </span>
      </button>

      {open && (
        <>
          <div className="border-t border-slate-200" />
          <div className="px-4 py-4">
            <p className="mb-3 text-xs font-medium text-slate-700">
              {t(localizationConstants.agreementUploadFiles)}
            </p>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs text-slate-600">
                {t(localizationConstants.agreementUpload)}:
              </span>
              <label
                htmlFor="agreement-file-upload"
                className="flex flex-1 cursor-pointer items-center rounded-md border border-slate-200 bg-white px-3 py-2"
              >
                <span className="text-xs text-slate-400">
                  {fileName ?? t(localizationConstants.agreementNoFile)}
                </span>
                <input
                  id="agreement-file-upload"
                  type="file"
                  accept="image/png,image/jpeg,application/pdf"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <Button
                size="sm"
                className="h-8 shrink-0 cursor-pointer bg-slate-900 px-4 text-xs text-white hover:bg-slate-700"
              >
                {t(localizationConstants.agreementSubmit)}
              </Button>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {t(localizationConstants.agreementFileTypes)}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
