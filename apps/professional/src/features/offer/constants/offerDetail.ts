import { OfferDetailData } from "../types";

export const DUMMY_OFFER_DETAIL: OfferDetailData = {
  id: "1",
  postedDate: "18-12-2024",
  titleKey: "Kitchen Renovation Job",
  type: "Express",
  isExpress: true,
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
