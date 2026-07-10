"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { securitySchema, SecurityFormValues } from "../schemas/security.schema";
import { Save, Shield, Loader2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Form, FormInput } from "@/components/form";
import { showToast } from "@/lib/toast";
import { useChangePassword } from "../hooks/useProfileSettings";
import type { AxiosError } from "axios";

export default function SecuritySection() {
	const form = useForm<SecurityFormValues>({
		resolver: zodResolver(securitySchema),
	});

	const changePassword = useChangePassword();

	const onSubmit = async (data: SecurityFormValues) => {
		try {
			await changePassword.mutateAsync({
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
			});
			form.reset();
			showToast("success", localizationConstants.profileUpdated);
		} catch (error: unknown) {
			// Show a specific message for wrong current password vs generic server errors.
			const detail = (error as AxiosError<{ detail?: string }>)?.response?.data?.detail;
			const msg =
				detail === "INVALID_CURRENT_PASSWORD"
					? localizationConstants.invalidCurrentPassword
					: localizationConstants.profileUpdateFailed;
			showToast("error", msg);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-6"
			>
				<section className="rounded-md border max-w-5xl  border-slate-200 bg-white py-4 shadow-sm">
					<div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4 px-5">
						<div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
							<Shield size={16} className="text-slate-500" />
							<Translate text={localizationConstants.security} />
						</div>
					</div>
					<div className="px-5">
						<div className="grid grid-cols-2 gap-4">
							<FormInput
								control={form.control}
								name="currentPassword"
								label={localizationConstants.currentPassword}
								placeholder={localizationConstants.currentPassword}
								type="password"

							/>
							<FormInput
								control={form.control}
								name="newPassword"
								label={localizationConstants.newPassword}
								placeholder={localizationConstants.newPassword}
								type="password"

							/>
						</div>

						<div className="mt-4 grid grid-cols-2 gap-4">
							<FormInput
								control={form.control}
								name="confirmPassword"
								label={localizationConstants.confirmPassword}
								placeholder={localizationConstants.confirmPassword}
								type="password"

							/>
						</div>
					</div>
				</section>

				<div className="sticky bottom-0 -mx-6 mt-4 border-t border-slate-200 bg-slate-50 px-6 py-4">
					<div className="flex justify-end gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => form.reset()}
							className="border border-slate-200 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary)] w-[204px]"
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							type="submit"
							disabled={changePassword.isPending}
							className="w-[204px] bg-[var(--color-primary-black)] text-white hover:bg-[var(--color-primary-black)]"
						>
							{changePassword.isPending ? (
								<Loader2 size={16} className="animate-spin" />
							) : (
								<Save size={16} />
							)}
							<Translate text={localizationConstants.save} />
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
