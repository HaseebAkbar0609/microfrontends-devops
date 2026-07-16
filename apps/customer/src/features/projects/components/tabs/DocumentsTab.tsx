"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronDown, Trash2, ArrowUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ProjectDocument } from "../../types";
import {
  getProjectDocumentsAPIAction,
  saveProjectDocumentAPIAction,
  deleteProjectDocumentAPIAction,
  uploadMediaAPIAction,
  type ApiProjectDocumentItem,
} from "@/api-actions";
import { showToast } from "@/lib/toast";

import { getDocumentIconMeta } from "@/features/quote/utils/documentIcon";

interface DocumentsTabProps {
  projectId: string;
  projectName: string;
}

export function DocumentsTab({ projectId, projectName }: DocumentsTabProps) {
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    const res = await getProjectDocumentsAPIAction(projectId);
    if (res.success && res.data) {
      const mapped: ProjectDocument[] = res.data.map((doc: ApiProjectDocumentItem) => {
        const name = doc.name || "Document";
        const ext = name.includes(".") ? name.split(".").pop() || "" : doc.type || "PDF";
        return {
          id: doc.id,
          name: name,
          specification: (doc.comment as string) || "No comments",
          type: doc.type && doc.type !== "PDF" ? doc.type : ext.toUpperCase(),
          date: doc.date ? new Date(doc.date).toISOString().split("T")[0] : "-",
          fileUrl: doc.fileUrl,
        };
      });
      setDocuments(mapped);
    } else {
      showToast("error", res.error || "Failed to fetch project documents");
    }
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    void fetchDocuments();
  }, [fetchDocuments]);

  const handleAreaClick = () => {
    if (!uploading) fileInputRef.current?.click();
  };

  const processFiles = async (filesToUpload: File[]) => {
    if (!filesToUpload.length) return;
    setUploading(true);

    try {
      for (const file of filesToUpload) {
        // 1. Upload to S3/Storage via media API
        const uploadRes = await uploadMediaAPIAction(file);
        if (!uploadRes.success || !uploadRes.data?.id) {
          throw new Error(uploadRes.error || `Failed to upload file "${file.name}" to storage`);
        }

        // 2. Link document in DB
        const linkRes = await saveProjectDocumentAPIAction(
          projectId,
          uploadRes.data.id,
          file.name || "Uploaded via documents tab",
        );
        if (!linkRes.success) {
          throw new Error(linkRes.error || `Failed to save document record for "${file.name}"`);
        }
      }

      showToast("success", "Documents uploaded successfully");
      setStagedFiles([]);
      void fetchDocuments();
    } catch (err: unknown) {
      const error = err as Error;
      showToast("error", error.message || "An error occurred during file upload");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const selectedFiles = Array.from(files);
    e.target.value = "";
    setStagedFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeStaged = (index: number) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!stagedFiles.length) return;
    await processFiles(stagedFiles);
  };

  const handleDelete = async (id: string) => {
    if (!projectId) return;
    const res = await deleteProjectDocumentAPIAction(projectId, id);
    if (res.success) {
      showToast("success", "Document deleted successfully");
      void fetchDocuments();
    } else {
      showToast("error", res.error || "Failed to delete document");
    }
  };

  return (
    <div className="space-y-5 pb-10">
      {/* Personal Documents */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
          <Image
            src="/assets/icons/personal-info.svg"
            alt=""
            width={20}
            height={20}
          />
          <span className="text-sm font-semibold text-slate-900">
            <Translate text={localizationConstants.projectPersonalDocumentTitle} />
          </span>
        </div>
        <div className="px-4">
          {/* Table header */}
          <div className="grid grid-cols-2 gap-4 py-3">
            <span className="text-sm font-medium text-[#09090B]">
              <Translate text={localizationConstants.projectDocNameLabel} />
            </span>
            <span className="text-sm font-medium text-[#09090B]">
              <Translate text={localizationConstants.projectDocTypeLabel} />
            </span>
          </div>
          <div className="py-6 text-center text-xs text-slate-400">
            No personal documents uploaded
          </div>
        </div>
      </div>

      {/* Documents - Project Name */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
          <Image
            src="/assets/icons/folders.svg"
            alt=""
            width={20}
            height={20}
          />
          <span className="text-sm font-semibold text-slate-900">
            <Translate text={localizationConstants.projectSubTabDocuments} /> -{" "}
            {projectName}
          </span>
        </div>

        <div className="px-4 py-4 space-y-1 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-900">
            <Translate text={localizationConstants.projectUploadFilesLabel} />
          </p>
          <p className="text-xs text-slate-400">
            PNG-, JPG- och PDF-filer är tillåtna.
          </p>

          <div className="flex gap-2 pt-2">
            {/* File chip input area */}
            <div
              className="flex-1 flex items-center gap-2 flex-wrap border border-slate-200 rounded-lg px-3 py-2 min-h-10 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={handleAreaClick}
            >
              {stagedFiles.length === 0 ? (
                <span className="text-xs text-slate-400 select-none">
                  Select files...
                </span>
              ) : (
                stagedFiles.map((file, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-slate-100 text-xs text-slate-700 px-2 py-0.5 rounded"
                  >
                    {file.name}
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeStaged(i);
                      }}
                      className="cursor-pointer text-slate-400 hover:text-slate-700 leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
              <ChevronDown className="h-4 w-4 text-slate-400 ml-auto shrink-0" />
            </div>

            <Button
              type="button"
              onClick={handleUpload}
              disabled={stagedFiles.length === 0 || uploading}
              className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-5 h-10 rounded-lg gap-2"
            >
              {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
              <Translate text={localizationConstants.projectUploadFilesLabel} />
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xlsx,.png,.jpg,.jpeg"
              disabled={uploading}
            />
          </div>
        </div>

        {/* Specification table */}
        <div className="px-4 py-3">
          <p className="text-sm font-semibold text-slate-900 mb-3">
            <Translate text={localizationConstants.projectSpecificationLabel} />
          </p>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[140px_1fr_1fr_80px_100px_40px] gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
              {[
                localizationConstants.projectFileDateLabel,
                localizationConstants.projectDocNameLabel,
                localizationConstants.projectSpecificationLabel,
                localizationConstants.projectFileLabel,
                localizationConstants.projectViewFileLabel,
              ].map((label) => (
                <button
                  key={label}
                  type="button"
                  className="cursor-pointer flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700 text-left"
                >
                  <Translate text={label} />
                  <ArrowUpDown className="h-3 w-3 shrink-0" />
                </button>
              ))}
              <span />
            </div>

            {/* Rows */}
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-slate-600" />
              </div>
            ) : documents.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-400">
                No documents yet
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="grid grid-cols-[140px_1fr_1fr_80px_100px_40px] gap-3 px-4 py-3 items-center hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-sm text-slate-500">{doc.date}</span>

                    <div className="flex items-center gap-2 min-w-0">
                      {(() => {
                        const ext = doc.name.includes(".")
                          ? doc.name.split(".").pop() || doc.type
                          : doc.type;
                        const iconMeta = getDocumentIconMeta(ext || "pdf");
                        return (
                          <Image
                            src={iconMeta.src}
                            alt={iconMeta.alt}
                            width={28}
                            height={28}
                            className="shrink-0"
                          />
                        );
                      })()}
                      <span className="text-sm text-slate-800 truncate font-medium">
                        {doc.name}
                      </span>
                    </div>

                    <span className="text-sm text-slate-500 truncate">
                      {doc.specification}
                    </span>

                    <span className="text-sm text-slate-500">{doc.type}</span>

                    {doc.fileUrl ? (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-700 hover:text-primary transition-colors font-medium"
                      >
                        <Translate text={localizationConstants.projectViewFileLabel} />
                      </a>
                    ) : (
                      <span />
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(doc.id)}
                      className="cursor-pointer text-slate-400 hover:text-red-500 transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
