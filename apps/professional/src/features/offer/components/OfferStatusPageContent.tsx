"use client";

import { useEffect, useState } from "react";
import { OfferModuleHeader, OfferTabId } from "@/features/offer/components/OfferModuleHeader";
import { OfferRequestView } from "@/features/offer/components/OfferRequestView";
import { OfferQuotedView } from "@/features/offer/components/OfferQuotedView";
import { OfferAcceptedView } from "@/features/offer/components/OfferAcceptedView";
import { OfferAgreedView } from "@/features/offer/components/OfferAgreedView";
import { OfferArchivedView } from "@/features/offer/components/OfferArchivedView";
import { listOffersAPIAction, OffersListResult } from "@/api-actions/offers";
import { OfferRequest } from "@/features/offer/constants/offerRequests";
import {
  OfferQuotedItem,
  OfferAcceptedItem,
  OfferAgreedItem,
  OfferAgreedStatus,
  OfferArchivedItem,
  OfferList,
} from "@/features/offer/types";
import { Loader } from "@/components/ui/loader";
import { authStorage } from "@/lib/authStorage";
import { ProfessionalRow } from "@/types/company";

export const OFFER_API_STATUS = {
  REQUESTED: "REQUESTED",
  OFFERED: "OFFERED",
  ACCEPTED: "ACCEPTED",
  AGREED: "AGREED",
  ARCHIVED: "ARCHIVED",
} as const;

export type OfferApiStatus = (typeof OFFER_API_STATUS)[keyof typeof OFFER_API_STATUS];

const STATUS_API_MAP: Partial<Record<OfferTabId, OfferApiStatus>> = {
  available: OFFER_API_STATUS.REQUESTED,
  request: OFFER_API_STATUS.REQUESTED,
  quoted: OFFER_API_STATUS.OFFERED,
  accepted: OFFER_API_STATUS.ACCEPTED,
  agreed: OFFER_API_STATUS.AGREED,
  archived: OFFER_API_STATUS.ARCHIVED,
};

function mapToRequestItems(result: OffersListResult): OfferRequest[] {
  return result.items.map((item: OfferList) => ({
    id: item.id,
    projectId: item.projectId,
    mappingId: item.mappingId,
    quoteId: item.quoteId,
    offertNr: item.idNumber,
    job: item.jobName,
    customerName: item.contactName || "—",
    category: item.category,
    municipality: item.municipality,
    type: item.type,
    price: item.totalPrice || 0,
    status: item.request === "opened" ? "opened" : "notReviewed",
    contactPerson: { name: item.contactName || "" },
    trackingNumber: item.idNumber,
    jobName: item.jobName,
  }));
}

function mapToQuotedItems(result: OffersListResult): OfferQuotedItem[] {
  return result.items.map((item: OfferList) => ({
    id: item.id,
    projectId: item.projectId,
    mappingId: item.mappingId,
    quoteId: item.quoteId,
    offertNr: item.idNumber,
    job: item.jobName,
    customerName: item.contactName || "—",
    category: item.category,
    municipality: item.municipality,
    type: item.type,
    price: item.totalPrice || 0,
    status: item.seenStatus?.toLowerCase().includes("open") ? "opened" as const : "notReviewed" as const,
    openedAt: item.openedAt,
    contactPerson: { name: item.contactName || "", phone: item.contactPhone || "", email: item.contactEmail || "" },
  }));
}

function mapToAcceptedItems(result: OffersListResult): OfferAcceptedItem[] {
  return result.items.map((item: OfferList) => ({
    id: item.id,
    projectId: item.projectId,
    mappingId: item.mappingId,
    quoteId: item.quoteId,
    offertNr: item.idNumber,
    job: item.jobName,
    customerName: item.contactName || "—",
    category: item.category,
    municipality: item.municipality,
    acceptedPrice: item.totalPrice || 0,
    type: item.type,
    contactPerson: { name: item.contactName || "", phone: item.contactPhone || "", email: item.contactEmail || "" },
  }));
}

