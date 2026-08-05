"use client";

import { useState } from "react";
import { ClipboardList, ChevronUp } from "lucide-react";
import Image from "next/image";
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
      {open && <div className="border-t border-slate-100">{children}</div>}
    </div>
  );
}

const TH = "whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-slate-500";
const TD = "whitespace-nowrap px-4 py-3 text-sm text-slate-700";

interface Props {
  data: CompanyDetail;
}

export function CompanyReferensTab({ data }: Props) {
  const t = useTranslate();

  return (
    <div className="space-y-4">
      <AccordionSection title={t(localizationConstants.b2bCompanyReferensSection)} icon={<ClipboardList size={18} />}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className={TH}>{t(localizationConstants.projectName)}</th>
                <th className={TH}>{t(localizationConstants.companyName)}</th>
                <th className={TH}>{t(localizationConstants.offerQuotedMunicipality)}</th>
                <th className={TH}>{t(localizationConstants.contactNameLabel)}</th>
                <th className={TH}>{t(localizationConstants.phone)}</th>
                <th className={TH}>{t(localizationConstants.b2bCompanyPDF)}</th>
              </tr>
            </thead>
            <tbody>
              {data.references.map((ref) => (
                <tr key={ref.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className={TD}>{ref.projekt}</td>
                  <td className={TD}>{ref.kund}</td>
                  <td className={TD}>{ref.kommun}</td>
                  <td className={TD}>{ref.kontakt}</td>
                  <td className={TD}>{ref.telefon}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {ref.pdfLabel ? (
                      <div className="flex items-center gap-1.5">
                        <Image src="/file-type-pdf.png" alt={ref.pdfLabel} width={20} height={20} className="h-5 w-5 object-contain" />
                        <span className="text-sm text-blue-600 hover:underline cursor-pointer">{ref.pdfLabel}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AccordionSection>
    </div>
  );
}
