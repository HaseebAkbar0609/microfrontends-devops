"use client";

import { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/modal";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { BusinessRentModalProps } from "../types";

export function BusinessRentModal({
  open,
  onOpenChange,
  quote,
  onConfirm,
}: BusinessRentModalProps) {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (open) setAccepted(false);
  }, [open]);

  const bullets = useMemo(
    () => [
      localizationConstants.businessRentModalBullet1,
      localizationConstants.businessRentModalBullet2,
      localizationConstants.businessRentModalBullet3,
      localizationConstants.businessRentModalBullet4,
      localizationConstants.businessRentModalBullet5,
      localizationConstants.businessRentModalBullet6,
    ],
    []
  );

  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      headerClassName="gap-0"
      bodyClassName="pt-0 max-h-[calc(100vh-280px)] overflow-y-auto font-sans"
      showCloseButton
      title={
        <div className="pr-10 text-left font-sans font-semibold text-[18px] leading-7.5 text-slate-950 align-middle">
          <Translate text={localizationConstants.businessRentModalTitle} />
        </div>
      }
      description={
        <div className="w-full text-left">
          <div className="mt-4 h-px w-full bg-slate-200" />
          <p className="mt-4 font-sans font-semibold text-[15px] leading-relaxed text-slate-700">
            <Translate text={localizationConstants.businessRentModalSubtitle} />
          </p>
        </div>
      }
      footer={
        <div className="flex w-full items-center justify-end gap-4 pt-4 font-sans">
          <Button
            variant="outline"
            className="h-10 rounded-md border-transparent bg-slate-100 px-6 text-sm font-medium text-slate-900 hover:bg-slate-200 cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            <Translate text={localizationConstants.businessRentModalCancel} />
          </Button>
          <Button
            className="h-10 rounded-md bg-slate-900 px-6 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer shadow-xs"
            disabled={!accepted}
            onClick={() => {
              if (!accepted) return;
              onConfirm?.(quote);
              onOpenChange(false);
            }}
          >
            <Check className="mr-1 h-4 w-4" />
            <Translate text={localizationConstants.businessRentModalConfirm} />
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 font-sans">
        <ul className="list-disc space-y-4 pl-5 font-sans font-normal text-[14px] leading-5 text-slate-500 align-middle">
          {bullets.map((key) => (
            <li key={key}>
              <Translate text={key} />
            </li>
          ))}
        </ul>

        <div className="mt-4 h-px w-full bg-slate-200" />

        <label className="flex items-center gap-3 pt-4 cursor-pointer select-none">
          <Checkbox
            checked={accepted}
            onCheckedChange={(v) => setAccepted(Boolean(v))}
            className="size-4.5 rounded-[4px] border-slate-300 data-[state=checked]:bg-slate-900! data-[state=checked]:border-slate-900! data-[state=checked]:text-white! transition-colors cursor-pointer"
          />
          <span className="font-sans font-medium text-[14px] leading-5 text-slate-900">
            <Translate text={localizationConstants.businessRentModalCheckbox} />
          </span>
        </label>
      </div>
    </ModalWrapper>
  );
}

export default BusinessRentModal;
