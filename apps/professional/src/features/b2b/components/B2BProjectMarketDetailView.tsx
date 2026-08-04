"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MoreVertical,
  Map,
  MapPin,
  FileText,
  CheckCircle2,
  Wallet,
  CreditCard,
  BadgeDollarSign,
  ChevronUp,
  CircleUserRound,
  ClipboardList,
  FilePlus,
  PencilLine,
  Mail,
  MailOpen,
  CirclePlus,
  Search,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTableSort } from "@/hooks/useTableSort";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { formatCurrency } from "@/utils/formatCurrency";
import { ProjectMarketDetail, QAStatus, QAMessage, OfferStatus } from "../types/projectMarket";

const TH_SORTABLE =
  "cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800";
const TH_PLAIN =
  "whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500";

type OfferSortField = "company" | "date" | "contactPerson" | "mobile" | "email" | "offerAmount";

function OfferStatusBadge({ status }: { status: OfferStatus }) {
  const t = useTranslate();
  const config: Record<OfferStatus, { label: string; className: string }> = {
    accepted: {
      label: t(localizationConstants.b2bPMOfferStatusAccepted),
      className: "border-emerald-400 bg-emerald-50 text-emerald-700",
    },
    deny: {
      label: t(localizationConstants.b2bPMOfferStatusDeny),
      className: "border-red-300 bg-red-50 text-red-700",
    },
    waiting: {
      label: t(localizationConstants.b2bPMStatusWaiting),
      className: "border-amber-300 bg-amber-50 text-amber-700",
    },
  };
  const { label, className } = config[status];
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium shadow-sm ${className}`}
    >
      {label}
    </span>
  );
}

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

function FileDocGrid({
  files,
}: {
  files: { id: string; label: string; type: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-4">
      {files.map((file) => (
        <div key={file.id} className="flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center">
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
              <FileText className="h-10 w-10 text-slate-400" aria-hidden={true} />
            )}
          </div>
          <span className="max-w-17 truncate text-center text-xs font-medium text-slate-800">
            {file.label}
          </span>
        </div>
      ))}
    </div>
  );
}

const BADGE_COLOR_MAP: Record<string, string> = {
  UE: "bg-blue-600",
  Beställare: "bg-emerald-600",
  Fråga: "bg-yellow-500",
};

function RoleBadge({ badge }: { badge: string }) {
  const colorClass = BADGE_COLOR_MAP[badge] ?? "bg-slate-500";
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium text-white ${colorClass}`}
    >
      {badge}
    </span>
  );
}

function QACard({ message }: { message: QAMessage }) {
  const t = useTranslate();
  const [comment, setComment] = useState("");

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      {/* Header: sender info + kebab */}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-zinc-700 hover:bg-zinc-100"
              aria-label={t(localizationConstants.actions)}
            >
              <MoreVertical size={16} aria-hidden={true} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
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

      {/* Message + date */}
      <div className="mt-3 flex items-start justify-between gap-4">
        <p className="text-sm text-zinc-950">{message.message}</p>
        <span className="shrink-0 text-xs text-slate-400">{message.date}</span>
      </div>

      {/* Separator */}
      <div className="my-4 h-px bg-slate-200" />

      {/* Reply section */}
      <div className="flex flex-col gap-3">
        {message.replyFrom && (
          <div className="flex items-center gap-2">
            <Image
              src="/assets/images/Avatar.svg"
              alt={message.replyFrom}
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-full"
            />
            <span className="text-sm font-semibold text-zinc-950">{message.replyFrom}</span>
          </div>
        )}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t(localizationConstants.b2bPMQALeaveComment)}
          className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300"
          rows={3}
        />
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="cursor-pointer rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-200"
            onClick={() => setComment("")}
          >
            {t(localizationConstants.cancel)}
          </button>
          <button
            type="button"
            className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
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

