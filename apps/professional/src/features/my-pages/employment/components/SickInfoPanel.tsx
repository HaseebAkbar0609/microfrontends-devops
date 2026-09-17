"use client";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
export default function SickInfoPanel() {
  return <p className="rounded-md border border-slate-200 bg-white p-5 text-sm text-slate-500">
    <Translate text={localizationConstants.myPagesNoContacts} />
  </p>;
}
