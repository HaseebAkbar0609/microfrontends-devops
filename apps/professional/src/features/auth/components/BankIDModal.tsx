"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export function BankIDModal() {
  return (
    <>
      <div
        className="flex min-h-[200px] w-full items-center justify-center rounded-lg border border-border bg-muted/30"
        aria-hidden
      >
        <span className="text-sm text-gray-700">
          <Translate text={localizationConstants.bankIdModalQrPlaceholder} />
        </span>
      </div>

      <div className="flex flex-col items-center gap-4 mt-4">
        <p className="text-center text-sm font-semibold text-primary">
          <Translate text={localizationConstants.bankIdModalUseSameDevice} />
        </p>
      </div>
    </>
  );
}
