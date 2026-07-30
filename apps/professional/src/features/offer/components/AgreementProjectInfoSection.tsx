"use client";

import { useState } from "react";
import { Info, ChevronUp, ChevronDown } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { formatCurrency } from "@/utils/formatCurrency";
import { AgreementData } from "../types/offer";

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-zinc-950">{label}</p>
      <p className="text-sm text-zinc-500">{value}</p>
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
    <div className="rounded-lg border border-zinc-200 bg-white">
      <button
        type="button"
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-4 px-4 py-4"
        onClick={() => setOpen((v) => !v)}
      >
        <Info size={18} className="shrink-0 text-slate-700" />
        <span className="text-base font-medium text-zinc-950">
          {t(localizationConstants.agreementProjectInfo)}
        </span>
        <span className="ml-auto">
          {open ? (
            <ChevronUp size={16} className="text-zinc-500" />
          ) : (
            <ChevronDown size={16} className="text-zinc-500" />
          )}
        </span>
      </button>

      {open && (
        <>
          <div className="border-t border-zinc-200" />
          <div className="flex flex-col gap-4 px-4 py-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <InfoField
                  label={t(localizationConstants.agreementProjectName)}
                  value={data.projectName}
                />
              </div>
              <div className="flex-1">
                <InfoField
                  label={t(localizationConstants.agreementProjectQuoteNumber)}
                  value={`${data.projectNumber} / ${data.quoteNumber}`}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <InfoField
                  label={t(localizationConstants.agreementAddress)}
                  value={data.address}
                />
              </div>
              <div className="flex-1">
                <InfoField
                  label={t(localizationConstants.agreementContractType)}
                  value={data.contractType}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <InfoField
                  label={t(localizationConstants.agreementCustomerLabel)}
                  value={data.customerName}
                />
              </div>
              <div className="flex-1">
                <InfoField
                  label={t(localizationConstants.agreementPrice)}
                  value={formatCurrency(data.price)}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <InfoField
                  label={t(localizationConstants.agreementStartDate)}
                  value={data.startDate}
                />
              </div>
              <div className="flex-1">
                <InfoField
                  label={t(localizationConstants.agreementEndDate)}
                  value={data.endDate}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
