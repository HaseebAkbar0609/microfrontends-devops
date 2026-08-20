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

export function OfferRequestDetailClient({ requestId }: Props) {
  const [data, setData] = useState<OfferSendData>({
    ...DUMMY_OFFER_SEND,
    id: requestId,
  });
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
        }
      } catch {
        // Keep mock data on error
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
