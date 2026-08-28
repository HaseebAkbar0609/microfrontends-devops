"use client";

import { Folder } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/form";
import { cn } from "@/lib/utils";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { ComplaintCompany } from "../types";

const FIELD_CLASS =
	"h-10 rounded-md border-slate-200 shadow-none focus-visible:border-gray-300 focus-visible:outline-none";

export interface ComplaintCompanySelectOption {
	id: string;
	name: string;
}

export interface ComplaintCompanyCardProps {
	titleKey: TranslationKeys;
	value: ComplaintCompany;
	onChange: (patch: Partial<ComplaintCompany>) => void;
	errors?: Partial<Record<keyof ComplaintCompany, string>>;
	/** Renders the leading Leverantör picker; only the supplier card has one. */
	selectOptions?: ComplaintCompanySelectOption[];
	selectedId?: string;
	onSelect?: (id: string) => void;
	/** Validation message for the picker; the description makes it mandatory. */
	selectError?: string;
}

/**
 * Company block from the complaint wizard: Företag, Adress, Telefon, Mail.
 *
 * The design uses this shape twice — Leverantörsinformation and Kontakt för
 * reklamationen — the first with a supplier picker above the fields.
 *
 * Deliberately not `CustomerDetailsCard`: that renders seven fields, and this
 * card has four.
 */
export function ComplaintCompanyCard({
	titleKey,
	value,
	onChange,
	errors = {},
	selectOptions,
	selectedId,
	onSelect,
	selectError,
}: ComplaintCompanyCardProps) {
	const t = useTranslate();

	const field = (
		key: keyof ComplaintCompany,
		labelKey: TranslationKeys,
		type?: string,
	) => (
		<div className="space-y-1">
			<Label className="text-sm font-medium text-slate-700">
				<Translate text={labelKey} />
			</Label>
			<Input
				type={type}
				value={value[key]}
				onChange={(event) => onChange({ [key]: event.target.value })}
				placeholder={t(labelKey)}
				className={cn(FIELD_CLASS, errors[key] && "border-red-500")}
			/>
			{errors[key] && (
				<p className="mt-1 text-xs font-normal text-red-500">
					{t(errors[key] as TranslationKeys)}
				</p>
			)}
		</div>
	);

	return (
		<Card className="rounded-lg border border-slate-200 bg-white pb-4 shadow-none">
			<CardHeader className="flex h-12 flex-row items-center border-b border-slate-200 px-4 py-0 [.border-b]:pb-0">
				<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
					<Folder className="h-5 w-5 text-slate-700" />
					<Translate text={titleKey} />
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 px-4 py-0">
				{selectOptions && (
					<div className="space-y-1">
						<Label className="text-sm font-medium text-slate-700">
							<Translate
								text={
									localizationConstants.complaintFieldSupplier
								}
							/>
							<span className="text-red-500"> *</span>
						</Label>
						<SearchableSelect
							value={selectedId ?? ""}
							onChange={(id) => onSelect?.(id)}
							options={selectOptions.map((option) => ({
								value: option.id,
								label: option.name,
							}))}
							allowCustom={false}
							hasError={Boolean(selectError)}
							placeholder={t(
								localizationConstants.complaintFieldSupplierPlaceholder,
							)}
							searchPlaceholder={t(
								localizationConstants.search,
							)}
						/>
						{selectError && (
							<p className="mt-1 text-xs font-normal text-red-500">
								{t(selectError as TranslationKeys)}
							</p>
						)}
					</div>
				)}

				<div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
					{field(
						"company",
						localizationConstants.complaintFieldCompany,
					)}
					{field("address", localizationConstants.orderAddressLabel)}
					{field("phone", localizationConstants.orderTelefonLabel)}
					{field(
						"email",
						localizationConstants.orderMailLabel,
						"email",
					)}
				</div>
			</CardContent>
		</Card>
	);
}

export default ComplaintCompanyCard;
