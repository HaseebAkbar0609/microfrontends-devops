"use client";

import { Calendar, CirclePlus, DollarSign, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { OfferSendConfirmationPanelProps } from "../types";

export function OfferSendConfirmationPanel({
  data,
}: OfferSendConfirmationPanelProps) {
  return (
    <Card className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">
        <Translate text={localizationConstants.offerSendConfirmationTitle} />
      </h2>

      <div className="mt-0 space-y-4">
        <div className="rounded-lg bg-slate-900 px-5 py-4 text-white">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-sm text-white/90">
                <Translate
                  text={localizationConstants.offerSendPreliminaryBudgetLabel}
                />
              </div>
              <div className="mt-0.5 text-2xl font-semibold">
                {data.preliminaryBudgetPrice}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-slate-100 px-5 py-4 text-slate-900">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-slate-200">
              <Calendar className="h-4 w-4 text-slate-700" />
            </div>
            <div>
              <div className="text-sm text-slate-600">
                <Translate
                  text={localizationConstants.offerSendOfferDateLabel}
                />
              </div>
              <div className="mt-0.5 text-base font-semibold text-slate-900">
                {data.offerDateLatest}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="text-sm font-medium text-slate-900">
            <Translate
              text={localizationConstants.offerSendPreliminaryBudgetLabel}
            />
          </div>
          <div className="mt-2">
            <Input
              placeholder="Preliminary budget price"
              className="bg-white"
            />
          </div>

          <div className="mt-5 text-sm font-medium text-slate-900">
            <Translate text={localizationConstants.offerSendOfferDateLabel} />
          </div>
          <div className="mt-2">
            <Input placeholder="Enter offer date latest" className="bg-white" />
          </div>
        </div>

        <div className="pt-6 space-y-3">
          <Button
            variant="outline"
            className="w-full h-11 rounded-md border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200"
          >
            <Translate text={localizationConstants.offerSendCancel} />
          </Button>

          <Button
            variant="outline"
            className="w-full h-11 rounded-md border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
          >
            <Save className="mr-2 h-4 w-4" />
            <Translate text={localizationConstants.offerSendSave} />
          </Button>

          <Button className="w-full h-11 rounded-md bg-slate-900 text-white hover:bg-slate-900/90">
            <CirclePlus className="mr-2 h-4 w-4" />
            <Translate text={localizationConstants.offerSendCreateOffer} />
          </Button>

          <Button className="w-full h-11 rounded-md bg-slate-900 text-white hover:bg-slate-900/90">
            <CirclePlus className="mr-2 h-4 w-4" />
            <Translate
              text={localizationConstants.offerSendCreateCalculation}
            />
          </Button>
        </div>
      </div>
    </Card>
  );
}
