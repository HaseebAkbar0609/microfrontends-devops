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
  const cleanProjectId =
    projectId?.replace(/^AGR-/, "").replace(/^PRJ-?/, "").replace(/^PRJ00/, "").replace(/^PRJ0/, "") ||
    projectId;

  const project =
    DUMMY_PROJECTS.find(
      (p) =>
        p.id === projectId ||
        p.id === cleanProjectId ||
        p.refNr.toLowerCase() === projectId?.toLowerCase() ||
        p.refNr.toLowerCase() === cleanProjectId?.toLowerCase()
    ) ||
    (!isNaN(Number(cleanProjectId)) && DUMMY_PROJECTS[Number(cleanProjectId) - 1]) ||
    DUMMY_PROJECTS[0];

  const offer =
    DUMMY_PROJECT_DETAIL.offers.find((o) => o.id === offerId) ||
    DUMMY_PROJECT_DETAIL.offers.find((o) => o.id === cleanProjectId) ||
    DUMMY_PROJECT_DETAIL.offers[0];

  const title = project?.project || "Köksrenoveringsjobb";
  const refNr = project?.refNr || "PRJ001";
  const municipality = project?.municipality || "Järfälla";
  const postedDate = project?.date || "2024-05-10";
  const totalOffert =
    offer?.offerAmount ?? (project?.lowestOffer || DUMMY_SEE_OFFER_DETAIL.totalOffert);

  const companyName = offer?.company || "Nesse bygg AB";
  const contactName = offer?.contactPerson || "Anna Andersson";
  const email = offer?.email || "anna@example.com";
  const mobile = offer?.mobile || "076000000";

  return {
    ...DUMMY_SEE_OFFER_DETAIL,
    id: offerId || "1",
    projectId: project.id,
    title,
    refNr,
    postedDate,
    municipality,
    totalOffert,
    statusBadge:
      offer?.status === "accepted"
        ? "Godkänd"
        : offer?.status === "deny"
        ? "Nekad"
        : "Väntande",
    company: {
      ...DUMMY_SEE_OFFER_DETAIL.company,
      id: offerId || "1",
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
    documents: {
      images: [
        { id: "img-1", label: `${title} - Foto 1.jpg` },
        { id: "img-2", label: `${title} - Foto 2.jpg` },
        { id: "img-3", label: `${title} - Översikt.jpg` },
      ],
      docs: [
        { id: "doc-1", label: `Offert - ${title}.pdf`, type: "pdf" },
        { id: "doc-2", label: `Specifikation - ${refNr}.doc`, type: "doc" },
        { id: "doc-3", label: `Villkor - ${companyName}.pdf`, type: "pdf" },
      ],
      drawings: [
        { id: "drw-1", label: `Ritning - ${refNr}.pdf`, type: "pdf" },
        { id: "drw-2", label: `Planritning - ${title}.pdf`, type: "pdf" },
      ],
    },
  };
}
