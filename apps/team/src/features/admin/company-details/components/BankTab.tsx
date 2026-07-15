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
			<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
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

				<div className="sticky bottom-0 mt-6 border-t border-slate-200 bg-white py-3 z-10">
					<div className="flex justify-end gap-4">
						<Button
							variant="outline"
							type="button"
							className="border border-slate-200 bg-white hover:bg-slate-50"
							onClick={() => {
								const lastSaved = lastSavedRef.current;
								if (lastSaved) {
									form.reset(lastSaved);
								}
							}}
						>
							<Translate text={localizationConstants.cancelLabel} />
						</Button>
						<Button
							type="submit"
							className="bg-[#09090B] text-white hover:bg-[#09090B]/90"
						>
							<Save size={16} />
							<Translate text={localizationConstants.save} />
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
