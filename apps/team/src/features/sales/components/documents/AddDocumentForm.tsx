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
import {
	SALES_CUSTOM_DOCUMENT_TYPES,
	type SalesDocumentType,
} from "../../constants/salesDocumentTypes";
import { SALES_PRIMARY_BUTTON_CLASS } from "../../constants/salesTheme";
import { useSalesCompanies } from "../../hooks/useSalesCompanies";
import { useSalesDocuments } from "../../hooks/useSalesDocuments";

const NO_COMPANY = "none";

type DocumentDraft = {
	type: SalesDocumentType;
	number: string;
	companyId: string;
	date: string;
	amount: string;
};

const EMPTY_DRAFT: DocumentDraft = {
	type: "agreement",
	number: "",
	companyId: "",
	date: "",
	amount: "",
};

/** Stores one document by hand, for the types the CRM does not produce. */
export function AddDocumentForm({ onClose }: { onClose: () => void }) {
	const { companies } = useSalesCompanies();
	const { addDocument } = useSalesDocuments();
	const t = useTranslate();
	const [draft, setDraft] = useState<DocumentDraft>(EMPTY_DRAFT);
	const [error, setError] = useState<string | null>(null);

	const update = (patch: Partial<DocumentDraft>) => {
		setDraft((previous) => ({ ...previous, ...patch }));
		setError(null);
	};

	const handleSave = () => {
		if (!draft.number.trim()) {
			setError(localizationConstants.salesDocNumberRequired);
			return;
		}
		const company = companies.find((item) => item.id === draft.companyId);
		const amount = Number(draft.amount);

		addDocument({
			type: draft.type,
			number: draft.number.trim(),
			companyId: company?.id ?? "",
			companyName: company?.name ?? "",
			date: draft.date || new Date().toISOString(),
			amount: Number.isFinite(amount) ? amount : 0,
		});
		showToast("success", t(localizationConstants.salesDocAddedToast));
		setDraft(EMPTY_DRAFT);
		onClose();
	};

	return (
		<section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<h2 className="text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.salesDocAddFormTitle} />
			</h2>

			<div className="mt-4 grid grid-cols-1 gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
				<div className="flex flex-col gap-1.5">
					<label className="text-sm font-medium text-slate-700">
						<Translate text={localizationConstants.salesActivityTypeLabel} />
					</label>
					<Select
						value={draft.type}
						onValueChange={(value) => update({ type: value as SalesDocumentType })}
					>
						<SelectTrigger className="h-10 w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{SALES_CUSTOM_DOCUMENT_TYPES.map((type) => (
								<SelectItem key={type.id} value={type.id}>
									{t(type.labelKey)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-col gap-1.5">
					<label className="text-sm font-medium text-slate-700" htmlFor="document-number">
						<Translate text={localizationConstants.salesDocColumnNumber} />
					</label>
					<Input
						id="document-number"
						value={draft.number}
						onChange={(event) => update({ number: event.target.value })}
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<label className="text-sm font-medium text-slate-700">
						<Translate text={localizationConstants.salesColumnCompany} />
					</label>
					<Select
						value={draft.companyId || NO_COMPANY}
						onValueChange={(value) =>
							update({ companyId: value === NO_COMPANY ? "" : value })
						}
					>
						<SelectTrigger className="h-10 w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value={NO_COMPANY}>
								{t(localizationConstants.salesDocCompanyPlaceholder)}
							</SelectItem>
							{companies.map((company) => (
								<SelectItem key={company.id} value={company.id}>
									{company.name || company.id}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-col gap-1.5">
					<label className="text-sm font-medium text-slate-700" htmlFor="document-date">
						<Translate text={localizationConstants.dateLabel} />
					</label>
					<Input
						id="document-date"
						type="date"
						value={draft.date}
						onChange={(event) => update({ date: event.target.value })}
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<label className="text-sm font-medium text-slate-700" htmlFor="document-amount">
						<Translate text={localizationConstants.amountLabel} />
					</label>
					<Input
						id="document-amount"
						type="number"
						min={0}
						value={draft.amount}
						onChange={(event) => update({ amount: event.target.value })}
					/>
				</div>
			</div>

			{error && (
				<p className="mt-3 text-sm text-red-600">
					<Translate text={error} />
				</p>
			)}

			<div className="mt-4 flex flex-wrap items-center gap-3">
				<Button
					type="button"
					className={`h-10 cursor-pointer active:scale-[0.98] ${SALES_PRIMARY_BUTTON_CLASS}`}
					onClick={handleSave}
				>
					<Translate text={localizationConstants.salesDocSaveButton} />
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
		</section>
	);
}
