"use client";

import React, { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  Building2,
  Check,
  ChevronUp,
  CircleCheckBig,
  CircleUserRound,
  FilePlus,
  FileText,
  ImageIcon,
  Loader2,
  Mail,
  Map,
  MapPin,
  MoreVertical,
  Trash2,
  Archive,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslate, Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { formatCurrency } from "@/utils/formatCurrency";
import { B2BSeeOfferDetail, B2BOfferQAMessage } from "../types/seeOffer";
import { useB2BSeeOffer } from "../hooks/useB2BSeeOffer";
import { B2B_QA_BADGE_COLOR_MAP } from "../constants/seeOfferConstants";

function RoleBadge({ badge }: { badge: string }) {
  const colorClass = B2B_QA_BADGE_COLOR_MAP[badge] ?? "bg-slate-600 text-white";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium leading-none",
        colorClass
      )}
    >
      {badge}
    </span>
  );
}

function BlankDocFileIcon({ className = "h-9 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      {/* Page Base */}
      <path
        d="M4 2C2.89543 2 2 2.89543 2 4V26C2 27.1046 2.89543 28 4 28H20C21.1046 28 22 27.1046 22 26V9.5L14.5 2H4Z"
        className="fill-white stroke-slate-300"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Folded Corner Flap */}
      <path
        d="M14.5 2V8C14.5 8.82843 15.1716 9.5 16 9.5H22"
        className="fill-slate-50 stroke-slate-300"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
        {label}
      </span>
      <span className="font-sans text-sm font-normal leading-5 tracking-normal text-slate-500 break-words">
        {value || "—"}
      </span>
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
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center justify-between border-b border-slate-100 bg-white px-5 py-4 text-left transition-colors hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              {icon && <span className="flex items-center shrink-0 text-slate-800">{icon}</span>}
              <span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900">
                {title}
              </span>
            </div>
            <ChevronUp
              size={18}
              className={cn(
                "text-slate-400 transition-transform duration-200",
                !open && "rotate-180"
              )}
              aria-hidden={true}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-5 py-4">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function QACard({
  message,
  currentUserName,
  userInitials,
  onReply,
  onMarkRead,
  onArchive,
  onDelete,
}: {
  message: B2BOfferQAMessage;
  currentUserName: string;
  userInitials: string;
  onReply: (messageId: string, reply: string) => void;
  onMarkRead: (messageId: string) => void;
  onArchive: (messageId: string) => void;
  onDelete: (messageId: string) => void;
}) {
  const t = useTranslate();
  const [comment, setComment] = useState("");

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSend = () => {
    const sanitized = comment.replace(/<[^>]*>?/gm, "").trim();
    if (!sanitized) return;
    onReply(message.id, sanitized);
    setComment("");
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3.5 sm:p-4 shadow-2xs">
      {/* Header with avatar, sender info, and menu */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            <Image
              src="/assets/images/Avatar.svg"
              alt={message.sender}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-sm font-semibold leading-5 tracking-normal text-slate-900">
                {message.sender}
              </span>
              {message.badge && <RoleBadge badge={message.badge} />}
            </div>
            <span className="text-[11px] text-slate-500">{message.company || message.role}</span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-800 hover:bg-slate-100 data-[state=open]:bg-slate-200 transition-colors p-0"
              aria-label={t(localizationConstants.actions)}
              title={t(localizationConstants.actions)}
            >
              <MoreVertical size={16} className="text-slate-800" aria-hidden={true} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 rounded-lg border border-slate-200 bg-white p-1.5 shadow-xl"
          >
            <DropdownMenuItem
              role="button"
              aria-label={t(localizationConstants.b2bPMQAMarkAsRead)}
              onClick={() => onMarkRead(message.id)}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <CircleCheckBig size={16} className="text-slate-700 shrink-0" aria-hidden={true} />
              <span>{t(localizationConstants.b2bPMQAMarkAsRead)}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              role="button"
              aria-label={t(localizationConstants.b2bDealArchiveAction)}
              onClick={() => onArchive(message.id)}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <Archive size={16} className="text-slate-700 shrink-0" aria-hidden={true} />
              <span>{t(localizationConstants.b2bDealArchiveAction)}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              role="button"
              aria-label={t(localizationConstants.b2bDealDelete)}
              onClick={() => onDelete(message.id)}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 transition-colors"
            >
              <Trash2 size={16} className="text-slate-700 shrink-0" aria-hidden={true} />
              <span>{t(localizationConstants.b2bDealDelete)}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Message question content & date on right */}
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <p className="font-sans text-sm font-normal leading-5 tracking-normal text-slate-950">
          {message.message}
        </p>
        <span className="shrink-0 font-sans text-xs font-normal leading-4 tracking-normal text-slate-500 text-right">
          {message.date}
        </span>
      </div>

      {/* Bottom reply / answer section */}
      {message.status === "answered" ? (
        <div className="mt-3.5 border-t border-slate-100 pt-3">
          <div className="flex items-start gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-500">
              {message.answerUser
                ? (message.answerUser.split(" ").map((w) => w[0]).filter(Boolean).join("").toUpperCase().slice(0, 2) || "U")
                : userInitials}
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-sans text-sm font-semibold leading-5 tracking-normal text-slate-900">
                  {message.answerUser || currentUserName}
                </span>
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
                  {t(localizationConstants.b2bPMQAAdmin)}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">
                {t(localizationConstants.b2bPMQAYou)}
              </span>
              <div className="mt-1 flex items-baseline justify-between gap-3">
                <p className="font-sans text-sm font-normal leading-5 tracking-normal text-slate-950">
                  {message.answerText || message.replyText || "—"}
                </p>
                <span className="shrink-0 font-sans text-xs font-normal leading-4 tracking-normal text-slate-500 text-right">
                  {message.answerDate || message.date}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3.5 flex flex-col gap-2 border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-500">
              {userInitials}
            </div>
            <span className="font-sans text-sm font-semibold leading-5 tracking-normal text-slate-900">
              {message.replyFrom || currentUserName}
            </span>
          </div>

          <Textarea
            value={comment}
            onChange={handleCommentChange}
            placeholder={t(localizationConstants.b2bPMQALeaveComment)}
            className="w-full resize-y rounded-lg border border-slate-200 p-2.5 font-sans text-sm font-normal leading-5 tracking-normal text-slate-950 placeholder:text-slate-500 focus:border-slate-300 focus:outline-none min-h-[70px] bg-white shadow-none focus-visible:ring-1 focus-visible:ring-slate-300"
            rows={3}
          />

          <span className="font-sans text-sm font-normal leading-5 tracking-normal text-slate-500">
            {t(localizationConstants.b2bPMQALeaveComment)}
          </span>

          <div className="flex items-center justify-end gap-2 pt-1 w-full">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setComment("")}
              className={`flex h-[36px] w-[120px] items-center justify-center rounded-md px-4 py-2 font-sans font-medium text-[14px] leading-[20px] tracking-normal transition-colors shadow-none ${comment.trim()
                  ? "cursor-pointer bg-slate-100 text-slate-900 hover:bg-slate-200"
                  : "cursor-default bg-slate-100 text-slate-400"
                }`}
            >
              {t(localizationConstants.cancel)}
            </Button>
            <Button
              type="button"
              disabled={!comment.trim()}
              onClick={handleSend}
              className={`flex h-[36px] w-[120px] items-center justify-center rounded-md px-4 py-2 font-sans font-medium text-[14px] leading-[20px] tracking-normal transition-colors ${comment.trim()
                  ? "cursor-pointer bg-slate-900 text-white hover:bg-slate-800 shadow-2xs"
                  : "cursor-not-allowed bg-slate-100 text-slate-400"
                }`}
            >
              {t(localizationConstants.b2bPMQASend)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface Props {
  data: B2BSeeOfferDetail;
  projectId?: string;
  offerId?: string;
}

export function B2BSeeOfferView({ data: initialData, projectId = "1", offerId = "1" }: Props) {
  const t = useTranslate();
  const router = useRouter();
  const [qaOpen, setQaOpen] = useState(true);

  const {
    data,
    isSubmitting,
    submittingAction,
    currentUserName,
    userInitials,
    handleAcceptOffer,
    handleDeclineOffer,
    handleSendQAReply,
    handleArchiveQAMessage,
    handleDeleteQAMessage,
    handleMarkQARead,
  } = useB2BSeeOffer(initialData, projectId, offerId);

  const onAccept = () => {
    handleAcceptOffer(() => {
      router.push("/module/business/b2b/agreements/create");
    });
  };

  return (
    <div className="flex flex-1 flex-col bg-slate-50 min-h-full">
      {/* Subheader with Back Button */}
      <div className="flex shrink-0 items-center gap-2 px-4 pt-6 pb-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t(localizationConstants.goBackButton)}
          onClick={() => router.back()}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-slate-900 hover:bg-slate-200/60 transition-colors p-0"
        >
          <ArrowLeft size={18} aria-hidden={true} />
        </Button>
        <h2 className="text-lg font-bold tracking-tight text-slate-900">
          <Translate text={localizationConstants.b2bArchiveViewOffer} />
        </h2>
      </div>

      {/* Main scrolling wrapper — content indented from back button */}
      <div className="flex flex-1 flex-col pl-4 sm:pl-6 md:pl-11 pr-4 sm:pr-5 md:pr-6 pb-10">
        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_480px] min-[1440px]:grid-cols-[1fr_634px] items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            {/* Top Project & Offer Header Card */}
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-slate-900">{data.title}</span>
                    <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700">
                      {data.refNr}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {t(localizationConstants.b2bDealCreatedDate)}: {data.postedDate}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      <Map size={11} aria-hidden={true} />
                      {data.city}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      <MapPin size={11} aria-hidden={true} />
                      {data.municipality}
                    </span>
                  </div>
                </div>

                {/* Dark Total-offert Highlight Box matching OrderOpenedHero style */}
                <div className="w-full sm:w-[309px] h-[88px] rounded-xl bg-[#111721] px-6 py-4 text-white shadow-md flex items-start gap-3.5 box-border shrink-0 self-start sm:self-auto">
                  <BadgeDollarSign className="h-6 w-6 text-slate-300 shrink-0 mt-0.5" strokeWidth={1.75} />
                  <div className="flex flex-col justify-center gap-0.5">
                    <span className="font-sans font-normal text-base leading-6 tracking-normal text-slate-300">
                      <Translate text={localizationConstants.b2bArchiveTotalOffer} />
                    </span>
                    <span className="font-sans font-semibold text-xl leading-7 tracking-normal text-white tabular-nums">
                      {formatCurrency(data.totalOffert)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accordion 1: Företagsnummer */}
            <AccordionSection
              title={t(localizationConstants.b2bArchiveCompanyNumber)}
              icon={<Building2 className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
                <InfoField label={t(localizationConstants.companyName)} value={data.company.name} />
                <InfoField label={t(localizationConstants.email)} value={data.company.email} />
                <InfoField label={t(localizationConstants.phone)} value={data.company.telefon} />
                <InfoField label={t(localizationConstants.address)} value={data.company.adress} />
                <div className="sm:col-span-2">
                  <InfoField
                    label={t(localizationConstants.b2bArchiveOrgNr)}
                    value={data.company.orgNr}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => router.push(`/module/business/b2b/company/${data.company.id}`)}
                  className="inline-flex h-auto cursor-pointer items-center gap-1 p-0 text-xs font-semibold text-slate-900 hover:text-slate-700 hover:underline transition-colors shadow-none"
                >
                  <span>{t(localizationConstants.b2bArchiveViewCompanyInfo)}</span>
                  <ArrowRight size={14} aria-hidden={true} />
                </Button>
              </div>
            </AccordionSection>

            {/* Accordion 2: Kontaktperson */}
            <AccordionSection
              title={t(localizationConstants.contactNameLabel)}
              icon={<CircleUserRound className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
                <InfoField label={t(localizationConstants.companyName)} value={data.contactPerson.name} />
                <InfoField label={t(localizationConstants.email)} value={data.contactPerson.email} />
                <div className="sm:col-span-2">
                  <InfoField label={t(localizationConstants.b2bPMMobile)} value={data.contactPerson.mobil} />
                </div>
              </div>
            </AccordionSection>

            {/* Accordion 3: Offert */}
            <AccordionSection
              title={t(localizationConstants.b2bPMOffer)}
              icon={<BadgeDollarSign className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
                <InfoField label={t(localizationConstants.b2bArchiveWork)} value={data.offert.arbete} />
                <InfoField label={t(localizationConstants.offerFormMaterial)} value={data.offert.material} />
                <InfoField
                  label={t(localizationConstants.b2bArchiveTotalOffer)}
                  value={formatCurrency(data.offert.totalOffert)}
                />
                <InfoField
                  label={t(localizationConstants.betalningsvillkorTitle)}
                  value={data.offert.betalningsvillkor}
                />
              </div>
            </AccordionSection>

            {/* Accordion 4: Documents */}
            <AccordionSection
              title={t(localizationConstants.b2bPMDocuments)}
              icon={<FilePlus className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
            >
              <div className="space-y-6">
                {/* Bilder */}
                <div className="space-y-3">
                  <h4 className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
                    {t(localizationConstants.b2bPMBilder)}
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {data.documents.images.map((img) => (
                      <div key={img.id} className="flex flex-col items-center gap-1">
                        <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-lg border border-slate-200 bg-slate-100/80 text-slate-400 shadow-2xs">
                          <ImageIcon size={24} className="text-slate-400" aria-hidden={true} />
                        </div>
                        <span className="max-w-20 truncate text-center text-xs text-slate-600">
                          {img.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Document */}
                <div className="space-y-3 pt-1">
                  <h4 className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
                    {t(localizationConstants.b2bPMDocumentSection)}
                  </h4>
                  <div className="flex flex-wrap items-center gap-6">
                    {data.documents.docs.map((file) => (
                      <div key={file.id} className="flex flex-col items-center gap-1.5">
                        <div className="flex h-12 w-12 items-center justify-center">
                          {file.type === "pdf" ? (
                            <Image
                              src="/file-type-pdf.png"
                              alt={file.label}
                              width={36}
                              height={36}
                              className="h-9 w-9 object-contain"
                            />
                          ) : file.type === "doc" ? (
                            <Image
                              src="/file-type-doc.png"
                              alt={file.label}
                              width={36}
                              height={36}
                              className="h-9 w-9 object-contain"
                            />
                          ) : (
                            <FileText size={32} strokeWidth={1} className="text-slate-300 stroke-[1]" aria-hidden={true} />
                          )}
                        </div>
                        <span className="text-xs font-normal text-slate-600">
                          {file.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                {/* Drawing */}
                <div className="space-y-3 pt-1">
                  <h4 className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
                    {t(localizationConstants.b2bPMDrawingSection)}
                  </h4>
                  <div className="flex flex-wrap items-center gap-6">
                    {data.documents.drawings.map((drawing) => (
                      <div key={drawing.id} className="flex flex-col items-center gap-1.5">
                        <div className="flex h-12 w-12 items-center justify-center">
                          {drawing.type === "pdf" ? (
                            <Image
                              src="/file-type-pdf.png"
                              alt={drawing.label}
                              width={36}
                              height={36}
                              className="h-9 w-9 object-contain"
                            />
                          ) : (
                            <BlankDocFileIcon className="h-9 w-7" />
                          )}
                        </div>
                        <span className="text-xs font-normal text-slate-600">
                          {drawing.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionSection>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4 self-start">
            {/* Project Summary & Action Card */}
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-3.5 sm:p-4 shadow-2xs">
              <div className="flex items-start justify-between gap-2">
                <span className="font-sans text-sm font-semibold leading-5 tracking-normal text-slate-900">
                  {data.title}
                </span>
                <span className="shrink-0 rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700">
                  {data.refNr}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-0.5 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  <Map size={10} aria-hidden={true} />
                  {data.city}
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                  <MapPin size={10} aria-hidden={true} />
                  {data.municipality}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {t(localizationConstants.b2bDealCreatedDate)}: {data.postedDate}
              </p>

              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-xs font-medium text-slate-500">
                  <Translate text={localizationConstants.b2bArchiveTotalOffer} />
                </span>
                <span className="text-base font-bold tabular-nums text-slate-900">
                  {formatCurrency(data.totalOffert)}
                </span>
              </div>

              {/* Separator line below price */}
              <div className="my-3.5 h-px bg-slate-100" />

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  disabled={isSubmitting}
                  className="h-10 w-full cursor-pointer gap-2 bg-slate-900 text-sm font-medium text-white hover:bg-slate-800 transition-colors rounded-lg shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={onAccept}
                >
                  {submittingAction === "accept" ? (
                    <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden={true} />
                  ) : (
                    <Check size={16} strokeWidth={2} className="shrink-0" aria-hidden={true} />
                  )}
                  <span>{t(localizationConstants.b2bArchiveAcceptOffer)}</span>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  className="h-10 w-full cursor-pointer gap-2 border-0 bg-zinc-100 text-sm font-medium text-slate-900 hover:bg-slate-200 transition-colors rounded-lg shadow-none disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleDeclineOffer}
                >
                  {submittingAction === "decline" ? (
                    <Loader2 className="h-4 w-4 animate-spin shrink-0 text-slate-800" aria-hidden={true} />
                  ) : (
                    <X size={15} aria-hidden={true} />
                  )}
                  <span>{t(localizationConstants.b2bArchiveDecline)}</span>
                </Button>
              </div>
            </div>

            {/* Collapsible Fråga/Svar Section matching QAColumn style */}
            <div className="flex w-full min-w-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs">
              <Collapsible open={qaOpen} onOpenChange={setQaOpen}>
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-3 hover:bg-slate-200/70 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="h-6 w-6 size-6 text-slate-900 shrink-0" strokeWidth={1.75} />
                      <span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900">
                        {t(localizationConstants.b2bPMTabQA)}
                      </span>
                      {data.qa.length > 0 && (
                        <span className="flex h-4 items-center justify-center rounded bg-orange-600 px-1.5 text-[10px] font-bold text-white">
                          {data.qa.length.toString().padStart(2, "0")}
                        </span>
                      )}
                    </div>
                    <ChevronUp
                      size={16}
                      className={cn(
                        "shrink-0 text-slate-400 transition-transform duration-200",
                        !qaOpen && "rotate-180"
                      )}
                      aria-hidden={true}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-3.5 bg-white p-3.5">
                    {data.qa.map((msg) => (
                      <QACard
                        key={msg.id}
                        message={msg}
                        currentUserName={currentUserName}
                        userInitials={userInitials}
                        onReply={handleSendQAReply}
                        onMarkRead={handleMarkQARead}
                        onArchive={handleArchiveQAMessage}
                        onDelete={handleDeleteQAMessage}
                      />
                    ))}
                    {data.qa.length === 0 && (
                      <p className="py-6 text-center text-xs text-slate-400">—</p>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

