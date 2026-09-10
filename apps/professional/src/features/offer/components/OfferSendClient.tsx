"use client";

import { useEffect, useState } from "react";
import { OfferModuleHeader } from "@/features/offer/components/OfferModuleHeader";
import { OfferFormPage } from "@/features/offer/components/OfferFormPage";
import { getOfferDetailByIdAPIAction } from "@/api-actions/offers";
import { OfferFormData, OfferFormType } from "@/features/offer/types";
import { Loader } from "@/components/ui/loader";
import { authStorage } from "@/lib/authStorage";

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
  const formType = parseOfferFormType(type);

  const [data, setData] = useState<OfferFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchOffer() {
      setIsLoading(true);
      try {
        const result = await getOfferDetailByIdAPIAction(offerId);
        if (cancelled) return;

        if (result.success && result.data) {
          const offerData = result.data;
          const company = authStorage.getCompanyData() as {
            company_name?: string;
            name?: string;
            organization_number?: string;
          } | null;
          setData({
            offerId: offerData.id,
            type: formType,
            title: offerData.title,
            badges: offerData.badges,
            customer: {
              name: offerData.customer.name,
              email: offerData.customer.email,
              phone: offerData.customer.phone,
              address: offerData.customer.address,
            },
            company: {
              name: company?.company_name || company?.name || "—",
              email: "",
              orgNumber: company?.organization_number || "",
              phone: "",
              address: "",
            },
          });
        } else setHasError(true);
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
    return <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700">Offer form could not be loaded. Please try again.</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <OfferModuleHeader activeTab="request" />
      <OfferFormPage data={data} />
    </div>
  );
}
