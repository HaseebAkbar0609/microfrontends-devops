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
      bodyClassName="pt-0 max-h-[calc(100vh-280px)] overflow-y-auto"
      showCloseButton
      title={
        <div className="pr-10 text-left text-lg font-bold leading-tight text-slate-950">
          <Translate text={localizationConstants.businessRentModalTitle} />
        </div>
      }
      description={
        <div className="w-full text-left">
          <div className="mt-4 h-px w-full bg-slate-200" />
          <p className="mt-4 text-base font-semibold leading-relaxed text-slate-700">
            <Translate text={localizationConstants.businessRentModalSubtitle} />
          </p>
        </div>
      }
      footer={
        <div className="flex w-full items-center justify-end gap-4 pt-4">
          <Button
            variant="outline"
            className="h-10 rounded-md border-transparent bg-slate-100 px-6 text-sm font-medium text-slate-900 hover:bg-slate-200"
            onClick={() => onOpenChange(false)}
          >
            <Translate text={localizationConstants.businessRentModalCancel} />
          </Button>
          <Button
            className="h-10 rounded-md bg-slate-900 px-6 text-sm font-medium text-white hover:bg-slate-900/90 disabled:cursor-not-allowed disabled:opacity-50"
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
      <div className="flex flex-col gap-4">
        <ul className="list-disc space-y-4 pl-5 text-sm leading-relaxed text-slate-600">
          {bullets.map((key) => (
            <li key={key}>
              <Translate text={key} />
            </li>
          ))}
        </ul>

        <div className="mt-4 h-px w-full bg-slate-200" />

        <label className="flex items-center gap-3 pt-4 text-sm text-slate-700">
          <Checkbox
            checked={accepted}
            onCheckedChange={(v) => setAccepted(Boolean(v))}
            className="border-black"
          />
          <span>
            <Translate text={localizationConstants.businessRentModalCheckbox} />
          </span>
        </label>
      </div>
    </ModalWrapper>
  );
}
