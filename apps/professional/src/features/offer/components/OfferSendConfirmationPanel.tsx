"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar1, CircleFadingPlus, Receipt, Save } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { OfferSendConfirmationPanelProps } from "../types";
import { savePreliminaryBudgetAPIAction } from "@/api-actions/offers";
import { parseOfferFormType } from "../services/offerFormService";

export function OfferSendConfirmationPanel({
  data,
}: OfferSendConfirmationPanelProps) {
  const t = useTranslate();
  const router = useRouter();
  const [displayBudget, setDisplayBudget] = useState(data.preliminaryBudgetPrice);
  const [displayOfferDate, setDisplayOfferDate] = useState(data.offerDateLatest);
  const [budget, setBudget] = useState("");
  const [offerDate, setOfferDate] = useState<Date | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const formType = parseOfferFormType(data.type);

  function handleCreateOffer() {
    router.push(`/module/business/offer/send/${data.id}?type=${formType}`);
  }

  async function handleSave() {
    if (isSaving) return;
    setSaveError(null);
    setIsSaved(false);
    if (!offerDate || !budget.trim() || Number(budget) <= 0) {
      setSaveError("Enter a positive budget and select an offer date.");
      return;
    }
    setIsSaving(true);
    const dateOnly = Date.UTC(offerDate.getFullYear(), offerDate.getMonth(), offerDate.getDate());
    const result = await savePreliminaryBudgetAPIAction(data.id, Number(budget), dateOnly);
    setIsSaving(false);
    if (!result.success) {
      setSaveError(result.error || "Could not save the preliminary budget.");
      return;
    }
    setDisplayBudget(Number(budget).toLocaleString("en-US"));
    setDisplayOfferDate(format(offerDate, "yyyy-MM-dd"));
    setIsSaved(true);
  }

  return (
    <Card className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-none flex flex-col gap-4">
      {/* Title */}
      <h2 className="font-sans font-semibold text-lg leading-7 tracking-normal text-[#020617]">
        <Translate text={localizationConstants.offerSendConfirmationTitle} />
      </h2>

      {/* Preliminary Budget Banner */}
      <div className="flex items-center gap-3 rounded-lg bg-[#1E2530] p-4 text-white">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
          <Receipt className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-sans font-normal text-xs text-slate-300">
            <Translate text={localizationConstants.offerSendPreliminaryBudgetLabel} />
          </p>
          <p className="font-sans font-semibold text-xl leading-7 text-white">
            {displayBudget}
          </p>
        </div>
      </div>

      {/* Offer Date Latest Banner */}
      <div className="flex items-center gap-3 rounded-lg bg-slate-100 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-xs">
          <Calendar1 className="h-5 w-5 text-slate-700" />
        </div>
        <div>
          <p className="font-sans font-normal text-xs text-slate-500">
            <Translate text={localizationConstants.offerSendOfferDateLabel} />
          </p>
          <p className="font-sans font-semibold text-sm leading-5 text-slate-800">
            {displayOfferDate}
          </p>
        </div>
      </div>

      {/* Input: Preliminary budget price */}
      <div className="space-y-1.5">
        <label className="font-sans font-medium text-xs text-[#09090B]">
          <Translate text={localizationConstants.offerSendPreliminaryBudgetLabel} />
        </label>
        <Input
          type="text"
          value={budget}
          onChange={(e) => {
            setIsSaved(false);
            const val = e.target.value.replace(/[^0-9]/g, "");
            setBudget(val);
          }}
          inputMode="numeric"
          placeholder={t(localizationConstants.offerSendPreliminaryBudgetPlaceholder)}
          className="h-10 rounded-lg border-slate-200 bg-slate-50/50 text-sm placeholder:text-slate-400"
        />
      </div>

      {/* Input: Offer date latest */}
      <div className="space-y-1.5">
        <label className="font-sans font-medium text-xs text-[#09090B]">
          <Translate text={localizationConstants.offerSendOfferDateLabel} />
        </label>
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-full justify-between text-left font-normal border-slate-200 bg-slate-50/50 px-3 shadow-none hover:bg-slate-50 text-sm"
            >
              <div className="flex items-center gap-2">
                <Calendar1 className="h-4 w-4 text-slate-500 shrink-0" />
                <span className={offerDate ? "text-slate-900" : "text-slate-400"}>
                  {offerDate
                    ? format(offerDate, "yyyy-MM-dd")
                    : t(localizationConstants.offerSendOfferDateLabel)}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0 border-0 bg-transparent shadow-none">
            <Calendar
              mode="single"
              captionLayout="dropdown"
              startMonth={new Date(2015, 0)}
              endMonth={new Date(2035, 11)}
              selected={offerDate}
              onSelect={(date) => {
                setIsSaved(false);
                setOfferDate(date);
                setDatePickerOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Action buttons */}
      {saveError && <p role="alert" className="text-sm text-red-600">{saveError}</p>}
      {isSaved && <p role="status" className="text-sm text-emerald-700">Preliminary budget saved.</p>}
      <div className="flex flex-col gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full rounded-lg border-transparent bg-slate-100 text-sm font-medium text-slate-800 hover:bg-slate-200 cursor-pointer shadow-none"
          onClick={() => router.back()}
        >
          <Translate text={localizationConstants.offerSendCancel} />
        </Button>

        <Button
          type="button"
          variant="outline"
          className="h-10 w-full rounded-lg border-slate-200 bg-white text-sm font-medium text-slate-900 hover:bg-slate-50 cursor-pointer shadow-xs gap-2"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="w-[15px] h-[15px] text-[#18181B] shrink-0" strokeWidth={1.67} />
          <Translate text={localizationConstants.offerSendSave} />
        </Button>

        <Button
          type="button"
          className="h-10 w-full rounded-lg bg-[#1E2530] text-sm font-medium text-white hover:bg-slate-800 cursor-pointer shadow-xs gap-2"
          onClick={handleCreateOffer}
        >
          <CircleFadingPlus className="h-4 w-4 text-white shrink-0" strokeWidth={1.75} />
          <Translate text={localizationConstants.offerSendCreateOffer} />
        </Button>

        <Button
          type="button"
          className="h-10 w-full rounded-lg bg-[#1E2530] text-sm font-medium text-white hover:bg-slate-800 cursor-pointer shadow-xs gap-2"
          onClick={() => router.push(`/module/business/calculation/new?offerId=${data.id}`)}
        >
          <CircleFadingPlus className="h-4 w-4 text-white shrink-0" strokeWidth={1.75} />
          <Translate text={localizationConstants.offerSendCreateCalculation} />
        </Button>
      </div>
    </Card>
  );
}
