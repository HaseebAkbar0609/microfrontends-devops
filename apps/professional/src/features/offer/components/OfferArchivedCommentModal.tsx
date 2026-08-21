"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  offertNr: string;
  job: string;
  onClose: () => void;
}

export function OfferArchivedCommentModal({
  open,
  offertNr,
  job,
  onClose,
}: Props) {
  const t = useTranslate();
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState(false);

  function handleClose() {
    setCommentText("");
    setError(false);
    onClose();
  }

  function handleSave() {
    if (!commentText.trim()) {
      setError(true);
      return;
    }
    setError(false);
    showToast("success", t(localizationConstants.offerCommentSavedToast));
    setCommentText("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="w-[400px] h-[214px] max-w-[400px] bg-white p-4.5 rounded-lg border border-slate-200 shadow-xl opacity-100 flex flex-col justify-between gap-0">
        {/* Header */}
        <DialogHeader className="p-0 text-left space-y-0.5">
          <DialogTitle className="text-sm font-semibold text-slate-900 leading-tight">
            {t(localizationConstants.offerQuotedCommentTitle)}
          </DialogTitle>
          <p className="text-xs text-slate-500 font-normal">
            {job} - {offertNr}
          </p>
        </DialogHeader>

        {/* Text Area */}
        <div className="py-1.5 flex-1 flex flex-col justify-center">
          <textarea
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
              if (error && e.target.value.trim()) {
                setError(false);
              }
            }}
            placeholder={t(localizationConstants.offerQuotedCommentPlaceholder)}
            className={cn(
              "w-full h-[85px] min-h-[65px] resize bg-white text-xs border focus:outline-none rounded-lg p-2.5 text-slate-800 placeholder:text-slate-400 leading-relaxed font-sans transition-colors",
              error
                ? "border-red-500 focus:ring-1 focus:ring-red-400"
                : "border-slate-200 focus:ring-1 focus:ring-slate-300",
            )}
          />
          {error && (
            <p className="text-[11px] text-red-500 font-medium mt-1">
              <Translate text={localizationConstants.offerCommentRequired} />
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-0.5">
          <Button
            variant="outline"
            className="h-8 px-4 text-xs font-medium rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-none"
            onClick={handleClose}
          >
            {t(localizationConstants.cancel)}
          </Button>
          <Button
            className="h-8 px-5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-md cursor-pointer shadow-none"
            onClick={handleSave}
          >
            {t(localizationConstants.save)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
