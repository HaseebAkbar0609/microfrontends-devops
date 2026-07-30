"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { AgreementData } from "../types/offer";
import { AgreementProjectInfoSection } from "./AgreementProjectInfoSection";
import { AgreementPartiesSection } from "./AgreementPartiesSection";
import { AgreementDocumentsSection } from "./AgreementDocumentsSection";
import { AgreementFileUploadSection } from "./AgreementFileUploadSection";

interface Props {
  offerId: string;
  data: AgreementData;
}

export function CreateAgreementView({ offerId, data }: Props) {
  const t = useTranslate();
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold text-slate-800 hover:text-slate-600"
          onClick={() =>
            router.push(`/module/business/offer/${offerId}/accepted`)
          }
        >
          <ArrowLeft size={16} />
          {t(localizationConstants.agreementCreateTitle)}
        </button>
        <span className="text-xs text-slate-400">
          {t(localizationConstants.agreementCreateDescription)}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Scrollable accordion form */}
        <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
          <AgreementProjectInfoSection data={data} />
          <AgreementPartiesSection parties={data.parties} />
          <AgreementDocumentsSection
            documents={data.documents}
            templates={data.templates}
          />
          <AgreementFileUploadSection />
        </div>

        {/* Fixed right: action panel */}
        <div className="flex w-52 shrink-0 flex-col gap-3 border-l border-slate-200 px-4 py-5">
          <Button
            variant="outline"
            className="w-full cursor-pointer text-sm"
            onClick={() =>
              router.push(`/module/business/offer/${offerId}/accepted`)
            }
          >
            {t(localizationConstants.agreementCancel)}
          </Button>
          <Button
            variant="outline"
            className="w-full cursor-pointer gap-2 text-sm"
          >
            <Eye size={14} />
            {t(localizationConstants.agreementViewAgreement)}
          </Button>
          <Button className="w-full cursor-pointer gap-2 bg-slate-900 text-sm text-white hover:bg-slate-700">
            <Send size={14} />
            {t(localizationConstants.agreementSendAgreement)}
          </Button>
        </div>
      </div>
    </div>
  );
}
