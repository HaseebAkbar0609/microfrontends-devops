"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Send } from "lucide-react";
import { OFFER_ROUTES } from "../constants/offerRoutes";
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
    <div className="flex flex-1 flex-col overflow-hidden bg-slate-50 -mb-6">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-3">
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1.5 text-2xl font-semibold tracking-tight text-zinc-950 hover:text-zinc-700"
          onClick={() => router.push(OFFER_ROUTES.accepted(offerId))}
        >
          <ArrowLeft size={20} />
          {t(localizationConstants.agreementCreateTitle)}
        </button>
        <span className="mt-1 block pl-8 text-sm text-slate-500">
          {t(localizationConstants.agreementCreateDescription)}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden bg-slate-50">
        {/* Scrollable accordion form */}
        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
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
            onClick={() => router.push(OFFER_ROUTES.accepted(offerId))}
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
