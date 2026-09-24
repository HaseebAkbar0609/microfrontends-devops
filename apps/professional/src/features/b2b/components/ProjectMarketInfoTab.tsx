"use client";

import React from "react";
import {
  PenLine,
  CircleUserRound,
  ClipboardList,
  FilePlus,
  File,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { formatApiDate } from "@/utils/date";
import { ProjectMarketDetail } from "../types/projectMarket";

function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
        {label}
      </span>
      <span className="font-sans text-sm font-normal leading-5 tracking-normal text-slate-500">
        {value || "—"}
      </span>
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
    <Card className="rounded-lg border border-slate-200 bg-white shadow-2xs">
      <CardHeader className="h-14 flex flex-row items-center justify-between border-b border-slate-200 px-4 py-0 sm:px-6 [.border-b]:pb-0">
        <div className="flex items-center gap-2.5">
          {icon}
          <CardTitle className="font-sans text-sm font-semibold sm:text-base text-slate-900 leading-none">
            {title}
          </CardTitle>
        </div>
        {onEdit && (
          <Button
            type="button"
            variant="secondary"
            onClick={onEdit}
            className="h-8 cursor-pointer items-center gap-1.5 rounded-md bg-slate-100 px-3 text-xs font-medium text-slate-900 hover:bg-slate-200 sm:h-9 sm:gap-2 sm:px-4 sm:text-sm transition-colors shadow-none"
          >
            <PenLine className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-900" aria-hidden={true} />
            <Translate text={localizationConstants.editLabel} />
          </Button>
        )}
      </CardHeader>
      <CardContent className="px-4 py-0 sm:px-6">{children}</CardContent>
    </Card>
  );
}

function FileItem({ label, type }: { label: string; type?: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex h-12 w-12 items-center justify-center">
        {type === "pdf" || type === "doc" ? (
          <Image
            src={type === "pdf" ? "/file-type-pdf.png" : "/file-type-doc.png"}
            alt={label}
            width={36}
            height={36}
            className="h-9 w-9 object-contain"
          />
        ) : (
          <File size={36} className="text-slate-400" aria-hidden={true} />
        )}
      </div>
      <span className="max-w-24 truncate text-xs font-medium text-slate-800">{label}</span>
    </div>
  );
}

function DocumentGroup({
  title,
  emptyLabel,
  children,
}: {
  title: string;
  emptyLabel: string;
  children: React.ReactNode[];
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">{title}</h4>
      {children.length > 0 ? (
        <div className="flex flex-wrap items-start gap-6">{children}</div>
      ) : (
        <p className="text-xs text-slate-500">{emptyLabel}</p>
      )}
    </div>
  );
}

export function ProjectMarketInfoTab({ data }: { data: ProjectMarketDetail }) {
  const t = useTranslate();

  return (
    <div className="flex flex-col gap-3 pl-4 sm:pl-6 md:pl-11 pr-4 sm:pr-5 md:pr-6 py-3.5">
      {/* 1. Kunduppgifter */}
      <SectionCard
        title={t(localizationConstants.b2bPMCustomerInfo)}
        icon={<CircleUserRound size={24} className="h-6 w-6 text-slate-900 shrink-0 opacity-100" aria-hidden={true} />}
      >
        <div className="grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2">
          <InfoField
            label={t(localizationConstants.b2bPMCompanyNamn)}
            value={data.customerInfo.companyName}
          />
          <InfoField
            label={t(localizationConstants.email)}
            value={data.customerInfo.email}
          />
          <InfoField
            label={t(localizationConstants.phone)}
            value={data.customerInfo.phone}
          />
          <InfoField
            label={t(localizationConstants.address)}
            value={data.customerInfo.address}
          />
          <InfoField
            label={t(localizationConstants.contactNameLabel)}
            value={data.customerInfo.contactPerson}
          />
          <InfoField
            label={t(localizationConstants.address)}
            value={data.customerInfo.postalAddress}
          />
        </div>
      </SectionCard>

      {/* 2. Projektbeskrivning */}
      <SectionCard
        title={t(localizationConstants.b2bPMProjectDescription)}
        icon={<ClipboardList size={24} className="h-6 w-6 text-slate-900 shrink-0 opacity-100" aria-hidden={true} />}
      >
        <div className="grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2">
          <InfoField
            label={t(localizationConstants.b2bPMProjektNamn)}
            value={data.projectInfo.projectName}
          />
          <InfoField
            label={t(localizationConstants.b2bPMProjektNr)}
            value={data.projectInfo.projectNr}
          />
          <InfoField
            label={t(localizationConstants.b2bPMWorkPlace)}
            value={data.projectInfo.offerPlace}
          />
          <InfoField
            label={t(localizationConstants.b2bPMQuarterName)}
            value={data.projectInfo.clientName}
          />
          <InfoField
            label={t(localizationConstants.b2bPMStartDatum)}
            value={formatApiDate(data.projectInfo.startDate)}
          />
          <InfoField
            label={t(localizationConstants.b2bPMCalculatedEndDate)}
            value={formatApiDate(data.projectInfo.endDate)}
          />
          <div className="sm:col-span-2">
            <InfoField
              label={t(localizationConstants.address)}
              value={data.projectInfo.address}
            />
          </div>
        </div>
      </SectionCard>

      {/*
        3. Documents — the project's own files. This section used to be entirely
        hardcoded ("Photo.img" x3, "+6 more", "Offert 1.doc", "Details.pdf",
        "bild.1"...), so every project showed the same fake files and
        data.documents was never read.
      */}
      <SectionCard
        title={t(localizationConstants.b2bPMDocuments)}
        icon={<FilePlus size={24} className="h-6 w-6 text-slate-900 shrink-0 opacity-100" aria-hidden={true} />}
      >
        <div className="space-y-6">
          <DocumentGroup
            title={t(localizationConstants.b2bPMBilder)}
            emptyLabel={t(localizationConstants.b2bPMNoFiles)}
          >
            {data.documents.images.map((img) => (
              <div key={img.id} className="flex flex-col items-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-slate-200 bg-slate-100/80 shadow-2xs">
                  <ImageIcon size={24} className="text-slate-400" aria-hidden={true} />
                </div>
                <span className="mt-1.5 max-w-24 truncate text-xs text-slate-500">{img.label}</span>
              </div>
            ))}
          </DocumentGroup>

          <DocumentGroup
            title={t(localizationConstants.b2bPMDocumentSection)}
            emptyLabel={t(localizationConstants.b2bPMNoFiles)}
          >
            {data.documents.docs.map((doc) => (
              <FileItem key={doc.id} label={doc.label} type={doc.type} />
            ))}
          </DocumentGroup>

          <DocumentGroup
            title={t(localizationConstants.b2bPMDrawingSection)}
            emptyLabel={t(localizationConstants.b2bPMNoFiles)}
          >
            {data.documents.drawings.map((drawing) => (
              <FileItem key={drawing.id} label={drawing.label} type={drawing.type} />
            ))}
          </DocumentGroup>
        </div>
      </SectionCard>
    </div>
  );
}
