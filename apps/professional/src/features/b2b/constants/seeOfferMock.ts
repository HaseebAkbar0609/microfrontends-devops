import { B2BSeeOfferDetail } from "../types/seeOffer";
import { DUMMY_PROJECTS, DUMMY_PROJECT_DETAIL } from "./projectMarketMock";

export const DUMMY_SEE_OFFER_DETAIL: B2BSeeOfferDetail = {
  id: "1",
  projectId: "1",
  title: "Köksrenoveringsjobb",
  refNr: "PRJ092",
  postedDate: "18-12-2024",
  city: "Stockholm",
  municipality: "Järfälla",
  totalOffert: 1586000,
  statusBadge: "Bokfört",
  company: {
    id: "1",
    name: "Nesse bygg AB",
    email: "Per@nessebygg.com",
    telefon: "076000000",
    adress: "Storgatan 16, 18880 Stockholm.",
    orgNr: "556310-1010",
  },
  contactPerson: {
    name: "Anna Andersson",
    email: "anna@example.com",
    mobil: "076000000",
  },
  offert: {
    arbete: "Total kostnad för projektet, inklusive material och arbete.",
    material: "Material",
    totalOffert: 1586000,
    betalningsvillkor: "Ange specifikationer",
  },
  documents: {
    images: [
      { id: "img-1", label: "Photo.img" },
      { id: "img-2", label: "Photo.img" },
      { id: "img-3", label: "Photo.img" },
      { id: "img-4", label: "Photo.img" },
      { id: "img-5", label: "+6 more" },
    ],
    docs: [
      { id: "doc-1", label: "Offert 1.doc", type: "doc" },
      { id: "doc-2", label: "Offert 2.doc", type: "doc" },
      { id: "doc-3", label: "Details.pdf", type: "pdf" },
    ],
    drawings: [
      { id: "drw-1", label: "projekt.pdf", type: "pdf" },
      { id: "drw-2", label: "bild.1", type: "other" },
      { id: "drw-3", label: "bild.1", type: "other" },
      { id: "drw-4", label: "bild.1", type: "other" },
    ],
  },
  qa: [
    {
      id: "qa-1",
      sender: "Kalle Svensson",
      role: "Pelles Måleri",
      company: "Pelles Måleri",
      badge: "UE",
      replyFrom: "Stefan Eriksson",
      message: "Hej , undrar om ni skickar över kontrollplan",
      date: "12 augusti",
    },
    {
      id: "qa-2",
      sender: "Kalle Svensson",
      role: "Pelles Måleri",
      company: "Pelles Måleri",
      badge: "Fråga",
      replyFrom: "Stefan Eriksson",
      message: "Hej , undrar om ni skickar över kontrollplan",
      date: "12 augusti",
    },
  ],
};

export function getMockSeeOfferDetail(projectId?: string, offerId?: string): B2BSeeOfferDetail {
  const project = DUMMY_PROJECTS.find((p) => p.id === projectId);
  const offer = DUMMY_PROJECT_DETAIL.offers.find((o) => o.id === offerId);

  const title = project?.project ?? DUMMY_SEE_OFFER_DETAIL.title;
  const refNr = project?.refNr ?? DUMMY_SEE_OFFER_DETAIL.refNr;
  const municipality = project?.municipality ?? DUMMY_SEE_OFFER_DETAIL.municipality;
  const postedDate = project?.date ?? DUMMY_SEE_OFFER_DETAIL.postedDate;
  const totalOffert = offer?.offerAmount ?? (project?.lowestOffer || DUMMY_SEE_OFFER_DETAIL.totalOffert);

  const companyName = offer?.company ?? DUMMY_SEE_OFFER_DETAIL.company.name;
  const contactName = offer?.contactPerson ?? DUMMY_SEE_OFFER_DETAIL.contactPerson.name;
  const email = offer?.email ?? DUMMY_SEE_OFFER_DETAIL.contactPerson.email;
  const mobile = offer?.mobile ?? DUMMY_SEE_OFFER_DETAIL.contactPerson.mobil;

  return {
    ...DUMMY_SEE_OFFER_DETAIL,
    id: offerId ?? DUMMY_SEE_OFFER_DETAIL.id,
    projectId: projectId ?? DUMMY_SEE_OFFER_DETAIL.projectId,
    title,
    refNr,
    postedDate,
    municipality,
    totalOffert,
    statusBadge: offer?.status === "accepted" ? "Godkänd" : offer?.status === "deny" ? "Nekad" : "Väntande",
    company: {
      ...DUMMY_SEE_OFFER_DETAIL.company,
      name: companyName,
      email,
      telefon: mobile,
    },
    contactPerson: {
      ...DUMMY_SEE_OFFER_DETAIL.contactPerson,
      name: contactName,
      email,
      mobil: mobile,
    },
    offert: {
      ...DUMMY_SEE_OFFER_DETAIL.offert,
      totalOffert,
    },
  };
}
