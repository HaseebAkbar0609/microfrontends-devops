"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface Props {
  open: boolean;
  offertNr: string;
  job: string;
  onClose: () => void;
}

export function OfferQuotedCommentModal({ open, offertNr, job, onClose }: Props) {
  const t = useTranslate();
  const [commentText, setCommentText] = useState("");

  function handleClose() {
    setCommentText("");
    onClose();
  }

  function handleSend() {
    setCommentText("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="w-110 max-w-[90vw] max-h-[85vh] bg-white p-0 flex flex-col overflow-y-auto">
        <DialogHeader className="px-6 py-4 shrink-0">
          <DialogTitle className="text-base font-semibold text-slate-900">
            {t(localizationConstants.offerQuotedCommentTitle)}
          </DialogTitle>
          <p className="mt-0.5 text-sm text-slate-500">
            {job} – {offertNr}
          </p>
        </DialogHeader>
        <div className="px-6 pb-4 flex-1 flex flex-col">
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={t(localizationConstants.offerQuotedCommentPlaceholder)}
            className="min-h-14 max-h-[45vh] resize-y bg-white text-sm"
          />
        </div>
        <div className="flex items-center justify-between bg-white px-6 py-3 shrink-0">
          <Button
            variant="outline"
            className="h-9 cursor-pointer px-5 text-sm"
            onClick={handleClose}
          >
            {t(localizationConstants.cancel)}
          </Button>
          <Button
            className="h-9 cursor-pointer bg-neutral-950 px-5 text-sm text-white hover:bg-neutral-800"
            onClick={handleSend}
          >
            {t(localizationConstants.offerQuotedCommentSend)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
