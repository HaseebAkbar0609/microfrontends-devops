"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Archive as ArchiveIcon,
  BadgeDollarSign,
  Building2,
  ChevronUp,
  FileText,
  Loader2,
  Map,
  MapPin,
  CircleUserRound,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatApiDate, formatApiDateTime } from "@/utils/date";
import { getB2BArchiveOfferDetailAction } from "@/api-actions/b2b";
import type { B2BOfferQAMessage, B2BSeeOfferDetail } from "../types/seeOffer";
import { OfferStatusBadge } from "./B2BSeeOfferView";

const BADGE_COLOR_MAP: Record<string, string> = {
  UE: "bg-blue-600",
  Beställare: "bg-emerald-600",
  Fråga: "bg-yellow-500",
};

function RoleBadge({ badge }: { badge: string }) {
  const colorClass = BADGE_COLOR_MAP[badge] ?? "bg-slate-500";
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium text-white ${colorClass}`}>
      {badge}
    </span>
  );
}

function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className="text-sm text-zinc-900">{value || "—"}</span>
    </div>
  );
}

function FileDocGrid({ files }: { files: { id: string; label: string; type?: string }[] }) {
  return (
    <div className="flex flex-wrap gap-4">
      {files.map((file) => (
        <div key={file.id} className="flex flex-col items-center gap-1">
          <div className="flex h-10 w-10 items-center justify-center">
            {file.type === "pdf" ? (
              <Image src="/file-type-pdf.png" alt={file.label} width={40} height={40} className="h-10 w-10 object-contain" />
            ) : file.type === "doc" ? (
              <Image src="/file-type-doc.png" alt={file.label} width={40} height={40} className="h-10 w-10 object-contain" />
            ) : (
              <FileText className="h-10 w-10 text-slate-300" aria-hidden={true} />
            )}
          </div>
          <span className="max-w-16 truncate text-center text-xs text-slate-600">{file.label}</span>
        </div>
      ))}
    </div>
  );
}

function AccordionSection({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button type="button" className="flex w-full cursor-pointer items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2">
              {icon && <span className="text-slate-500">{icon}</span>}
              <span className="text-sm font-semibold text-zinc-900">{title}</span>
            </div>
            <ChevronUp
              size={16}
              className={`text-slate-400 transition-transform duration-200 ${open ? "" : "rotate-180"}`}
              aria-hidden={true}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-slate-100 px-5 py-4">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function ProjectInfoCard({ data }: { data: B2BSeeOfferDetail }) {
  const t = useTranslate();
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-stretch gap-5 p-4">
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-slate-900">{data.title}</span>
            <span className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-xs font-medium text-zinc-700">
              {data.refNr}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {t(localizationConstants.b2bDealCreatedDate)}: {formatApiDate(data.postedDate)}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <OfferStatusBadge status={data.statusBadge} />
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              <Map size={10} aria-hidden={true} />
              {data.city}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
              <MapPin size={10} aria-hidden={true} />
              {data.municipality}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-800 px-6 py-3">
          <div className="flex items-center gap-1.5">
            <BadgeDollarSign size={14} className="text-slate-300" aria-hidden={true} />
            <span className="text-xs text-slate-300">{t(localizationConstants.b2bArchiveTotalOffer)}</span>
          </div>
          <span className="mt-1 text-lg font-bold tabular-nums text-white">{formatCurrency(data.totalOffert)}</span>
        </div>
      </div>
    </div>
  );
}

/** The fields a read-only card needs — met by both the offer and the project thread shapes. */
type ReadOnlyQAMessage = Pick<
  B2BOfferQAMessage,
  "id" | "sender" | "role" | "badge" | "message" | "date" | "answerText" | "answerUser" | "answerDate"
>;

/**
 * Read-only: an archived engagement's thread is history. The card used to carry
 * a reply box, a Send button and a Mark-as-read / Archive / Delete menu, none of
 * which was wired to anything — so they are gone rather than left as dead UI.
 * Shared with the archive's inquiry view.
 */
export function ArchivedQACard({ message }: { message: ReadOnlyQAMessage }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <Image
            src="/assets/images/Avatar.svg"
            alt={message.sender}
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full"
          />
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-zinc-950">{message.sender}</span>
              {message.badge && <RoleBadge badge={message.badge} />}
            </div>
            <span className="text-xs text-slate-500">{message.role}</span>
          </div>
        </div>
        <span className="shrink-0 text-xs text-slate-400">{formatApiDateTime(message.date)}</span>
      </div>

      <p className="mt-3 text-sm text-zinc-700">{message.message}</p>

      {message.answerText && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-zinc-900">{message.answerUser}</span>
            <span className="shrink-0 text-xs text-slate-400">
              {formatApiDateTime(message.answerDate || message.date)}
            </span>
          </div>
          <p className="mt-1 text-sm text-zinc-700">{message.answerText}</p>
        </div>
      )}
    </div>
  );
}

interface Props {
  /** Fetched in the browser, where the access token lives — never on the server. */
  projectId: string;
}

export function B2BArchiveOfferDetailView({ projectId }: Props) {
  const t = useTranslate();
  const router = useRouter();
  const [qaOpen, setQaOpen] = useState(true);
  const [data, setData] = useState<B2BSeeOfferDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const result = await getB2BArchiveOfferDetailAction(projectId);
    if (result.success && result.data) {
      setData(result.data);
    } else {
      setLoadError(result.error || t(localizationConstants.genericError));
    }
    setLoading(false);
  }, [projectId, t]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (isMounted) await fetchDetail();
    })();
    return () => {
      isMounted = false;
    };
  }, [fetchDetail]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-slate-50">
        <Loader2 className="h-5 w-5 animate-spin text-slate-400" aria-hidden={true} />
      </div>
    );
  }

  if (loadError || !data) {
    return (
      <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-center">
        <p className="text-sm text-slate-500">{loadError}</p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => fetchDetail()} className="cursor-pointer">
            {t(localizationConstants.retry)}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push("/module/business/b2b/archive")}
            className="cursor-pointer"
          >
            {t(localizationConstants.goBackButton)}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* Header — back arrow + title only, no project metadata */}
      <div className="flex items-center gap-3 px-4 py-4">
        <button
          type="button"
          aria-label={t(localizationConstants.goBackButton)}
          onClick={() => router.back()}
          className="flex h-8 w-8 cursor-pointer items-center justify-center text-slate-700 hover:text-slate-950"
        >
          <ArrowLeft size={20} aria-hidden={true} />
        </button>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          {t(localizationConstants.b2bArchiveViewOffer)}
        </h1>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-5 px-6 py-4 lg:grid-cols-[1fr_280px]">

          {/* Left column */}
          <div className="space-y-4">
            {/* Project info + total-offert card */}
            <ProjectInfoCard data={data} />

            {/* Företagsnummer */}
            <AccordionSection
              title={t(localizationConstants.b2bArchiveCompanyNumber)}
              icon={<Building2 size={20} />}
            >
              <div className="grid grid-cols-2 gap-4">
                <InfoField label={t(localizationConstants.companyName)} value={data.company.name} />
                <InfoField label={t(localizationConstants.email)} value={data.company.email} />
                <InfoField label={t(localizationConstants.phone)} value={data.company.telefon} />
                <InfoField label={t(localizationConstants.address)} value={data.company.adress} />
                <div className="col-span-2">
                  <InfoField label={t(localizationConstants.b2bArchiveOrgNr)} value={data.company.orgNr} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => router.push(`/module/business/b2b/company/${data.company.id}`)}
                className="mt-4 cursor-pointer text-xs font-medium text-blue-600 hover:underline"
              >
                {t(localizationConstants.b2bArchiveViewCompanyInfo)} →
              </button>
            </AccordionSection>

            {/* Kontaktperson */}
            <AccordionSection
              title={t(localizationConstants.contactNameLabel)}
              icon={<CircleUserRound size={20} />}
            >
              <div className="grid grid-cols-2 gap-4">
                <InfoField label={t(localizationConstants.companyName)} value={data.contactPerson.name} />
                <InfoField label={t(localizationConstants.email)} value={data.contactPerson.email} />
                <InfoField label={t(localizationConstants.b2bPMMobile)} value={data.contactPerson.mobil} />
              </div>
            </AccordionSection>

            {/* Offert */}
            <AccordionSection
              title={t(localizationConstants.b2bPMOffer)}
              icon={<BadgeDollarSign size={20} />}
            >
              <div className="grid grid-cols-2 gap-4">
                <InfoField label={t(localizationConstants.b2bArchiveWork)} value={data.offert.arbete} />
                <InfoField label={t(localizationConstants.offerFormMaterial)} value={data.offert.material} />
                <InfoField
                  label={t(localizationConstants.b2bArchiveTotalOffer)}
                  value={formatCurrency(data.offert.totalOffert)}
                />
                <InfoField label={t(localizationConstants.betalningsvillkorTitle)} value={data.offert.betalningsvillkor} />
              </div>
            </AccordionSection>

            {/* Documents */}
            <AccordionSection
              title={t(localizationConstants.b2bPMDocuments)}
              icon={<FileText size={20} />}
            >
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-500">{t(localizationConstants.offerDetailImagesTitle)}</p>
                  <div className="flex flex-wrap gap-4">
                    {data.documents.images.map((img) => (
                      <div key={img.id} className="flex flex-col items-center gap-1">
                        <div className="h-20 w-24 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                          <Image
                            src="/offer-details.png"
                            alt={img.label}
                            width={96}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="max-w-20 truncate text-center text-xs text-neutral-500">{img.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-500">{t(localizationConstants.offerDetailDocumentTitle)}</p>
                  <FileDocGrid files={data.documents.docs} />
                </div>
                <div className="h-px bg-slate-200" />
                <div className="space-y-2">
                  <p className="text-xs font-medium text-slate-500">{t(localizationConstants.offerDetailDrawingTitle)}</p>
                  <FileDocGrid files={data.documents.drawings} />
                </div>
              </div>
            </AccordionSection>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {/* Project summary card */}
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">{data.title}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                <span className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-xs font-medium text-zinc-700">
                  {data.refNr}
                </span>
                <OfferStatusBadge status={data.statusBadge} />
                <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  <Map size={10} aria-hidden={true} />
                  {data.city}
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                  <MapPin size={10} aria-hidden={true} />
                  {data.municipality}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {t(localizationConstants.b2bDealCreatedDate)}: {formatApiDate(data.postedDate)}
              </p>
              <div className="mt-2 h-px bg-slate-100" />
              <p className="mt-2 text-xs text-slate-500">{t(localizationConstants.b2bArchiveTotalOffer)}</p>
              <p className="text-base font-bold tabular-nums text-slate-900">{formatCurrency(data.totalOffert)}</p>
            </div>

            {/*
              No Accept / Decline here. This screen used to show both: Accept only
              navigated to Create Agreement without accepting anything, Decline had
              no handler, and the backend refuses either on an archived engagement
              anyway. Restoring from the Archive list is what makes it actionable.
            */}
            <div className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-3">
              <ArchiveIcon size={16} className="mt-0.5 shrink-0 text-slate-500" aria-hidden={true} />
              <p className="text-xs text-slate-600">{t(localizationConstants.b2bArchivedDetailNote)}</p>
            </div>

            {/* Fråga / Svar */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setQaOpen((prev) => !prev)}
                className="flex cursor-pointer items-center justify-between"
              >
                <span className="text-sm font-semibold text-zinc-900">{t(localizationConstants.b2bPMTabQA)}</span>
                <div className="flex items-center gap-2">
                  {data.qa.length > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-semibold text-white">
                      {data.qa.length}
                    </span>
                  )}
                  <ChevronUp
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 ${qaOpen ? "" : "rotate-180"}`}
                    aria-hidden={true}
                  />
                </div>
              </button>
              {qaOpen && data.qa.map((msg) => (
                <ArchivedQACard key={msg.id} message={msg} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
