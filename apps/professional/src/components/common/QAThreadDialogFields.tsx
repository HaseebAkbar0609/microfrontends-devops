"use client";

import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { QAThreadOption } from "./qaThread";

interface QAThreadTypeFieldProps {
	/** Shared by the radios, so they form one group. */
	name: string;
	legend: TranslationKeys;
	options: QAThreadOption[];
	value: string;
	onChange: (value: string) => void;
}

/** "Typ" in "Ny fråga": one radio per option, grouped under a legend. */
export function QAThreadTypeField({
	name,
	legend,
	options,
	value,
	onChange,
}: QAThreadTypeFieldProps) {
	return (
		<fieldset className="flex flex-col gap-2">
			<legend className="mb-2 text-sm font-medium text-slate-900">
				<Translate text={legend} />
			</legend>
			<div className="flex gap-6">
				{options.map((option) => (
					<label
						key={option.value}
						className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
					>
						<input
							type="radio"
							name={name}
							value={option.value}
							checked={value === option.value}
							onChange={() => onChange(option.value)}
							className="cursor-pointer accent-slate-900"
						/>
						<Translate text={option.label} />
					</label>
				))}
			</div>
		</fieldset>
	);
}

interface QAThreadSubjectFieldProps {
	id: string;
	label: TranslationKeys;
	placeholder: TranslationKeys;
	options: QAThreadOption[];
	value: string;
	onChange: (value: string) => void;
}

/** The select under Typ — Ämne on purchase, Funktion on a project. */
export function QAThreadSubjectField({
	id,
	label,
	placeholder,
	options,
	value,
	onChange,
}: QAThreadSubjectFieldProps) {
	const t = useTranslate();

	return (
		<div className="flex flex-col gap-2">
			<Label htmlFor={id} className="text-sm font-medium text-slate-900">
				<Translate text={label} />
			</Label>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger
					id={id}
					className="h-10 w-full cursor-pointer border-slate-200 bg-white text-sm text-slate-900 shadow-none"
				>
					<SelectValue placeholder={t(placeholder)} />
				</SelectTrigger>
				<SelectContent className="bg-white">
					{options.map((option) => (
						<SelectItem
							key={option.value}
							value={option.value}
							className="cursor-pointer"
						>
							<Translate text={option.label} />
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
