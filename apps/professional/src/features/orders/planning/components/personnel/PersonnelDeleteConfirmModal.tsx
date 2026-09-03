"use client";

import { Trash2, Loader2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PersonnelDeleteConfirmModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  isDeleting?: boolean;
}

export function PersonnelDeleteConfirmModal({
  isOpen,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: PersonnelDeleteConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-114.5 min-h-37.5 p-6 bg-white rounded-xl shadow-2xl border border-slate-200 font-sans flex flex-col justify-between gap-4">
        <DialogHeader className="flex flex-col gap-1 text-left p-0">
          <DialogTitle className="font-sans font-semibold text-[18px] leading-6 tracking-tight text-slate-900">
            <Translate text={localizationConstants.deletePlanConfirmTitle} />
          </DialogTitle>
          <DialogDescription className="font-sans font-normal text-[14px] leading-5 tracking-normal text-zinc-500">
            <Translate text={localizationConstants.deletePlanConfirmDesc} />
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-end gap-2.5 pt-1">
          <Button
            type="button"
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="h-9 px-4 py-2 bg-zinc-100 hover:bg-slate-200 text-slate-700 font-sans font-medium text-[14px] leading-5 tracking-normal rounded-md transition-colors cursor-pointer border-0 shadow-none"
          >
            <Translate text={localizationConstants.cancelButton} />
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-26 h-9 px-4 py-2 bg-zinc-900 hover:bg-black text-white font-sans font-medium text-[14px] leading-5 tracking-normal rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-none shrink-0"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin stroke-[1.33]" />
            ) : (
              <Trash2 className="w-4 h-4 text-white stroke-[1.33]" />
            )}
            <Translate text={localizationConstants.deleteConfirmButton} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PersonnelDeleteConfirmModal;
