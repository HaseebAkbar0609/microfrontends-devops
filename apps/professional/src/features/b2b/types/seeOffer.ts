export type B2BDocumentType = "pdf" | "doc" | "other";

export interface B2BOfferDocumentItem {
  id: string;
  label: string;
  type?: B2BDocumentType;
  url?: string;
}

export interface B2BOfferImageItem {
  id: string;
  label: string;
  url?: string;
}

export interface B2BOfferQAMessage {
  id: string;
  sender: string;
  role: string;
  badge?: "UE" | "Fråga" | "Beställare" | string;
  company?: string;
  replyFrom?: string;
  replyText?: string;
  message: string;
  date: string;
  avatar?: string;
  status?: "new" | "opened" | "answered" | string;
  answerUser?: string;
  answerText?: string;
  answerDate?: string;
}

export interface B2BCompanyInfo {
  id: string;
  name: string;
  email: string;
  telefon: string;
  adress: string;
  orgNr: string;
}

export interface B2BContactPerson {
  name: string;
  email: string;
  mobil: string;
}

export interface B2BOffertBreakdown {
  arbete: string;
  material: string;
  totalOffert: number;
  betalningsvillkor: string;
}

export interface B2BSeeOfferDetail {
  id: string;
  projectId?: string;
  title: string;
  refNr: string;
  postedDate: string;
  city: string;
  municipality: string;
  totalOffert: number;
  statusBadge?: string;
  company: B2BCompanyInfo;
  contactPerson: B2BContactPerson;
  offert: B2BOffertBreakdown;
  documents: {
    images: B2BOfferImageItem[];
    docs: B2BOfferDocumentItem[];
    drawings: B2BOfferDocumentItem[];
  };
  qa: B2BOfferQAMessage[];
}
