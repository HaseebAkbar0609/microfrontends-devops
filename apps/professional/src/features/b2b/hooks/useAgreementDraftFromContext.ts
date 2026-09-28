"use client";

import { useEffect, useState } from "react";
import { useAuthStatus, type User } from "@/context/AuthContext";
import { getB2BOfferDetailAction } from "@/api-actions/b2b/seeOffer";
import { getProjectMarketDetailAction } from "@/api-actions/b2b/projectMarket";
import { B2BAgreementDetail } from "../types/agreement";

export const EMPTY_AGREEMENT_DRAFT: B2BAgreementDetail = {
  id: "",
  projectInfo: {
    projektNamn: "", projektNummer: "", offertNr: "", adress: "", kontraktTyp: "",
    kund: "", pris: 0, totalOffert: 0, startDatum: "", slutDatum: "", postedDate: "",
    city: "", municipality: "", refNr: "",
  },
  client: { kund: "", kontaktPerson: "", orgNr: "", telefon: "", personNummer: "", email: "", adress: "" },
  supplier: { foretag: "", firmatecknare: "", orgNr: "", personNummer: "", telefon: "", email: "", adress: "" },
  documents: { attachedDocs: [], templates: [], uploaded: [] },
  signature: {
    bestallare: { foretagsNamn: "", namn: "", mail: "", mobil: "" },
    entreprenor: { foretagsNamn: "", namn: "", mail: "", mobil: "" },
  },
};

/**
 * Builds a Create Agreement draft from real data instead of the mock
 * `getAgreementDetailByContext`: the project's real customer (bestallare,
 * from M1's project-market detail), the real offer (project info/price,
 * from M2's offer detail), and the signed-in company/user (entreprenor,
 * from AuthContext -- already loaded, no extra request). Fields with no
 * real source stay empty for the form's existing edit fields to fill in,
 * rather than being pre-filled with plausible-looking placeholder text.
 */
export function useAgreementDraftFromContext(projectId?: string, offerId?: string) {
  const { company, user } = useAuthStatus() as { company: { id: string; company_name: string; organization_number: string } | null; user: User | null };
  const [draft, setDraft] = useState<B2BAgreementDetail>(EMPTY_AGREEMENT_DRAFT);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(projectId || offerId));

  useEffect(() => {
    if (!projectId && !offerId) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    (async () => {
      setIsLoading(true);
      const [offerRes, projectRes] = await Promise.all([
        offerId ? getB2BOfferDetailAction(projectId || offerId, offerId) : Promise.resolve(null),
        projectId ? getProjectMarketDetailAction(projectId) : Promise.resolve(null),
      ]);
      if (!isMounted) return;

      const offer = offerRes?.success ? offerRes.data : null;
      const project = projectRes?.success ? projectRes.data : null;
      const ownerName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");

      setDraft({
        id: "",
        projectInfo: {
          projektNamn: project?.projectInfo.projectName || offer?.title || "",
          projektNummer: project?.projectInfo.projectNr || offer?.refNr || "",
          offertNr: offer?.refNr ? `OF-${offer.refNr}` : "",
          adress: project?.projectInfo.address || "",
          kontraktTyp: "",
          kund: project?.customerInfo.companyName || "",
          pris: offer?.totalOffert || 0,
          totalOffert: offer?.totalOffert || 0,
          startDatum: project?.projectInfo.startDate || "",
          slutDatum: project?.projectInfo.endDate || "",
          postedDate: offer?.postedDate || "",
          city: offer?.city || project?.city || "",
          municipality: offer?.municipality || project?.municipality || "",
          refNr: project?.refNr || offer?.refNr || "",
        },
        client: {
          kund: project?.customerInfo.companyName || "",
          kontaktPerson: project?.customerInfo.contactPerson || "",
          orgNr: "",
          telefon: project?.customerInfo.phone || "",
          personNummer: "",
          email: project?.customerInfo.email || "",
          adress: project?.customerInfo.address || "",
          postNr: "",
          ort: offer?.city || project?.city || "",
        },
        supplier: {
          foretag: company?.company_name || "",
          firmatecknare: ownerName,
          orgNr: company?.organization_number || "",
          personNummer: "",
          telefon: "",
          email: user?.email || "",
          adress: "",
        },
        documents: { attachedDocs: [], templates: [], uploaded: [] },
        signature: {
          bestallare: {
            foretagsNamn: project?.customerInfo.companyName || "",
            namn: project?.customerInfo.contactPerson || "",
            mail: project?.customerInfo.email || "",
            mobil: project?.customerInfo.phone || "",
          },
          entreprenor: {
            foretagsNamn: company?.company_name || "",
            namn: ownerName,
            mail: user?.email || "",
            mobil: "",
          },
        },
      });
      setIsLoading(false);
    })();

    return () => {
      isMounted = false;
    };
  }, [projectId, offerId, company, user]);

  return { draft, isLoading };
}
