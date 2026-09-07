"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";

type SupportStatCardProps = {
	labelKey: string;
	value: ReactNode;
	icon?: LucideIcon;
	/** Small note under the value, e.g. a country count. */
	hint?: ReactNode;
	/** Colours the value, for KPIs that signal a problem. */
	valueClassName?: string;
	className?: string;
};

/** The KPI tile used across every support page. */
export function SupportStatCard({
	labelKey,
	value,
	icon: Icon,
	hint,
	valueClassName,
	className,
}: SupportStatCardProps) {
	return (
		<div
			className={cn(
				"rounded-xl border border-slate-200 bg-white p-4 shadow-2xs",
				className,
			)}
		>
			<div className="flex items-start justify-between gap-3">
				<p className="text-sm text-slate-500">
					<Translate text={labelKey} />
				</p>
				{Icon ? (
					<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
						<Icon className="h-4 w-4" />
					</span>
				) : null}
			</div>
			<p
				className={cn(
					"mt-2 text-3xl font-semibold tabular-nums tracking-tight text-slate-900",
					valueClassName,
				)}
			>
				{value}
			</p>
			{hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
		</div>
	);
}
