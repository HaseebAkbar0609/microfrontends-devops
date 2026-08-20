"use client";

import { useState, useRef } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

export function OfferFormProjectSection() {
  const t = useTranslate();
  const [projectName, setProjectName] = useState("");
  const [workLocation, setWorkLocation] = useState("");
  const [specifications, setSpecifications] = useState("");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1.5 font-sans font-medium text-sm leading-5 text-[#09090B]">
            <Translate text={localizationConstants.offerFormProjectName} />
          </label>
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder={t(localizationConstants.offerFormProjectNamePlaceholder)}
            className="h-10 rounded-lg border-slate-200 bg-white text-sm placeholder:text-slate-400 px-3.5"
          />
        </div>

        <div>
          <label className="block mb-1.5 font-sans font-medium text-sm leading-5 text-[#09090B]">
            <Translate text={localizationConstants.offerFormWorkLocation} />
          </label>
          <Input
            value={workLocation}
            onChange={(e) => setWorkLocation(e.target.value)}
            placeholder={t(localizationConstants.offerFormWorkAddressPlaceholder)}
            className="h-10 rounded-lg border-slate-200 bg-white text-sm placeholder:text-slate-400 px-3.5"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1.5 font-sans font-medium text-sm leading-5 text-[#09090B]">
          <Translate text={localizationConstants.offerFormSpecifications} />
        </label>
        <Textarea
          value={specifications}
          onChange={(e) => setSpecifications(e.target.value)}
          placeholder={t(localizationConstants.offerFormSpecificationsPlaceholder)}
          className="min-h-24 resize-none rounded-lg border-slate-200 bg-white text-sm placeholder:text-slate-400 p-3"
        />
      </div>

      <div>
        <label className="block mb-1.5 font-sans font-medium text-sm leading-5 text-[#09090B]">
          <Translate text={localizationConstants.offerFormUploadFiles} />
        </label>
        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            className="sr-only"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
          />
          <div className="flex h-10 w-[296px] items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-2.5 py-1 text-xs font-medium text-slate-800 cursor-pointer"
            >
              <Translate text={localizationConstants.offerFormLaddaUpp} />
            </button>
            <span className="text-xs text-slate-500 truncate">
              {fileName || t(localizationConstants.offerFormNoFileChosen)}
            </span>
          </div>
          <Button
            type="button"
            className="h-10 rounded-lg bg-[#1E2530] px-5 text-sm font-medium text-white hover:bg-slate-800 cursor-pointer"
          >
            <Translate text={localizationConstants.offerFormSubmit} />
          </Button>
        </div>
        <p className="mt-1.5 font-sans font-normal text-xs leading-5 text-[#64748B]">
          <Translate text={localizationConstants.offerFormFileTypesInfo} />
        </p>
      </div>
    </div>
  );
}
