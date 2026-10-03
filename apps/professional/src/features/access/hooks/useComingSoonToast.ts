"use client";

import { useCallback } from "react";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";

/** For buttons whose behaviour the Figma does not design yet (edit, preview, uploads, linking). */
export function useComingSoonToast() {
	const t = useTranslate();
	return useCallback(() => showToast("info", t(localizationConstants.comingSoonMessage)), [t]);
}
