import { B2BSeeOfferDetail } from "../types/seeOffer";

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
