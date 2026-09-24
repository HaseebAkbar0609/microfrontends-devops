"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  MoreVertical,
  MapPin,
  Building2,
  Wallet,
  WalletCards,
  BadgeDollarSign,
  ChevronUp,
  Check,
  Archive,
  ArrowRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { renderSortIcon } from "@/utils/renderSortIcon";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatApiDate } from "@/utils/date";
import { showToast } from "@/lib/toast";
import { archiveB2BProjectAction } from "@/api-actions/b2b";
import { acceptB2BOfferAction, declineB2BOfferAction } from "@/api-actions/b2b/seeOffer";
import { ProjectMarketDetail, OfferStatus, ProjectMarketOffer } from "../types/projectMarket";

type OfferAction = "accept" | "decline" | "archive";

type OfferSortField =
  | "company"
  | "date"
  | "contactPerson"
  | "mobile"
  | "email"
  | "status"
  | "offerAmount";

function OfferStatusBadge({ status }: { status: OfferStatus }) {
  const t = useTranslate();
  const config: Record<OfferStatus, { label: string; className: string }> = {
    accepted: {
      label: t(localizationConstants.b2bPMOfferStatusAccepted),
      className: "border-emerald-200 bg-emerald-50 text-emerald-600",
    },
    deny: {
      label: t(localizationConstants.b2bPMOfferStatusDeny),
      className: "border-red-200 bg-red-50 text-red-600",
    },
    waiting: {
      label: t(localizationConstants.b2bPMStatusWaiting),
      className: "border-amber-200 bg-amber-50 text-amber-600",
    },
  };
  const { label, className } = config[status];
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

export function ProjectMarketOfferTab({
  data,
  onRefresh,
}: {
  data: ProjectMarketDetail;
  onRefresh?: () => void | Promise<void>;
}) {
  const t = useTranslate();
  const router = useRouter();
  const offers = data.offers;
  const [offerListOpen, setOfferListOpen] = useState(true);
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string>(
    data.offers.length > 0 ? data.offers[0].id : ""
  );
  const { sortField, sortDir, toggleSort } = useTableSort<OfferSortField>();

  // Accept / decline / archive each ask first, then call the API. They used to
  // change only this screen's copy of the row, so a reload undid them.
  const [pendingAction, setPendingAction] = useState<{ action: OfferAction; offerId: string } | null>(
    null
  );
  const [isActing, setIsActing] = useState(false);

  /** Worded from the HTTP status — the API message can be a raw error code. */
  function actionErrorMessage(action: OfferAction, code: string | undefined, fallback: string) {
    if (code === "forbidden") {
      return t(
        action === "archive"
          ? localizationConstants.b2bErrorNoPermission
          : localizationConstants.b2bErrorOfferNoPermission
      );
    }
    if (code === "conflict") return t(localizationConstants.b2bErrorOfferSettled);
    if (code === "not_found") return t(localizationConstants.b2bErrorProjectGone);
    return fallback || t(localizationConstants.genericError);
  }

  async function handleConfirmAction() {
    if (!pendingAction) return;
    const { action, offerId } = pendingAction;
    setIsActing(true);
    try {
      if (action === "accept") {
        const res = await acceptB2BOfferAction(offerId);
        if (!res.success) {
          showToast("error", actionErrorMessage(action, res.errorCode, res.error || ""));
          return;
        }
        showToast("success", t(localizationConstants.b2bPMAcceptOffer));
        // Same next step as accepting from the See offer screen.
        router.push(`/module/business/b2b/agreements/create?projectId=${data.id}&offerId=${offerId}`);
      } else if (action === "decline") {
        const res = await declineB2BOfferAction(offerId);
        if (!res.success) {
          showToast("error", actionErrorMessage(action, res.errorCode, res.error || ""));
          return;
        }
        showToast("info", t(localizationConstants.b2bPMDeclineOffer));
        await onRefresh?.();
      } else {
        // Archiving is per project: it moves this company's whole engagement to
        // the Archive screen, so there is nothing left to show here.
        const res = await archiveB2BProjectAction(data.id);
        if (!res.success) {
          showToast("error", actionErrorMessage(action, res.errorCode, res.error || ""));
          return;
        }
        showToast("success", t(localizationConstants.b2bArchiveSuccessToast));
        router.push("/module/business/b2b/overview");
      }
    } finally {
      setIsActing(false);
      setPendingAction(null);
    }
  }

  const confirmCopy: Record<OfferAction, { title: string; description: string; confirm: string }> = {
    accept: {
      title: t(localizationConstants.b2bOfferAcceptConfirmTitle),
      description: t(localizationConstants.b2bOfferAcceptConfirmDesc),
      confirm: t(localizationConstants.b2bPMAcceptOffer),
    },
    decline: {
      title: t(localizationConstants.b2bOfferDeclineConfirmTitle),
      description: t(localizationConstants.b2bOfferDeclineConfirmDesc),
      confirm: t(localizationConstants.b2bPMDeclineOffer),
    },
    archive: {
      title: t(localizationConstants.b2bArchiveConfirmTitle),
      description: t(localizationConstants.b2bArchiveConfirmDesc),
      confirm: t(localizationConstants.b2bPMQAArchive),
    },
  };

  const sortedOffers = useMemo(
    () =>
      sortItems(
        offers,
        sortField,
        sortDir,
        (item, field) => item[field as keyof ProjectMarketOffer] as string | number,
      ),
    [offers, sortField, sortDir],
  );

  return (
    <div className="flex flex-col gap-4 pl-4 sm:pl-6 md:pl-11 pr-4 sm:pr-5 md:pr-6 py-3.5">
      {/* Summary — Single outer white card containing info on left, and 2 inner boxes on right */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
        <div className="grid grid-cols-1 gap-3.5 sm:gap-4 min-[860px]:grid-cols-2 xl:grid-cols-3">
          {/* Section 1: Project details and tags — full width on tablet (860px to xl), 1 col on xl */}
          <div className="flex flex-col justify-between py-0.5 min-[860px]:col-span-2 xl:col-span-1">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{data.title}</h3>
                <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700">
                  {t(localizationConstants.b2bPMRefNr)}: {data.refNr}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {t(localizationConstants.b2bPMLatestOfferDate)}: {formatApiDate(data.latestOfferDate)}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-slate-900 px-2.5 py-0.5 text-xs font-medium text-white shadow-xs">
                {data.type}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                <Building2 size={12} aria-hidden={true} />
                {data.city}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                <MapPin size={12} aria-hidden={true} />
                {data.municipality}
              </span>
            </div>
          </div>

          {/* Section 2: Lowest offer - Dark Slate (side-by-side on sm to xl) */}
          <div className="flex flex-col justify-between rounded-xl bg-slate-800 p-3.5 sm:p-4 text-white shadow-xs">
            <div className="flex items-center gap-2">
              <Wallet size={24} className="h-6 w-6 shrink-0 text-slate-300" aria-hidden={true} />
              <span className="text-sm sm:text-base font-normal leading-6 tracking-normal text-slate-300 font-sans truncate">
                {t(localizationConstants.b2bPMLowestOffer)} - {data.lowestOfferCompany}
              </span>
            </div>
            <p className="mt-2.5 pl-8 font-sans font-semibold text-xl leading-7 tracking-normal text-white">
              {formatCurrency(data.lowestOfferValue)}
            </p>
          </div>

          {/* Section 3: Contract panel - Soft Slate (side-by-side on sm to xl) */}
          <div className="flex flex-row items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-100 p-3.5 sm:p-4 shadow-xs">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <WalletCards size={24} className="h-6 w-6 shrink-0 text-slate-900" aria-hidden={true} />
                <span className="text-base font-normal leading-6 tracking-normal text-slate-900 font-sans">
                  {t(localizationConstants.b2bPMContractPanel)}
                </span>
              </div>
              <div className="flex items-center gap-2.5 pl-8">
                <span className="font-sans font-semibold text-xl leading-7 tracking-normal text-slate-900">
                  {data.contractCount}
                </span>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                  {t(localizationConstants.b2bPMNoContract)}
                </span>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setContractModalOpen(true)}
              className="cursor-pointer border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 shadow-xs hover:bg-slate-50 shrink-0 self-start"
            >
              {t(localizationConstants.b2bPMManageContract)}
            </Button>
          </div>
        </div>
      </div>

      {/* Offer table — collapsible */}
      <Collapsible open={offerListOpen} onOpenChange={setOfferListOpen}>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between border-b border-slate-200 px-4 py-3 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <BadgeDollarSign size={22} className="shrink-0 text-slate-800" aria-hidden={true} />
                <span className="text-base font-bold text-slate-900">
                  {t(localizationConstants.b2bPMTabOffers)}
                </span>
              </div>
              <ChevronUp
                size={18}
                className={`shrink-0 text-slate-500 transition-transform duration-200 ${
                  offerListOpen ? "" : "rotate-180"
                }`}
                aria-hidden={true}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-3 sm:p-4 pt-1">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-200 bg-white hover:bg-white">
                    <TableHead
                      className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-medium text-slate-500 hover:text-slate-800"
                      onClick={() => toggleSort("company")}
                    >
                      <span className="flex items-center gap-1">
                        {t(localizationConstants.b2bDealCompany)}
                        {renderSortIcon("company", sortField, sortDir)}
                      </span>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-medium text-slate-500 hover:text-slate-800"
                      onClick={() => toggleSort("date")}
                    >
                      <span className="flex items-center gap-1">
                        {t(localizationConstants.b2bDealDetailDatum)}
                        {renderSortIcon("date", sortField, sortDir)}
                      </span>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-medium text-slate-500 hover:text-slate-800"
                      onClick={() => toggleSort("contactPerson")}
                    >
                      <span className="flex items-center gap-1">
                        {t(localizationConstants.contactNameLabel)}
                        {renderSortIcon("contactPerson", sortField, sortDir)}
                      </span>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-medium text-slate-500 hover:text-slate-800"
                      onClick={() => toggleSort("mobile")}
                    >
                      <span className="flex items-center gap-1">
                        {t(localizationConstants.b2bPMMobile)}
                        {renderSortIcon("mobile", sortField, sortDir)}
                      </span>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-medium text-slate-500 hover:text-slate-800"
                      onClick={() => toggleSort("email")}
                    >
                      <span className="flex items-center gap-1">
                        {t(localizationConstants.email)}
                        {renderSortIcon("email", sortField, sortDir)}
                      </span>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-medium text-slate-500 hover:text-slate-800"
                      onClick={() => toggleSort("status")}
                    >
                      <span className="flex items-center gap-1">
                        {t(localizationConstants.statusLabel)}
                        {renderSortIcon("status", sortField, sortDir)}
                      </span>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none whitespace-nowrap px-4 py-3.5 text-left text-xs font-medium text-slate-500 hover:text-slate-800"
                      onClick={() => toggleSort("offerAmount")}
                    >
                      <span className="flex items-center gap-1">
                        {t(localizationConstants.b2bPMOffer)}
                        {renderSortIcon("offerAmount", sortField, sortDir)}
                      </span>
                    </TableHead>
                    <TableHead className="whitespace-nowrap px-4 py-3.5 text-right" />
                    <TableHead className="w-12 border-l border-slate-200 px-3 py-3.5 text-center" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedOffers.map((offer) => (
                    <TableRow
                      key={offer.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/80 transition-colors"
                    >
                      <TableCell className="whitespace-nowrap px-4 py-3.5 font-semibold text-slate-900">
                        {offer.company}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-3.5 text-slate-800">
                        {formatApiDate(offer.date)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-3.5 text-slate-800">
                        {offer.contactPerson}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-3.5 text-slate-800">
                        {offer.mobile}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-3.5 text-slate-800">
                        {offer.email}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-3.5">
                        <OfferStatusBadge status={offer.status} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-4 py-3.5 tabular-nums font-normal text-slate-800">
                        {offer.offerAmount > 0 ? formatCurrency(offer.offerAmount) : "0"}
                      </TableCell>
                      <TableCell
                        className="whitespace-nowrap px-4 py-3.5 text-right"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      >
                        <Button
                          size="sm"
                          className="h-8 cursor-pointer whitespace-nowrap bg-slate-100 px-3.5 text-xs font-medium text-slate-900 shadow-none hover:bg-slate-200"
                          onClick={() =>
                            router.push(
                              `/module/business/b2b/overview/${data.id}/offer/${offer.id}`
                            )
                          }
                        >
                          {t(localizationConstants.b2bPMViewOffer)}
                        </Button>
                      </TableCell>
                      <TableCell
                        className="w-12 whitespace-nowrap border-l border-slate-200 px-2 py-3.5 text-center"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="mx-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-700 hover:bg-slate-100 hover:text-slate-950 p-0"
                              aria-label={t(localizationConstants.actions)}
                            >
                              <MoreVertical size={16} className="text-slate-700" aria-hidden={true} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-40 bg-white p-1.5 shadow-lg border border-slate-200 rounded-lg"
                          >
                            {offer.status === "waiting" && (
                              <DropdownMenuItem
                                onClick={() => setPendingAction({ action: "accept", offerId: offer.id })}
                                className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 rounded-md"
                              >
                                <Check
                                  size={16}
                                  className="h-4 w-4 text-slate-700 stroke-[2.25]"
                                  aria-hidden={true}
                                />
                                <span>{t(localizationConstants.b2bPMAcceptOffer)}</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => setPendingAction({ action: "archive", offerId: offer.id })}
                              className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 rounded-md"
                            >
                              <Archive size={16} className="h-4 w-4 text-slate-700" aria-hidden={true} />
                              <span>{t(localizationConstants.b2bPMQAArchive)}</span>
                            </DropdownMenuItem>
                            {offer.status === "waiting" && (
                              <DropdownMenuItem
                                onClick={() => setPendingAction({ action: "decline", offerId: offer.id })}
                                className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-800 hover:bg-slate-50 rounded-md"
                              >
                                <X size={16} className="h-4 w-4 text-slate-700" aria-hidden={true} />
                                <span>{t(localizationConstants.b2bPMDeclineOffer)}</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
      {/* Modal: Välj företag för att skapa kontrakt */}
      <Dialog open={contractModalOpen} onOpenChange={setContractModalOpen}>
        <DialogContent className="w-full max-w-[458px] min-h-[230px] rounded-xl border border-slate-200 bg-white p-6 shadow-xl gap-4 flex flex-col justify-between">
          <DialogHeader className="flex flex-col gap-1.5 text-left">
            <DialogTitle className="font-sans font-semibold text-[18px] leading-[30px] text-zinc-950 tracking-normal">
              {t(localizationConstants.b2bPMSelectCompanyModalTitle)}
            </DialogTitle>
            <DialogDescription className="font-sans font-medium text-[14px] leading-[20px] text-zinc-950 tracking-normal text-left">
              {t(localizationConstants.b2bPMSelectCompanyModalDesc)}
            </DialogDescription>
          </DialogHeader>

          <div className="py-1">
            <Select
              value={selectedOfferId}
              onValueChange={setSelectedOfferId}
            >
              <SelectTrigger className="h-10 w-full rounded-md border-slate-200 bg-white text-sm text-zinc-950 shadow-xs focus:ring-zinc-950">
                <SelectValue
                  placeholder={t(localizationConstants.b2bPMSelectCompanyModalPlaceholder)}
                />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                {offers.map((o) => (
                  <SelectItem key={o.id} value={o.id} className="cursor-pointer text-sm">
                    {o.company} - {formatCurrency(o.offerAmount)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-1 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setContractModalOpen(false)}
              className="h-[36px] w-[120px] cursor-pointer rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-slate-200 transition-colors shadow-none"
            >
              {t(localizationConstants.b2bAvtalAvbryt)}
            </Button>
            <Button
              type="button"
              onClick={() => {
                setContractModalOpen(false);
                router.push(
                  `/module/business/b2b/overview/agreements/${selectedOfferId || "1"}?projectId=${data.id}&offerId=${selectedOfferId || "1"}`
                );
              }}
              className="h-[36px] w-[120px] cursor-pointer gap-2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white shadow-none hover:bg-zinc-800 transition-colors flex items-center justify-center"
            >
              {t(localizationConstants.b2bCreateNext)}
              <ArrowRight size={16} aria-hidden={true} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!pendingAction}
        onOpenChange={(open) => !open && !isActing && setPendingAction(null)}
      >
        <AlertDialogContent>
          {pendingAction && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>{confirmCopy[pendingAction.action].title}</AlertDialogTitle>
                <AlertDialogDescription>
                  {confirmCopy[pendingAction.action].description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isActing} className="cursor-pointer">
                  {t(localizationConstants.cancel)}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    void handleConfirmAction();
                  }}
                  disabled={isActing}
                  className={`cursor-pointer text-white ${
                    pendingAction.action === "decline"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-slate-900 hover:bg-slate-800"
                  }`}
                >
                  {confirmCopy[pendingAction.action].confirm}
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
