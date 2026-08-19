"use client";

import { useEffect, useState } from "react";
import { OfferModuleHeader, OfferTabId } from "@/features/offer/components/OfferModuleHeader";
import { OfferRequestView } from "@/features/offer/components/OfferRequestView";
import { OfferQuotedView } from "@/features/offer/components/OfferQuotedView";
import { OfferAcceptedView } from "@/features/offer/components/OfferAcceptedView";
import { OfferAgreedView } from "@/features/offer/components/OfferAgreedView";
import { OfferArchivedView } from "@/features/offer/components/OfferArchivedView";
import { listOffersAPIAction, OffersListResult } from "@/api-actions/offers";
import { DUMMY_OFFER_REQUESTS } from "@/features/offer/constants/offerRequests.mock";
import { DUMMY_QUOTED_ITEMS } from "@/features/offer/constants/offerQuoted.mock";
import { DUMMY_ACCEPTED_ITEMS } from "@/features/offer/constants/offerAccepted.mock";
import { DUMMY_AGREED_ITEMS } from "@/features/offer/constants/offerAgreed.mock";
import { DUMMY_ARCHIVED_ITEMS } from "@/features/offer/constants/offerArchived.mock";
import { OfferRequest } from "@/features/offer/constants/offerRequests";
import { OfferQuotedItem, OfferAcceptedItem, OfferAgreedItem, OfferArchivedItem, OfferList } from "@/features/offer/types";
import { Loader } from "@/components/ui/loader";

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
    offertNr: item.idNumber,
    job: item.jobName,
    customerName: item.jobName,
    category: item.category,
    municipality: item.municipality,
    type: item.type,
    price: 0,
    status: item.request === "opened" ? "opened" : "notReviewed",
    contactPerson: { name: "" },
    trackingNumber: item.idNumber,
    jobName: item.jobName,
  }));
}

function mapToQuotedItems(result: OffersListResult): OfferQuotedItem[] {
  return result.items.map((item: OfferList) => ({
    id: item.id,
    offertNr: item.idNumber,
    job: item.jobName,
    customerName: item.jobName,
    category: item.category,
    municipality: item.municipality,
    type: item.type,
    price: 0,
    status: "notReviewed" as const,
    contactPerson: { name: "", phone: "", email: "" },
  }));
}

function mapToAcceptedItems(result: OffersListResult): OfferAcceptedItem[] {
  return result.items.map((item: OfferList) => ({
    id: item.id,
    offertNr: item.idNumber,
    job: item.jobName,
    customerName: item.jobName,
    category: item.category,
    municipality: item.municipality,
    acceptedPrice: 0,
    type: item.type,
  }));
}

function mapToAgreedItems(result: OffersListResult): OfferAgreedItem[] {
  return result.items.map((item: OfferList) => ({
    id: item.id,
    contractNr: item.idNumber,
    jobName: item.jobName,
    customerName: item.jobName,
    status: "waiting_signature" as const,
    municipality: item.municipality,
    jobType: item.type,
    agreedPrice: 0,
  }));
}

function mapToArchivedItems(result: OffersListResult): OfferArchivedItem[] {
  return result.items.map((item: OfferList) => ({
    id: item.id,
    contractNr: item.idNumber,
    jobName: item.jobName,
    customerName: item.jobName,
    status: "waiting_signature" as const,
    municipality: item.municipality,
    jobType: item.type,
    agreedPrice: 0,
    projectId: item.id,
  }));
}

interface OfferStatusPageProps {
  tabId: OfferTabId;
  offerId?: string;
}

export function OfferStatusPageContent({ tabId, offerId = "" }: OfferStatusPageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [requestItems, setRequestItems] = useState<OfferRequest[]>(DUMMY_OFFER_REQUESTS);
  const [quotedItems, setQuotedItems] = useState<OfferQuotedItem[]>(DUMMY_QUOTED_ITEMS);
  const [acceptedItems, setAcceptedItems] = useState<OfferAcceptedItem[]>(DUMMY_ACCEPTED_ITEMS);
  const [agreedItems, setAgreedItems] = useState<OfferAgreedItem[]>(DUMMY_AGREED_ITEMS);
  const [archivedItems, setArchivedItems] = useState<OfferArchivedItem[]>(DUMMY_ARCHIVED_ITEMS);

  useEffect(() => {
    const status = STATUS_API_MAP[tabId];
    if (!status) return;

    const apiStatus: OfferApiStatus = status;
    let cancelled = false;

    async function fetchOffers() {
      setIsLoading(true);
      try {
        const result = await listOffersAPIAction({ status: apiStatus, page: 1, pageSize: 50 });

        if (cancelled) return;

        if (result.items.length > 0) {
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
        }
      } catch {
        // Keep mock data on error
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchOffers();
    return () => { cancelled = true; };
  }, [tabId]);

  return (
    <div className="flex flex-1 flex-col min-h-screen">
      <OfferModuleHeader activeTab={tabId} />

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {tabId === "request" && (
            <OfferRequestView requests={requestItems} />
          )}

          {tabId === "quoted" && (
            <OfferQuotedView offerId={offerId} items={quotedItems} />
          )}

          {tabId === "accepted" && (
            <OfferAcceptedView offerId={offerId} items={acceptedItems} />
          )}

          {tabId === "agreed" && (
            <OfferAgreedView offerId={offerId} items={agreedItems} />
          )}

          {tabId === "archived" && (
            <OfferArchivedView offerId={offerId} items={archivedItems} />
          )}
        </>
      )}
    </div>
  );
}
