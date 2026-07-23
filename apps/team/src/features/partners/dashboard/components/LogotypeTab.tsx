"use client";

import { useWatch, type UseFormReturn } from "react-hook-form";
import { Image as ImageUp, Save, Sparkle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormFileUpload } from "@/components/form";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import type { PartnerCompanyProfileFormValues } from "../schemas/companyProfile.schema";

type LogotypeTabProps = {
	form: UseFormReturn<PartnerCompanyProfileFormValues>;
	onSubmit: (data: PartnerCompanyProfileFormValues) => Promise<void>;
	lastSavedRef: { current: PartnerCompanyProfileFormValues | null };
};

export function LogotypeTab({ form, onSubmit, lastSavedRef }: LogotypeTabProps) {
	const t = useTranslate();
	const { handleSubmit, control } = form;
	const companyLogotype = useWatch({ control, name: "companyLogotype" });

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit(onSubmit)} className="flex h-full min-h-0 flex-col">
				<div className="min-h-0 flex-1 overflow-y-auto pb-1 pr-1">
					<CollapsibleSection
						className="w-197.5 rounded-md border border-slate-200 bg-white py-4 shadow-sm"
						contentClassName="px-5"
						icon={<ImageUp size={20} className="text-slate-700" />}
						title={<Translate text={localizationConstants.companyLogotype} />}
						defaultOpen
					>
						<div className="flex flex-col gap-10">
							<div className="w-96">
								<FormFileUpload
									control={control}
									name="companyLogotype"
									label={localizationConstants.uploadYourLogotype}
									buttonLabel={localizationConstants.upload}
									placeholder={localizationConstants.noFileChosen}
									helperText={localizationConstants.logotypeFileTypesAllowed}
									accept="image/png,image/jpeg,application/pdf"
									allowedTypes={["image/png", "image/jpeg", "application/pdf"]}
									showPreview={false}
									buttonClassName="bg-[#0F172A] text-[#F8FAFC] hover:bg-[#1E293B]"
									onFileSelected={() => showToast("success", t(localizationConstants.toastLogoUploaded))}
								/>
							</div>

							{companyLogotype && (
								<div className="w-96">
									<p className="mb-2 text-sm font-medium text-[#020617]">
										<Translate text={localizationConstants.logo} />
									</p>
									<div className="relative flex h-16 w-96 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
										<div className="flex items-center gap-2">
											<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500">
												<Sparkle size={16} className="text-white" />
											</span>
											<span className="text-sm font-medium text-slate-900">
												{companyLogotype instanceof File ? companyLogotype.name : "Logoipsum"}
											</span>
										</div>
										<button
											type="button"
											aria-label={t(localizationConstants.removeLogo)}
											className="absolute right-2 top-2 cursor-pointer rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
											onClick={() => {
												form.setValue("companyLogotype", null);
												showToast("success", t(localizationConstants.toastLogoRemoved));
											}}
										>
											<X size={16} />
										</button>
									</div>
								</div>
							)}
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
