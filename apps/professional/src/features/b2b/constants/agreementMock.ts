import { B2BAgreementDetail } from "../types/agreement";
import { getMockSeeOfferDetail } from "./seeOfferMock";

export const DUMMY_AGREEMENT_DETAIL: B2BAgreementDetail = {
  id: "AGR-2025-001",
  projectInfo: {
    projektNamn: "Köksrenoveringsjobb",
    projektNummer: "PRJ092",
    offertNr: "OF2025-001",
    adress: "Sveavägen 34, lgh 204, 11350 Stockholm, Sverige",
    kontraktTyp: "ABT92 (AB06),",
    kund: "Anna Andersson",
    pris: 550000,
    totalOffert: 1586000,
    startDatum: "23-10-2024",
    slutDatum: "23-02-2025",
    postedDate: "18-12-2024",
    city: "Stockholm",
    municipality: "Järfälla",
    refNr: "PRJ092",
  },
  client: {
    kund: "Fastighetsbolaget AB",
    kontaktPerson: "Kalle Andersson",
    fornamn: "Fastighetsbolaget AB",
    efternamn: "Name",
    orgNr: "1974-05-05-1010",
    telefon: "076-000000",
    personNummer: "19710505-1010",
    email: "jsson@example.com",
    adress: "Sveavägen 34, lgh 204, 11350 Stockholm, Sverige",
    postNr: "12345432",
    ort: "Info",
    roll: "Beställare",
  },
  supplier: {
    foretag: "Byggbolaget AB",
    firmatecknare: "Stefan Svensson",
    orgNr: "551010-5050",
    personNummer: "19710505-1010",
    telefon: "076-000000",
    email: "jsson@example.com",
    adress: "Sveavägen 34, lgh 204, 11350 Stockholm, Sverige",
  },
  documents: {
    attachedDocs: ["Document 1", "Document 2"],
    templates: [
      { id: "tmpl-1", label: "Document 1.pdf", type: "pdf", datum: "2024-06-10", namn: "Dokumentets namn" },
      { id: "tmpl-2", label: "Document 2.doc", type: "doc", datum: "2024-06-10", namn: "Dokumentets namn" },
    ],
    uploaded: [
      { id: "up-1", label: "Kontrakt.pdf", type: "pdf", datum: "2024-06-10", namn: "Dokumentets namn" },
      { id: "up-2", label: "Kontrakt.pdf", type: "doc", datum: "2024-06-10", namn: "Dokumentets namn" },
    ],
  },
  signature: {
    bestallare: {
      foretagsNamn: "Byggbolaget AB",
      namn: "Stefan Larsson",
      mail: "stefan@gmail.com",
      mobil: "072 563 76 98",
    },
    entreprenor: {
      foretagsNamn: "Byggbolaget",
      namn: "Kalle Andersson",
      mail: "kalle@gmail.com",
      mobil: "070 458 83 83",
    },
  },
};

export const B2B_MOCK_CLIENTS: B2BAgreementDetail["client"][] = [
  {
    kund: "Fastighetsbolaget AB",
    kontaktPerson: "Kalle Andersson",
    fornamn: "Kalle",
    efternamn: "Andersson",
    orgNr: "1974-05-05-1010",
    telefon: "076-000000",
    personNummer: "19710505-1010",
    email: "kalle.andersson@fastighetsbolaget.se",
    adress: "Sveavägen 34, lgh 204, 11350 Stockholm, Sverige",
    postNr: "11350",
    ort: "Stockholm",
    roll: "Beställare",
  },
  {
    kund: "Stockholm Bygg & Renovering AB",
    kontaktPerson: "Erik Johansson",
    fornamn: "Erik",
    efternamn: "Johansson",
    orgNr: "556789-1234",
    personNummer: "19750315-5678",
    telefon: "070-987654",
    email: "erik@sthlmbygg.se",
    adress: "Kungsgatan 12, 11135 Stockholm, Sverige",
    postNr: "11135",
    ort: "Stockholm",
    roll: "Fastighetsförvaltare",
  },
  {
    kund: "Nordic Construction HB",
    kontaktPerson: "Maria Lindqvist",
    fornamn: "Maria",
    efternamn: "Lindqvist",
    orgNr: "559876-5432",
    personNummer: "19881120-4321",
    telefon: "073-456789",
    email: "maria@nordicconstruction.se",
    adress: "Hamngatan 8, 11147 Stockholm, Sverige",
    postNr: "11147",
    ort: "Stockholm",
    roll: "Inköpschef",
  },
  {
    kund: "Byggbolaget AB",
    kontaktPerson: "Stefan Svensson",
    fornamn: "Stefan",
    efternamn: "Svensson",
    orgNr: "551010-5050",
    personNummer: "19710505-1010",
    telefon: "076-123456",
    email: "stefan@byggbolaget.se",
    adress: "Drottninggatan 45, 11151 Stockholm, Sverige",
    postNr: "11151",
    ort: "Stockholm",
    roll: "Projektledare",
  },
];

export const B2B_AVAILABLE_TEMPLATES = [
  { id: "tmpl-1", label: "Document 1.pdf", type: "pdf" as const, namn: "Standardavtal ABT 06" },
  { id: "tmpl-2", label: "Document 2.doc", type: "doc" as const, namn: "Underentreprenad Mall" },
  { id: "tmpl-3", label: "Kvalitetsplan.pdf", type: "pdf" as const, namn: "Kvalitetskontroll Mall" },
];

