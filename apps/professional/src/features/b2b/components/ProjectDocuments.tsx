"use client";

import React, { useState } from "react";
import { Download, ExternalLink, File, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { DocFileIcon } from "@/components/ui/DocFileIcon";
import { BASE_URL } from "@/constants/api";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ProjectDocument } from "../types/projectMarket";

/** The API sends local-storage links as a path on the API host; S3 links are absolute. */
export function documentUrl(url: string): string {
  return url.startsWith("/") ? `${BASE_URL}${url}` : url;
}

type FileKind = "image" | "pdf" | "doc" | "other";

/** `type` is the file's MIME type, e.g. "application/pdf". */
function fileKind(doc: ProjectDocument): FileKind {
  const type = doc.type.toLowerCase();
  const name = doc.label.toLowerCase();
  if (type.startsWith("image/")) return "image";
  if (type === "application/pdf" || name.endsWith(".pdf")) return "pdf";
  if (type.includes("word") || name.endsWith(".doc") || name.endsWith(".docx")) return "doc";
  return "other";
}

function FileKindIcon({ kind, className }: { kind: FileKind; className?: string }) {
  if (kind === "pdf") return <PdfFileIcon className={className} />;
  if (kind === "doc") return <DocFileIcon className={className} />;
  return <File className={`text-slate-400 ${className ?? ""}`} aria-hidden={true} />;
}

/** An image: its own thumbnail, falling back to an icon when the link can't be loaded. */
export function ImageTile({ doc, onOpen }: { doc: ProjectDocument; onOpen: () => void }) {
  const [broken, setBroken] = useState(false);
  return (
    <button
      type="button"
      onClick={onOpen}
      title={doc.label}
      className="flex cursor-pointer flex-col items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
    >
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100/80 shadow-2xs">
        {doc.url && !broken ? (
          // eslint-disable-next-line @next/next/no-img-element -- signed, short-lived API links; not for next/image
          <img
            src={documentUrl(doc.url)}
            alt={doc.label}
            className="h-full w-full object-cover"
            onError={() => setBroken(true)}
          />
        ) : (
          <ImageIcon size={24} className="text-slate-400" aria-hidden={true} />
        )}
      </div>
      <span className="mt-1.5 max-w-24 truncate text-xs text-slate-500">{doc.label}</span>
    </button>
  );
}

/** A document or drawing: an icon for its file type. */
export function FileTile({ doc, onOpen }: { doc: ProjectDocument; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      title={doc.label}
      className="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
    >
      <div className="flex h-12 w-12 items-center justify-center">
        <FileKindIcon kind={fileKind(doc)} className="h-9 w-9" />
      </div>
      <span className="max-w-24 truncate text-xs font-medium text-slate-800">{doc.label}</span>
    </button>
  );
}

/**
 * Preview of one project file: the image itself, or the file's icon with
 * Open / Download. Files are fetched as a blob so they keep their real name on
 * download and open in a new tab even though the file endpoint forbids framing.
 */
export function ProjectDocumentPreview({
  doc,
  onClose,
}: {
  doc: ProjectDocument | null;
  onClose: () => void;
}) {
  const t = useTranslate();
  const [busy, setBusy] = useState<"open" | "download" | null>(null);
  const kind = doc ? fileKind(doc) : "other";

  async function withBlob(action: "open" | "download") {
    if (!doc?.url) {
      showToast("error", t(localizationConstants.b2bPMDocLoadError));
      return;
    }
    // Opened before the fetch so the browser treats it as the click's own popup.
    const tab = action === "open" ? window.open("", "_blank") : null;
    setBusy(action);
    try {
      const res = await fetch(documentUrl(doc.url));
      if (!res.ok) throw new Error(String(res.status));
      const objectUrl = URL.createObjectURL(await res.blob());
      if (action === "open" && tab) {
        tab.location.href = objectUrl;
      } else {
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = doc.label;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    } catch {
      tab?.close();
      showToast("error", t(localizationConstants.b2bPMDocLoadError));
    } finally {
      setBusy(null);
    }
  }

  return (
    <Dialog open={!!doc} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white">
        {doc && (
          <>
            <DialogHeader>
              <DialogTitle className="truncate pr-6 text-base">{doc.label}</DialogTitle>
              <DialogDescription className="text-xs">{doc.type || "—"}</DialogDescription>
            </DialogHeader>

            <div className="flex min-h-40 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-3">
              {kind === "image" && doc.url ? (
                // eslint-disable-next-line @next/next/no-img-element -- signed, short-lived API links; not for next/image
                <img
                  src={documentUrl(doc.url)}
                  alt={doc.label}
                  className="max-h-[60vh] max-w-full rounded object-contain"
                />
              ) : (
                <FileKindIcon kind={kind} className="h-16 w-14" />
              )}
            </div>

            <DialogFooter className="gap-2">
              {kind !== "image" && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy !== null}
                  onClick={() => void withBlob("open")}
                  className="cursor-pointer gap-1.5 text-xs"
                >
                  {busy === "open" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden={true} />
                  ) : (
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden={true} />
                  )}
                  {t(localizationConstants.b2bPMDocOpen)}
                </Button>
              )}
              <Button
                type="button"
                disabled={busy !== null}
                onClick={() => void withBlob("download")}
                className="cursor-pointer gap-1.5 bg-slate-900 text-xs text-white hover:bg-slate-800"
              >
                {busy === "download" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden={true} />
                ) : (
                  <Download className="h-3.5 w-3.5" aria-hidden={true} />
                )}
                {t(localizationConstants.b2bPMDocDownload)}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
