export type JobRef = { id?: string; type?: string };

export type BusinessExpressModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote?: JobRef | null;
  onConfirm?: (quote?: JobRef | null) => void;
};

export type BusinessOfferModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote?: JobRef | null;
  onConfirm?: (quote?: JobRef | null) => void;
};

export type BusinessRentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote?: JobRef | null;
  onConfirm?: (quote?: JobRef | null) => void;
};

export type OfferConfirmationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
};

export interface OfferList {
  id: string;
  idNumber: string;
  jobName: string;
  date: string;
  type: string;
  request: string;
  municipality: string;
  category: string;
  isFavorite?: boolean;
}

export interface OfferListColumn {
  label: string;
  field: string;
}

export type OfferSendCustomer = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type OfferSendImage = {
  id: string;
  label: string;
};

export type OfferSendFile = {
  id: string;
  label: string;
};

export type OfferSendData = {
  id: string;
  title: string;
  postedDate: string;
  type: string;
  badges: string[];
  customer: OfferSendCustomer;
  description: string;
  images: OfferSendImage[];
  extraImagesCount: number;
  documents: OfferSendFile[];
  drawings: OfferSendFile[];
  preliminaryBudgetPrice: string;
  offerDateLatest: string;
};

export type OfferSendCustomerDetailsProps = {
  customer: OfferSendCustomer;
};

export type OfferSendDocumentsAndImagesProps = {
  data: Pick<
    OfferSendData,
    "images" | "extraImagesCount" | "documents" | "drawings"
  >;
};

export interface OfferListTableProps {
  data: OfferList[];
  totalItems: number;
}

export type OfferSendConfirmationPanelProps = {
  data: Pick<OfferSendData, "id" | "type" | "preliminaryBudgetPrice" | "offerDateLatest">;
};

export type OfferFormType = "rent" | "express" | "b2c";

export type OfferQuotedStatus = "notReviewed" | "opened";

export type OfferQuotedContactPerson = {
  name: string;
  phone: string;
  email: string;
};

export type OfferQuotedItem = {
  id: string;
  offertNr: string;
  job: string;
  customerName: string;
  category: string;
  municipality: string;
  type: string;
  price: number;
  status: OfferQuotedStatus;
  openedAt?: string;
  contactPerson: OfferQuotedContactPerson;
  customerAnswer?: string;
};

export type OfferAcceptedItem = {
  id: string;
  offertNr: string;
  job: string;
  customerName: string;
  category: string;
  municipality: string;
  acceptedPrice: number;
  type: string;
};

export type AgreementParty = {
  id: string;
  name: string;
  role: "customer" | "supplier";
  company?: string;
  companyOrPerson?: string;
  orgNumber?: string;
  personalNumber?: string;
  phone: string;
  email: string;
  address: string;
  contactPerson?: string;
  authorizedSignatory?: string;
};

export type AgreementData = {
  id: string;
  projectName: string;
  projectNumber: string;
  quoteNumber: string;
  address: string;
  contractType: string;
  customerName: string;
  price: number;
  startDate: string;
  endDate: string;
  parties: AgreementParty[];
  documents: string[];
  templates: string[];
};

export type OfferFormCompany = {
  name: string;
  email: string;
  orgNumber: string;
  phone: string;
  address: string;
};

export type OfferFormData = {
  offerId: string;
  type: OfferFormType;
  title: string;
  badges: string[];
  customer: OfferSendCustomer;
  company: OfferFormCompany;
};
