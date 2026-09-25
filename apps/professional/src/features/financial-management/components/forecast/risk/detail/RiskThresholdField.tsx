"use client";

import { Input } from "@/components/ui/input";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface RiskThresholdFieldProps {
	id: string;
	labelKey: TranslationKeys;
	helpKey: TranslationKeys;
	/** The unit the field is read in, shown inside its right edge. */
	unitKey: TranslationKeys;
	value: number;
	onChange: (value: number) => void;
	max?: number;
}

/**
 * A number with its unit inside the field, as the frame draws it. The unit is
 * decoration, so it does not take the pointer, and the input keeps room for it.
 */
export function RiskThresholdField({ id, labelKey, helpKey, unitKey, value, onChange, max }: RiskThresholdFieldProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<label htmlFor={id} className="text-sm font-semibold text-slate-900">
				<Translate text={labelKey} />
			</label>

			<div className="relative">
				<Input
					id={id}
					type="number"
					min={0}
					max={max}
					value={value}
					onChange={(event) => onChange(Number(event.target.value) || 0)}
					className="h-11 rounded-lg border-slate-200 pr-14 text-sm tabular-nums"
				/>
				<span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-slate-500">
					<Translate text={unitKey} />
				</span>
			</div>

			<p className="text-xs text-slate-500">
				<Translate text={helpKey} />
			</p>
		</div>
	);
}

export default RiskThresholdField;
