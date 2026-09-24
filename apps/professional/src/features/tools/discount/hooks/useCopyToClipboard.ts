"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { DISCOUNT_COPY_FEEDBACK_MS } from "../constants";

export interface UseCopyToClipboardResult {
	copied: boolean;
	copy: (value: string) => Promise<void>;
}

/**
 * Copies a discount code and flips `copied` for a short confirmation window.
 *
 * `navigator.clipboard` is unavailable on insecure origins and in older
 * browsers, so a failed or missing API surfaces an error toast telling the
 * user to copy manually rather than silently doing nothing.
 */
export function useCopyToClipboard(): UseCopyToClipboardResult {
	const t = useTranslate();
	const [copied, setCopied] = useState(false);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	const copy = useCallback(
		async (value: string) => {
			if (!value) return;

			try {
				if (!navigator.clipboard?.writeText) {
					throw new Error("Clipboard API unavailable");
				}
				await navigator.clipboard.writeText(value);
				setCopied(true);
				if (timerRef.current) clearTimeout(timerRef.current);
				timerRef.current = setTimeout(
					() => setCopied(false),
					DISCOUNT_COPY_FEEDBACK_MS,
				);
			} catch {
				showToast("error", t(localizationConstants.discountCopyFailed));
			}
		},
		[t],
	);

	return { copied, copy };
}
