import { createElement } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import localizationConstants from "@/utils/translation/constants";
import { SortLabel } from "@/features/leads/management/components/LeadDetailShared";
import type { TranslationKeys } from "@/utils/translation/constants";

export type ReviewCard = {
  id: string;
  name: string;
  textKey: TranslationKeys;
  memberSinceKey: TranslationKeys;
  avatar: string;
  rating: number;
};

export type ReferenceRow = {
  id: string;
  project: string;
  contactPerson: string;
  municipality: string;
  date: string;
  phone: string;
  fileType: "PDF" | "DOC" | "IMG";
};

export type ReferenceImageRow = {
  id: string;
  project: string;
  municipality: string;
  year: string;
  images: string[];
};

export const referenceReviewCards: ReviewCard[] = [
  {
    id: "review-1",
    name: "Kalle Andersson",
    textKey: localizationConstants.reviewHighlightText,
    memberSinceKey: localizationConstants.memberSinceJuly2024,
    avatar: "/images/review/reviewer2.png",
    rating: 5,
  },
  {
    id: "review-2",
    name: "Mika Rosberg",
    textKey: localizationConstants.reviewHighlightText,
    memberSinceKey: localizationConstants.memberSinceJuly2024,
    avatar: "/images/review/reviewer3.png",
    rating: 5,
  },
  {
    id: "review-3",
    name: "Sara Rosberg",
    textKey: localizationConstants.reviewHighlightText,
    memberSinceKey: localizationConstants.memberSinceJuly2024,
    avatar: "/images/review/reviewer1.png",
    rating: 5,
  },
];

export const referenceRows: ReferenceRow[] = [
  {
    id: "ref-1",
    project: "Apartments Bredangen",
    contactPerson: "Nisse Gran",
    municipality: "Stockholm",
    date: "2021-04-12",
    phone: "073122488",
    fileType: "PDF",
  },
];

export const referenceImageRows: ReferenceImageRow[] = [
  {
    id: "ref-img-1",
    project: "Bathroom Renovation",
    municipality: "Jarfalla",
    year: "2023",
    images: [
      "/images/review/reviewe-bg1.png",
      "/images/review/review-bg-2.png",
    ],
  },
  {
    id: "ref-img-2",
    project: "Kitchen Renovation",
    municipality: "Solna",
    year: "2024",
    images: [
      "/images/review/reviewer-bg-11.png",
      "/images/review/review-bg-21.png",
    ],
  },
  {
    id: "ref-img-3",
    project: "Extension",
    municipality: "Balsta",
    year: "2023",
    images: [
      "/images/review/review-bg-31.png",
      "/images/review/review-bg-3.png",
    ],
  },
];

export const getReferenceColumns = (
  t: (key: string) => string
): ColumnDef<ReferenceRow>[] => [
  {
    accessorKey: "project",
    header: () =>
      createElement(SortLabel, { label: t(localizationConstants.projectLabel) }),
  },
  {
    accessorKey: "contactPerson",
    header: () =>
      createElement(SortLabel, {
        label: t(localizationConstants.contactPersonLabel),
      }),
  },
  {
    accessorKey: "municipality",
    header: () =>
      createElement(SortLabel, {
        label: t(localizationConstants.municipalityLabel),
      }),
  },
  {
    accessorKey: "date",
    header: () =>
      createElement(SortLabel, { label: t(localizationConstants.dateLabel) }),
  },
  {
    accessorKey: "phone",
    header: () =>
      createElement(SortLabel, { label: t(localizationConstants.phoneLabel) }),
  },
  {
    accessorKey: "fileType",
    header: () => t(localizationConstants.fileLabel),
  },
];

export const getReferenceImageColumns = (
  t: (key: string) => string
): ColumnDef<ReferenceImageRow>[] => [
  {
    accessorKey: "project",
    header: () =>
      createElement(SortLabel, { label: t(localizationConstants.projectLabel) }),
  },
  {
    accessorKey: "municipality",
    header: () =>
      createElement(SortLabel, {
        label: t(localizationConstants.municipalityLabel),
      }),
  },
  {
    accessorKey: "year",
    header: () =>
      createElement(SortLabel, { label: t(localizationConstants.yearLabel) }),
  },
  {
    accessorKey: "images",
    header: () => t(localizationConstants.imagesLabel),
  },
];
