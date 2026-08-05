"use client";

import { useState } from "react";
import { Building2, MapPin, CircleUserRound, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CompanyDetail } from "../types/company";

function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className="text-sm text-zinc-900">{value || "—"}</span>
    </div>
  );
}

function AccordionSection({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between px-5 py-4"
      >
        <div className="flex items-center gap-2 text-slate-600">
          {icon}
          <span className="text-sm font-semibold text-zinc-900">{title}</span>
        </div>
        <ChevronUp
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${open ? "" : "rotate-180"}`}
          aria-hidden={true}
        />
      </button>
      {open && <div className="border-t border-slate-100 px-5 py-4">{children}</div>}
    </div>
  );
}

interface Props {
  data: CompanyDetail;
}

export function CompanyInfoTab({ data }: Props) {
  const t = useTranslate();

  return (
    <div className="space-y-4">
      {/* Företag */}
      <AccordionSection title={t(localizationConstants.b2bCompanySection)} icon={<Building2 size={18} />}>
        <div className="flex gap-6">
          <div className="grid flex-1 grid-cols-2 gap-4">
            <InfoField label={t(localizationConstants.companyName)} value={data.namn} />
            <InfoField label={t(localizationConstants.b2bArchiveOrgNr)} value={data.orgNr} />
            <InfoField label={t(localizationConstants.b2bCompanyVAT)} value={data.vatNr} />
            <InfoField label={t(localizationConstants.b2bCompanySNI)} value={data.sniKod} />
          </div>
          <div className="flex h-24 w-48 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-3">
            <Image src="/logo.png" alt={t(localizationConstants.b2bCompanyLogo)} width={160} height={64} className="h-full w-full object-contain" />
          </div>
        </div>
      </AccordionSection>

      {/* Adress */}
      <AccordionSection title={t(localizationConstants.b2bCompanyAdressSection)} icon={<MapPin size={18} />}>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <InfoField label={t(localizationConstants.b2bCompanyPostAdress)} value={data.adress.postAdress} />
            <InfoField label={t(localizationConstants.b2bCompanyPostNr)} value={data.adress.postNr} />
            <InfoField label={t(localizationConstants.b2bCompanyOrt)} value={data.adress.ort} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <InfoField label={t(localizationConstants.b2bCompanyBesoksAdress)} value={data.adress.besoksAdress} />
            <InfoField label={t(localizationConstants.b2bCompanyPostNr)} value={data.adress.besoksPostNr} />
            <InfoField label={t(localizationConstants.b2bCompanyOrt)} value={data.adress.besoksOrt} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <InfoField label={t(localizationConstants.b2bCompanyLeveransAdress)} value={data.adress.leveransAdress} />
            <InfoField label={t(localizationConstants.b2bCompanyPostNr)} value={data.adress.leveransPostNr} />
            <InfoField label={t(localizationConstants.b2bCompanyOrt)} value={data.adress.leveransOrt} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <InfoField label={t(localizationConstants.b2bCompanyVaxelNr)} value={data.adress.vaxelNr} />
            <InfoField label={t(localizationConstants.email)} value={data.adress.epost} />
            <InfoField label={t(localizationConstants.b2bCompanyHemsida)} value={data.adress.hemsida} />
          </div>
        </div>
      </AccordionSection>

      {/* Alternativa kontakter */}
      <AccordionSection title={t(localizationConstants.b2bCompanyAltKontakter)} icon={<CircleUserRound size={18} />}>
        <InfoField label={t(localizationConstants.b2bCompanyInvoiceEmail)} value={data.fakturaEmail} />
      </AccordionSection>
    </div>
  );
}
