"use client";

import { Button } from "@/components/ui/button";
import { openSafeUrl } from "@/lib/safeUrl";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

export interface AtaDocumentViewButtonProps {
	fileName: string;
	/** The stored file's URL; without one there is nothing to open. */
	url?: string;
}

/**
 * The supplier View ÄTA's per-document "Visa" (the frame's "View"). Opens the
 * stored file in a new tab through `openSafeUrl`; with no file behind the row
 * it is disabled and says why.
 */
export function AtaDocumentViewButton({ fileName, url }: AtaDocumentViewButtonProps) {
	const t = useTranslate();
	const noPreview = t(localizationConstants.projectAtaNoPreview);

	return (
		<span title={url ? undefined : noPreview} className="inline-flex">
			<Button
				type="button"
				variant="outline"
				disabled={!url}
				onClick={() => {
					if (!openSafeUrl(url)) showToast("error", noPreview);
				}}
				aria-label={`${t(localizationConstants.projectAtaSupplierViewDocument)} ${fileName}`}
				className="h-9 cursor-pointer border-slate-200 px-4 text-sm font-medium text-slate-900"
			>
				<Translate text={localizationConstants.projectAtaSupplierViewDocument} />
			</Button>
			{!url && (
				<span className="sr-only">
					<Translate text={localizationConstants.projectAtaNoPreview} />
				</span>
			)}
		</span>
	);
}

export default AtaDocumentViewButton;