function QAColumn({
  status,
  label,
  icon,
  messages,
  badgeColorClass,
}: {
  status: QAStatus;
  label: string;
  icon: React.ReactNode;
  messages: QAMessage[];
  badgeColorClass: string;
}) {
  const [open, setOpen] = useState(true);
  const items = messages.filter((m) => m.status === status);
  const count = items.length;

  return (
    <div className="flex min-w-72 flex-1 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full cursor-pointer items-center gap-3 bg-slate-100 px-4 py-4"
          >
            <div className="flex flex-1 items-center gap-2">
              {icon}
              <span className="text-base font-medium text-zinc-950">{label}</span>
              {count > 0 && (
                <span
                  className={`flex h-5 min-w-6 items-center justify-center rounded-md px-1.5 text-xs font-medium text-white ${badgeColorClass}`}
                >
                  {String(count).padStart(2, "0")}
                </span>
              )}
            </div>
            <ChevronUp
              size={16}
              className={`shrink-0 text-zinc-400 transition-transform duration-200 ${open ? "" : "rotate-180"}`}
              aria-hidden={true}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="flex flex-col gap-4 p-4">
            {items.map((msg) => (
              <QACard key={msg.id} message={msg} />
            ))}
            {items.length === 0 && (
              <p className="py-4 text-center text-xs text-slate-400">—</p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

interface Props {
  data: ProjectMarketDetail;
}

export function B2BProjectMarketDetailView({ data }: Props) {
  const t = useTranslate();
  const router = useRouter();
  const { sortField, sortDir, toggleSort } = useTableSort<OfferSortField>();

  const [offerListOpen, setOfferListOpen] = useState(true);
  const [qaSearch, setQaSearch] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);

  const filteredQA = data.qa.filter((q) => {
    const matchesSearch =
      !qaSearch ||
      q.sender.toLowerCase().includes(qaSearch.toLowerCase()) ||
      q.message.toLowerCase().includes(qaSearch.toLowerCase());
    const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(q.role);
    const matchesBadge =
      selectedBadges.length === 0 || (q.badge != null && selectedBadges.includes(q.badge));
    return matchesSearch && matchesRole && matchesBadge;
  });

  const uniqueRoles = Array.from(new Set(data.qa.map((q) => q.role)));
  const uniqueBadges = Array.from(new Set(data.qa.flatMap((q) => (q.badge ? [q.badge] : []))));
  const hasActiveFilters = qaSearch !== "" || selectedRoles.length > 0 || selectedBadges.length > 0;

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* Header */}
      <div className="flex items-center gap-3 py-4 pl-2 pr-6">
        <button
          type="button"
          aria-label={t(localizationConstants.goBackButton)}
          onClick={() => router.back()}
          className="flex h-8 w-8 cursor-pointer items-center justify-center text-slate-700 hover:text-slate-950"
        >
          <ArrowLeft size={20} aria-hidden={true} />
        </button>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          {t(localizationConstants.b2bPMViewProjectMarket)}
        </h1>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="offers" className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-slate-200 px-6">
          <TabsList variant="line" className="h-10 gap-6">
            <TabsTrigger value="offers" className="cursor-pointer px-0 text-sm">
              {t(localizationConstants.b2bPMTabOffers)}
            </TabsTrigger>
            <TabsTrigger value="project-info" className="cursor-pointer px-0 text-sm">
              {t(localizationConstants.b2bPMTabProjectInfo)}
            </TabsTrigger>
            <TabsTrigger value="qa" className="cursor-pointer px-0 text-sm">
              {t(localizationConstants.b2bPMTabQA)}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ── Tab 1: Offert-lista ── */}
        <TabsContent value="offers" className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 px-4 py-6">

            {/* Summary card — 3 horizontal panels */}
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="grid grid-cols-3 gap-5 p-4">

                {/* Panel 1: Project info (white) */}
                <div className="flex flex-col justify-center gap-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-slate-800">{data.title}</h2>
                    <span className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs font-medium text-zinc-950">
                      Ref nr: {data.refNr}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {t(localizationConstants.b2bPMLatestOfferDate)}: {data.latestOfferDate}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-zinc-950 px-2 py-0.5 text-xs font-medium text-white shadow-sm">
                      {data.type}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 shadow-sm">
                      <Map size={12} aria-hidden={true} />
                      {data.city}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 shadow-sm">
                      <MapPin size={12} aria-hidden={true} />
                      {data.municipality}
                    </span>
                  </div>
                </div>

                {/* Panel 2: Lowest offer (dark gray #1F2937) */}
                <div className="flex flex-col justify-center gap-1 rounded-lg bg-gray-800 p-4">
                  <div className="flex items-center gap-2">
                    <Wallet size={24} className="shrink-0 text-slate-200" aria-hidden={true} />
                    <span className="text-sm text-slate-200">
                      {t(localizationConstants.b2bPMLowestOffer)} - {data.lowestOfferCompany}
                    </span>
                  </div>
                  <p className="pl-8 text-xl font-semibold tabular-nums text-slate-50">
                    {formatCurrency(data.lowestOfferValue)}
                  </p>
                </div>

                {/* Panel 3: Contract (slate-200 bg) */}
                <div className="flex min-w-0 flex-row items-start justify-between gap-4 rounded-lg bg-slate-200 p-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <CreditCard size={24} className="shrink-0 text-zinc-900" aria-hidden={true} />
                      <span className="text-sm text-zinc-900">
                        {t(localizationConstants.b2bPMContractPanel)}
                      </span>
                    </div>
                    <p className="pl-8 text-xl font-semibold tabular-nums text-zinc-950">
                      {data.contractCount}
                    </p>
                    <span className="ml-8 inline-flex items-center self-start rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 shadow-sm">
                      {t(localizationConstants.b2bPMNoContract)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-auto h-9 cursor-pointer shrink-0 border-slate-300 bg-white px-3 text-sm font-medium text-slate-950 hover:bg-slate-50"
                  >
                    {t(localizationConstants.b2bPMManageContract)}
                  </Button>
                </div>

              </div>
            </div>

            {/* Offer list — collapsible */}
            <Collapsible open={offerListOpen} onOpenChange={setOfferListOpen}>
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full cursor-pointer items-center gap-4 border-b border-zinc-200 p-4"
                  >
                    <div className="flex flex-1 items-center gap-2">
                      <BadgeDollarSign size={24} className="shrink-0 text-slate-700" aria-hidden={true} />
                      <span className="text-base font-medium text-zinc-950">
                        {t(localizationConstants.b2bPMTabOffers)}
                      </span>
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-200 px-1 text-xs font-semibold text-slate-700">
                        {data.offers.length}
                      </span>
                    </div>
                    <ChevronUp
                      size={16}
                      className={`shrink-0 text-zinc-400 transition-transform duration-200 ${offerListOpen ? "" : "rotate-180"}`}
                      aria-hidden={true}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("company")}>
                            <span className="flex items-center gap-1">
                              {t(localizationConstants.b2bDealCompany)}
                              {renderSortIcon("company", sortField, sortDir)}
                            </span>
                          </th>
                          <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("date")}>
                            <span className="flex items-center gap-1">
                              {t(localizationConstants.b2bDealDetailDatum)}
                              {renderSortIcon("date", sortField, sortDir)}
                            </span>
                          </th>
                          <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("contactPerson")}>
                            <span className="flex items-center gap-1">
                              {t(localizationConstants.contactNameLabel)}
                              {renderSortIcon("contactPerson", sortField, sortDir)}
                            </span>
                          </th>
                          <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("mobile")}>
                            <span className="flex items-center gap-1">
                              {t(localizationConstants.b2bPMMobile)}
                              {renderSortIcon("mobile", sortField, sortDir)}
                            </span>
                          </th>
                          <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("email")}>
                            <span className="flex items-center gap-1">
                              {t(localizationConstants.email)}
                              {renderSortIcon("email", sortField, sortDir)}
                            </span>
                          </th>
                          <th scope="col" className={TH_PLAIN}>
                            {t(localizationConstants.statusLabel)}
                          </th>
                          <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("offerAmount")}>
                            <span className="flex items-center gap-1">
                              {t(localizationConstants.b2bPMOffer)}
                              {renderSortIcon("offerAmount", sortField, sortDir)}
                            </span>
                          </th>
                          <th scope="col" className={TH_PLAIN} />
                        </tr>
                      </thead>
                      <tbody>
                        {data.offers.map((offer) => (
                          <tr
                            key={offer.id}
                            className="border-b border-slate-200 last:border-0 hover:bg-slate-50"
                          >
                            <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">
                              {offer.company}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                              {offer.date}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                              {offer.contactPerson}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                              {offer.mobile}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                              {offer.email}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                              <OfferStatusBadge status={offer.status} />
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-600">
                              {offer.offerAmount > 0 ? formatCurrency(offer.offerAmount) : "—"}
                            </td>
                            <td
                              className="whitespace-nowrap px-4 py-3"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  className="h-9 cursor-pointer whitespace-nowrap bg-slate-100 px-2 text-sm font-medium text-slate-900 shadow-none hover:bg-slate-200"
                                >
                                  {t(localizationConstants.b2bPMViewOffer)}
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button
                                      type="button"
                                      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-100"
                                      aria-label={t(localizationConstants.actions)}
                                    >
                                      <MoreVertical size={14} aria-hidden={true} />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-36">
                                    <DropdownMenuItem className="cursor-pointer text-xs">
                                      {t(localizationConstants.b2bPMAcceptOffer)}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer text-xs">
                                      {t(localizationConstants.b2bDealArchiveAction)}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer text-xs text-red-600 focus:text-red-600">
                                      {t(localizationConstants.b2bPMDeclineOffer)}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

          </div>
        </TabsContent>

        {/* ── Tab 2: Projekt information ── */}
        <TabsContent value="project-info" className="flex-1 overflow-y-auto">
          <div className="space-y-4 px-6 py-5">
            <SectionCard
              title={t(localizationConstants.b2bPMCustomerInfo)}
              icon={<CircleUserRound size={24} className="text-slate-800" aria-hidden={true} />}
              onEdit={() => {}}
            >
              <div className="grid grid-cols-2 gap-4">
                <InfoField
                  label={t(localizationConstants.companyName)}
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

            <SectionCard
              title={t(localizationConstants.b2bPMProjectDescription)}
              icon={<ClipboardList size={24} className="text-slate-700" aria-hidden={true} />}
              onEdit={() => {}}
            >
              <div className="grid grid-cols-2 gap-4">
                <InfoField
                  label={t(localizationConstants.projectName)}
                  value={data.projectInfo.projectName}
                />
                <InfoField
                  label={t(localizationConstants.b2bDealDetailProjectNumber)}
                  value={data.projectInfo.projectNr}
                />
                <InfoField
                  label={t(localizationConstants.b2bPMOfferPlace)}
                  value={data.projectInfo.offerPlace}
                />
                <InfoField
                  label={t(localizationConstants.b2bPMClientName)}
                  value={data.projectInfo.clientName}
                />
                <InfoField
                  label={t(localizationConstants.b2bDealDetailStartDate)}
                  value={data.projectInfo.startDate}
                />
                <InfoField
                  label={t(localizationConstants.b2bPMEndDate)}
                  value={data.projectInfo.endDate}
                />
                <div className="col-span-2">
                  <InfoField
                    label={t(localizationConstants.address)}
                    value={data.projectInfo.address}
                  />
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
                  <p className="text-sm font-medium text-zinc-950">
                    {t(localizationConstants.offerDetailImagesTitle)}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {data.documents.images.map((img) => (
                      <div key={img.id} className="flex w-25 flex-col items-center gap-1">
                        <div className="h-25 w-25 overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow">
                          <Image
                            src="/offer-details.png"
                            alt={img.label}
                            width={100}
                            height={100}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="w-full truncate text-center text-xs text-neutral-500">
                          {img.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px w-full bg-slate-200" />

                <div className="space-y-3">
                  <p className="text-sm font-medium text-zinc-950">
                    {t(localizationConstants.offerDetailDocumentTitle)}
                  </p>
                  <FileDocGrid files={data.documents.docs} />
                </div>

                <div className="h-px w-full bg-slate-200" />

                <div className="space-y-3">
                  <p className="text-sm font-medium text-zinc-950">
                    {t(localizationConstants.offerDetailDrawingTitle)}
                  </p>
                  <FileDocGrid files={data.documents.drawings} />
                </div>
              </div>
            </SectionCard>
          </div>
        </TabsContent>

        {/* ── Tab 3: Fråga/Svar ── */}
        <TabsContent value="qa" className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 px-6 py-5">

            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Search */}
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-hidden={true}
                />
                <input
                  type="text"
                  value={qaSearch}
                  onChange={(e) => setQaSearch(e.target.value)}
                  placeholder={t(localizationConstants.search)}
                  className="h-9 w-56 border-0 border-b border-slate-200 bg-transparent pl-8 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none"
                />
              </div>

              {/* Företag filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex cursor-pointer items-center gap-1.5 rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <CirclePlus size={13} className="shrink-0 text-slate-400" aria-hidden={true} />
                    <span>{t(localizationConstants.b2bPMQAForetag)}</span>
                    {selectedRoles.length > 0 && (
                      <>
                        <span className="h-3.5 w-px bg-slate-300" />
                        {selectedRoles.map((r) => (
                          <span
                            key={r}
                            className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-700"
                          >
                            {r}
                          </span>
                        ))}
                      </>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52">
                  <DropdownMenuLabel className="text-xs font-medium text-slate-500">
                    {t(localizationConstants.b2bPMQAForetag)}
                  </DropdownMenuLabel>
                  {uniqueRoles.map((role) => (
                    <DropdownMenuCheckboxItem
                      key={role}
                      checked={selectedRoles.includes(role)}
                      onCheckedChange={(checked) =>
                        setSelectedRoles((prev) =>
                          checked ? [...prev, role] : prev.filter((r) => r !== role),
                        )
                      }
                      className="cursor-pointer text-xs"
                    >
                      {role}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Kund / badge filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex cursor-pointer items-center gap-1.5 rounded-md border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    <CirclePlus size={13} className="shrink-0 text-slate-400" aria-hidden={true} />
                    <span>{t(localizationConstants.b2bPMQAKund)}</span>
                    {selectedBadges.length > 0 && (
                      <>
                        <span className="h-3.5 w-px bg-slate-300" />
                        {selectedBadges.map((b) => (
                          <span
                            key={b}
                            className="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-medium text-slate-700"
                          >
                            {b}
                          </span>
                        ))}
                      </>
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  <DropdownMenuLabel className="text-xs font-medium text-slate-500">
                    {t(localizationConstants.b2bPMQAKund)}
                  </DropdownMenuLabel>
                  {uniqueBadges.map((badge) => (
                    <DropdownMenuCheckboxItem
                      key={badge}
                      checked={selectedBadges.includes(badge)}
                      onCheckedChange={(checked) =>
                        setSelectedBadges((prev) =>
                          checked ? [...prev, badge] : prev.filter((b) => b !== badge),
                        )
                      }
                      className="cursor-pointer text-xs"
                    >
                      {badge}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Reset */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setQaSearch("");
                    setSelectedRoles([]);
                    setSelectedBadges([]);
                  }}
                  className="flex cursor-pointer items-center gap-1 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                >
                  {t(localizationConstants.b2bPMQAReset)} ×
                </button>
              )}
            </div>

            {/* Kanban columns */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              <QAColumn
                status="new"
                label={t(localizationConstants.b2bPMQANew)}
                icon={<Mail size={20} className="shrink-0 text-slate-700" aria-hidden={true} />}
                messages={filteredQA}
                badgeColorClass="bg-orange-600"
              />
              <QAColumn
                status="opened"
                label={t(localizationConstants.b2bPMQAOpened)}
                icon={<MailOpen size={20} className="shrink-0 text-slate-700" aria-hidden={true} />}
                messages={filteredQA}
                badgeColorClass="bg-blue-600"
              />
              <QAColumn
                status="answered"
                label={t(localizationConstants.b2bPMQAAnswered)}
                icon={<CheckCircle2 size={20} className="shrink-0 text-emerald-600" aria-hidden={true} />}
                messages={filteredQA}
                badgeColorClass="bg-emerald-600"
              />
            </div>

          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
