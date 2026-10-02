"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useComingSoonToast } from "../../hooks/useComingSoonToast";

interface AccessUploadRowProps {
	label: TranslationKeys;
	hint: TranslationKeys;
	placeholder: TranslationKeys;
}

/**
 * The upload field and its dark Upload button, as in the Figma frames. How files get
 * chosen and uploaded is not designed, so both show the coming-soon toast.
 */
export function AccessUploadRow({ label, hint, placeholder }: AccessUploadRowProps) {
	const showComingSoon = useComingSoonToast();

	return (
		<div>
			<p className="text-sm font-medium text-slate-950">
				<Translate text={label} />
			</p>
			<p className="text-sm text-slate-500">
				<Translate text={hint} />
			</p>
			<div className="mt-1 flex items-center gap-3">
				<button
					type="button"
					onClick={showComingSoon}
					className="flex min-h-9 flex-1 cursor-pointer items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-left text-sm text-slate-500 shadow-xs"
				>
					<Translate text={placeholder} />
					<ChevronDown className="h-5 w-5" aria-hidden />
				</button>
				<Button type="button" className="h-9 cursor-pointer bg-zinc-900 px-4 text-white hover:bg-zinc-800" onClick={showComingSoon}>
					<Translate text={localizationConstants.accessImagesUploadButton} />
				</Button>
			</div>
		</div>
	);
}
