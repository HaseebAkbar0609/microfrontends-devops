import { OfferSendData } from "../types";

export const DUMMY_OFFER_SEND: OfferSendData = {
  id: "1",
  title: "Kitchen renovation job",
  postedDate: "12-18-2024",
  type: "Express",
  badges: ["Express job", "Stockholm", "Järfälla"],
  customer: {
    name: "Anna Andersson",
    email: "anna@example.com",
    phone: "076000000",
    address: "Storgatan 16, 18880 Stockholm.",
  },
  description:
    "The company needs proven experience in kitchen renovation or interior design.\nA keen eye for design trends and a passion for creating stylish and functional spaces.",
  images: [
    { id: "img-1", label: "Photo.img" },
    { id: "img-2", label: "Photo.img" },
    { id: "img-3", label: "Photo.img" },
  ],
  extraImagesCount: 6,
  documents: [
    { id: "doc-1", label: "Template #1.doc" },
    { id: "doc-2", label: "Template #1.doc" },
    { id: "doc-3", label: "project.pdf" },
  ],
  drawings: [
    { id: "drawing-1", label: "project.pdf" },
    { id: "drawing-2", label: "image.1" },
    { id: "drawing-3", label: "image.1" },
    { id: "drawing-4", label: "image.1" },
  ],
  preliminaryBudgetPrice: "550,000",
  offerDateLatest: "2025-04-15",
};
