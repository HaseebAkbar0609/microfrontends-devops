"use client";

import { useEffect, useState } from "react";
import { OfferModuleHeader } from "@/features/offer/components/OfferModuleHeader";
import { OfferFormPage } from "@/features/offer/components/OfferFormPage";
import { DUMMY_OFFER_FORMS } from "@/features/offer/constants/offerForm.mock";
import { getOfferDetailByIdAPIAction } from "@/api-actions/offers";
import { OfferFormData, OfferFormType } from "@/features/offer/types";
import { Loader } from "@/components/ui/loader";

type Props = {
  offerId: string;
  type?: string;
};

export function OfferSendClient({ offerId, type }: Props) {
  const rawType = (type || "").toLowerCase().trim();

  let formType: OfferFormType = "b2c";
  if (rawType.includes("rent") || rawType.includes("hyra")) {
    formType = "rent";
  } else if (rawType.includes("express")) {
    formType = "express";
  } else {
    formType = "b2c";
  }

  const [data, setData] = useState<OfferFormData>({
    ...(DUMMY_OFFER_FORMS[formType] || DUMMY_OFFER_FORMS.b2c),
    type: formType,
    offerId,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchOffer() {
      setIsLoading(true);
      try {
        const result = await getOfferDetailByIdAPIAction(offerId);
        if (cancelled) return;

        if (result.success && result.data) {
          const offerData = result.data;
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
              name: "Nesse Bygg AB",
              email: "per@nessebygg.com",
              orgNumber: "7060070-0000 - Nesse",
              phone: "76000000",
              address: "Storgatan 23, 18877 Stockholm",
            },
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

  return (
    <div className="flex flex-1 flex-col">
      <OfferModuleHeader activeTab="request" />
      <OfferFormPage data={data} />
    </div>
  );
}
