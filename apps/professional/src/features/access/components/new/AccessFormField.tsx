"use client";

import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ACCESS_EMPTY_CELL } from "../../constants/access.constants";
import { ACCESS_ERROR_KEYS, ACCESS_NO_SELECTION } from "../../constants/accessNew.constants";
import type { AccessFieldError } from "../../types/accessNew.types";

interface AccessFormFieldProps {
	/** Ties the label and the error text to the control. */
	id: string;
	label: TranslationKeys;
	error?: AccessFieldError;
	/** Filled into the "too long" message. */
	max?: number;
	className?: string;
	children: ReactNode;
}

/** A label over a control, with the inline error under it. */
export function AccessFormField({ id, label, error, max, className, children }: AccessFormFieldProps) {
	return (
		<div className={`flex min-w-0 flex-col gap-1 ${className ?? ""}`}>
			<Label htmlFor={id} className="text-sm font-medium text-slate-950">
				<Translate text={label} />
			</Label>
			{children}
			{error && (
				<p id={`${id}-error`} role="alert" className="text-xs text-red-600">
					<Translate text={ACCESS_ERROR_KEYS[error]} values={{ max: max ?? 0 }} />
				</p>
			)}
		</div>
	);
}

interface AccessSelectFieldProps {
	id: string;
	label: TranslationKeys;
	placeholder: TranslationKeys;
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
	error?: AccessFieldError;
	/** Adds a dash entry that clears the choice. */
	allowEmpty?: boolean;
	className?: string;
}

/** A select with a label and an inline error. An empty value shows the placeholder. */
export function AccessSelectField({ id, label, placeholder, value, onChange, options, error, allowEmpty, className }: AccessSelectFieldProps) {
	return (
		<AccessFormField id={id} label={label} error={error} className={className}>
			<Select
				value={value}
				onValueChange={(next) => onChange(next === ACCESS_NO_SELECTION ? "" : next)}
			>
				<SelectTrigger id={id} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} className="w-full cursor-pointer bg-white text-slate-900">
					<SelectValue placeholder={<Translate text={placeholder} />} />
				</SelectTrigger>
				<SelectContent>
					{allowEmpty && (
						<SelectItem value={ACCESS_NO_SELECTION} className="cursor-pointer">
							{ACCESS_EMPTY_CELL}
						</SelectItem>
					)}
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value} className="cursor-pointer">
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</AccessFormField>
	);
}
