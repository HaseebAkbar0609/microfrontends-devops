"use client";

import { Pencil, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { useSectionForm } from "../hooks/useSectionForm";
import type { ContentSection } from "../types";
import { SectionFieldInput } from "./SectionFieldInput";

type SectionFormCardProps = {
	section: ContentSection;
	sectionForm: ReturnType<typeof useSectionForm>;
};

/**
 * Add/edit form for one section.
 *
 * The prototype validated with a single truthiness check and a toast; this is
 * zod plus React Hook Form, so errors land inline under the field that failed.
 */
export function SectionFormCard({ section, sectionForm }: SectionFormCardProps) {
	const { form, submit, reset, editingId } = sectionForm;
	const t = useTranslate();

	const itemLabel = t(section.itemLabelKey);
	const title = editingId
		? `${t(localizationConstants.contentEditTitlePrefix)} ${itemLabel}`
		: `${t(localizationConstants.contentAddTitlePrefix)} ${itemLabel}`;

	return (
		<section className="h-fit rounded-xl border border-slate-200 bg-white shadow-2xs">
			<header className="border-b border-slate-200 px-5 py-4">
				<h2 className="text-base font-semibold text-slate-900">{title}</h2>
			</header>

			<Form {...form}>
				<form onSubmit={submit} className="flex flex-col gap-4 px-5 py-5">
					{section.fields.map((field) => (
						<SectionFieldInput
							key={field.name}
							control={form.control}
							field={field}
						/>
					))}

					<div className="flex flex-wrap gap-2 pt-1">
						<Button type="submit" className="cursor-pointer">
							{editingId ? (
								<Pencil className="size-4" aria-hidden />
							) : (
								<Plus className="size-4" aria-hidden />
							)}
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
							className="cursor-pointer"
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

export default SectionFormCard;
