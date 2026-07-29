"use client";

import { useState, useRef } from "react";
import { X, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
  DUMMY_REQUIRED_DOCS,
  DUMMY_TEMPLATE_DOCS,
} from "../constants/offerForm.mock";

export function OfferFormDocumentsSection() {
  const t = useTranslate();
  const [requiredDocs, setRequiredDocs] = useState(
    DUMMY_REQUIRED_DOCS.map((d) => d.id),
  );
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const removeRequired = (id: string) =>
    setRequiredDocs((prev) => prev.filter((d) => d !== id));

  const activeRequired = DUMMY_REQUIRED_DOCS.filter((d) =>
    requiredDocs.includes(d.id),
  );

  return (
    <div className="space-y-5">
      {/* Required documents */}
      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">
          <Translate text={localizationConstants.offerFormRequiredDocs} />
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {activeRequired.map((doc) => (
            <span
              key={doc.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
            >
              {doc.label}
              <button
                type="button"
                onClick={() => removeRequired(doc.id)}
                className="ml-0.5 text-slate-400 hover:text-slate-600"
                aria-label={`Remove ${doc.label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Download templates */}
      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">
          <Translate text={localizationConstants.offerFormDownloadTemplates} />
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {DUMMY_TEMPLATE_DOCS.map((doc) => (
            <span
              key={doc.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
            >
              {doc.label}
            </span>
          ))}
          <Button
            type="button"
            className="h-8 bg-neutral-950 px-4 text-xs text-white hover:bg-neutral-800"
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            <Translate text={localizationConstants.offerFormDownload} />
          </Button>
        </div>
      </div>

      {/* File upload */}
      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">
          <Translate text={localizationConstants.offerFormFileUpload} />
        </p>
        <div className="flex items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            className="sr-only"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
          />
          <Button
            type="button"
            variant="outline"
            className="h-9 shrink-0 text-sm"
            onClick={() => fileRef.current?.click()}
          >
            <Translate text={localizationConstants.offerFormUploadFiles} />
          </Button>
          <span className="text-sm text-slate-500">
            {fileName || t(localizationConstants.offerFormNoFileChosen)}
          </span>
          {fileName && (
            <Button
              type="button"
              className="h-9 bg-neutral-950 text-white hover:bg-neutral-800 text-sm"
            >
              <Translate text={localizationConstants.offerFormSubmit} />
            </Button>
          )}
        </div>
        <p className="mt-1.5 text-xs text-slate-400">
          <Translate text={localizationConstants.offerFormFileTypesInfo} />
        </p>
      </div>
    </div>
  );
}
