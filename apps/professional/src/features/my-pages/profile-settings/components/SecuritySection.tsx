"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { securitySchema, SecurityFormValues } from "../schemas/security.schema";
import {  Save, Shield } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Form, FormInput } from "@/components/form";

export default function SecuritySection() {

	const form = useForm<SecurityFormValues>({
		resolver: zodResolver(securitySchema),
	});

	const onSubmit = (data: SecurityFormValues) => {
		console.log(data);
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
