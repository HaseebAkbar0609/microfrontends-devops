"use client";

import { useState } from "react";
import { Eye, Send, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { DUMMY_ASSIGNEES } from "../constants/offerForm.mock";
import { OfferFormType } from "../types";

type Props = { type: OfferFormType };

export function OfferFormRightPanel({ type }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(["4"]));
  const [showDropdown, setShowDropdown] = useState(false);

  const toggle = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const selectedNames = DUMMY_ASSIGNEES.filter((a) => selectedIds.has(a.id))
    .map((a) => a.name)
    .join(", ");

  return (
    <Card className="overflow-hidden rounded-lg border border-slate-200 bg-white p-0 shadow-sm">
      <div className="flex flex-col gap-3 p-5">
        <Button
          variant="outline"
          className="h-10 w-full border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200"
        >
          <Translate text={localizationConstants.offerSendCancel} />
        </Button>

        <Button
          variant="outline"
          className="h-10 w-full border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
        >
          <Eye className="mr-2 h-4 w-4" />
          <Translate text={localizationConstants.offerFormViewOffer} />
        </Button>

        <Button className="h-10 w-full bg-neutral-950 text-white hover:bg-neutral-800">
          <Send className="mr-2 h-4 w-4" />
          <Translate text={localizationConstants.offerFormSendOffer} />
        </Button>
      </div>

      {type === "rent" && (
        <div className="border-t border-slate-200 p-5">
          <p className="mb-2 text-sm font-medium text-slate-700">
            <Translate text={localizationConstants.offerFormAssignHyraUt} />
          </p>

          <button
            type="button"
            onClick={() => setShowDropdown((v) => !v)}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            <span className="block truncate">
              {selectedNames || "—"}
            </span>
          </button>

          {showDropdown && (
            <div className="mt-1 rounded-md border border-slate-200 bg-white shadow-md">
              {DUMMY_ASSIGNEES.map((assignee) => {
                const checked = selectedIds.has(assignee.id);
                return (
                  <button
                    key={assignee.id}
                    type="button"
                    onClick={() => toggle(assignee.id)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                      {assignee.initials}
                    </div>
                    <span className="flex-1 text-left">{assignee.name}</span>
                    {checked && <Check className="h-4 w-4 text-slate-900" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