function mapToAgreedItems(result: OffersListResult): OfferAgreedItem[] {
  return result.items.map((item: OfferList) => ({
    id: item.id,
    projectId: item.projectId,
    mappingId: item.mappingId,
    quoteId: item.quoteId,
    agreementId: item.agreementId,
    agreementStatus: item.agreementStatus,
    contractNr: item.idNumber || item.id || "—",
    jobName: item.jobName,
    customerName: item.contactName || "—",
    status: (item.agreementId && item.agreementStatus === "active" ? "signed" : "waiting_signature") as OfferAgreedStatus,
    municipality: item.municipality || "-",
    jobType: item.type || "-",
    agreedPrice: item.totalPrice || 0,
  }));
}

function mapToArchivedItems(result: OffersListResult): OfferArchivedItem[] {
  return result.items.map((item: OfferList) => ({
    id: item.id,
    mappingId: item.mappingId,
    quoteId: item.quoteId,
    agreementId: item.agreementId,
    agreementStatus: item.agreementStatus,
    contractNr: item.idNumber,
    jobName: item.jobName,
    customerName: item.contactName || "—",
    status: (item.agreementId && item.agreementStatus === "active" ? "signed" : "waiting_signature") as OfferAgreedStatus,
    municipality: item.municipality,
    jobType: item.type,
    agreedPrice: item.totalPrice || 0,
    projectId: item.projectId || item.id,
  }));
}

interface OfferStatusPageProps {
  tabId: OfferTabId;
  offerId?: string;
}

export function OfferStatusPageContent({ tabId, offerId = "" }: OfferStatusPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [requestItems, setRequestItems] = useState<OfferRequest[]>([]);
  const [quotedItems, setQuotedItems] = useState<OfferQuotedItem[]>([]);
  const [acceptedItems, setAcceptedItems] = useState<OfferAcceptedItem[]>([]);
  const [agreedItems, setAgreedItems] = useState<OfferAgreedItem[]>([]);
  const [archivedItems, setArchivedItems] = useState<OfferArchivedItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const status = STATUS_API_MAP[tabId];
    if (!status) return;

    const apiStatus: OfferApiStatus = status;
    let cancelled = false;

    async function fetchOffers() {
      setIsLoading(true);
      setHasError(false);
      try {
        const companyData = authStorage.getCompanyData() as ProfessionalRow | null;
        const result = await listOffersAPIAction({
          status: apiStatus,
          page: 1,
          pageSize: 50,
          companyId: companyData?.id,
          search,
        });

        if (cancelled) return;

        switch (tabId) {
            case "request":
              setRequestItems(mapToRequestItems(result));
              break;
            case "quoted":
              setQuotedItems(mapToQuotedItems(result));
              break;
            case "accepted":
              setAcceptedItems(mapToAcceptedItems(result));
              break;
            case "agreed":
              setAgreedItems(mapToAgreedItems(result));
              break;
            case "archived":
              setArchivedItems(mapToArchivedItems(result));
              break;
        }
      } catch {
        if (!cancelled) setHasError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchOffers();
    return () => { cancelled = true; };
  }, [tabId, search]);

  return (
    <div className="flex flex-1 flex-col min-h-screen">
      <OfferModuleHeader activeTab={tabId} />

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader />
        </div>
      ) : hasError ? (
        <div className="mx-6 mt-6 rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center text-red-700">
          Offers could not be loaded. Please refresh the page and try again.
        </div>
      ) : (
        <>
          {tabId === "request" && (
            <OfferRequestView requests={requestItems} onSearchChange={setSearch} />
          )}

          {tabId === "quoted" && (
            <OfferQuotedView offerId={offerId} items={quotedItems} />
          )}

          {tabId === "accepted" && (
            <OfferAcceptedView offerId={offerId} items={acceptedItems} onSearchChange={setSearch} />
          )}

          {tabId === "agreed" && (
            <OfferAgreedView offerId={offerId} items={agreedItems} onSearchChange={setSearch} />
          )}

          {tabId === "archived" && (
            <OfferArchivedView offerId={offerId} items={archivedItems} onSearchChange={setSearch} />
          )}
        </>
      )}
    </div>
  );
}
