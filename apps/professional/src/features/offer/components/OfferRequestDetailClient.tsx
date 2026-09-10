"use client";

import { useEffect, useState } from "react";
import { OfferModuleHeader } from "@/features/offer/components/OfferModuleHeader";
import { OfferSendPage } from "@/features/offer/components/OfferSendPage";
import { getOfferDetailByIdAPIAction } from "@/api-actions/offers";
import { OfferSendData } from "@/features/offer/types";
import { Loader } from "@/components/ui/loader";

type Props = {
  requestId: string;
};

export function OfferRequestDetailClient({ requestId }: Props) {
  const [data, setData] = useState<OfferSendData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

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
          setHasError(true);
        }
      } catch {
        setHasError(true);
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

  if (hasError) {
    return <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700">Project could not be loaded. Please try again.</div>;
  }

  if (!data) return null;

  return (
    <div className="flex flex-1 flex-col min-h-screen">
      <OfferModuleHeader activeTab="request" />
      <OfferSendPage data={data} />
    </div>
  );
}
