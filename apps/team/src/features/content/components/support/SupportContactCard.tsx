"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useContentSections } from "../../hooks/useContentSections";
import {
	supportContactSchema,
	type SupportContactValues,
} from "../../schemas/supportContact.schema";
import type { ContentGroupId, SupportContact } from "../../types";

type SupportContactCardProps = {
	groupId: ContentGroupId;
	contact: SupportContact;
};

/**
 * Phone, email and opening hours for the support page.
 *
 * In the prototype "Spara kontaktuppgifter" only raised a toast and the edits
 * were dropped; here the values go to the provider and survive navigation.
 */
export function SupportContactCard({
	groupId,
	contact,
}: SupportContactCardProps) {
	const { setContact } = useContentSections();
	const t = useTranslate();

	const form = useForm<SupportContactValues>({
		resolver: zodResolver(supportContactSchema),
		defaultValues: contact,
		mode: "onSubmit",
	});

	const submit = form.handleSubmit((values) => {
		setContact(groupId, values);
		showToast("success", t(localizationConstants.contentContactSavedToast));
	});

	return (
		<section className="rounded-xl border border-slate-200 bg-white shadow-2xs">
			<header className="border-b border-slate-200 px-5 py-4">
				<h2 className="text-base font-semibold text-slate-900">
					<Translate text={localizationConstants.contentSupportContactTitle} />
				</h2>
			</header>

			<Form {...form}>
				<form onSubmit={submit} className="flex flex-col gap-4 px-5 py-5">
					<div className="grid grid-cols-1 gap-4 @2xl:grid-cols-3">
						<FormInput
							control={form.control}
							name="phone"
							label={localizationConstants.contentSupportPhone}
						/>
						<FormInput
							control={form.control}
							name="email"
							type="email"
							label={localizationConstants.contentSupportEmail}
						/>
						<FormInput
							control={form.control}
							name="hours"
							label={localizationConstants.contentSupportHours}
						/>
					</div>

					<Button type="submit" className="w-fit cursor-pointer">
						<Save className="size-4" aria-hidden />
						<Translate
							text={localizationConstants.contentSaveContactButton}
						/>
					</Button>
				</form>
			</Form>
		</section>
	);
}

export default SupportContactCard;
