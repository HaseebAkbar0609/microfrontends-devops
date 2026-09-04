"use client";

import { useEffect, useState } from "react";
import { OfferModuleHeader } from "@/features/offer/components/OfferModuleHeader";
import { OfferSendPage } from "@/features/offer/components/OfferSendPage";
import { DUMMY_OFFER_SEND } from "@/features/offer/constants/offerSend";
import { getOfferDetailByIdAPIAction } from "@/api-actions/offers";
import { OfferSendData } from "@/features/offer/types";
import { Loader } from "@/components/ui/loader";

type Props = {
  requestId: string;
};

import { DUMMY_OFFER_REQUESTS } from "@/features/offer/constants/offerRequests.mock";
import { DUMMY_QUOTED_ITEMS } from "@/features/offer/constants/offerQuoted.mock";

function getFallbackOfferData(requestId: string): OfferSendData {
  const reqMatch = DUMMY_OFFER_REQUESTS.find((r) => r.id === requestId);
  if (reqMatch) {
    return {
      ...DUMMY_OFFER_SEND,
      id: reqMatch.id,
      title: reqMatch.job,
      type: reqMatch.type,
      badges: [reqMatch.type, reqMatch.category, reqMatch.municipality],
      customer: {
        name: reqMatch.customerName,
        email: `${reqMatch.customerName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        phone: "076000000",
        address: `Storgatan 16, ${reqMatch.municipality}`,
      },
      preliminaryBudgetPrice: reqMatch.price ? reqMatch.price.toLocaleString("en-US") : "550,000",
      offerDateLatest: "2025-04-15",
    };
  }

  const quotedMatch = DUMMY_QUOTED_ITEMS.find((q) => q.id === requestId);
  if (quotedMatch) {
    return {
      ...DUMMY_OFFER_SEND,
      id: quotedMatch.id,
      title: quotedMatch.job,
      type: quotedMatch.type,
      badges: [quotedMatch.type, quotedMatch.category, quotedMatch.municipality],
      customer: {
        name: quotedMatch.customerName,
        email: quotedMatch.contactPerson.email || `${quotedMatch.customerName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        phone: quotedMatch.contactPerson.phone || "076000000",
        address: `Storgatan 16, ${quotedMatch.municipality}`,
      },
      preliminaryBudgetPrice: quotedMatch.price ? quotedMatch.price.toLocaleString("en-US") : "550,000",
      offerDateLatest: "2025-04-15",
    };
  }

  return {
    ...DUMMY_OFFER_SEND,
    id: requestId,
  };
}

export function OfferRequestDetailClient({ requestId }: Props) {
  const [data, setData] = useState<OfferSendData>(() => getFallbackOfferData(requestId));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchOffer() {
      setIsLoading(true);
      try {
        const result = await getOfferDetailByIdAPIAction(requestId);
        if (cancelled) return;

        if (result.success && result.data) {
          setData({
            ...result.data,
            id: requestId,
          });
        } else {
          setData(getFallbackOfferData(requestId));
        }
      } catch {
        setData(getFallbackOfferData(requestId));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchOffer();
    return () => { cancelled = true; };
  }, [requestId]);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col min-h-screen">
        <OfferModuleHeader activeTab="request" />
        <div className="flex flex-1 items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col min-h-screen">
      <OfferModuleHeader activeTab="request" />
      <OfferSendPage data={data} />
    </div>
  );
}
