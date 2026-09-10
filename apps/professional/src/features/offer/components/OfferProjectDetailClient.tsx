"use client";

import { useEffect, useState } from "react";
import { getOfferDetailByIdAPIAction } from "@/api-actions/offers";
import { Loader } from "@/components/ui/loader";
import type { ProjectData } from "../types/offer";
import { OfferSeeProjectView } from "./OfferSeeProjectView";

export function OfferProjectDetailClient({ projectId, offerId = "" }: { projectId: string; offerId?: string }) {
  const [data, setData] = useState<ProjectData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getOfferDetailByIdAPIAction(projectId).then((result) => {
      if (cancelled) return;
      if (!result.success || !result.data) {
        setError(true);
        return;
      }
      const item = result.data;
      setData({
        id: item.id,
        title: item.title,
        jobType: item.type,
        budget: Number(item.preliminaryBudgetPrice.replace(/[^0-9.-]+/g, "")) || 0,
        statusBadge: "Active",
        postedDate: item.postedDate,
        municipality: item.badges.at(-1) || "",
        customer: {
          name: item.customer.name,
          postalCode: "",
          city: item.badges.at(-1) || "",
          email: item.customer.email,
          orgPersonNr: "",
          address: item.customer.address,
          info: item.description,
          phone: item.customer.phone,
        },
        contactPerson: {
          firstName: item.customer.name.split(" ")[0] || "",
          lastName: item.customer.name.split(" ").slice(1).join(" "),
          company: "",
          email: item.customer.email,
          mobile: item.customer.phone,
          role: "Customer",
        },
        order: { serialNr: "", blockName: "", postalCode: "", orderName: item.title, orderAddress: item.customer.address, city: item.badges.at(-1) || "" },
        orderInfo: { type: item.type, category: item.badges[0] || "", department: "", contractNr: "", offerNr: offerId, startDate: "", endDate: "" },
        documents: item.documents.map((document) => ({
          id: document.id,
          date: item.postedDate,
          name: document.label,
          fileLabel: document.src || document.label,
          fileType: document.label.toLowerCase().endsWith(".pdf") ? "pdf" : "image",
        })),
      });
    });
    return () => { cancelled = true; };
  }, [offerId, projectId]);

  if (error) return <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700">Project could not be loaded.</div>;
  if (!data) return <div className="flex min-h-screen items-center justify-center"><Loader /></div>;
  return <OfferSeeProjectView offerId={offerId} data={data} />;
}
