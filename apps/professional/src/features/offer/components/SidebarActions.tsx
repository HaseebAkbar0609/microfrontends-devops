import React from "react";
import { Check, LayoutGrid, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export const SidebarActions = () => (
  <div className="flex flex-col gap-3">
    <div className="flex justify-end">
      <Button
        variant="secondary"
        className="gap-2 rounded-lg border border-slate-200 bg-slate-100 py-2 text-sm font-bold text-slate-900 hover:bg-slate-200 h-10"
      >
        <LayoutGrid size={18} />
        <Translate text={localizationConstants.rearrange} />
      </Button>
    </div>
    <Card className="flex flex-col gap-3 p-4 shadow-sm">
      <Button className="w-full justify-center gap-2 rounded-lg bg-gray-900 py-6 text-sm font-bold text-white hover:bg-slate-800 h-10">
        <Check size={18} />
        <Translate text={localizationConstants.save} />
      </Button>
      <Button
        variant="secondary"
        className="w-full justify-center gap-2 rounded-lg bg-slate-100 py-6 text-sm font-bold text-slate-900 hover:bg-slate-200 h-10"
      >
        <X size={18} />
        <Translate text={localizationConstants.throwAway} />
      </Button>
    </Card>
  </div>
);
