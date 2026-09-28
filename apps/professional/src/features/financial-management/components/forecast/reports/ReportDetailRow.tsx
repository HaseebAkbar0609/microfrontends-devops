"use client";

import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface ReportDetailRowProps {
	labelKey: TranslationKeys;
	children: React.ReactNode;
}

/** One labelled line of a report's record, in either report dialog. */
export function ReportDetailRow({ labelKey, children }: ReportDetailRowProps) {
	return (
		<div className="flex flex-col gap-1 border-b border-slate-100 py-2.5 last:border-b-0 sm:flex-row sm:items-center sm:gap-4">
			<span className="text-xs font-medium text-slate-500 sm:w-32 sm:shrink-0">
				<Translate text={labelKey} />
			</span>
			<div className="min-w-0 text-sm text-slate-900">{children}</div>
		</div>
	);
}

export default ReportDetailRow;
