"use client";

import { Building2, MapPinned, Users } from "lucide-react";
import Image from "next/image";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CompanyDetail } from "../types/company";
import { CompanyAccordionSection } from "./CompanyAccordionSection";
import { Input } from "@/components/ui/input";

interface Props {
  data: CompanyDetail;
  isEditMode?: boolean;
  fieldErrors?: Record<string, string>;
  onFieldChange?: (field: string, value: string) => void;
}

function DisplayOrInputField({
  label,
  value,
  fieldKey,
  isEditMode,
  placeholder,
  error,
  onChange,
}: {
  label: string;
  value?: string;
  fieldKey: string;
  isEditMode?: boolean;
  placeholder?: string;
  error?: string;
  onChange?: (field: string, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
        {label}
      </span>
      {isEditMode ? (
        <div>
          <Input
            value={value ?? ""}
            placeholder={placeholder || label}
            onChange={(e) => onChange?.(fieldKey, e.target.value)}
            className={`h-9 font-sans text-sm ${
              error ? "border-red-500 focus-visible:ring-red-400" : ""
            }`}
          />
          {error && <span className="font-sans text-xs text-red-500">{error}</span>}
        </div>
      ) : (
        <span className="font-sans text-sm font-normal leading-5 tracking-normal text-slate-500">
          {value || "—"}
        </span>
      )}
    </div>
  );
}

export function CompanyInfoTab({
  data,
  isEditMode = false,
  fieldErrors = {},
  onFieldChange,
}: Props) {
  const t = useTranslate();

  return (
    <div className="space-y-4">
      {/* Företag */}
      <CompanyAccordionSection
        title={t(localizationConstants.b2bCompanySection)}
        icon={<Building2 className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
          <div className="grid flex-1 grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <DisplayOrInputField
              label={t(localizationConstants.companyName)}
              value={data.namn}
              fieldKey="namn"
              isEditMode={isEditMode}
              error={fieldErrors.namn}
              onChange={onFieldChange}
            />
            <DisplayOrInputField
              label={t(localizationConstants.b2bArchiveOrgNr)}
              value={data.orgNr}
              fieldKey="orgNr"
              placeholder={t(localizationConstants.b2bCompanyPlaceholderOrgNr)}
              isEditMode={isEditMode}
              error={fieldErrors.orgNr}
              onChange={onFieldChange}
            />
            <DisplayOrInputField
              label={t(localizationConstants.b2bCompanyVAT)}
              value={data.vatNr}
              fieldKey="vatNr"
              isEditMode={isEditMode}
              error={fieldErrors.vatNr}
              onChange={onFieldChange}
            />
            <DisplayOrInputField
              label={t(localizationConstants.b2bCompanySNI)}
              value={data.sniKod}
              fieldKey="sniKod"
              isEditMode={isEditMode}
              error={fieldErrors.sniKod}
              onChange={onFieldChange}
            />
          </div>

          {/* Right box / Logo placeholder area */}
          <div className="flex min-h-[120px] w-full items-center justify-center rounded-lg border border-slate-200 bg-slate-50/50 p-4 lg:w-[45%]">
            {data.logoUrl ? (
              <Image
                src={data.logoUrl}
                alt={t(localizationConstants.b2bCompanyLogo)}
                width={160}
                height={64}
                className="max-h-20 max-w-full object-contain"
              />
            ) : (
              <div className="h-full w-full" />
            )}
          </div>
        </div>
      </CompanyAccordionSection>

      {/* Adress */}
      <CompanyAccordionSection
        title={t(localizationConstants.b2bCompanyAdressSection)}
        icon={<MapPinned className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3">
            <DisplayOrInputField
              label={t(localizationConstants.b2bCompanyPostAdress)}
              value={data.adress.postAdress}
              fieldKey="adress.postAdress"
              isEditMode={isEditMode}
              error={fieldErrors["adress.postAdress"]}
              onChange={onFieldChange}
            />
            <DisplayOrInputField
              label={t(localizationConstants.b2bCompanyPostNr)}
              value={data.adress.postNr}
              fieldKey="adress.postNr"
              isEditMode={isEditMode}
              error={fieldErrors["adress.postNr"]}
              onChange={onFieldChange}
            />
            <DisplayOrInputField
              label={t(localizationConstants.b2bCompanyOrt)}
              value={data.adress.ort}
              fieldKey="adress.ort"
              isEditMode={isEditMode}
              error={fieldErrors["adress.ort"]}
              onChange={onFieldChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3">
            <DisplayOrInputField
              label={t(localizationConstants.b2bCompanyBesoksAdress)}
              value={data.adress.besoksAdress}
              fieldKey="adress.besoksAdress"
              isEditMode={isEditMode}
              error={fieldErrors["adress.besoksAdress"]}
              onChange={onFieldChange}
            />
            <DisplayOrInputField
              label={t(localizationConstants.b2bCompanyPostNr)}
              value={data.adress.besoksPostNr}
              fieldKey="adress.besoksPostNr"
              isEditMode={isEditMode}
              error={fieldErrors["adress.besoksPostNr"]}
              onChange={onFieldChange}
            />
            <DisplayOrInputField
              label={t(localizationConstants.b2bCompanyOrt)}
              value={data.adress.besoksOrt}
              fieldKey="adress.besoksOrt"
              isEditMode={isEditMode}
              error={fieldErrors["adress.besoksOrt"]}
              onChange={onFieldChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3">
            <DisplayOrInputField
              label={t(localizationConstants.b2bCompanyLeveransAdress)}
              value={data.adress.leveransAdress}
              fieldKey="adress.leveransAdress"
              isEditMode={isEditMode}
              error={fieldErrors["adress.leveransAdress"]}
              onChange={onFieldChange}
            />
            <DisplayOrInputField
              label={t(localizationConstants.b2bCompanyPostNr)}
              value={data.adress.leveransPostNr}
              fieldKey="adress.leveransPostNr"
              isEditMode={isEditMode}
              error={fieldErrors["adress.leveransPostNr"]}
              onChange={onFieldChange}
            />
            <DisplayOrInputField
              label={t(localizationConstants.b2bCompanyOrt)}
              value={data.adress.leveransOrt}
              fieldKey="adress.leveransOrt"
              isEditMode={isEditMode}
              error={fieldErrors["adress.leveransOrt"]}
              onChange={onFieldChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3">
            <DisplayOrInputField
              label={t(localizationConstants.b2bCompanyVaxelNr)}
              value={data.adress.vaxelNr}
              fieldKey="adress.vaxelNr"
              isEditMode={isEditMode}
              error={fieldErrors["adress.vaxelNr"]}
              onChange={onFieldChange}
            />
            <DisplayOrInputField
              label={t(localizationConstants.email)}
              value={data.adress.epost}
              fieldKey="adress.epost"
              isEditMode={isEditMode}
              error={fieldErrors["adress.epost"]}
              onChange={onFieldChange}
            />
            <DisplayOrInputField
              label={t(localizationConstants.b2bCompanyHemsida)}
              value={data.adress.hemsida}
              fieldKey="adress.hemsida"
              isEditMode={isEditMode}
              error={fieldErrors["adress.hemsida"]}
              onChange={onFieldChange}
            />
          </div>
        </div>
      </CompanyAccordionSection>

      {/* Alternativa kontakter */}
      <CompanyAccordionSection
        title={t(localizationConstants.b2bCompanyAltKontakter)}
        icon={<Users className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
      >
        <div className="max-w-md">
          <DisplayOrInputField
            label={t(localizationConstants.b2bCompanyInvoiceEmail)}
            value={data.fakturaEmail}
            fieldKey="fakturaEmail"
            isEditMode={isEditMode}
            error={fieldErrors.fakturaEmail}
            onChange={onFieldChange}
          />
        </div>
      </CompanyAccordionSection>
    </div>
  );
}
