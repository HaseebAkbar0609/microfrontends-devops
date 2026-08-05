"use client";

import { useState } from "react";
import { CreditCard, ChevronUp } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CompanyDetail } from "../types/company";

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

export function CompanyCreditTab({ data }: Props) {
  const t = useTranslate();

  return (
    <div className="space-y-4">
      <AccordionSection title={t(localizationConstants.b2bCompanyKreditSection)} icon={<CreditCard size={18} />}>
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
      </AccordionSection>
    </div>
  );
}
