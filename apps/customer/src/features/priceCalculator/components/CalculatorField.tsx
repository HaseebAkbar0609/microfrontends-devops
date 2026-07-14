"use client";

import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { CalculatorField as CalculatorFieldType } from "../types";

interface CalculatorFieldProps {
	field: CalculatorFieldType;
	value: number | string;
	onChange: (value: number | string) => void;
}

export function CalculatorField({ field, value, onChange }: CalculatorFieldProps) {
	const { t } = useTranslation();

	if (field.type === "slider") {
		const numericValue = typeof value === "number" ? value : Number(value);
		return (
			<div>
				<div className="mb-2 flex items-center justify-between gap-4">
					<div>
						<label className="text-sm font-medium text-slate-700">
							{t(field.labelKey)}
						</label>
						{field.subtitleKey && (
							<p className="text-xs text-slate-400">{t(field.subtitleKey)}</p>
						)}
					</div>
					<div className="flex w-[140px] items-center justify-end gap-2">
						<Input
							type="number"
							min={field.min}
							max={field.max}
							value={numericValue}
							onChange={(e) => onChange(Number(e.target.value))}
							className="h-[31px] w-[80px] rounded-lg border border-slate-200 px-3 py-1 text-sm"
						/>
						<span className="w-[30px] text-right text-sm text-slate-500">{field.unit}</span>
					</div>
				</div>
				<style>{`
					input[type="range"].calc-slider {
						-webkit-appearance: none;
						appearance: none;
						height: 8px;
						border-radius: 4px;
						background: linear-gradient(to right, #475569 0%, #475569 var(--slider-pct, 50%), #e2e8f0 var(--slider-pct, 50%), #e2e8f0 100%);
						border: none;
						outline: none;
					}
					input[type="range"].calc-slider::-webkit-slider-runnable-track {
						height: 8px;
						border-radius: 4px;
						background: transparent;
						border: none;
					}
					input[type="range"].calc-slider::-webkit-slider-thumb {
						-webkit-appearance: none;
						appearance: none;
						width: 20px;
						height: 20px;
						border-radius: 50%;
						background: #475569;
						border: 3px solid #ffffff;
						box-shadow: 0 2px 4px rgba(0,0,0,0.2);
						cursor: pointer;
						margin-top: -6px;
					}
					input[type="range"].calc-slider::-moz-range {
						height: 8px;
						border-radius: 4px;
						background: transparent;
						border: none;
					}
					input[type="range"].calc-slider::-moz-range-track {
						height: 8px;
						border-radius: 4px;
						background: transparent;
						border: none;
					}
					input[type="range"].calc-slider::-moz-range-progress {
						height: 8px;
						border-radius: 4px;
						background: #475569;
					}
					input[type="range"].calc-slider::-moz-range-thumb {
						width: 20px;
						height: 20px;
						border-radius: 50%;
						background: #475569;
						border: 3px solid #ffffff;
						box-shadow: 0 2px 4px rgba(0,0,0,0.2);
						cursor: pointer;
					}
				`}</style>
				<input
					type="range"
					min={field.min}
					max={field.max}
					step={field.step ?? 1}
					value={numericValue}
					onChange={(e) => onChange(Number(e.target.value))}
					className="calc-slider w-full cursor-pointer"
					style={{ '--slider-pct': `${((numericValue - field.min) / (field.max - field.min)) * 100}%` } as React.CSSProperties}
				/>
			</div>
		);
	}

	if (field.type === "number") {
		const numericValue = typeof value === "number" ? value : Number(value);
		return (
			<div>
				<div className="mb-2 flex items-center justify-between gap-4">
					<div>
						<label className="text-sm font-medium text-slate-700">
							{t(field.labelKey)}
						</label>
						{field.subtitleKey && (
							<p className="text-xs text-slate-400">{t(field.subtitleKey)}</p>
						)}
					</div>
					<div className="flex w-[140px] items-center justify-end gap-2">
						<Input
							type="number"
							min={field.min}
							max={field.max}
							value={numericValue}
							onChange={(e) => onChange(Number(e.target.value))}
							className="h-[31px] w-[80px] rounded-lg border border-slate-200 px-3 py-1 text-sm"
						/>
						<span className="w-[30px] text-right text-sm text-slate-500">{field.unit}</span>
					</div>
				</div>
			</div>
		);
	}

	const selectValue = typeof value === "string" ? value : String(value);

	return (
		<div>
			<label className="mb-1.5 block text-sm font-medium text-slate-700">
				{t(field.labelKey)}
			</label>
			<Select value={selectValue} onValueChange={onChange}>
				<SelectTrigger className={`h-[31px] w-full rounded-lg border-0 bg-slate-100 px-3 py-1 ${field.selectWidth ?? "max-w-[240px]"}`}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{field.options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{t(option.labelKey)}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
