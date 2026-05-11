import { createElement } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { QuoteDetail } from "@/features/leads/types";
import localizationConstants from "@/utils/translation/constants";
import { SortLabel } from "@/features/leads/management/components/LeadDetailShared";
import type { TranslationKeys } from "@/utils/translation/constants";

export type CompanyInfoItem = {
  labelKey: TranslationKeys;
  value: string;
};

export type CreditInfoItem = {
  labelKey: TranslationKeys;
  value: string;
};

export type CertificateRow = {
  id: string;
  date: string;
  certificate: string;
  textKey: TranslationKeys;
  fileType: "PDF" | "DOC" | "IMG";
  category: "certificate" | "insurance";
};

export type PersonnelRow = {
  id: string;
  name: string;
  position: string;
  certifications: string;
  fileType: "PDF" | "DOC" | "IMG";
};

export const companyHeroImage = "/images/company-info.png";

export const getCompanyDetails = (detail: QuoteDetail): CompanyInfoItem[] => [
  { labelKey: localizationConstants.companyLabel, value: detail.companyName },
  { labelKey: localizationConstants.websiteLabel, value: "www.malarfirman.se" },
  { labelKey: localizationConstants.addressLabel, value: detail.address },
  { labelKey: localizationConstants.cityLabel, value: "Solna" },
  { labelKey: localizationConstants.companyNameLabel, value: "Pelle Construction" },
  { labelKey: localizationConstants.mobilePhoneLabel, value: detail.mobilePhone },
  { labelKey: localizationConstants.emailLabel, value: detail.email },
];

export const getCreditInfo = (detail: QuoteDetail): CreditInfoItem[] => [
  { labelKey: localizationConstants.companyLabel, value: detail.companyName },
  { labelKey: localizationConstants.registeredVatLabel, value: "YES" },
  { labelKey: localizationConstants.registeredFTaxLabel, value: "YES" },
  { labelKey: localizationConstants.boardInformationLabel, value: "NO" },
];

export const certificateFilterOptions = [
  { value: "all", labelKey: localizationConstants.allTypes },
  { value: "certificate", labelKey: localizationConstants.certificateLabel },
  { value: "insurance", labelKey: localizationConstants.insuranceLabel },
];

export const certificateRows: CertificateRow[] = [
  {
    id: "cert-1",
    date: "20210412",
    certificate: "CE547",
    textKey: localizationConstants.readMoreLabel,
    fileType: "PDF",
    category: "certificate",
  },
];

export const personnelRows: PersonnelRow[] = [
  {
    id: "person-1",
    name: "Robert Hellgren",
    position: "CEO",
    certifications: "Certified Construction Manager (CCM)",
    fileType: "PDF",
  },
  {
    id: "person-2",
    name: "Mashiur Rahman",
    position: "IT",
    certifications: "IT Administrator",
    fileType: "PDF",
  },
  {
    id: "person-3",
    name: "Mika Hellgren",
    position: "Project Manager",
    certifications: "Certified Construction Manager (CCM)",
    fileType: "PDF",
  },
];

export const getCertificateColumns = (
  t: (key: string) => string
): ColumnDef<CertificateRow>[] => [
  {
    accessorKey: "date",
    header: () =>
      createElement(SortLabel, { label: t(localizationConstants.dateLabel) }),
  },
  {
    accessorKey: "certificate",
    header: () =>
      createElement(SortLabel, {
        label: t(localizationConstants.certificateLabel),
      }),
  },
  {
    id: "text",
    header: () =>
      createElement(SortLabel, { label: t(localizationConstants.textLabel) }),
    cell: ({ row }) =>
      createElement(
        "span",
        { className: "text-slate-700" },
        t(row.original.textKey)
      ),
    accessorFn: (row) => t(row.textKey),
  },
  {
    accessorKey: "fileType",
    header: () => t(localizationConstants.fileLabel),
  },
];

export const getPersonnelColumns = (
  t: (key: string) => string
): ColumnDef<PersonnelRow>[] => [
  {
    accessorKey: "name",
    header: () =>
      createElement(SortLabel, { label: t(localizationConstants.nameLabel) }),
    cell: ({ row }) =>
      createElement(
        "span",
        { className: "font-semibold text-slate-900" },
        row.original.name
      ),
  },
  {
    accessorKey: "position",
    header: () =>
      createElement(SortLabel, {
        label: t(localizationConstants.positionLabel),
      }),
  },
  {
    accessorKey: "certifications",
    header: () =>
      createElement(SortLabel, {
        label: t(localizationConstants.certificationsLabel),
      }),
  },
  {
    accessorKey: "fileType",
    header: () => t(localizationConstants.fileLabel),
  },
];
