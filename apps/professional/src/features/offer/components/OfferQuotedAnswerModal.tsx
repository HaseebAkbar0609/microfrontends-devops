"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface Props {
  open: boolean;
  offertNr: string;
  job: string;
  answer: string;
  onClose: () => void;
  onLeaveComment: () => void;
}

export function OfferQuotedAnswerModal({
  open,
  offertNr,
  job,
  answer,
  onClose,
  onLeaveComment,
}: Props) {
  const t = useTranslate();

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-110 p-0">
        <DialogHeader className="border-b border-slate-100 px-6 py-4">
          <DialogTitle className="text-base font-semibold text-slate-900">
            {t(localizationConstants.offerQuotedAnswerTitle)}
          </DialogTitle>
          <p className="mt-0.5 text-sm text-slate-500">
            {job} – {offertNr}
          </p>
        </DialogHeader>
        <div className="px-6 py-4">
          <p className="text-sm text-slate-700">{answer}</p>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <Button
            variant="outline"
            className="h-9 cursor-pointer px-5 text-sm"
            onClick={onClose}
          >
            {t(localizationConstants.offerQuotedAnswerBack)}
          </Button>
          <Button
            className="h-9 cursor-pointer bg-neutral-950 px-5 text-sm text-white hover:bg-neutral-800"
            onClick={onLeaveComment}
          >
            {t(localizationConstants.offerQuotedAnswerLeaveComment)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
