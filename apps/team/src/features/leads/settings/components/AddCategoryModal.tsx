"use client";

import { useState } from "react";
import { X, CirclePlus } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTags?: string[];
  onSave: (tags: string[]) => void;
};

export function AddCategoryModal({ open, onOpenChange, initialTags = [], onSave }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<string[]>(initialTags);

  const addTag = () => {
    const v = inputValue.trim();
    if (!v || tags.includes(v)) return;
    setTags((prev) => [...prev, v]);
    setInputValue("");
  };

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((t) => t !== tag));

  const handleSave = () => {
    if (inputValue.trim()) addTag();
    onSave(tags.concat(inputValue.trim() ? [inputValue.trim()] : []));
    reset();
    onOpenChange(false);
  };

  const reset = () => {
    setInputValue("");
    setTags([]);
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogContent className="max-w-[672px] gap-0 p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-6 pr-14">
          <DialogTitle className="text-xl font-semibold leading-7 tracking-tight text-[#0F172B]">
            <Translate text={localizationConstants.addNewSubCategoryTitle} />
          </DialogTitle>
        </div>

        {/* Input */}
        <div className="px-6 pt-6">
          <div className="flex flex-col gap-1">
            <Label className="text-sm font-medium text-[#09090B]">
              <Translate text={localizationConstants.addSubCategoryNameLabel} />
            </Label>
            <Input
              placeholder="Kitchen renovation"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="bg-slate-100 border-zinc-200 focus-visible:ring-0 focus-visible:border-slate-400"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="px-6 pt-6 pb-2">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-0.5 rounded-md bg-zinc-100 py-1 pl-2 pr-1"
              >
                <span className="text-xs font-medium text-[#09090B]">{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="flex items-center justify-center rounded p-0.5 hover:bg-zinc-200"
                >
                  <X className="h-3 w-3 text-[#09090B]" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={addTag}
              className="flex items-center gap-1 rounded-md border border-dashed border-neutral-300 bg-zinc-100 py-1 pl-3 pr-2 text-xs font-medium text-[#666666] hover:bg-zinc-200"
            >
              <CirclePlus className="h-4 w-4" />
              <Translate text={localizationConstants.addLabel} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4">
          <Button
            variant="outline"
            className="min-w-[100px] border-[#CAD5E2] text-[#0A0A0A] hover:bg-slate-50"
            onClick={handleClose}
          >
            <Translate text={localizationConstants.cancelLabel} />
          </Button>
          <Button
            className="min-w-[100px] bg-[#111721] text-white hover:bg-[#111721]/90"
            onClick={handleSave}
            disabled={tags.length === 0 && !inputValue.trim()}
          >
            <Translate text={localizationConstants.nextLabel} />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
