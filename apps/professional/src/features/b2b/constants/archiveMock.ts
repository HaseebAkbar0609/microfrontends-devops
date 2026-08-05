import { B2BArchiveItem, B2BArchiveOfferDetail } from "../types/archive";

export const DUMMY_ARCHIVE_ITEMS: B2BArchiveItem[] = [
  { id: "1", refNr: "PRJ001", projekt: "Köksrenoveringsjobb", datum: "2024-05-10", typ: "B2B-Hyra UT", forfragningar: "0/10", kommun: "Järfälla", lagstOffert: 159000 },
  { id: "2", refNr: "PRJ001", projekt: "Målare", datum: "2024-05-10", typ: "B2B-Offert", forfragningar: "2/10", kommun: "Järfälla", lagstOffert: 256000 },
  { id: "3", refNr: "PRJ001", projekt: "Köksrenoveringsjobb", datum: "2024-05-10", typ: "B2B-Hyra IN", forfragningar: "4/10", kommun: "Järfälla", lagstOffert: 78500 },
  { id: "4", refNr: "PRJ001", projekt: "Målare", datum: "2024-05-10", typ: "B2B-Hyra IN", forfragningar: "3/10", kommun: "Järfälla", lagstOffert: 145000 },
  { id: "5", refNr: "PRJ001", projekt: "Kök Reno Job", datum: "2024-05-10", typ: "B2B-Hyra UT", forfragningar: "5/10", kommun: "Järfälla", lagstOffert: 125000 },
  { id: "6", refNr: "PRJ001", projekt: "Målare", datum: "2024-05-10", typ: "B2B-Hyra IN", forfragningar: "8/10", kommun: "Järfälla", lagstOffert: 54000 },
];

export const DUMMY_ARCHIVE_OFFER_DETAIL: B2BArchiveOfferDetail = {
  id: "1",
  title: "Köksrenoveringsjobb",
  refNr: "PRJ-50",
  postedDate: "18-10-2024",
  city: "Stockholm",
  municipality: "JärVäla",
  totalOffert: 1589000,
  statusBadge: "Bokfört",
  company: {
    name: "Nysse Bygg AB",
    email: "per@example.test",
    telefon: "0700000000",
    adress: "Storgatan 19, 19880 Stockholm",
    orgNr: "556310-1010",
  },
  contactPerson: {
    name: "Anna Andersson",
    email: "anna@example.test",
    mobil: "0700000100",
  },
  offert: {
    arbete: "Total kostnad för construction, inklusive material och arbete",
    material: "Material",
    totalOffert: 1586500,
    betalningsvillkor: "Ange specifikationer",
  },
  documents: {
    images: [
      { id: "img-1", label: "Foto.jpg" },
      { id: "img-2", label: "Foto.jpg" },
      { id: "img-3", label: "Foto.jpg" },
    ],
    docs: [
      { id: "doc-1", label: "Offert1.doc", type: "doc" },
      { id: "doc-2", label: "Offert2.doc", type: "doc" },
      { id: "doc-3", label: "Utser.pdf", type: "pdf" },
    ],
    drawings: [
      { id: "drw-1", label: "projekt.pdf", type: "pdf" },
      { id: "drw-2", label: "rit1", type: "other" },
      { id: "drw-3", label: "rit2", type: "other" },
      { id: "drw-4", label: "rit3", type: "other" },
    ],
  },
  qa: [
    {
      id: "qa-1",
      sender: "Kalle Svensson",
      role: "Pelles Måleri AB",
      badge: "UE",
      replyFrom: "Stefan Eriksson",
      message: "Hej, undrar om ni söldrar besr korrektorsam",
      date: "2 aug",
    },
    {
      id: "qa-2",
      sender: "Kalle Svensson",
      role: "Pelles Måleri AB",
      badge: "Fråga",
      message: "Hej, undrar om ni söldrar det hör koordinera",
      date: "3 aug",
    },
  ],
};
