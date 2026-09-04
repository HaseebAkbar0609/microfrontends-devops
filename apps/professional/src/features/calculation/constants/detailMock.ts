import type { KalkylDetailData } from "../types/kalkyl";

export const DUMMY_KALKYL_DETAIL: KalkylDetailData = {
  calcNo: "Kalkyl 3001",
  // Kunduppgifter (Bestellare)
  bestellareForetag: "Fastighetsbolaget AB",
  bestellareAddress: "Storgatan 16",
  bestellarePostNr: "12345432",
  bestellareOrt: "Stockholm",
  bestellareMail: "contact@example.test",
  bestellareTelefon: "",
  bestellareOrgNr: "",
  // Kontaktperson
  kontaktFornamn: "Anna",
  kontaktEfternamn: "Svensson",
  kontaktAddress: "Storgatan 16",
  kontaktPostnummer: "000 7961 248",
  kontaktMail: "anna@example.test",
  kontaktMobil: "000 7961 248",
  kontaktRoll: "",
  kontaktOrt: "Stockholm",
  // Kunduppgifter (Entreprenör)
  entreprenorForetag: "Fastighetsbolaget AB",
  entreprenorAddress: "Ange adressen",
  entreprenorPostNr: "12345432",
  entreprenorOrt: "Info",
  entreprenorMail: "contact@example.test",
  entreprenorTelefon: "",
  entreprenorOrgNr: "",
  // Kalkylansvarig
  kalkylFornamn: "Fastighetsbolaget AB",
  kalkylEfternamn: "Name",
  kalkylMail: "anna@example.test",
  kalkylMobil: "000 7961 248",
  kalkylRoll: "000 7961 248",
  // Projekt
  projekteringNr: "ORD-0002",
  projekteringNamn: "Renovation",
  kvartersNamn: "",
  projekteringAdress: "Storgatan 16, 18880 Stockholm.",
  postNr: "000892",
  ort: "",
  // Projekt Information
  type: "",
  kategori: "",
  avdelning: "",
  kontraktsumma: "",
  offertNr: "",
  startDatum: "12/10/2025",
  slutDatum: "12/10/2025",
  senatsDatumOffert: "12/10/2025",
  // Dokument
  documents: [
    {
      id: "doc-1",
      datum: "2024-04-10",
      namn: "Taxakeeper1",
      typ: "A500-10",
      fileType: "pdf",
    },
    {
      id: "doc-2",
      datum: "2024-05-30",
      namn: "Namnexepel1",
      typ: "A600-1",
      fileType: "pdf",
    },
  ],
};
