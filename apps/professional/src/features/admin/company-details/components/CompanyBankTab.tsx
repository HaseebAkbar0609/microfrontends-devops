"use client";

import { useState } from "react";
import { Landmark, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

const BANK_FIELDS = [
	{
		id: "bank",
		labelKey: localizationConstants.bank,
		placeholder: "Swedbank",
	},
	{
		id: "accountNr",
		labelKey: localizationConstants.companyBankAccountNr,
		placeholder: "123 563 633",
	},
	{
		id: "bankgiro",
		labelKey: localizationConstants.companyBankgiro,
		placeholder: "5663-2500",
	},
	{
		id: "postgiro",
		labelKey: localizationConstants.companyPostgiro,
		placeholder: "1256045-7",
	},
	{
		id: "iban",
		labelKey: localizationConstants.companyIbanNr,
		placeholder: "5626894566",
	},
	{
		id: "bic",
		labelKey: localizationConstants.companyBic,
		placeholder: "SE87009SD88",
	},
	{
		id: "swift",
		labelKey: localizationConstants.companySwiftNr,
		placeholder: "070-456 85 60",
	},
] as const;

export function CompanyBankTab() {
	const t = useTranslate();
	const [values, setValues] = useState<Record<string, string>>({});

	// Static phase: the backend has no bank-details endpoint yet, so Spara
	// only confirms the local UI state. When the API lands, replace this with
	// a mutation + error toast following the CompanyDetail.onSubmit pattern.
	const handleSave = () => {
		showToast("success", t(localizationConstants.profileUpdated));
	};

	return (
		<div className="flex min-h-[calc(100vh-320px)] flex-col gap-6">
			<CollapsibleSection
				className="rounded-md border border-slate-200 bg-white py-4"
				contentClassName="px-5"
				icon={<Landmark size={24} className="text-slate-700" />}
				title={<Translate text={localizationConstants.bankDetails} />}
				defaultOpen
			>
				<div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
					{BANK_FIELDS.map((field) => (
						<div key={field.id} className="flex flex-col gap-1.5">
							<label className="text-sm font-medium text-slate-900">
								<Translate text={field.labelKey} />
							</label>
							<Input
								value={values[field.id] ?? ""}
								onChange={(event) =>
									setValues((current) => ({
										...current,
										[field.id]: event.target.value,
									}))
								}
								placeholder={field.placeholder}
								className="h-11 border-slate-200 text-sm"
							/>
						</div>
					))}
				</div>
			</CollapsibleSection>

			<div className="sticky bottom-0 mt-auto -mx-6 border-t border-slate-200 bg-slate-50 px-6 py-4">
				<div className="flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => setValues({})}
						className="w-[204px] border border-slate-200 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary)]"
					>
						<Translate text={localizationConstants.cancel} />
					</Button>
					<Button
						type="button"
						onClick={handleSave}
						className="w-[204px] bg-[var(--color-primary-black)] text-white hover:bg-[var(--color-primary-black)]"
					>
						<Save size={16} />
						<Translate text={localizationConstants.save} />
					</Button>
				</div>
			</div>
		</div>
	);
}
