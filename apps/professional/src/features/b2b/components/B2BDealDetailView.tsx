"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Image as ImageIcon, FileText, Map, MapPin, Send } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { OfferSendSection } from "@/features/offer/components/OfferSendSection";
import { B2BDealDetail, DealFile } from "../types/dealDetail";

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-8 gap-y-5">{children}</div>;
}

function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-zinc-950">{label}</span>
      <span className="text-sm text-zinc-500">{value || "—"}</span>
    </div>
  );
}

function FileGrid({ files }: { files: DealFile[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {files.map((file) => (
        <div key={file.id} className="flex w-27 flex-col items-center">
          <div className="flex h-18 w-27 items-center justify-center rounded-md bg-transparent">
            {file.type === "pdf" ? (
              <Image
                src="/file-type-pdf.png"
                alt={file.label}
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
            ) : file.type === "doc" ? (
              <Image
                src="/file-type-doc.png"
                alt={file.label}
                width={40}
                height={40}
                className="h-10 w-10 object-contain"
              />
            ) : (
              <FileText className="h-10 w-10 text-slate-300" aria-hidden={true} />
            )}
          </div>
          <span className="mt-2 w-full truncate text-center text-xs font-medium text-slate-800">
            {file.label}
          </span>
        </div>
      ))}
    </div>
  );
}

interface Props {
  data: B2BDealDetail;
}

export function B2BDealDetailView({ data }: Props) {
  const t = useTranslate();
  const router = useRouter();

  const imagePlaceholders = data.typeSection.extraImagesCount > 0 ? 3 : 0;

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4">
        <button
          type="button"
          aria-label={t(localizationConstants.goBackButton)}
          onClick={() => router.back()}
          className="flex h-8 w-8 cursor-pointer items-center justify-center text-slate-700 hover:text-slate-950"
        >
          <ArrowLeft size={20} aria-hidden={true} />
        </button>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          {t(localizationConstants.b2bDealDetailPreview)}
        </h1>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-6">
        <div className="grid grid-cols-1 gap-5 pl-9 lg:grid-cols-[1fr_300px]">
          {/* Left: accordion sections */}
          <div className="space-y-4">
            {/* Kontakt information */}
            <OfferSendSection
              title={t(localizationConstants.b2bDealDetailContactInfo)}
              icon={
                <Image
                  src="/assets/icons/personal-info.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              }
              defaultOpen
            >
              <InfoGrid>
                <InfoField
                  label={t(localizationConstants.contactNameLabel)}
                  value={data.contact.name}
                />
                <InfoField
                  label={t(localizationConstants.email)}
                  value={data.contact.email}
                />
                <InfoField
                  label={t(localizationConstants.phone)}
                  value={data.contact.phone}
                />
                <InfoField
                  label={t(localizationConstants.postalCode)}
                  value={data.contact.postalCode}
                />
                <InfoField
                  label={t(localizationConstants.address)}
                  value={data.contact.address}
                />
                <InfoField
                  label={t(localizationConstants.city)}
                  value={data.contact.city}
                />
              </InfoGrid>
            </OfferSendSection>

            {/* Förfrågan */}
            <OfferSendSection
              title={t(localizationConstants.b2bDealDetailRequest)}
              icon={
                <Image
                  src="/assets/icons/info.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              }
              defaultOpen
            >
              <InfoGrid>
                <InfoField
                  label={t(localizationConstants.projectName)}
                  value={data.request.projectName}
                />
                <InfoField
                  label={t(localizationConstants.b2bDealDetailProjectNumber)}
                  value={data.request.projectNumber}
                />
                <InfoField
                  label={t(localizationConstants.b2bDealDetailProjectAddress)}
                  value={data.request.projectAddress}
                />
                <InfoField
                  label={t(localizationConstants.city)}
                  value={data.request.city}
                />
                <InfoField
                  label={t(localizationConstants.postalCode)}
                  value={data.request.postalCode}
                />
                <InfoField
                  label={t(localizationConstants.b2bDealDetailContractForm)}
                  value={data.request.contractForm}
                />
                <InfoField
                  label={t(localizationConstants.b2bDealDetailJobType)}
                  value={data.request.jobType}
                />
                <InfoField
                  label={t(localizationConstants.b2bDealDetailAddressOptional)}
                  value={data.request.addressOptional}
                />
              </InfoGrid>
            </OfferSendSection>

            {/* Typ section */}
            <OfferSendSection
              title={`${t(localizationConstants.b2bDealDetailType)}: ${data.typeSection.title}`}
              icon={
                <Image
                  src="/assets/icons/folders.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              }
              defaultOpen
            >
              <div className="space-y-6">
                <InfoGrid>
                  <InfoField
                    label={t(localizationConstants.b2bDealDetailCategoryLabel)}
                    value={data.typeSection.category}
                  />
                  <InfoField
                    label={t(localizationConstants.b2bDealDetailSubcategoryLabel)}
                    value={data.typeSection.subcategory}
                  />
                  <div className="col-span-2">
                    <InfoField
                      label={t(localizationConstants.descriptionLabel)}
                      value={data.typeSection.description}
                    />
                  </div>
                  <InfoField
                    label={t(localizationConstants.b2bDealDetailStartDate)}
                    value={data.typeSection.startDate}
                  />
                  <InfoField
                    label={t(localizationConstants.b2bDealDetailOfferDate)}
                    value={data.typeSection.offerDate}
                  />
                </InfoGrid>

                {/* Attached documents */}
                <div className="space-y-5">
                  <p className="text-sm font-semibold text-slate-900">
                    {t(localizationConstants.b2bDealDetailAttachments)}
                  </p>

                  {/* Images */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-700">
                      {t(localizationConstants.offerDetailImagesTitle)}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      {data.typeSection.images.map((img) => (
                        <div key={img.id} className="flex w-27 flex-col items-center">
                          <div className="h-22 w-27 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                            <Image
                              src="/offer-details.png"
                              alt={img.label}
                              width={108}
                              height={88}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="mt-2 w-full truncate text-center text-xs text-neutral-500">
                            {img.label}
                          </span>
                        </div>
                      ))}
                      {Array.from({ length: imagePlaceholders }).map((_, idx) => {
                        const isMore = idx === imagePlaceholders - 1;
                        return (
                          <div key={`ph-${idx}`} className="flex w-27 flex-col items-center">
                            <div className="flex h-22 w-27 items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                              {isMore ? (
                                <span className="text-xs font-medium text-slate-500">
                                  +{data.typeSection.extraImagesCount}
                                </span>
                              ) : (
                                <ImageIcon className="h-6 w-6 text-slate-400" aria-hidden={true} />
                              )}
                            </div>
                            <span className="mt-2 w-full truncate text-center text-xs text-neutral-500">
                              {isMore ? `+${data.typeSection.extraImagesCount} more` : "Photo.img"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="h-px w-full bg-slate-200" />

                  {/* Documents */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-700">
                      {t(localizationConstants.offerDetailDocumentTitle)}
                    </p>
                    <FileGrid files={data.typeSection.documents} />
                  </div>

                  <div className="h-px w-full bg-slate-200" />

                  {/* Drawings */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-700">
                      {t(localizationConstants.offerDetailDrawingTitle)}
                    </p>
                    <FileGrid files={data.typeSection.drawings} />
                  </div>
                </div>
              </div>
            </OfferSendSection>

            {/* Ytterligare information */}
            <OfferSendSection
              title={t(localizationConstants.b2bDealDetailAdditionalInfo)}
              icon={
                <Image
                  src="/assets/icons/info.svg"
                  alt=""
                  width={20}
                  height={20}
                />
              }
              defaultOpen
            >
              <p className="text-sm text-slate-500">
                {data.additionalInfo || "—"}
              </p>
            </OfferSendSection>
          </div>

          {/* Right: sticky preview panel */}
          <div className="lg:sticky lg:self-start">
            <Card className="overflow-hidden rounded-lg border border-slate-200 bg-white p-0">
              {/* Top section */}
              <div className="flex flex-col gap-2 border-b border-slate-200 p-5">
                <p className="text-sm font-medium text-zinc-950">
                  {t(localizationConstants.b2bDealDetailPreview)}
                </p>

                {/* Title + ref tag */}
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-slate-800">
                    {data.title}
                  </h2>
                  <span className="inline-flex shrink-0 items-center rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-950">
                    {data.refNumber}
                  </span>
                </div>

                {/* Location badges */}
                <div className="flex items-center gap-5">
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 shadow-sm">
                    <Map size={12} aria-hidden={true} />
                    {data.municipality}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md bg-yellow-50 px-2 py-0.5 text-xs font-medium text-amber-700 shadow-sm">
                    <MapPin size={12} aria-hidden={true} />
                    {data.contact.city}
                  </span>
                </div>

                {/* Category description */}
                <p className="text-sm text-slate-500">{data.typeSection.category}</p>

                {/* Datum + Projekt nr */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{data.date}</span>
                  <span className="text-sm font-semibold text-zinc-950">{data.projectNr}</span>
                </div>
              </div>

              {/* Bottom section — buttons */}
              <div className="p-5">
                <div className="flex flex-col gap-3">
                  <Button
                    variant="ghost"
                    className="h-11 w-full cursor-pointer rounded-md bg-zinc-100 text-sm font-medium text-zinc-950 shadow-sm hover:bg-zinc-200"
                    onClick={() => router.back()}
                  >
                    {t(localizationConstants.cancel)}
                  </Button>
                  <Button className="h-11 w-full cursor-pointer gap-2 rounded-md bg-zinc-900 text-base font-medium text-white shadow-md hover:bg-zinc-800">
                    <Send size={16} aria-hidden={true} />
                    {t(localizationConstants.b2bDealDetailSubmit)}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
