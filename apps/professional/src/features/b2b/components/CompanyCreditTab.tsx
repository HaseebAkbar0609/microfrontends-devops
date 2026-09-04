"use client";


import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CompanyDetail } from "../types/company";
import { CompanyAccordionSection } from "./CompanyAccordionSection";
import { Input } from "@/components/ui/input";

interface Props {
  data: CompanyDetail;
  isEditMode?: boolean;
  onFieldChange?: (field: string, value: string) => void;
}

export function CompanyCreditTab({
  data,
  isEditMode = false,
  onFieldChange,
}: Props) {
  const t = useTranslate();

  return (
    <div className="space-y-4">
      <CompanyAccordionSection
        title={t(localizationConstants.b2bCompanyKreditSection)}
        icon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 size-6 text-slate-800 shrink-0"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="12 6.5 13.7 10 17.5 10.5 14.75 13.2 15.4 17 12 15.2 8.6 17 9.25 13.2 6.5 10.5 10.3 10 12 6.5" />
          </svg>
        }
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
              {t(localizationConstants.b2bCompanyInput)}
            </span>
            {isEditMode ? (
              <Input
                value={data.kreditInput1 ?? ""}
                placeholder="-"
                onChange={(e) => onFieldChange?.("kreditInput1", e.target.value)}
                className="h-9 font-sans text-sm"
              />
            ) : (
              <span className="font-sans text-sm font-normal leading-5 tracking-normal text-slate-500">
                {data.kreditInput1 || "—"}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
              {t(localizationConstants.b2bCompanyInput)}
            </span>
            {isEditMode ? (
              <Input
                value={data.kreditInput2 ?? ""}
                placeholder="-"
                onChange={(e) => onFieldChange?.("kreditInput2", e.target.value)}
                className="h-9 font-sans text-sm"
              />
            ) : (
              <span className="font-sans text-sm font-normal leading-5 tracking-normal text-slate-500">
                {data.kreditInput2 || "—"}
              </span>
            )}
          </div>
        </div>
      </CompanyAccordionSection>
    </div>
  );
}
