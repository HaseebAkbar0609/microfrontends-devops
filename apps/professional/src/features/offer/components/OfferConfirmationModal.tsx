"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/modal";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { OfferConfirmationModalProps } from "../types";

export function OfferConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
}: OfferConfirmationModalProps) {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (open) setAccepted(false);
  }, [open]);

  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      headerClassName="gap-0"
      bodyClassName="pt-0 max-h-[calc(100vh-280px)] overflow-y-auto"
      showCloseButton
      title={
        <div className="text-left text-xl font-bold leading-tight text-slate-950">
          <Translate text={localizationConstants.offerConfirmationModalTitle} />
        </div>
      }
      footer={
        <div className="flex w-full items-center justify-end gap-4 pt-4">
          <Button
            variant="outline"
            className="h-10 rounded-md border-transparent bg-slate-100 px-6 text-sm font-medium text-slate-900 hover:bg-slate-200"
            onClick={() => onOpenChange(false)}
          >
            <Translate
              text={localizationConstants.offerConfirmationModalCancel}
            />
          </Button>
          <Button
            className="h-10 rounded-md bg-slate-900 px-6 text-sm font-medium text-white hover:bg-slate-900/90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!accepted}
            onClick={() => {
              if (!accepted) return;
              onConfirm?.();
              onOpenChange(false);
            }}
          >
            <Check className="mr-2 h-4 w-4" />
            <Translate
              text={localizationConstants.offerConfirmationModalConfirm}
            />
          </Button>
        </div>
      }
    >
      <div className="flex flex-col">
        <div className="h-px w-full bg-slate-200" />

        <label className="flex items-center gap-3 pt-4 text-sm text-slate-700">
          <Checkbox
            checked={accepted}
            onCheckedChange={(v) => setAccepted(Boolean(v))}
            className="border-black"
          />
          <span>
            <Translate
              text={localizationConstants.offerConfirmationModalCheckbox}
            />
          </span>
        </label>
      </div>
    </ModalWrapper>
  );
}
