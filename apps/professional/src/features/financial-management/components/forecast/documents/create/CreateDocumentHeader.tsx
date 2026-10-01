"use client";

import { ArrowLeft } from "lucide-react";

import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

export interface CreateDocumentHeaderProps {
	onBack: () => void;
}

/**
 * The create page's own header band.
 *
 * Prognos hides its tab row on sub-routes, so this page has to carry its own
 * way back — which is what the frame draws. The label names this destination
 * rather than borrowing the generic `backAriaLabel`, which says "back to the
 * certificate list" on five screens that are nowhere near a certificate.
 */
export function CreateDocumentHeader({ onBack }: CreateDocumentHeaderProps) {
	const t = useTranslate();

	return (
		<div className="border-b border-slate-200 bg-white px-6 py-4">
			<div className="flex items-center gap-3">
				<button
					type="button"
					onClick={onBack}
					aria-label={t(localizationConstants.forecastDocumentsBackToList)}
					className="-ml-1.5 cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
				>
					<ArrowLeft className="h-5 w-5" aria-hidden />
				</button>
				<h1 className="text-xl font-bold text-slate-900">
					<Translate text={localizationConstants.forecastDocumentsCreateTitle} />
				</h1>
			</div>
		</div>
	);
}

export default CreateDocumentHeader;
