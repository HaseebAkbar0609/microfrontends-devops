"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeDollarSign,
  Building2,
  ChevronUp,
  FileText,
  Map,
  MapPin,
  MoreVertical,
  CircleUserRound,
  X,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { formatCurrency } from "@/utils/formatCurrency";
import { B2BArchiveOfferDetail, B2BArchiveQAMessage } from "../types/archive";

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

function FileDocGrid({ files }: { files: { id: string; label: string; type: string }[] }) {
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

function ProjectInfoCard({ data }: { data: B2BArchiveOfferDetail }) {
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
          <p className="text-xs text-slate-500">Postad: {data.postedDate}</p>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              {data.statusBadge}
            </span>
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
            <span className="text-xs text-slate-300">Total-offert</span>
          </div>
          <span className="mt-1 text-lg font-bold tabular-nums text-white">{formatCurrency(data.totalOffert)}</span>
        </div>
      </div>
    </div>
  );
}

function QACard({ message }: { message: B2BArchiveQAMessage }) {
  const t = useTranslate();
  const [comment, setComment] = useState("");

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
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-xs text-slate-400">{message.date}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100"
              >
                <MoreVertical size={14} aria-hidden={true} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem className="cursor-pointer text-xs">
                {t(localizationConstants.b2bPMQAMarkAsRead)}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-xs">
                {t(localizationConstants.b2bDealArchiveAction)}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-xs text-red-600 focus:text-red-600">
                {t(localizationConstants.b2bDealDelete)}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p className="mt-3 text-sm text-zinc-700">{message.message}</p>

      {message.replyFrom && (
        <div className="mt-3 flex items-center gap-2">
          <Image
            src="/assets/images/Avatar.svg"
            alt={message.replyFrom}
            width={24}
            height={24}
            className="h-6 w-6 shrink-0 rounded-full"
          />
          <span className="text-xs font-medium text-zinc-700">SE {message.replyFrom}</span>
        </div>
      )}

      <div className="mt-3 flex flex-col gap-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t(localizationConstants.b2bPMQALeaveComment)}
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
          rows={2}
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setComment("")}
            className="cursor-pointer rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-500 hover:bg-zinc-200"
          >
            {t(localizationConstants.cancel)}
          </button>
          <button
            type="button"
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              comment ? "bg-zinc-900 text-white hover:bg-zinc-800" : "bg-zinc-100 text-zinc-400"
            }`}
          >
            {t(localizationConstants.b2bPMQASend)}
          </button>
        </div>
      </div>
    </div>
  );
}

interface Props {
  data: B2BArchiveOfferDetail;
}

export function B2BArchiveOfferDetailView({ data }: Props) {
  const t = useTranslate();
  const router = useRouter();
  const [qaOpen, setQaOpen] = useState(true);

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
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  {data.statusBadge}
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  <Map size={10} aria-hidden={true} />
                  {data.city}
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                  <MapPin size={10} aria-hidden={true} />
                  {data.municipality}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400">Postad: {data.postedDate}</p>
              <div className="mt-2 h-px bg-slate-100" />
              <p className="mt-2 text-xs text-slate-500">Totalt offert</p>
              <p className="text-base font-bold tabular-nums text-slate-900">{formatCurrency(data.totalOffert)}</p>
            </div>

            {/* Action buttons */}
            <Button className="h-11 w-full cursor-pointer bg-zinc-950 text-sm font-medium text-white hover:bg-zinc-800">
              {t(localizationConstants.b2bArchiveAcceptOffer)}
            </Button>
            <Button
              variant="outline"
              className="h-10 w-full cursor-pointer gap-2 border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <X size={14} aria-hidden={true} />
              {t(localizationConstants.b2bArchiveDecline)}
            </Button>

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
                <QACard key={msg.id} message={msg} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
