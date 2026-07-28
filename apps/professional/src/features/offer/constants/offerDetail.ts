import { OfferDetailData } from "../types";

export const OFFER_STATUSES = ["request", "quoted", "accepted", "agreed", "archived"] as const;
export type OfferStatus = (typeof OFFER_STATUSES)[number];

const BASE_DETAIL = {
  postedDate: "18-12-2024",
  locations: ["Stockholm", "Järfälla"],
  images: [
    { id: "img-1", label: "Photo.img" },
    { id: "img-2", label: "Photo.img" },
    { id: "img-3", label: "Photo.img" },
  ],
  extraImagesCount: 6,
  documents: [
    { id: "doc-1", label: "Form Template #1.doc" },
    { id: "doc-2", label: "Form Template #1.doc" },
    { id: "doc-3", label: "project.pdf" },
  ],
  drawings: [
    { id: "drawing-1", label: "project.pdf" },
    { id: "drawing-2", label: "image.1" },
    { id: "drawing-3", label: "image.1" },
    { id: "drawing-4", label: "image.1" },
  ],
  description:
    "The company requires proven experience in kitchen renovation or interior design. A keen eye for design trends and a passion for creating stylish and functional spaces.",
};

const DUMMY_OFFER_DETAILS: Record<string, OfferDetailData> = {
  "1001": { ...BASE_DETAIL, id: "1001", titleKey: "Bathroom Renovation Job", type: "B2C", isExpress: false },
  "1002": { ...BASE_DETAIL, id: "1002", titleKey: "Kitchen Renovation Job", type: "Express", isExpress: true },
  "1003": { ...BASE_DETAIL, id: "1003", titleKey: "Office Space Rental", type: "Rent", isExpress: false },
  "1004": { ...BASE_DETAIL, id: "1004", titleKey: "Roof Repair Job", type: "B2C", isExpress: false },
  "1005": { ...BASE_DETAIL, id: "1005", titleKey: "Facade Renovation", type: "Rent", isExpress: false },
};

export const DUMMY_OFFER_DETAIL = DUMMY_OFFER_DETAILS["1002"];

export function getDummyOfferDetail(id: string): OfferDetailData {
  return DUMMY_OFFER_DETAILS[id] ?? DUMMY_OFFER_DETAIL;
}