export const B2B_STANDARD_ATTACHMENTS = [
  "Document 1",
  "Document 2",
  "Allmänna bestämmelser ABT 06",
  "Miljö- och arbetsmiljöplan",
  "Kvalitetsplan & Kontrollprogram",
  "Tidplan & Leveransvillkor",
  "Ritningsförteckning",
  "ÄTA-rutin och prislista",
];

export function getAgreementDetailByContext(
  projectId?: string,
  offerId?: string
): B2BAgreementDetail {
  if (projectId || offerId) {
    const offer = getMockSeeOfferDetail(projectId, offerId);
    const firstName = offer.contactPerson?.name?.split(" ")[0] || "Anna";
    const lastName = offer.contactPerson?.name?.split(" ").slice(1).join(" ") || "Andersson";

    const offerDocs = (offer.documents?.docs || []).map((d, i) => ({
      id: d.id || `doc-${i + 1}`,
      label: d.label || `Offert - ${offer.title}.pdf`,
      type: d.type === "doc" ? ("doc" as const) : ("pdf" as const),
      datum: offer.postedDate || "2024-06-10",
      namn: d.label.replace(/\.[^/.]+$/, "") || "Offertdokument",
    }));

    const offerDrawings = (offer.documents?.drawings || []).map((d, i) => ({
      id: d.id || `drw-${i + 1}`,
      label: d.label || `Ritning - ${offer.refNr}.pdf`,
      type: d.type === "doc" ? ("doc" as const) : ("pdf" as const),
      datum: offer.postedDate || "2024-06-10",
      namn: d.label.replace(/\.[^/.]+$/, "") || "Ritning",
    }));

    const allProjectDocs = [...offerDocs, ...offerDrawings];
    const uploadedDocs =
      allProjectDocs.length > 0
        ? allProjectDocs
        : [
            {
              id: "up-1",
              label: `Offert - ${offer.title || "Kontrakt"}.pdf`,
              type: "pdf" as const,
              datum: offer.postedDate || "2024-06-10",
              namn: "Offert & Avtalsvillkor",
            },
            {
              id: "up-2",
              label: `Specifikation - ${offer.refNr || "PRJ092"}.doc`,
              type: "doc" as const,
              datum: offer.postedDate || "2024-06-10",
              namn: "Projektunderlag & Ritning",
            },
          ];

    return {
      id: `AGR-${offer.refNr || "2025-001"}`,
      projectInfo: {
        projektNamn: offer.title || "Köksrenoveringsjobb",
        projektNummer: offer.refNr || "PRJ092",
        offertNr: `OF-${offer.refNr || "2025-001"}`,
        adress: offer.company?.adress || "Storgatan 16, 18880 Stockholm.",
        kontraktTyp: "ABT92 (AB06),",
        kund: offer.company?.name || "Nesse bygg AB",
        pris: offer.totalOffert || 1586000,
        totalOffert: offer.totalOffert || 1586000,
        startDatum: "23-10-2024",
        slutDatum: "23-02-2025",
        postedDate: offer.postedDate || "18-12-2024",
        city: offer.city || "Stockholm",
        municipality: offer.municipality || "Järfälla",
        refNr: offer.refNr || "PRJ092",
      },
      client: {
        kund: offer.company?.name || "Nesse bygg AB",
        kontaktPerson: offer.contactPerson?.name || "Anna Andersson",
        fornamn: firstName,
        efternamn: lastName,
        orgNr: offer.company?.orgNr || "556310-1010",
        telefon: offer.contactPerson?.mobil || offer.company?.telefon || "076000000",
        personNummer: "1974-05-05-1010",
        email: offer.contactPerson?.email || offer.company?.email || "anna@example.com",
        adress: offer.company?.adress || "Storgatan 16, 18880 Stockholm.",
        postNr: "18880",
        ort: offer.city || "Stockholm",
        roll: "Beställare",
      },
      supplier: {
        foretag: "Byggbolaget AB",
        firmatecknare: "Stefan Svensson",
        orgNr: "551010-5050",
        personNummer: "19710505-1010",
        telefon: "076-000000",
        email: "jsson@example.com",
        adress: "Sveavägen 34, lgh 204, 11350 Stockholm, Sverige",
      },
      documents: {
        attachedDocs: uploadedDocs.map((d) => d.label),
        templates: [
          { id: "tmpl-1", label: "Document 1.pdf", type: "pdf", datum: offer.postedDate || "2024-06-10", namn: "Standardavtal Mall" },
          { id: "tmpl-2", label: "Document 2.doc", type: "doc", datum: offer.postedDate || "2024-06-10", namn: "ÄTA-rutin Mall" },
        ],
        uploaded: uploadedDocs,
      },
      signature: {
        bestallare: {
          foretagsNamn: offer.company?.name || "Nesse bygg AB",
          namn: offer.contactPerson?.name || "Anna Andersson",
          mail: offer.contactPerson?.email || "anna@example.com",
          mobil: offer.contactPerson?.mobil || offer.company?.telefon || "076000000",
        },
        entreprenor: {
          foretagsNamn: "Byggbolaget",
          namn: "Stefan Larsson",
          mail: "stefan@gmail.com",
          mobil: "072 563 76 98",
        },
      },
    };
  }

  return DUMMY_AGREEMENT_DETAIL;
}

