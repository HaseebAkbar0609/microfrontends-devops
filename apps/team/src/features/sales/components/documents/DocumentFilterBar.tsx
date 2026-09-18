"use client";

import { Search } from "@/components/search/Search";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	SALES_DOCUMENT_TYPES,
	type SalesDocumentType,
} from "../../constants/salesDocumentTypes";

type DocumentFilterBarProps = {
	type: SalesDocumentType | "all";
	onTypeChange: (type: SalesDocumentType | "all") => void;
	counts: Record<string, number>;
	query: string;
	onQueryChange: (value: string) => void;
};

/** One pill per document type, each showing how many it holds. */
export function DocumentFilterBar({
	type,
	onTypeChange,
	counts,
	query,
	onQueryChange,
}: DocumentFilterBarProps) {
	const t = useTranslate();

	const pills = [
		{ id: "all" as const, labelKey: localizationConstants.salesDocFilterAll },
		...SALES_DOCUMENT_TYPES,
	];

	return (
		<div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b border-slate-200 px-5 py-4">
			<div className="flex flex-wrap items-center gap-2">
				{pills.map((pill) => {
					const isActive = pill.id === type;

					return (
						<button
							key={pill.id}
							type="button"
							aria-pressed={isActive}
							onClick={() => onTypeChange(pill.id)}
							className={cn(
								"cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
								isActive
									? "border-teal-600 bg-teal-50/50 text-teal-800"
									: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
							)}
						>
							<Translate text={pill.labelKey} />{" "}
							<span className="tabular-nums text-slate-500">
								{counts[pill.id] ?? 0}
							</span>
						</button>
					);
				})}
			</div>

			<Search
				value={query}
				onChange={onQueryChange}
				placeholder={t(localizationConstants.salesDocSearchPlaceholder)}
				wrapperClassName="w-[300px]"
			/>
		</div>
	);
}
