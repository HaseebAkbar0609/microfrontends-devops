"use client";

import { Calendar, CirclePlus, DollarSign, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useTranslate } from "@/utils/translation/translate";
import { OfferSendConfirmationPanelProps } from "../types";

export function OfferSendConfirmationPanel({
  data,
}: OfferSendConfirmationPanelProps) {
  const t = useTranslate();

  return (
    <Card className="overflow-hidden rounded-lg border border-slate-200 bg-white p-0 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          <Translate text={localizationConstants.offerSendConfirmationTitle} />
        </h2>

        <div className="rounded-lg bg-gray-800 px-4 py-4 text-white">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 shrink-0 text-slate-200" />
            <span className="text-base text-slate-200">
              <Translate text={localizationConstants.offerSendPreliminaryBudgetLabel} />
            </span>
          </div>
          <div className="pl-8 pt-1 text-xl font-semibold text-slate-50">
            {data.preliminaryBudgetPrice}
          </div>
        </div>

        <div className="rounded-lg bg-slate-200 px-4 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 shrink-0 text-slate-500" />
            <span className="text-base text-slate-600">
              <Translate text={localizationConstants.offerSendOfferDateLabel} />
            </span>
          </div>
          <div className="pl-8 pt-1 text-base font-medium text-slate-700">
            {data.offerDateLatest}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-zinc-950">
            <Translate text={localizationConstants.offerSendPreliminaryBudgetLabel} />
          </p>
          <Input
            placeholder={t(localizationConstants.offerSendPreliminaryBudgetPlaceholder)}
            className="h-9 border-gray-200 bg-zinc-100 text-sm placeholder:text-zinc-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-zinc-950">
            <Translate text={localizationConstants.offerSendOfferDateLabel} />
          </p>
          <Input
            placeholder={t(localizationConstants.offerSendOfferDatePlaceholder)}
            className="h-9 border-gray-200 bg-zinc-100 text-sm placeholder:text-zinc-400"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <Button
          variant="outline"
          className="h-11 w-full rounded-md border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200"
        >
          <Translate text={localizationConstants.offerSendCancel} />
        </Button>

        <Button
          variant="outline"
          className="h-11 w-full rounded-md border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
        >
          <Save className="mr-2 h-4 w-4" />
          <Translate text={localizationConstants.offerSendSave} />
        </Button>

        <Button className="h-11 w-full rounded-md bg-neutral-950 text-white hover:bg-neutral-800">
          <CirclePlus className="mr-2 h-4 w-4" />
          <Translate text={localizationConstants.offerSendCreateOffer} />
        </Button>

        <Button className="h-11 w-full rounded-md bg-neutral-950 text-white hover:bg-neutral-800">
          <CirclePlus className="mr-2 h-4 w-4" />
          <Translate text={localizationConstants.offerSendCreateCalculation} />
        </Button>
      </div>
    </Card>
  );
}
