"use client";

import { useEffect, useState } from "react";
import { OfferModuleHeader } from "@/features/offer/components/OfferModuleHeader";
import { OfferEditorPage } from "./quote-form/OfferEditorPage";
import { loadOfferContext, resolveOfferVariant, type OfferContext } from "../services/offerFormService";
import { Loader } from "@/components/ui/loader";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";

type Props = {
  offerId: string;
  type?: string;
};

export function OfferSendClient({ offerId, type }: Props) {
  const t = useTranslate();

  const [data, setData] = useState<OfferContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchOffer() {
      setIsLoading(true);
      setHasError(false);
      try {
        const result = await loadOfferContext(offerId);
        if (cancelled) return;
        setData(result);
      } catch {
        setHasError(true);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchOffer();
    return () => { cancelled = true; };
  }, [offerId]);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <OfferModuleHeader activeTab="request" />
        <div className="flex flex-1 items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  if (hasError || !data) {
    return <div role="alert" className="m-6 rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700">{t(localizationConstants.offerEditorLoadError)}</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <OfferModuleHeader activeTab="request" />
      <OfferEditorPage key={offerId} context={data} variant={resolveOfferVariant(data, type)} />
    </div>
  );
}
