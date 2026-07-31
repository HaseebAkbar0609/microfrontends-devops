"use client";

import { useState } from "react";
import { Paperclip, ChevronUp, ChevronDown, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

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

  function removeDoc(doc: string) {
    setDocs((prev) => prev.filter((item) => item !== doc));
  }

  function removeTemplate(tpl: string) {
    setTemplates((prev) => prev.filter((item) => item !== tpl));
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-4 px-4 py-4"
        onClick={() => setOpen((v) => !v)}
      >
        <Paperclip size={18} className="shrink-0 text-slate-700" />
        <span className="text-base font-medium text-slate-800">
          {t(localizationConstants.agreementDocuments)}
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
          <div className="space-y-5 px-4 py-4">
            {/* Attach standard documents */}
            <div>
              <p className="mb-2.5 text-xs text-slate-500">
                {t(localizationConstants.agreementAttachStandard)}
              </p>
              <div className="flex flex-wrap gap-2">
                {docs.map((doc) => (
                  <span
                    key={doc}
                    className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    {doc}
                    <button
                      type="button"
                      aria-label={`Remove ${doc}`}
                      className="cursor-pointer text-slate-400 hover:text-slate-700"
                      onClick={() => removeDoc(doc)}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Download templates */}
            <div>
              <p className="mb-2.5 text-xs text-slate-500">
                {t(localizationConstants.agreementDownloadTemplates)}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex flex-1 flex-wrap gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
                  {templates.map((tpl) => (
                    <span
                      key={tpl}
                      className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                    >
                      {tpl}
                      <button
                        type="button"
                        aria-label={`Remove template ${tpl}`}
                        className="cursor-pointer text-slate-400 hover:text-slate-700"
                        onClick={() => removeTemplate(tpl)}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <Button
                  size="sm"
                  className="h-9 shrink-0 cursor-pointer gap-1.5 bg-slate-900 text-xs text-white hover:bg-slate-700"
                >
                  <Download size={13} />
                  {t(localizationConstants.agreementDownload)}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
