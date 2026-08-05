export type ProjectMarketStatus = "contract_signed" | "waiting" | "open" | "closing_soon";
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
  badge?: string;
  replyFrom?: string;
  message: string;
  date: string;
  status: QAStatus;
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
    images: { id: string; label: string }[];
    docs: { id: string; label: string; type: string }[];
    drawings: { id: string; label: string; type: string }[];
  };
  qa: QAMessage[];
};
