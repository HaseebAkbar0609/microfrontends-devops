"use client";

import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface DetailRowProps {
	labelKey: TranslationKeys;
	children: React.ReactNode;
}

/**
 * One labelled line of a record, as the detail dialogs draw it: the label
 * beside the value on a wide screen, above it on a narrow one.
 */
export function DetailRow({ labelKey, children }: DetailRowProps) {
	return (
		<div className="flex flex-col gap-1 border-b border-slate-100 py-2.5 last:border-b-0 sm:flex-row sm:items-center sm:gap-4">
			{/* Wide enough for "Dokumentets namn", which wraps at w-32. */}
			<span className="text-xs font-medium text-slate-500 sm:w-40 sm:shrink-0">
				<Translate text={labelKey} />
			</span>
			<div className="min-w-0 text-sm text-slate-900">{children}</div>
		</div>
	);
}

export default DetailRow;
