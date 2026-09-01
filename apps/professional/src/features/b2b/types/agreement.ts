import { z } from "zod";

export interface B2BAgreementProjectInfo {
  projektNamn: string;
  projektNummer: string;
  offertNr: string;
  adress: string;
  kontraktTyp: string;
  kund: string;
  pris: number;
  totalOffert: number;
  startDatum: string;
  slutDatum: string;
  postedDate: string;
  city: string;
  municipality: string;
  refNr: string;
}

export interface B2BAgreementClient {
  kund: string;
  kontaktPerson: string;
  orgNr: string;
  telefon: string;
  personNummer: string;
  email: string;
  adress: string;
  postNr?: string;
  ort?: string;
  fornamn?: string;
  efternamn?: string;
  roll?: string;
}

export interface B2BAgreementSupplier {
  foretag: string;
  firmatecknare: string;
  orgNr: string;
  personNummer: string;
  telefon: string;
  email: string;
  adress: string;
}

export interface B2BAgreementDocItem {
  id: string;
  datum?: string;
  namn?: string;
  label: string;
  type: "pdf" | "doc" | "other";
  url?: string;
}

export interface B2BAgreementSignatureParty {
  foretagsNamn: string;
  namn: string;
  mail: string;
  mobil: string;
}

export interface B2BAgreementSignature {
  bestallare: B2BAgreementSignatureParty;
  entreprenor: B2BAgreementSignatureParty;
}

export interface B2BAgreementDetail {
  id: string;
  projectInfo: B2BAgreementProjectInfo;
  client: B2BAgreementClient;
  supplier: B2BAgreementSupplier;
  documents: {
    attachedDocs: string[];
    templates: B2BAgreementDocItem[];
    uploaded: B2BAgreementDocItem[];
  };
  signature: B2BAgreementSignature;
}

export interface B2BCreateAgreementPayload {
  projectId?: string;
  projectInfo: B2BAgreementProjectInfo;
  client: B2BAgreementClient;
  supplier: B2BAgreementSupplier;
  attachedDocs: string[];
  signature: B2BAgreementSignature;
}

export const b2bSignaturePartyValidationSchema = z.object({
  foretagsNamn: z.string().trim().min(1, "Företagsnamn är obligatoriskt"),
  namn: z.string().trim().min(1, "Namn är obligatoriskt"),
  mail: z.string().trim().email("Ogiltig e-postadress"),
  mobil: z.string().trim().min(5, "Ogiltigt telefonnummer"),
});

export const b2bCreateAgreementValidationSchema = z.object({
  client: z.object({
    kund: z.string().trim().min(1, "Kund är obligatorisk"),
    kontaktPerson: z.string().optional(),
    email: z.string().trim().email("Ogiltig e-postadress").or(z.literal("")),
    telefon: z.string().optional(),
    orgNr: z.string().optional(),
    adress: z.string().optional(),
  }),
  signature: z.object({
    bestallare: b2bSignaturePartyValidationSchema,
    entreprenor: b2bSignaturePartyValidationSchema,
  }),
});

