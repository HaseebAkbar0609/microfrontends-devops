"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

/** The value a Select carries for "no choice made"; the filter itself is null then. */
export const FILTER_ALL = "all";
export const FILTER_TRIGGER = "h-10 w-full border-slate-200 bg-white text-sm";

/** Four fields and the button, as every Prognos filter card lays them out. */
const DEFAULT_COLUMNS = "lg:grid-cols-[1fr_1fr_1.5fr_1fr_auto]";

export function FilterField({ labelKey, children }: { labelKey: TranslationKeys; children: React.ReactNode }) {
	return (
		<div className="flex w-full flex-col gap-1.5">
			<label className="text-xs font-medium text-slate-500">
				<Translate text={labelKey} />
			</label>
			{children}
		</div>
	);
}

export interface FilterSelectProps<T extends string> {
	labelKey: TranslationKeys;
	labels: Record<T, TranslationKeys>;
	value: T | null;
	onChange: (value: T | null) => void;
}

/** One Select whose options are a value → label map, plus Alla. */
export function FilterSelect<T extends string>({ labelKey, labels, value, onChange }: FilterSelectProps<T>) {
	const t = useTranslate();

	return (
		<FilterField labelKey={labelKey}>
			<Select
				value={value ?? FILTER_ALL}
				onValueChange={(next) => onChange(next === FILTER_ALL ? null : (next as T))}
			>
				<SelectTrigger className={FILTER_TRIGGER} aria-label={t(labelKey)}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={FILTER_ALL}>
						<Translate text={localizationConstants.forecastFilterAll} />
					</SelectItem>
					{(Object.keys(labels) as T[]).map((option) => (
						<SelectItem key={option} value={option}>
							<Translate text={labels[option]} />
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</FilterField>
	);
}

/**
 * A Select over values that are already the words the reader sees — a
 * department or a role as the record spells it, which no translation covers.
 */
export function FilterStringSelect({
	labelKey,
	options,
	value,
	onChange,
}: {
	labelKey: TranslationKeys;
	options: string[];
	value: string | null;
	onChange: (value: string | null) => void;
}) {
	const t = useTranslate();

	return (
		<FilterField labelKey={labelKey}>
			<Select
				value={value ?? FILTER_ALL}
				onValueChange={(next) => onChange(next === FILTER_ALL ? null : next)}
			>
				<SelectTrigger className={FILTER_TRIGGER} aria-label={t(labelKey)}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={FILTER_ALL}>
						<Translate text={localizationConstants.forecastFilterAll} />
					</SelectItem>
					{options.map((option) => (
						<SelectItem key={option} value={option}>
							{option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</FilterField>
	);
}

export interface FilterPeriodSelectProps<T extends string> {
	labelKey: TranslationKeys;
	/** Periods are an ordered list with no Alla, so they are not a label map. */
	periods: readonly { id: T; labelKey: TranslationKeys }[];
	value: T;
	onChange: (value: T) => void;
}

export function FilterPeriodSelect<T extends string>({
	labelKey,
	periods,
	value,
	onChange,
}: FilterPeriodSelectProps<T>) {
	const t = useTranslate();

	return (
		<FilterField labelKey={labelKey}>
			<Select value={value} onValueChange={(next) => onChange(next as T)}>
				<SelectTrigger className={FILTER_TRIGGER} aria-label={t(labelKey)}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{periods.map((period) => (
						<SelectItem key={period.id} value={period.id}>
							<Translate text={period.labelKey} />
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</FilterField>
	);
}

export interface FilterCardShellProps {
	titleKey: TranslationKeys;
	onReset: () => void;
	onApply: () => void;
	/** The lg grid template; the default fits four fields and the button. */
	columns?: string;
	children: React.ReactNode;
}

/**
 * The card every Prognos selection is made in: its heading, Återställ, the
 * row of fields and Välj. The selection is edited as a draft and only Välj
 * hands it on, so the page does not redraw halfway through choosing.
 */
export function FilterCardShell({ titleKey, onReset, onApply, columns = DEFAULT_COLUMNS, children }: FilterCardShellProps) {
	return (
		<Card className="gap-3 p-4">
			<div className="flex items-center justify-between">
				<h2 className="text-base font-bold text-slate-900">
					<Translate text={titleKey} />
				</h2>
				<button
					type="button"
					onClick={onReset}
					className="flex cursor-pointer items-center gap-1 text-xs font-medium text-slate-400 transition-colors hover:text-slate-700"
				>
					<Translate text={localizationConstants.forecastAnalysisFilterReset} />
					<X className="h-3.5 w-3.5" aria-hidden />
				</button>
			</div>

			<div className={cn("grid grid-cols-1 items-end gap-3 sm:grid-cols-2", columns)}>
				{children}

				<Button
					type="button"
					onClick={onApply}
					className="h-10 w-full cursor-pointer rounded-md bg-[#111827] px-6 text-sm font-medium text-white hover:bg-black sm:w-auto"
				>
					<Translate text={localizationConstants.forecastAnalysisFilterApply} />
				</Button>
			</div>
		</Card>
	);
}
