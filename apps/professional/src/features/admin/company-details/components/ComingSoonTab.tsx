"use client";

import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export function ComingSoonTab() {
  return (
    <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
      <Translate text={localizationConstants.comingSoonMessage} />
    </div>
  );
}
