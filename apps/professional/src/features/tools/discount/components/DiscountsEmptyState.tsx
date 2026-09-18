"use client";

import { SearchX, TicketPercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

interface DiscountsEmptyStateProps {
	/** True when filters hid every discount; false when the data source is empty. */
	isFiltered: boolean;
	onClearFilters: () => void;
}

export function DiscountsEmptyState({
	isFiltered,
	onClearFilters,
}: DiscountsEmptyStateProps) {
	const Icon = isFiltered ? SearchX : TicketPercent;

	return (
		<div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
			<div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F1F5F9]">
				<Icon className="h-6 w-6 text-slate-400" />
			</div>

			<h3 className="text-base font-semibold text-[#0A0A0A]">
				<Translate
					text={
						isFiltered
							? localizationConstants.discountsNoResultsTitle
							: localizationConstants.discountsEmptyTitle
					}
				/>
			</h3>

			<p className="max-w-md text-sm leading-5 text-[#64748B]">
				<Translate
					text={
						isFiltered
							? localizationConstants.discountsNoResultsDescription
							: localizationConstants.discountsEmptyDescription
					}
				/>
			</p>

			{isFiltered && (
				<Button
					type="button"
					variant="outline"
					onClick={onClearFilters}
					className="mt-1 h-9 rounded-[6px] border-slate-200 px-4 text-sm font-medium"
				>
					<Translate text={localizationConstants.discountsClearFilters} />
				</Button>
			)}
		</div>
	);
}
