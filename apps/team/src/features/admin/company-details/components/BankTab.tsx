"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Landmark, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormInput } from "@/components/form";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import {
	bankInformationSchema,
	type BankInformationFormValues,
} from "../schemas/bankInformation.schema";
import { DEFAULT_BANK_VALUES } from "../constants/bank";

export function BankTab() {
	const t = useTranslate();
	const lastSavedRef = useRef<BankInformationFormValues | null>(DEFAULT_BANK_VALUES);

	const form = useForm<BankInformationFormValues>({
		resolver: zodResolver(bankInformationSchema),
		defaultValues: DEFAULT_BANK_VALUES,
	});
	const { handleSubmit, control } = form;

	const onSubmit = async (data: BankInformationFormValues) => {
		lastSavedRef.current = data;
		showToast("success", t(localizationConstants.save));
	};

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="flex h-full min-h-0 flex-col">
				<div className="min-h-0 flex-1 overflow-y-auto pb-1 pr-1">
				<CollapsibleSection
					className="rounded-md border border-slate-200 bg-white py-4 shadow-sm"
					contentClassName="px-5"
					icon={<Landmark size={20} className="text-slate-700" />}
					title={<Translate text={localizationConstants.adminBankDetailsTitle} />}
					defaultOpen
				>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<FormInput
							control={control}
							name="bank"
							label={localizationConstants.adminBankLabel}
							placeholder={localizationConstants.adminBankLabel}
						/>
						<FormInput
							control={control}
							name="accountNumber"
							label={localizationConstants.adminAccountNoLabel}
							placeholder={localizationConstants.adminAccountNoLabel}
						/>
						<FormInput
							control={control}
							name="bankgiro"
							label={localizationConstants.adminBankgiroLabel}
							placeholder={localizationConstants.adminBankgiroLabel}
						/>
						<FormInput
							control={control}
							name="postgiro"
							label={localizationConstants.adminPostgiroLabel}
							placeholder={localizationConstants.adminPostgiroLabel}
						/>
						<FormInput
							control={control}
							name="iban"
							label={localizationConstants.adminIbanLabel}
							placeholder={localizationConstants.adminIbanLabel}
						/>
						<FormInput
							control={control}
							name="bic"
							label={localizationConstants.adminBicLabel}
							placeholder={localizationConstants.adminBicLabel}
						/>
						<FormInput
							control={control}
							name="swift"
							label={localizationConstants.adminSwiftLabel}
							placeholder={localizationConstants.adminSwiftLabel}
						/>
					</div>
				</CollapsibleSection>
				</div>

				<div className="shrink-0 flex items-center justify-end gap-3 py-3 bg-white border-t border-[#E2E8F0]">
					<button
						type="button"
						className="cursor-pointer h-9 px-4 text-sm font-medium text-[#374151] border border-[#E2E8F0] rounded-md hover:bg-slate-50 transition-colors"
						onClick={() => {
							const lastSaved = lastSavedRef.current;
							if (lastSaved) {
								form.reset(lastSaved);
							}
						}}
					>
						<Translate text={localizationConstants.cancelLabel} />
					</button>
					<Button
						type="submit"
						className="h-9 px-5 gap-1.5 bg-[#09090B] text-white text-sm font-medium hover:bg-[#27272A]"
					>
						<Save size={16} />
						<Translate text={localizationConstants.save} />
					</Button>
				</div>
			</form>
		</Form>
	);
}
