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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-1 text-sm font-medium text-slate-700">
            <Translate text={localizationConstants.offerFormProjectName} />
          </p>
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder={t(localizationConstants.offerFormProjectName)}
            className="h-9 bg-white text-sm"
          />
        </div>

        <div>
          <p className="mb-1 text-sm font-medium text-slate-700">
            <Translate text={localizationConstants.offerFormWorkLocation} />
          </p>
          <Input
            value={workLocation}
            onChange={(e) => setWorkLocation(e.target.value)}
            placeholder={t(localizationConstants.offerFormWorkLocation)}
            className="h-9 bg-white text-sm"
          />
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-slate-700">
          <Translate text={localizationConstants.offerFormSpecifications} />
        </p>
        <Textarea
          value={specifications}
          onChange={(e) => setSpecifications(e.target.value)}
          placeholder={t(localizationConstants.offerFormSpecifications)}
          className="min-h-24 resize-none bg-white text-sm"
        />
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-slate-700">
          <Translate text={localizationConstants.offerFormUploadFiles} />
        </p>
        <div className="flex items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            className="sr-only"
            onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
          />
          <Button
            type="button"
            variant="outline"
            className="h-9 shrink-0 text-sm"
            onClick={() => fileRef.current?.click()}
          >
            <Translate text={localizationConstants.offerFormUploadFiles} />
          </Button>
          <span className="text-sm text-slate-500">
            {fileName || t(localizationConstants.offerFormNoFileChosen)}
          </span>
          {fileName && (
            <Button
              type="button"
              className="h-9 bg-neutral-950 text-sm text-white hover:bg-neutral-800"
            >
              <Translate text={localizationConstants.offerFormSubmit} />
            </Button>
          )}
        </div>
        <p className="mt-1.5 text-xs text-slate-400">
          <Translate text={localizationConstants.offerFormFileTypesInfo} />
        </p>
      </div>
    </div>
  );
}
