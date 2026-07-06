"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronDown, Trash2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
  DUMMY_PROJECT_DOCUMENTS,
  DUMMY_PERSONAL_DOCUMENTS,
} from "../../constants";
import type { ProjectDocument } from "../../types";

interface DocumentsTabProps {
  projectName: string;
}

export function DocumentsTab({ projectName }: DocumentsTabProps) {
  const [documents, setDocuments] =
    useState<ProjectDocument[]>(DUMMY_PROJECT_DOCUMENTS);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAreaClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setStagedFiles((prev) => [...prev, ...Array.from(files)]);
    e.target.value = "";
  };

  const removeStaged = (index: number) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (!stagedFiles.length) return;
    const newDocs: ProjectDocument[] = stagedFiles.map((file, i) => ({
      id: `new-${Date.now()}-${i}`,
      name: file.name.replace(/\.[^.]+$/, ""),
      specification: "—",
      type: (file.name.split(".").pop() ?? "FILE").toUpperCase(),
      date: new Date().toISOString().split("T")[0],
    }));
    setDocuments((prev) => [...newDocs, ...prev]);
    setStagedFiles([]);
  };

  const handleDelete = (id: string) =>
    setDocuments((prev) => prev.filter((d) => d.id !== id));

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
          {DUMMY_PERSONAL_DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              className="grid grid-cols-2 gap-4 py-3 last:border-0"
            >
              <span className="text-sm text-[#71717A]">{doc.name}</span>
              <span className="text-sm text-[#71717A]">{doc.type}</span>
            </div>
          ))}
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
            Documents — {projectName}
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
              className="flex-1 flex items-center gap-2 flex-wrap border border-slate-200 rounded-lg px-3 py-2 min-h-[40px] cursor-pointer hover:bg-slate-50 transition-colors"
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
                      onClick={(e) => {
                        e.stopPropagation();
                        removeStaged(i);
                      }}
                      className="text-slate-400 hover:text-slate-700 leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
              <ChevronDown className="h-4 w-4 text-slate-400 ml-auto flex-shrink-0" />
            </div>

            <Button
              type="button"
              onClick={handleUpload}
              disabled={stagedFiles.length === 0}
              className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-5 h-10 rounded-lg"
            >
              <Translate text={localizationConstants.projectUploadFilesLabel} />
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xlsx,.png,.jpg,.jpeg"
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
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-700 text-left"
                >
                  <Translate text={label} />
                  <ArrowUpDown className="h-3 w-3 flex-shrink-0" />
                </button>
              ))}
              <span />
            </div>

            {/* Rows */}
            {documents.length === 0 ? (
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
                      <Image
                        src="/assets/pdf.svg"
                        alt="PDF"
                        width={28}
                        height={28}
                        className="flex-shrink-0"
                      />
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
                      className="text-slate-400 hover:text-red-500 transition-colors"
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
