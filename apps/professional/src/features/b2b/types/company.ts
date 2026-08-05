export type CompanyTeamMember = {
  id: string;
  name: string;
  role: string;
  roleColor: string;
  email: string;
  initials: string;
  avatarColor: string;
};

export type CompanyReference = {
  id: string;
  projekt: string;
  kund: string;
  kommun: string;
  kontakt: string;
  telefon: string;
  pdfLabel?: string;
};

export type CompanyReview = {
  id: string;
  reviewerName: string;
  rating: number;
  date: string;
  reviewText: string;
  companyReply?: {
    companyInitials: string;
    companyName: string;
    replyText: string;
    date: string;
  };
};

export type CompanyDetail = {
  id: string;
  namn: string;
  orgNr: string;
  vatNr: string;
  sniKod: string;
  adress: {
    postAdress: string;
    postNr: string;
    ort: string;
    besoksAdress: string;
    besoksPostNr: string;
    besoksOrt: string;
    leveransAdress: string;
    leveransPostNr: string;
    leveransOrt: string;
    vaxelNr: string;
    epost: string;
    hemsida: string;
  };
  fakturaEmail: string;
  kreditInput1?: string;
  kreditInput2?: string;
  presentationText: string;
  team: CompanyTeamMember[];
  presentationFiles: { id: string; label: string; type: string }[];
  references: CompanyReference[];
  reviews: CompanyReview[];
};
