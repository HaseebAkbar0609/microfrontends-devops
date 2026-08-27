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

export function ProjectMarketInfoTab({ data }: { data: ProjectMarketDetail }) {
  const t = useTranslate();

  return (
    <div className="flex flex-col gap-3 px-4 sm:px-6 md:px-11 py-3.5">
      {/* 1. Kunduppgifter */}
      <SectionCard
        title={t(localizationConstants.b2bPMCustomerInfo)}
        icon={<CircleUserRound size={24} className="h-6 w-6 text-slate-900 shrink-0 opacity-100" aria-hidden={true} />}
        onEdit={() => {}}
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
        onEdit={() => {}}
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
            value={data.projectInfo.startDate}
          />
          <InfoField
            label={t(localizationConstants.b2bPMCalculatedEndDate)}
            value={data.projectInfo.endDate}
          />
          <div className="sm:col-span-2">
            <InfoField
              label={t(localizationConstants.address)}
              value={data.projectInfo.address}
            />
          </div>
        </div>
      </SectionCard>

      {/* 3. Documents */}
      <SectionCard
        title={t(localizationConstants.b2bPMDocuments)}
        icon={<FilePlus size={24} className="h-6 w-6 text-slate-900 shrink-0 opacity-100" aria-hidden={true} />}
        onEdit={() => {}}
      >
        <div className="space-y-6">
          {/* Bilder */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              {t(localizationConstants.b2bPMBilder)}
            </h4>
            <div className="flex flex-wrap gap-4">
              {/* 3 photo thumbnails */}
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center shadow-2xs">
                  <Image
                    src="/offer-details.png"
                    alt="Photo.img"
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="mt-1.5 text-xs text-slate-500">Photo.img</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center shadow-2xs">
                  <Image
                    src="/offer-details.png"
                    alt="Photo.img"
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="mt-1.5 text-xs text-slate-500">Photo.img</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center shadow-2xs">
                  <Image
                    src="/offer-details.png"
                    alt="Photo.img"
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="mt-1.5 text-xs text-slate-500">Photo.img</span>
              </div>

              {/* 2 placeholder boxes */}
              <div className="flex flex-col items-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-slate-200 bg-slate-100/80 shadow-2xs">
                  <ImageIcon size={24} className="text-slate-400" aria-hidden="true" />
                </div>
                <span className="mt-1.5 text-xs text-slate-500">Photo.img</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-slate-200 bg-slate-100/80 shadow-2xs">
                  <ImageIcon size={24} className="text-slate-400" aria-hidden={true} />
                </div>
                <span className="mt-1.5 text-xs text-slate-500">Photo.img</span>
              </div>

              {/* +6 more placeholder */}
              <div className="flex flex-col items-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-slate-200 bg-slate-100/80 shadow-2xs">
                  <ImageIcon size={24} className="text-slate-400" aria-hidden={true} />
                </div>
                <span className="mt-1.5 text-xs font-medium text-slate-600">+6 more</span>
              </div>
            </div>
          </div>

          {/* Document Section */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              {t(localizationConstants.b2bPMDocumentSection)}
            </h4>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-12 w-12 items-center justify-center">
                  <Image
                    src="/file-type-doc.png"
                    alt="Offert 1.doc"
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                  />
                </div>
                <span className="text-xs font-medium text-slate-800">Offert 1.doc</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-12 w-12 items-center justify-center">
                  <Image
                    src="/file-type-doc.png"
                    alt="Offert 2.doc"
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                  />
                </div>
                <span className="text-xs font-medium text-slate-800">Offert 2.doc</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-12 w-12 items-center justify-center">
                  <Image
                    src="/file-type-pdf.png"
                    alt="Details.pdf"
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                  />
                </div>
                <span className="text-xs font-medium text-slate-800">Details.pdf</span>
              </div>
            </div>
          </div>

          {/* Drawing Section */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              {t(localizationConstants.b2bPMDrawingSection)}
            </h4>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-12 w-12 items-center justify-center">
                  <Image
                    src="/file-type-pdf.png"
                    alt="projekt.pdf"
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                  />
                </div>
                <span className="text-xs font-medium text-slate-800">projekt.pdf</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-12 w-12 items-center justify-center">
                  <File size={36} className="text-slate-400" aria-hidden={true} />
                </div>
                <span className="text-xs font-medium text-slate-800">bild.1</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-12 w-12 items-center justify-center">
                  <File size={36} className="text-slate-400" aria-hidden={true} />
                </div>
                <span className="text-xs font-medium text-slate-800">bild.1</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <div className="flex h-12 w-12 items-center justify-center">
                  <File size={36} className="text-slate-400" aria-hidden={true} />
                </div>
                <span className="text-xs font-medium text-slate-800">bild.1</span>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
