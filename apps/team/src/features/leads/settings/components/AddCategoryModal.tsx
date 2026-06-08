"use client";

import { useState } from "react";
import { useTranslate, Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (name: string, subCategoryName: string) => void;
};

export function AddCategoryModal({ open, onOpenChange, onAdd }: Props) {
  const t = useTranslate();
  const [name, setName] = useState("");
  const [subName, setSubName] = useState("");

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, subName.trim());
    setName("");
    setSubName("");
    onOpenChange(false);
  };

  const handleCancel = () => {
    setName("");
    setSubName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleCancel(); }}>
      <DialogContent className="max-w-[672px] gap-0 p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-6 pr-14">
          <DialogTitle className="text-xl font-semibold text-slate-900">
            <Translate text={localizationConstants.addNewCategoryGroupTitle} />
          </DialogTitle>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-6 px-6 py-6">
          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-[#09090B]">
              <Translate text={localizationConstants.addNameLabel} />
            </Label>
            <Input
              placeholder={t(localizationConstants.categoryGroupNamePlaceholder)}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="bg-slate-100 border-zinc-200 focus-visible:ring-0 focus-visible:border-slate-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-[#09090B]">
              <Translate text={localizationConstants.addSubCategoryNameLabel} />
            </Label>
            <Input
              placeholder={t(localizationConstants.categoryGroupNamePlaceholder)}
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="bg-slate-100 border-zinc-200 focus-visible:ring-0 focus-visible:border-slate-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 pb-6">
          <Button
            variant="outline"
            className="border-[#CAD5E2] text-[#0A0A0A] hover:bg-slate-50 min-w-[100px]"
            onClick={handleCancel}
          >
            <Translate text={localizationConstants.cancelLabel} />
          </Button>
          <Button
            className="bg-[#111721] text-white hover:bg-[#111721]/90 min-w-[100px]"
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            <Translate text={localizationConstants.nextLabel} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
