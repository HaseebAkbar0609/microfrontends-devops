"use client";

import { useState } from "react";
import { ClipboardList, ChevronUp, ChevronDown } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { formatCurrency } from "@/utils/formatCurrency";
import { AgreementData } from "../types/offer";

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

interface Props {
  data: AgreementData;
}

export function AgreementProjectInfoSection({ data }: Props) {
  const t = useTranslate();
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-3 px-5 py-4"
        onClick={() => setOpen((v) => !v)}
      >
        <ClipboardList size={18} className="shrink-0 text-slate-500" />
        <span className="text-sm font-semibold text-slate-800">
          {t(localizationConstants.agreementProjectInfo)}
        </span>
        <span className="ml-auto">
          {open ? (
            <ChevronUp size={16} className="text-slate-400" />
          ) : (
            <ChevronDown size={16} className="text-slate-400" />
          )}
        </span>
      </button>

      {open && (
        <>
          <div className="border-t border-slate-100" />
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 px-5 py-5">
            <InfoField
              label={t(localizationConstants.agreementProjectName)}
              value={data.projectName}
            />
            <InfoField
              label={t(localizationConstants.agreementProjectQuoteNumber)}
              value={`${data.projectNumber} / ${data.quoteNumber}`}
            />
            <InfoField
              label={t(localizationConstants.agreementCustomerLabel)}
              value={data.customerName}
            />
            <InfoField
              label={t(localizationConstants.agreementContractType)}
              value={data.contractType}
            />
            <InfoField
              label={t(localizationConstants.agreementPrice)}
              value={formatCurrency(data.price)}
            />
            <div />
            <InfoField
              label={t(localizationConstants.agreementStartDate)}
              value={data.startDate}
            />
            <InfoField
              label={t(localizationConstants.agreementEndDate)}
              value={data.endDate}
            />
          </div>
        </>
      )}
    </div>
  );
}
