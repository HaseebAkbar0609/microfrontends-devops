"use client";

import { Loader2, Pencil, Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import localizationConstants from "@/utils/translation/constants";
import { CONSULTANT_TYPE_LIMITS } from "../../constants/content.constants";
import type { ConsultantTypeFormState } from "../../hooks/useConsultantTypeForm";
import type { ContentSection } from "../../types";
import { ConsultantTypeSectionsEditor } from "./ConsultantTypeSectionsEditor";

type ConsultantTypeFormCardProps = {
	section: ContentSection;
	typeForm: ConsultantTypeFormState;
};

/** Add/edit form for one consultant type: its name and described sections. */
export function ConsultantTypeFormCard({
	section,
	typeForm,
}: ConsultantTypeFormCardProps) {
	const { form, submit, reset, editingId, isSaving } = typeForm;
	const { t, i18n } = useTranslation();

	const title = `${t(
		editingId
			? localizationConstants.contentEditTitlePrefix
			: localizationConstants.contentAddTitlePrefix,
	)} ${t(section.itemLabelKey)}`;

	// Schema messages are translation keys; the server's arrive translated.
	const translateError = (message: string) =>
		i18n.exists(message) ? t(message) : message;

	const submitIcon = isSaving ? (
		<Loader2 className="size-4 animate-spin" aria-hidden />
	) : editingId ? (
		<Pencil className="size-4" aria-hidden />
	) : (
		<Plus className="size-4" aria-hidden />
	);

	return (
		<section className="h-fit rounded-xl border border-slate-200 bg-white shadow-2xs">
			<header className="border-b border-slate-200 px-5 py-4">
				<h2 className="text-base font-semibold text-slate-900">{title}</h2>
			</header>

			<Form {...form}>
				<form
					onSubmit={submit}
					noValidate
					aria-busy={isSaving}
					className="flex flex-col gap-5 px-5 py-5"
				>
					<FormInput
						control={form.control}
						name="name"
						label={localizationConstants.contentConsultantTypeNameLabel}
						placeholder={localizationConstants.contentConsultantTypeNamePlaceholder}
						translateError={translateError}
						inputProps={{ maxLength: CONSULTANT_TYPE_LIMITS.nameLength }}
					/>

					<ConsultantTypeSectionsEditor control={form.control} />

					<div className="flex flex-wrap gap-2 border-t border-slate-200 pt-4">
						<Button type="submit" disabled={isSaving}>
							{submitIcon}
							{t(
								editingId
									? localizationConstants.contentSaveChangeButton
									: localizationConstants.contentSaveButton,
							)}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={reset}
							disabled={isSaving}
						>
							{editingId && <X className="size-4" aria-hidden />}
							{t(
								editingId
									? localizationConstants.contentCancelButton
									: localizationConstants.contentClearButton,
							)}
						</Button>
					</div>
				</form>
			</Form>
		</section>
	);
}

export default ConsultantTypeFormCard;
