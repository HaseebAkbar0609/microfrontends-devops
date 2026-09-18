"use client";

import { Beaker, FlaskConical } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { SALES_STATUSES } from "../constants/salesStatuses";
import type { SalesStatusFilter } from "../types";

type SalesStatusSummaryCardsProps = {
	counts: Record<string, number>;
	activeFilter: SalesStatusFilter;
	onFilterChange: (filter: SalesStatusFilter) => void;
};

type SummaryCardProps = {
	labelKey: string;
	hintKey: string;
	count: number;
	accentClassName: string;
	isActive: boolean;
	icon?: LucideIcon;
	onClick: () => void;
};

function SummaryCard({
	labelKey,
	hintKey,
	count,
	accentClassName,
	isActive,
	icon: Icon,
	onClick,
}: SummaryCardProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={isActive}
			className={`cursor-pointer rounded-xl border p-4 text-left transition-colors ${
				isActive
					? "border-teal-600 bg-teal-50/50 ring-1 ring-teal-600"
					: "border-slate-200 bg-white hover:bg-slate-50"
			}`}
		>
			<span
				className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ${accentClassName}`}
			>
				{Icon ? <Icon className="h-3.5 w-3.5" /> : null}
				<Translate text={labelKey} />
			</span>
			<p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">
				{count}
			</p>
			<p className="text-xs text-slate-500">
				<Translate text={hintKey} />
			</p>
		</button>
	);
}

/** Pipeline counters across the top of the overview; each one filters the table. */
export function SalesStatusSummaryCards({
	counts,
	activeFilter,
	onFilterChange,
}: SalesStatusSummaryCardsProps) {
	return (
		<div className="flex flex-col gap-2.5">
			<div className="grid grid-cols-1 gap-2.5 @2xl:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-5">
				{SALES_STATUSES.map((status) => (
					<SummaryCard
						key={status.id}
						labelKey={status.labelKey}
						hintKey={status.hintKey}
						count={counts[status.id] ?? 0}
						accentClassName={status.accentClassName}
						isActive={activeFilter === status.id}
						onClick={() => onFilterChange(status.id)}
					/>
				))}
			</div>

			<div className="grid grid-cols-1 gap-2.5 @2xl:grid-cols-2">
				<SummaryCard
					labelKey={localizationConstants.salesDemoAccountsTitle}
					hintKey={localizationConstants.salesDemoAccountsHint}
					count={counts.demo ?? 0}
					accentClassName="bg-sky-50 text-sky-700"
					isActive={activeFilter === "demo"}
					icon={FlaskConical}
					onClick={() => onFilterChange("demo")}
				/>
				<SummaryCard
					labelKey={localizationConstants.salesTestAccountsTitle}
					hintKey={localizationConstants.salesTestAccountsHint}
					count={counts.test ?? 0}
					accentClassName="bg-violet-50 text-violet-700"
					isActive={activeFilter === "test"}
					icon={Beaker}
					onClick={() => onFilterChange("test")}
				/>
			</div>
		</div>
	);
}
