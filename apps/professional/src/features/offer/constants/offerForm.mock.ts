import type { OfferFormData } from "../types";

const DUMMY_CUSTOMER = {
  name: "Anna Andersson",
  email: "anna@example.com",
  phone: "076000000",
  address: "Storgatan 16, 18880 Stockholm",
};

const DUMMY_COMPANY = {
  name: "Nesse Bygg AB",
  email: "per@nessebygg.com",
  orgNumber: "7060070-0000 - Nesse",
  phone: "76000000",
  address: "Storgatan 23, 18877 Stockholm",
};

const DUMMY_BADGES = ["Express jobb", "Stockholm", "Järfälla"];

export const DUMMY_OFFER_FORMS: Record<string, OfferFormData> = {
  rent: {
    offerId: "1001",
    type: "rent",
    title: "B2B - HYRA UT / IN",
    badges: DUMMY_BADGES,
    customer: DUMMY_CUSTOMER,
    company: DUMMY_COMPANY,
  },
  express: {
    offerId: "1002",
    type: "express",
    title: "EXPRESS",
    badges: DUMMY_BADGES,
    customer: DUMMY_CUSTOMER,
    company: DUMMY_COMPANY,
  },
  b2c: {
    offerId: "1003",
    type: "b2c",
    title: "Ladda ner Offert - mallar +",
    badges: DUMMY_BADGES,
    customer: DUMMY_CUSTOMER,
    company: DUMMY_COMPANY,
  },
};

export const DUMMY_ASSIGNEES = [
  { id: "1", name: "Sadie Carr", initials: "SC" },
  { id: "2", name: "Bruno Harut", initials: "BH" },
  { id: "3", name: "Eva Vendas", initials: "EV" },
  { id: "4", name: "Nacho Mejors", initials: "NM" },
  { id: "5", name: "Omar Birdie", initials: "OB" },
];

export const DUMMY_TEMPLATE_DOCS = [
  { id: "doc-1", label: "Document 1.pdf" },
  { id: "doc-2", label: "Document 2.doc" },
];

export const DUMMY_REQUIRED_DOCS = [
  { id: "req-1", label: "Document 1" },
  { id: "req-3", label: "Document 3" },
];
