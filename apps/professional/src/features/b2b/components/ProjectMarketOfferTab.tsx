"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Map, MapPin, Wallet, CreditCard, BadgeDollarSign, ChevronUp } from "lucide-react";
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
import { useTableSort } from "@/hooks/useTableSort";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { formatCurrency } from "@/utils/formatCurrency";
import { ProjectMarketDetail, OfferStatus } from "../types/projectMarket";

const TH_SORTABLE =
  "cursor-pointer select-none whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500 hover:text-slate-800";
const TH_PLAIN = "whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-slate-500";

type OfferSortField = "company" | "date" | "contactPerson" | "mobile" | "email" | "offerAmount";

function OfferStatusBadge({ status }: { status: OfferStatus }) {
  const t = useTranslate();
  const config: Record<OfferStatus, { label: string; className: string }> = {
    accepted: { label: t(localizationConstants.b2bPMOfferStatusAccepted), className: "border-emerald-400 bg-emerald-50 text-emerald-700" },
    deny: { label: t(localizationConstants.b2bPMOfferStatusDeny), className: "border-red-300 bg-red-50 text-red-700" },
    waiting: { label: t(localizationConstants.b2bPMStatusWaiting), className: "border-amber-300 bg-amber-50 text-amber-700" },
  };
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium shadow-sm ${className}`}>
      {label}
    </span>
  );
}

export function ProjectMarketOfferTab({ data }: { data: ProjectMarketDetail }) {
  const t = useTranslate();
  const router = useRouter();
  const [offerListOpen, setOfferListOpen] = useState(true);
  const { sortField, sortDir, toggleSort } = useTableSort<OfferSortField>();

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      {/* Summary — 3 panels */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="grid grid-cols-3 gap-5 p-4">
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
              <span className="rounded-md bg-zinc-950 px-2 py-0.5 text-xs font-medium text-white shadow-sm">{data.type}</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 shadow-sm">
                <Map size={12} aria-hidden={true} />{data.city}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 shadow-sm">
                <MapPin size={12} aria-hidden={true} />{data.municipality}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-1 rounded-lg bg-gray-800 p-4">
            <div className="flex items-center gap-2">
              <Wallet size={24} className="shrink-0 text-slate-200" aria-hidden={true} />
              <span className="text-sm text-slate-200">
                {t(localizationConstants.b2bPMLowestOffer)} - {data.lowestOfferCompany}
              </span>
            </div>
            <p className="pl-8 text-xl font-semibold tabular-nums text-slate-50">{formatCurrency(data.lowestOfferValue)}</p>
          </div>

          <div className="flex min-w-0 flex-row items-start justify-between gap-4 rounded-lg bg-slate-200 p-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <CreditCard size={24} className="shrink-0 text-zinc-900" aria-hidden={true} />
                <span className="text-sm text-zinc-900">{t(localizationConstants.b2bPMContractPanel)}</span>
              </div>
              <p className="pl-8 text-xl font-semibold tabular-nums text-zinc-950">{data.contractCount}</p>
              <span className="ml-8 inline-flex items-center self-start rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 shadow-sm">
                {t(localizationConstants.b2bPMNoContract)}
              </span>
            </div>
            <Button size="sm" variant="outline" className="mt-auto h-9 cursor-pointer shrink-0 border-slate-300 bg-white px-3 text-sm font-medium text-slate-950 hover:bg-slate-50">
              {t(localizationConstants.b2bPMManageContract)}
            </Button>
          </div>
        </div>
      </div>

      {/* Offer table — collapsible */}
      <Collapsible open={offerListOpen} onOpenChange={setOfferListOpen}>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <CollapsibleTrigger asChild>
            <button type="button" className="flex w-full cursor-pointer items-center gap-4 border-b border-zinc-200 p-4">
              <div className="flex flex-1 items-center gap-2">
                <BadgeDollarSign size={24} className="shrink-0 text-slate-700" aria-hidden={true} />
                <span className="text-base font-medium text-zinc-950">{t(localizationConstants.b2bPMTabOffers)}</span>
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
            <div className="b2b-table-scroll overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("company")}>
                      <span className="flex items-center gap-1">{t(localizationConstants.b2bDealCompany)}{renderSortIcon("company", sortField, sortDir)}</span>
                    </th>
                    <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("date")}>
                      <span className="flex items-center gap-1">{t(localizationConstants.b2bDealDetailDatum)}{renderSortIcon("date", sortField, sortDir)}</span>
                    </th>
                    <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("contactPerson")}>
                      <span className="flex items-center gap-1">{t(localizationConstants.contactNameLabel)}{renderSortIcon("contactPerson", sortField, sortDir)}</span>
                    </th>
                    <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("mobile")}>
                      <span className="flex items-center gap-1">{t(localizationConstants.b2bPMMobile)}{renderSortIcon("mobile", sortField, sortDir)}</span>
                    </th>
                    <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("email")}>
                      <span className="flex items-center gap-1">{t(localizationConstants.email)}{renderSortIcon("email", sortField, sortDir)}</span>
                    </th>
                    <th scope="col" className={TH_PLAIN}>{t(localizationConstants.statusLabel)}</th>
                    <th scope="col" className={TH_SORTABLE} onClick={() => toggleSort("offerAmount")}>
                      <span className="flex items-center gap-1">{t(localizationConstants.b2bPMOffer)}{renderSortIcon("offerAmount", sortField, sortDir)}</span>
                    </th>
                    <th scope="col" className={TH_PLAIN} />
                  </tr>
                </thead>
                <tbody>
                  {data.offers.map((offer) => (
                    <tr key={offer.id} className="border-b border-slate-200 last:border-0 hover:bg-slate-50">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">{offer.company}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{offer.date}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{offer.contactPerson}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{offer.mobile}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-600">{offer.email}</td>
                      <td className="whitespace-nowrap px-4 py-3"><OfferStatusBadge status={offer.status} /></td>
                      <td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-600">
                        {offer.offerAmount > 0 ? formatCurrency(offer.offerAmount) : "—"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="h-9 cursor-pointer whitespace-nowrap bg-slate-100 px-2 text-sm font-medium text-slate-900 shadow-none hover:bg-slate-200"
                            onClick={() => router.push(`/module/business/b2b/project-market/${data.id}/offer/${offer.id}`)}
                          >
                            {t(localizationConstants.b2bPMViewOffer)}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button type="button" className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-100" aria-label={t(localizationConstants.actions)}>
                                <MoreVertical size={14} aria-hidden={true} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                              <DropdownMenuItem className="cursor-pointer text-xs">{t(localizationConstants.b2bPMAcceptOffer)}</DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer text-xs">{t(localizationConstants.b2bDealArchiveAction)}</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="cursor-pointer text-xs text-red-600 focus:text-red-600">{t(localizationConstants.b2bPMDeclineOffer)}</DropdownMenuItem>
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
  );
}
