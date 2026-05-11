"use client";

import type { ReactNode } from "react";
import { Translate } from "@/utils/translation/translate";
import type { TranslationKeys } from "@/utils/translation/constants";

export function SettingsCard({
  titleKey,
  subtitleKey,
  action,
  children,
}: {
  titleKey: TranslationKeys;
  subtitleKey?: TranslationKeys;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <div className="text-xl font-semibold text-slate-900">
            <Translate text={titleKey} />
          </div>
          {subtitleKey && (
            <div className="mt-1 text-xs text-slate-500">
              <Translate text={subtitleKey} />
            </div>
          )}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
