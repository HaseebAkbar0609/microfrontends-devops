"use client";

import { FileSpreadsheet } from "lucide-react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CompanyDetail } from "../types/company";
import { CompanyAccordionSection } from "./CompanyAccordionSection";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";

interface Props {
  data: CompanyDetail;
}

export function CompanyReferensTab({ data }: Props) {
  const t = useTranslate();

  return (
    <div className="space-y-4">
      <CompanyAccordionSection
        noPadding
        hideChevron
        headerBorderClassName="max-w-[892px] w-full"
        title={t(localizationConstants.b2bCompanyReferensSection)}
        icon={<FileSpreadsheet className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
      >
        <div className="p-4 max-w-full overflow-x-auto">
          <table className="text-left font-sans text-sm min-w-max">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="px-5 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B]">
                  {t(localizationConstants.projectName)}
                </th>
                <th className="px-5 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B]">
                  {t(localizationConstants.seeProjectCustomerName)}
                </th>
                <th className="px-5 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B]">
                  {t(localizationConstants.offerQuotedMunicipality)}
                </th>
                <th className="px-5 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B]">
                  {t(localizationConstants.contactNameLabel)}
                </th>
                <th className="px-5 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B]">
                  {t(localizationConstants.phone)}
                </th>
                <th className="px-5 py-3.5 font-sans text-sm font-medium leading-6 tracking-normal text-[#64748B]">
                  {t(localizationConstants.b2bCompanyPDF)}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.references.map((ref) => (
                <tr
                  key={ref.id}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  <td className="px-5 py-3.5 font-sans text-sm font-normal leading-6 tracking-normal text-[#020617] whitespace-nowrap">
                    {ref.projekt}
                  </td>
                  <td className="px-5 py-3.5 font-sans text-sm font-normal leading-6 tracking-normal text-[#020617] whitespace-nowrap">
                    {ref.kund}
                  </td>
                  <td className="px-5 py-3.5 font-sans text-sm font-normal leading-6 tracking-normal text-[#020617] whitespace-nowrap">
                    {ref.kommun}
                  </td>
                  <td className="px-5 py-3.5 font-sans text-sm font-normal leading-6 tracking-normal text-[#020617] whitespace-nowrap">
                    {ref.kontakt}
                  </td>
                  <td className="px-5 py-3.5 font-sans text-sm font-normal leading-6 tracking-normal text-[#020617] whitespace-nowrap">
                    {ref.telefon}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    {ref.pdfLabel ? (
                      <div className="flex items-center gap-2 cursor-pointer group">
                        <PdfFileIcon className="h-10 w-10 shrink-0" />
                        <span className="font-sans text-sm font-normal leading-6 tracking-normal text-[#020617] group-hover:text-blue-600 transition-colors">
                          {ref.pdfLabel}
                        </span>
                      </div>
                    ) : (
                      <span className="font-sans text-sm text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CompanyAccordionSection>
    </div>
  );
}
