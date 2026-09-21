"use client";

import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { openSafeUrl } from "@/lib/safeUrl";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { disposePrintFrame, printStoredFile } from "../../../shared/printStoredFile";

/**
 * Opening and printing a protocol's stored file — the list's ⋮ and an
 * uploaded protocol's page. Only a URL the store minted gets here, and
 * `openSafeUrl` checks it again. Both run in the click, so a fallback tab is
 * not blocked; the print frame, if one was used, leaves with the page.
 *
 * Uses react-i18next's `t`, which keeps its identity between renders.
 */
export function useProtocolFileActions() {
	const { t } = useTranslation();

	useEffect(() => disposePrintFrame, []);

	const openFile = useCallback(
		(url?: string) => {
			if (!openSafeUrl(url)) showToast("error", t(localizationConstants.projectProtocolNoFile));
		},
		[t],
	);

	/** Prints the file itself, not the page around it. */
	const printFile = useCallback(
		(url?: string) => {
			if (!url) {
				showToast("error", t(localizationConstants.projectProtocolNoFile));
				return;
			}
			const failed = () => showToast("error", t(localizationConstants.projectProtocolPrintFailed));
			if (!printStoredFile(url, failed)) failed();
		},
		[t],
	);

	return { openFile, printFile };
}
