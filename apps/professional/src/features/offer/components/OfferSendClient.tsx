"use client";

import { useEffect, useState } from "react";
import { OfferModuleHeader } from "@/features/offer/components/OfferModuleHeader";
import { OfferEditorPage } from "./quote-form/OfferEditorPage";
import { loadOfferContext, type OfferContext } from "../services/offerFormService";
import { OfferFormType } from "@/features/offer/types";
import { Loader } from "@/components/ui/loader";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";

type Props = {
  offerId: string;
  type?: string;
};

const FORM_TYPE_MAP: Record<string, OfferFormType> = {
  rent: "rent",
  hyra: "rent",
  b2b: "rent",
  express: "express",
  snabb: "express",
  b2c: "b2c",
};

export function parseOfferFormType(type?: string): OfferFormType {
  if (!type) return "b2c";
  const normalized = type.toLowerCase().trim();
  return FORM_TYPE_MAP[normalized] ?? "b2c";
}

export function OfferSendClient({ offerId, type }: Props) {
  const t = useTranslate();
  const formType = parseOfferFormType(type);

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
  }, [offerId, formType]);

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
      <OfferEditorPage key={offerId} context={data} variant={formType} />
    </div>
  );
}
