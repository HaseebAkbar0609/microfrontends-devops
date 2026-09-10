"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

export interface StepRailProps {
	/** 1-based position of the step being shown. */
	current: number;
	/**
	 * One label per step. Its length is the total, and when `showList` is off
	 * the labels are still used for the accessible name of each position.
	 */
	steps: TranslationKeys[];
	/** Draw the numbered step list under the bar. Off matches the frames. */
	showList?: boolean;
	/** Buttons under the bar — Avbryt, Spara, and whatever else the flow needs. */
	children?: React.ReactNode;
	className?: string;
}

/**
 * The right-hand "Steg n/N" progress card that every create wizard draws.
 *
 * Eight flows had hand-rolled their own copy of this bar before it was pulled
 * out here; only `OrderStepRail` had given it a real `progressbar` role, which
 * is why that one is the shape this took. Migrating the other seven is a
 * separate ticket — this exists so the ninth is not another copy.
 */
export function StepRail({
	current,
	steps,
	showList = false,
	children,
	className,
}: StepRailProps) {
	const t = useTranslate();
	const total = steps.length;
	const percent = total > 0 ? Math.round((current / total) * 100) : 0;

	return (
		<div className={cn("w-full shrink-0 xl:w-72", className)}>
			<div className="sticky top-4 space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-none">
				<div className="space-y-2.5">
					<div className="flex items-center justify-between">
						<p className="text-sm font-medium text-slate-900">
							<Translate text={localizationConstants.stepLabel} />{" "}
							{current}/{total}
						</p>
						<span className="text-xs font-medium text-slate-500">
							{percent}%
						</span>
					</div>

					<div
						className="h-1.5 w-full rounded-full bg-slate-200"
						role="progressbar"
						aria-valuenow={current}
						aria-valuemin={1}
						aria-valuemax={total}
						aria-label={t(localizationConstants.stepLabel)}
					>
						<div
							className="h-1.5 rounded-full bg-slate-900 transition-all"
							style={{ width: `${percent}%` }}
						/>
					</div>
				</div>

				{showList && (
					<ol className="space-y-1">
						{steps.map((label, index) => {
							const value = index + 1;
							const done = value < current;
							const isCurrent = value === current;

							return (
								<li
									key={label}
									aria-current={isCurrent ? "step" : undefined}
									className={cn(
										"flex items-center gap-2 rounded-md px-2 py-1.5 text-xs",
										isCurrent
											? "bg-slate-100 font-semibold text-slate-900"
											: done
												? "text-slate-500"
												: "text-slate-400",
									)}
								>
									<span
										className={cn(
											"flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
											isCurrent
												? "bg-slate-900 text-white"
												: done
													? "bg-emerald-100 text-emerald-700"
													: "bg-slate-200 text-slate-500",
										)}
									>
										{done ? (
											<Check className="h-3 w-3" aria-hidden />
										) : (
											value
										)}
									</span>
									<Translate text={label} />
								</li>
							);
						})}
					</ol>
				)}

				{children && <div className="space-y-2">{children}</div>}
			</div>
		</div>
	);
}

export default StepRail;
