"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SALES_CATEGORIES, SALES_REGIONS } from "../../constants/salesTaxonomy";
import { useSalesCompanies } from "../../hooks/useSalesCompanies";
import {
	EMPTY_SALES_COMPANY_DRAFT,
	salesCompanyDraftSchema,
} from "../../schemas/salesCompany.schema";

type CompanyDraft = {
	name: string;
	contactPerson: string;
	mobile: string;
	email: string;
	category: string;
	region: string;
};

const EMPTY_DRAFT: CompanyDraft = {
	name: "",
	contactPerson: "",
	mobile: "",
	email: "",
	category: "",
	region: "",
};

const TEXT_FIELDS = [
	{ name: "name", labelKey: localizationConstants.salesFieldCompanyName },
	{
		name: "contactPerson",
		labelKey: localizationConstants.salesFieldContactPerson,
	},
	{ name: "mobile", labelKey: localizationConstants.salesColumnPhone },
	{ name: "email", labelKey: localizationConstants.salesFieldEmail },
] as const;

type FieldErrors = Partial<Record<(typeof TEXT_FIELDS)[number]["name"], string>>;

/**
 * Adds one company straight into the call list. A new company defaults to
 * prospect, which is what puts it in the list without any extra step.
 */
export function AddCompanyForm({ onClose }: { onClose: () => void }) {
	const { addCompany } = useSalesCompanies();
	const t = useTranslate();
	const [draft, setDraft] = useState<CompanyDraft>(EMPTY_DRAFT);
	const [errors, setErrors] = useState<FieldErrors>({});

	const update = (patch: Partial<CompanyDraft>) => {
		setDraft((previous) => ({ ...previous, ...patch }));
		setErrors({});
	};

	const handleSave = async () => {
		// Same rules as the CRM's register dialog: trimmed values, valid email.
		const result = salesCompanyDraftSchema.safeParse({
			...EMPTY_SALES_COMPANY_DRAFT,
			...draft,
		});
		if (!result.success) {
			const { fieldErrors } = result.error.flatten();
			setErrors(
				Object.fromEntries(
					TEXT_FIELDS.map((field) => [field.name, fieldErrors[field.name]?.[0]]),
				),
			);
			return;
		}
		try {
			await addCompany(result.data);
			showToast("success", t(localizationConstants.salesBookerCompanyAddedToast));
			setDraft(EMPTY_DRAFT);
			onClose();
		} catch {
			showToast("error", t(localizationConstants.salesRecordSaveFailed));
		}
	};

	const selects = [
		{
			id: "category",
			labelKey: localizationConstants.salesFieldCategory,
			placeholderKey: localizationConstants.salesSelectCategoryPlaceholder,
			value: draft.category,
			options: SALES_CATEGORIES,
			onChange: (value: string) => update({ category: value }),
		},
		{
			id: "region",
			labelKey: localizationConstants.salesFieldRegion,
			placeholderKey: localizationConstants.salesSelectRegionPlaceholder,
			value: draft.region,
			options: SALES_REGIONS,
			onChange: (value: string) => update({ region: value }),
		},
	];

	return (
		<section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<h2 className="text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.salesBookerAddFormTitle} />
			</h2>

			<div className="mt-4 grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
				{TEXT_FIELDS.map((field) => {
					const error = errors[field.name];
					return (
						<div key={field.name} className="flex flex-col gap-1.5">
							<label
								className="text-sm font-medium text-slate-700"
								htmlFor={`add-company-${field.name}`}
							>
								<Translate text={field.labelKey} />
							</label>
							<Input
								id={`add-company-${field.name}`}
								value={draft[field.name]}
								aria-invalid={Boolean(error)}
								onChange={(event) => update({ [field.name]: event.target.value })}
							/>
							{error && (
								<p className="text-sm text-red-600">
									<Translate text={error} />
								</p>
							)}
						</div>
					);
				})}

				{selects.map((select) => (
					<div key={select.id} className="flex flex-col gap-1.5">
						<label className="text-sm font-medium text-slate-700">
							<Translate text={select.labelKey} />
						</label>
						<Select value={select.value} onValueChange={select.onChange}>
							<SelectTrigger className="h-10 w-full">
								<SelectValue placeholder={t(select.placeholderKey)} />
							</SelectTrigger>
							<SelectContent>
								{select.options.map((option) => (
									<SelectItem key={option.id} value={option.id}>
										{t(option.labelKey)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				))}
			</div>

			<div className="mt-4 flex flex-wrap items-center gap-3">
				<Button
					type="button"
					variant="primary"
					className="h-10 active:scale-[0.98]"
					onClick={handleSave}
				>
					<Translate text={localizationConstants.salesSaveCompanyButton} />
				</Button>
				<Button
					type="button"
					variant="ghost"
					className="h-10 active:scale-[0.98]"
					onClick={onClose}
				>
					<Translate text={localizationConstants.salesCancelButton} />
				</Button>
			</div>

			<p className="mt-3 text-sm text-slate-500">
				<Translate text={localizationConstants.salesBookerCsvHint} />
			</p>
		</section>
	);
}
