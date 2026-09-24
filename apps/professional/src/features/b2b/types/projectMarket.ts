export type ProjectMarketStatus =
  | "contract_signed"
  | "waiting"
  | "open"
  | "closing_soon"
  | "declined"
  | "archived";
export type OfferStatus = "accepted" | "deny" | "waiting";
export type QAStatus = "new" | "opened" | "answered";

export type ProjectMarket = {
  id: string;
  refNr: string;
  project: string;
  date: string;
  type: string;
  requests: number;
  municipality: string;
  lowestOffer: number;
  status: ProjectMarketStatus;
};

export type ProjectMarketOffer = {
  id: string;
  company: string;
  date: string;
  contactPerson: string;
  mobile: string;
  email: string;
  status: OfferStatus;
  offerAmount: number;
};

export type QAMessage = {
  id: string;
  sender: string;
  role: string;
  /** True when the viewer's own company asked it. Other companies stay anonymous. */
  ownCompany?: boolean;
  company?: string;
  badge?: string;
  replyFrom?: string;
  replyText?: string;
  answerUser?: string;
  answerBadge?: string;
  answerRole?: string;
  answerDate?: string;
  answerText?: string;
  message: string;
  date: string;
  status: QAStatus;
  avatar?: string;
};

/** A project file. `type` is its MIME type; `url` a short-lived signed link. */
export type ProjectDocument = {
  id: string;
  label: string;
  type: string;
  url: string;
};

export type ProjectMarketDetail = {
  id: string;
  refNr: string;
  title: string;
  latestOfferDate: string;
  type: string;
  municipality: string;
  city: string;
  lowestOfferCompany: string;
  lowestOfferValue: number;
  contractCount: number;
  offers: ProjectMarketOffer[];
  customerInfo: {
    companyName: string;
    email: string;
    phone: string;
    address: string;
    contactPerson: string;
    postalAddress: string;
  };
  projectInfo: {
    projectName: string;
    projectNr: string;
    offerPlace: string;
    clientName: string;
    startDate: string;
    endDate: string;
    address: string;
  };
  documents: {
    images: ProjectDocument[];
    docs: ProjectDocument[];
    drawings: ProjectDocument[];
  };
  qa: QAMessage[];
};
