"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { SalesTaxonomyOption } from "../../constants/salesTaxonomy";
import type { SalesCompany } from "../../types";

/** Company fields the detail card edits as free text. */
export type EditableTextField = Extract<
	keyof SalesCompany,
	| "name"
	| "organisationNumber"
	| "trade"
	| "city"
	| "contactPerson"
	| "mobile"
	| "email"
	| "source"
	| "accountManager"
	| "seller"
	| "startYear"
>;

/** Company fields the detail card edits as numbers. */
export type EditableNumberField = Extract<
	keyof SalesCompany,
	"employees" | "revenue"
>;

type CompanyTextFieldProps = {
	company: SalesCompany;
	field: EditableTextField;
	labelKey: string;
	type?: "text" | "email" | "tel";
	onChange: (patch: Partial<SalesCompany>) => void;
};

export function CompanyTextField({
	company,
	field,
	labelKey,
	type = "text",
	onChange,
}: CompanyTextFieldProps) {
	const inputId = `company-${field}`;
	return (
		<div className="space-y-1.5">
			<Label htmlFor={inputId}>
				<Translate text={labelKey} />
			</Label>
			<Input
				id={inputId}
				type={type}
				value={company[field]}
				onChange={(event) => onChange({ [field]: event.target.value })}
			/>
		</div>
	);
}

type CompanyNumberFieldProps = {
	company: SalesCompany;
	field: EditableNumberField;
	labelKey: string;
	onChange: (patch: Partial<SalesCompany>) => void;
};

export function CompanyNumberField({
	company,
	field,
	labelKey,
	onChange,
}: CompanyNumberFieldProps) {
	const inputId = `company-${field}`;
	return (
		<div className="space-y-1.5">
			<Label htmlFor={inputId}>
				<Translate text={labelKey} />
			</Label>
			<Input
				id={inputId}
				type="number"
				min={0}
				value={company[field]}
				onChange={(event) =>
					onChange({ [field]: Math.max(0, Number(event.target.value) || 0) })
				}
			/>
		</div>
	);
}

type CompanyTaxonomyFieldProps = {
	value: string;
	field: "category" | "region";
	labelKey: string;
	placeholderKey: string;
	options: SalesTaxonomyOption[];
	onChange: (patch: Partial<SalesCompany>) => void;
};

export function CompanyTaxonomyField({
	value,
	field,
	labelKey,
	placeholderKey,
	options,
	onChange,
}: CompanyTaxonomyFieldProps) {
	const t = useTranslate();
	return (
		<div className="space-y-1.5">
			<Label htmlFor={`company-${field}`}>
				<Translate text={labelKey} />
			</Label>
			<Select
				value={value || undefined}
				onValueChange={(next) => onChange({ [field]: next })}
			>
				<SelectTrigger id={`company-${field}`} className="w-full">
					<SelectValue placeholder={t(placeholderKey)} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.id} value={option.id}>
							<Translate text={option.labelKey} />
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
