"use client";

import React from "react";
import { PencilLine, CircleUserRound, ClipboardList, FilePlus, FileText } from "lucide-react";
import Image from "next/image";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ProjectMarketDetail } from "../types/projectMarket";

function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-zinc-950">{label}</span>
      <span className="text-sm text-zinc-500">{value || "—"}</span>
    </div>
  );
}

function SectionCard({
  title,
  icon,
  onEdit,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-base font-medium text-zinc-950">{title}</span>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex cursor-pointer items-center gap-2 rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 shadow-sm hover:bg-zinc-200"
          >
            <PencilLine size={16} aria-hidden={true} />
            Edit
          </button>
        )}
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

function FileDocGrid({ files }: { files: { id: string; label: string; type: string }[] }) {
  return (
    <div className="flex flex-wrap gap-4">
      {files.map((file) => (
        <div key={file.id} className="flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center">
            {file.type === "pdf" ? (
              <Image src="/file-type-pdf.png" alt={file.label} width={40} height={40} className="h-10 w-10 object-contain" />
            ) : file.type === "doc" ? (
              <Image src="/file-type-doc.png" alt={file.label} width={40} height={40} className="h-10 w-10 object-contain" />
            ) : (
              <FileText className="h-10 w-10 text-slate-400" aria-hidden={true} />
            )}
          </div>
          <span className="max-w-17 truncate text-center text-xs font-medium text-slate-800">{file.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ProjectMarketInfoTab({ data }: { data: ProjectMarketDetail }) {
  const t = useTranslate();

  return (
    <div className="space-y-4 px-6 py-5">
      <SectionCard
        title={t(localizationConstants.b2bPMCustomerInfo)}
        icon={<CircleUserRound size={24} className="text-slate-800" aria-hidden={true} />}
        onEdit={() => {}}
      >
        <div className="grid grid-cols-2 gap-4">
          <InfoField label={t(localizationConstants.companyName)} value={data.customerInfo.companyName} />
          <InfoField label={t(localizationConstants.email)} value={data.customerInfo.email} />
          <InfoField label={t(localizationConstants.phone)} value={data.customerInfo.phone} />
          <InfoField label={t(localizationConstants.address)} value={data.customerInfo.address} />
          <InfoField label={t(localizationConstants.contactNameLabel)} value={data.customerInfo.contactPerson} />
          <InfoField label={t(localizationConstants.address)} value={data.customerInfo.postalAddress} />
        </div>
      </SectionCard>

      <SectionCard
        title={t(localizationConstants.b2bPMProjectDescription)}
        icon={<ClipboardList size={24} className="text-slate-700" aria-hidden={true} />}
        onEdit={() => {}}
      >
        <div className="grid grid-cols-2 gap-4">
          <InfoField label={t(localizationConstants.projectName)} value={data.projectInfo.projectName} />
          <InfoField label={t(localizationConstants.b2bDealDetailProjectNumber)} value={data.projectInfo.projectNr} />
          <InfoField label={t(localizationConstants.b2bPMOfferPlace)} value={data.projectInfo.offerPlace} />
          <InfoField label={t(localizationConstants.b2bPMClientName)} value={data.projectInfo.clientName} />
          <InfoField label={t(localizationConstants.b2bDealDetailStartDate)} value={data.projectInfo.startDate} />
          <InfoField label={t(localizationConstants.b2bPMEndDate)} value={data.projectInfo.endDate} />
          <div className="col-span-2">
            <InfoField label={t(localizationConstants.address)} value={data.projectInfo.address} />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title={t(localizationConstants.b2bPMDocuments)}
        icon={<FilePlus size={24} className="text-slate-700" aria-hidden={true} />}
        onEdit={() => {}}
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-950">{t(localizationConstants.offerDetailImagesTitle)}</p>
            <div className="flex flex-wrap gap-4">
              {data.documents.images.map((img) => (
                <div key={img.id} className="flex w-25 flex-col items-center gap-1">
                  <div className="h-25 w-25 overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow">
                    <Image src="/offer-details.png" alt={img.label} width={100} height={100} className="h-full w-full object-cover" />
                  </div>
                  <span className="w-full truncate text-center text-xs text-neutral-500">{img.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-px w-full bg-slate-200" />
          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-950">{t(localizationConstants.offerDetailDocumentTitle)}</p>
            <FileDocGrid files={data.documents.docs} />
          </div>
          <div className="h-px w-full bg-slate-200" />
          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-950">{t(localizationConstants.offerDetailDrawingTitle)}</p>
            <FileDocGrid files={data.documents.drawings} />
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
