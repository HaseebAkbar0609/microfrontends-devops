"use client";

import { useState } from "react";
import { Info, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { AgreementData } from "../types/offer";

function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-zinc-950">{label}</span>
      <span className="text-sm text-zinc-500">{value || "—"}</span>
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
        className={cn(
          "flex w-full cursor-pointer items-center gap-4 p-4",
          open && "border-b border-zinc-200",
        )}
        onClick={() => setOpen((v) => !v)}
      >
        <Info size={21} className="shrink-0 text-slate-700" />
        <span className="flex-1 text-left text-base font-medium text-zinc-950">
          {t(localizationConstants.agreementProjectInfo) || "Project information"}
        </span>
        {open ? (
          <ChevronUp size={18} className="shrink-0 text-zinc-400" />
        ) : (
          <ChevronDown size={18} className="shrink-0 text-zinc-400" />
        )}
      </button>

      {open && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoField
              label={t(localizationConstants.agreementProjectName) || "Project name"}
              value={data.projectName}
            />
            <InfoField
              label={t(localizationConstants.agreementProjectQuoteNumber) || "Project number / Quote number"}
              value={`${data.projectNumber} / ${data.quoteNumber}`}
            />
            <InfoField
              label={t(localizationConstants.agreementAddress) || "Address"}
              value={data.address}
            />
            <InfoField
              label={t(localizationConstants.agreementContractType) || "Contract type"}
              value={data.contractType}
            />
            <InfoField
              label={t(localizationConstants.agreementCustomerLabel) || "Customer"}
              value={data.customerName}
            />
            <InfoField
              label={t(localizationConstants.agreementPrice) || "Price"}
              value={data.price.toLocaleString("en-US")}
            />
            <InfoField
              label={t(localizationConstants.agreementStartDate) || "Start date"}
              value={data.startDate}
            />
            <InfoField
              label={t(localizationConstants.agreementEndDate) || "End date"}
              value={data.endDate}
            />
          </div>
        </div>
      )}
    </div>
  );
}

