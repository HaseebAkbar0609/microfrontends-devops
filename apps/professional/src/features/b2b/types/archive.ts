export type B2BArchiveTyp = "B2B-Hyra UT" | "B2B-Offert" | "B2B-Hyra IN";

export type B2BArchiveItem = {
  id: string;
  refNr: string;
  projekt: string;
  datum: string;
  typ: B2BArchiveTyp;
  forfragningar: string;
  kommun: string;
  lagstOffert: number;
};

export type B2BArchiveQAMessage = {
  id: string;
  sender: string;
  role: string;
  badge?: string;
  replyFrom?: string;
  message: string;
  date: string;
};

export type B2BArchiveOfferDetail = {
  id: string;
  title: string;
  refNr: string;
  postedDate: string;
  city: string;
  municipality: string;
  totalOffert: number;
  statusBadge: string;
  company: {
    name: string;
    email: string;
    telefon: string;
    adress: string;
    orgNr: string;
  };
  contactPerson: {
    name: string;
    email: string;
    mobil: string;
  };
  offert: {
    arbete: string;
    material: string;
    totalOffert: number;
    betalningsvillkor: string;
  };
  documents: {
    images: { id: string; label: string }[];
    docs: { id: string; label: string; type: string }[];
    drawings: { id: string; label: string; type: string }[];
  };
  qa: B2BArchiveQAMessage[];
};
