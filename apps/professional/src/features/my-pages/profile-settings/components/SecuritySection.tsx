"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { securitySchema, SecurityFormValues } from "../schemas/security.schema";
import { Save, Shield } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Form, FormCheckbox, FormTextarea } from "@/components/form";
import { showToast } from "@/lib/toast";

const DEFAULT_SECURITY_VALUES: SecurityFormValues = {
	twoFactorEnabled: true,
	securityQuestion: "",
	securityAnswer: "",
	acceptTerms: true,
};

export default function SecuritySection() {
	const form = useForm<SecurityFormValues>({
		resolver: zodResolver(securitySchema),
		defaultValues: DEFAULT_SECURITY_VALUES,
	});

	const onSubmit = (_data: SecurityFormValues) => {
		showToast("success", localizationConstants.profileUpdated);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex min-h-[calc(100vh-180px)] flex-col gap-6"
			>
				<section className="max-w-5xl rounded-md border border-slate-200 bg-white py-4">
					<div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4 px-5">
						<div className="flex items-center gap-2 text-md font-medium text-slate-700">
							<Shield size={24} className="text-slate-700" />
							<Translate
								text={
									localizationConstants.securityPrivacyTitle
								}
							/>
						</div>
					</div>

					<div className="space-y-6 px-5">
						<div>
							<label className="mb-3 block text-sm font-semibold text-slate-800">
								<Translate
									text={localizationConstants.twoFactorAuth}
								/>
							</label>
							<div className="flex items-center gap-3">
								<Controller
									control={form.control}
									name="twoFactorEnabled"
									render={({ field }) => (
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									)}
								/>
								<span className="text-sm text-slate-800">
									<Translate
										text={
											localizationConstants.twoFactorEnable
										}
									/>
								</span>
							</div>
						</div>

						<div className="border-t border-slate-200 pt-6">
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<FormTextarea
									control={form.control}
									name="securityQuestion"
									label={
										localizationConstants.securityQuestionLabel
									}
									placeholder={
										localizationConstants.textField
									}
								/>
								<FormTextarea
									control={form.control}
									name="securityAnswer"
									label={
										localizationConstants.securityAnswerLabel
									}
									placeholder={
										localizationConstants.textField
									}
								/>
							</div>
						</div>

						<div className="border-t border-slate-200 pt-6">
							<label className="mb-3 block text-sm font-semibold text-slate-800">
								<Translate
									text={localizationConstants.termsOfUseTitle}
								/>
							</label>
							<FormCheckbox
								control={form.control}
								name="acceptTerms"
								label={
									<Translate
										text={
											localizationConstants.termsAcceptLabel
										}
									/>
								}
								className="space-y-0"
								labelClassName="text-sm text-slate-800"
								variant="secondary"
							/>
						</div>
					</div>
				</section>

				<div className="sticky bottom-0 -mx-6 mt-4 border-t border-slate-200 bg-slate-50 px-6 py-4">
					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => form.reset(DEFAULT_SECURITY_VALUES)}
							className="w-[204px] border border-slate-200 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary)]"
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
