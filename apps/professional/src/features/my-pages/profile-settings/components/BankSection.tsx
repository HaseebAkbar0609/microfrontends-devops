"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bankSchema, BankFormValues } from "../schemas/bank.schema";
import { Button } from "@/components/ui/button";
import { Landmark, ChevronDown, Save } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Form, FormInput, FormSelect } from "@/components/form";

export default function BankSection() {
	const inputClassName = "";

	const form = useForm<BankFormValues>({
		resolver: zodResolver(bankSchema),
		defaultValues: {
			taxTable: "30",
			// bank: "swedbank",
		},
		
	});

	const onSubmit = (data: BankFormValues) => {
		console.log(data);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex min-h-[calc(100vh-120px)]  flex-col gap-6"
			>
			<section className="rounded-md border border-slate-200 max-w-5xl bg-white py-4 ">
				<div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4 px-5">
					<div className="flex items-center gap-2 text-md font-medium text-slate-700">
						<Landmark size={24} className="text-slate-700" />
						<Translate text={localizationConstants.bank} />
					</div>
					<ChevronDown size={16} className="text-slate-400" />
				</div>
				<div className="px-5 space-y-6">
					{/* Tax Table */}
					<div className="grid grid-cols-4 gap-4">
						<FormSelect
							control={form.control}
							name="taxTable"
							label={<Translate text={localizationConstants.taxTable} />}
							placeholder={localizationConstants.selectField}
							className="space-y-1"
							labelClassName="text-sm font-medium"
							triggerClassName={`w-full ${inputClassName}`}
							options={[
								{ value: "29", label: "29" },
								{ value: "30", label: "30" },
								{ value: "31", label: "31" },
								{ value: "32", label: "32" },
							]}
						/>
					</div>

					{/* Bank Details Title */}
					<div className="text-sm font-semibold text-slate-700">
						<Translate text={localizationConstants.bankDetails} />
					</div>

					{/* Bank + Bank Account */}
					<div className="grid grid-cols-2 gap-4">
						<FormSelect
							control={form.control}
							name="bank"
							label={<Translate text={localizationConstants.bankTab} />}
							placeholder={localizationConstants.selectField}
							className="space-y-1"
							labelClassName="text-sm font-medium"
							triggerClassName={`w-full ${inputClassName}`}
							options={[
								{ value: "swedbank", label: "Swedbank" },
								{ value: "seb", label: "SEB" },
								{ value: "nordea", label: "Nordea" },
								{ value: "handelsbanken", label: "Handelsbanken" },
							]}
						/>

						<FormInput
							control={form.control}
							name="bankAccountNumber"
							label={localizationConstants.bankAccountNumber}
							placeholder={localizationConstants.bankAccountNumber}
							
						/>
					</div>

					{/* IBAN + Swish */}
					<div className="grid grid-cols-2 gap-4">
						<FormInput
							control={form.control}
							name="iban"
							label={localizationConstants.iban}
							placeholder={localizationConstants.iban}
							
						/>

						<FormInput
							control={form.control}
							name="swish"
							label={localizationConstants.swish}
							placeholder="070-xxxxx"
							
						/>
					</div>

					{/* SWIFT */}
					<div className="grid grid-cols-2 gap-4">
						<FormInput
							control={form.control}
							name="swift"
							label={localizationConstants.swift}
							placeholder="XXXXBB"
							
						/>
					</div>

				</div>
			</section>

			<div className="sticky bottom-0 -mx-6 mt-4 border-t border-slate-200 bg-slate-50 px-6 py-4
">
				<div className="flex justify-end gap-2">
					<Button
						type="button"
						variant="outline"
						className="border border-slate-200 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary)] w-[204px]"
					>
						<Translate text={localizationConstants.cancel} />
					</Button>

					<Button
						type="submit"
						className="w-[204px] bg-[var(--color-primary-black)] text-white hover:bg-[var(--color-primary-black)]"
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
