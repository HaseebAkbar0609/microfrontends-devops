export type AvtalStatus = "draft" | "sent" | "signed" | "rejected";
export type AvtalKontraktTyp = "ABT06" | "AB04" | "ABT92 (AB06)" | "ABK09";

export type AvtalDocument = {
  id: string;
  datum: string;
  namn: string;
  fil: string;
  type: "pdf" | "doc";
};

export type ContractHandlerType = "self" | "company" | "other";

export type ContractHandlerInfo = {
  handlerType: ContractHandlerType;
  contactPerson: string;
  email: string;
  phone?: string;
  notes?: string;
};

export type AvtalUnderskrift = {
  foretagsNamn: string;
  namn: string;
  mail: string;
  mobil: string;
};

export type AvtalDetail = {
  id: string;
  refNr: string;
  projektNamn: string;
  projektNummer: string;
  offertNr: string;
  adress: string;
  kontraktTyp: AvtalKontraktTyp;
  postedDate: string;
  city: string;
  municipality: string;
  pris: number;
  startDatum: string;
  slutDatum: string;
  status: AvtalStatus;
  handlerInfo?: ContractHandlerInfo;
  kunduppgifter: {
    kund: string;
    adress: string;
    postNr: string;
    ort: string;
    mail: string;
    telefon: string;
    orgNr: string;
  };
  kontaktperson: {
    fornamn: string;
    efternamn: string;
    mail: string;
    mobil: string;
    roll: string;
  };
  leverantor: {
    foretag: string;
    firmatecknare: string;
    orgNr: string;
    personNummer: string;
    telefon: string;
    email: string;
    adress: string;
  };
  documents: AvtalDocument[];
  underskrift: {
    bestellare: AvtalUnderskrift;
    entreprenor: AvtalUnderskrift;
  };
};

export type AvtalListItem = {
  id: string;
  refNr: string;
  projektNamn: string;
  status: AvtalStatus;
  kund: string;
  datum: string;
  kontraktTyp: AvtalKontraktTyp;
  pris: number;
};
