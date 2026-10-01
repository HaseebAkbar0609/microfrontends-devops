"use client";

import { useCallback } from "react";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";

/** For buttons whose page does not exist yet (details, edit, new access). */
export function useComingSoonToast() {
	const t = useTranslate();
	return useCallback(() => showToast("info", t(localizationConstants.comingSoonMessage)), [t]);
}
