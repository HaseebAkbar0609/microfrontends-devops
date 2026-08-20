"use client";

import { useState, useRef } from "react";
import { Upload, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";

export function AgreementFileUploadSection() {
  const t = useTranslate();
  const [open, setOpen] = useState(true);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const extension = selectedFile.name.split(".").pop()?.toLowerCase();
    const validExtensions = ["png", "jpg", "jpeg", "pdf"];
    if (!extension || !validExtensions.includes(extension)) {
      showToast("error", "Invalid file type. PNG, JPG, and PDF files are allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFileName(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      showToast("error", "File size exceeds 5MB limit.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setFileName(null);
      return;
    }

    setFileName(selectedFile.name);
    showToast("success", `Selected ${selectedFile.name}`);
  }

  function handleSubmit() {
    if (!fileName) {
      showToast("error", "Please select a file first.");
      return;
    }
    showToast("success", `${fileName} uploaded successfully!`);
  }

  function handleTriggerUpload() {
    fileInputRef.current?.click();
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white max-w-[76%]">
      <button
        type="button"
        aria-expanded={open}
        className={cn(
          "flex w-full cursor-pointer items-center gap-4 p-4",
          open && "border-b border-slate-200",
        )}
        onClick={() => setOpen((v) => !v)}
      >
        <Upload size={21} className="shrink-0 text-slate-700" />
        <span className="flex-1 text-left text-base font-medium text-slate-800">
          {t(localizationConstants.agreementFileUpload) || "File Upload"}
        </span>
        {open ? (
          <ChevronUp size={18} className="shrink-0 text-zinc-500" />
        ) : (
          <ChevronDown size={18} className="shrink-0 text-zinc-500" />
        )}
      </button>

      {open && (
        <div className="p-4">
          <div className="flex flex-col gap-1 mb-3">
            <label className="text-sm font-medium text-zinc-950">
              {t(localizationConstants.agreementUploadFiles) || "Upload your files"}
            </label>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex items-center gap-3 max-w-md">
            <div
              role="button"
              tabIndex={0}
              onClick={handleTriggerUpload}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleTriggerUpload();
                }
              }}
              className="flex h-9 flex-1 cursor-pointer items-center rounded border border-slate-200 bg-white overflow-hidden select-none hover:border-slate-300 transition-colors"
            >
              <span className="flex h-full items-center px-3.5 text-xs font-medium text-slate-800 hover:bg-slate-50 transition-colors">
                {t(localizationConstants.agreementUpload) || "Upload"}
              </span>
              <span className="px-3 text-xs text-slate-400 truncate flex-1">
                {fileName ?? (t(localizationConstants.agreementNoFile) || "No file chosen")}
              </span>
            </div>

            <Button
              type="button"
              onClick={handleSubmit}
              className="h-9 shrink-0 cursor-pointer rounded bg-[#111721] px-4 text-xs font-medium text-white hover:bg-slate-800 shadow-none"
            >
              {t(localizationConstants.agreementSubmit) || "Submit"}
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 font-normal">
            {t(localizationConstants.agreementFileTypes) || "PNG, JPG, and PDF files are allowed."}
          </p>
        </div>
      )}
    </div>
  );
}

