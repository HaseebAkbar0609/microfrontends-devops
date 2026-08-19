"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/modal";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { OfferConfirmationModalProps } from "../types";

export function OfferConfirmationModal({
  open,
  onOpenChange,
  projectName,
  description,
  onConfirm,
}: OfferConfirmationModalProps) {
  return (
    <ModalWrapper
      open={open}
      onOpenChange={onOpenChange}
      headerClassName="gap-0 pr-8"
      bodyClassName="pt-2 pb-2"
      showCloseButton
      title={
        <div className="text-left font-sans font-semibold text-[18px] leading-[30px] tracking-normal text-slate-950">
          <Translate text={localizationConstants.offerConfirmationModalTitle} />
        </div>
      }
      footer={
        <div className="flex w-full items-center justify-end gap-3 pt-4">
          <Button
            variant="outline"
            className="h-10 rounded-md border-transparent bg-slate-100 px-6 text-sm font-medium text-slate-900 hover:bg-slate-200 cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            <Translate
              text={localizationConstants.offerConfirmationModalCancel}
            />
          </Button>
          <Button
            className="h-10 rounded-md bg-[#1E2530] px-6 text-sm font-medium text-white hover:bg-slate-800 cursor-pointer"
            onClick={() => {
              onConfirm?.();
              onOpenChange(false);
            }}
          >
            <Send className="mr-2 h-4 w-4" />
            <Translate
              text={localizationConstants.offerConfirmationModalSend}
            />
          </Button>
        </div>
      }
    >
      <div className="flex flex-col">
        <p className="font-sans font-normal text-[14px] leading-[20px] tracking-normal text-[#71717A]">
          {description ? (
            description
          ) : projectName ? (
            `Du är på väg att skicka ett offert till "${projectName}". Kunden kommer då att välja att acceptera, eller avslå ditt offert.`
          ) : (
            <Translate text={localizationConstants.offerConfirmationModalDescription} />
          )}
        </p>
      </div>
    </ModalWrapper>
  );
}
