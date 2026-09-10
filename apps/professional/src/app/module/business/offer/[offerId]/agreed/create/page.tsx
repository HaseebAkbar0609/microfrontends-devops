"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CreateAgreementView } from "@/features/offer/components/CreateAgreementView";
import { getOfferDetailByIdAPIAction } from "@/api-actions/offers";
import type { AgreementData } from "@/features/offer/types";
import { Loader } from "@/components/ui/loader";

const emptyParty = (role: "customer" | "supplier") => ({
  id: `${role}-1`,
  name: "",
  role,
  companyOrPerson: "",
  contactPerson: "",
  company: "",
  authorizedSignatory: "",
  phone: "",
  email: "",
  address: "",
});

export default function CreateAgreementPage() {
  const { offerId } = useParams<{ offerId: string }>();
  const [data, setData] = useState<AgreementData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getOfferDetailByIdAPIAction(offerId).then((result) => {
      if (cancelled) return;
      if (!result.success || !result.data) {
        setError(true);
        return;
      }
      const offer = result.data;
      setData({
        id: offer.id,
        projectName: offer.title,
        projectNumber: offer.id,
        quoteNumber: offerId,
        address: offer.customer.address,
        contractType: offer.type,
        customerName: offer.customer.name,
        price: Number(offer.preliminaryBudgetPrice.replace(/[^0-9.-]+/g, "")) || 0,
        startDate: "",
        endDate: "",
        parties: [
          {
            ...emptyParty("customer"),
            name: offer.customer.name,
            companyOrPerson: offer.customer.name,
            contactPerson: offer.customer.name,
            phone: offer.customer.phone,
            email: offer.customer.email,
            address: offer.customer.address,
          },
          emptyParty("supplier"),
        ],
        documents: offer.documents.map((document) => document.id).filter(Boolean),
        templates: [],
      });
    });
    return () => { cancelled = true; };
  }, [offerId]);

  if (error) return <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700">Agreement data could not be loaded.</div>;
  if (!data) return <div className="flex min-h-screen items-center justify-center"><Loader /></div>;
  return <CreateAgreementView offerId={offerId} data={data} />;
}
