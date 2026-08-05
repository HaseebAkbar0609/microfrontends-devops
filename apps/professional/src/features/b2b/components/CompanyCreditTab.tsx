"use client";

import { CreditCard } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CompanyDetail } from "../types/company";
import { CompanyAccordionSection } from "./CompanyAccordionSection";

interface Props {
  data: CompanyDetail;
}

export function CompanyCreditTab({ data }: Props) {
  const t = useTranslate();

  return (
    <div className="space-y-4">
      <CompanyAccordionSection title={t(localizationConstants.b2bCompanyKreditSection)} icon={<CreditCard size={18} />}>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500">Input</span>
            <span className="text-sm text-zinc-900">{data.kreditInput1 ?? "—"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500">Input</span>
            <span className="text-sm text-zinc-900">{data.kreditInput2 ?? "—"}</span>
          </div>
        </div>
      </CompanyAccordionSection>
    </div>
  );
}
