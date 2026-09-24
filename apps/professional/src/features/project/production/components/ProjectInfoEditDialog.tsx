"use client";

import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

import { PhoneInput, SearchableSelect } from "@/components/form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { ProjectInfoField } from "../../shared/projectInfoFields";

const FIELD_CLASS = "h-11 rounded-lg border-slate-200 text-sm shadow-none";

export interface ProjectInfoEditDialogProps<TSection> {
	isOpen: boolean;
	titleKey: TranslationKeys;
	fields: ProjectInfoField<TSection>[];
	value: TSection;
	isSaving?: boolean;
	/**
	 * Checks the draft before it is saved. Returning any entry keeps the dialog
	 * open with the messages shown against their fields.
	 */
	validate?: (values: TSection) => Record<string, string>;
	onClose: () => void;
	onSave: (values: TSection) => void | Promise<void>;
}

/**
 * One dialog for all four cards, driven by the same field list the card reads.
 *
 * The order module has four near-identical modals for these four cards, which
 * is how its Kunduppgifter card came to show two fields its modal cannot edit.
 * Here the card and the dialog share one list, so a field can only appear in
 * both or — with `readOnlyOnCard` — deliberately in just the card.
 */
export function ProjectInfoEditDialog<TSection extends object>({
	isOpen,
	titleKey,
	fields,
	value,
	isSaving = false,
	validate,
	onClose,
	onSave,
}: ProjectInfoEditDialogProps<TSection>) {
	const t = useTranslate();
	const [draft, setDraft] = useState<TSection>(value);
	const [errors, setErrors] = useState<Record<string, string>>({});

	/* Reload on open so a cancelled edit is discarded, not carried over. */
	useEffect(() => {
		if (isOpen) {
			setDraft(value);
			setErrors({});
		}
	}, [isOpen, value]);

	const editable = fields.filter((field) => !field.readOnlyOnCard);

	const set = (name: string, next: string) => {
		setDraft((previous) => ({ ...previous, [name]: next }));
		/* Clear the field's message as soon as it is being corrected. */
		setErrors((previous) => {
			if (!previous[name]) return previous;
			const { [name]: _cleared, ...rest } = previous;
			return rest;
		});
	};

	const read = (name: string) => String((draft as Record<string, unknown>)[name] ?? "");

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && !isSaving && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="max-h-[85vh] w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-xl sm:w-[619px] sm:max-w-[619px] sm:p-7"
			>
				<DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
					<DialogTitle className="text-2xl font-semibold tracking-[-0.6px] text-slate-900">
						<Translate text={titleKey} />
					</DialogTitle>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onClose}
						disabled={isSaving}
						aria-label={t(localizationConstants.closeButton)}
						className="h-8 w-8 cursor-pointer rounded-md p-1 text-slate-900 hover:bg-slate-100"
					>
						<X className="h-5 w-5" />
					</Button>
				</DialogHeader>

				{/* Radix warns without a description; the fields are the content. */}
				<DialogDescription className="sr-only">
					<Translate text={titleKey} />
				</DialogDescription>

				<form
					noValidate
					onSubmit={(event) => {
						event.preventDefault();
						const found = validate?.(draft) ?? {};
						if (Object.keys(found).length > 0) {
							setErrors(found);
							return;
						}
						void onSave(draft);
					}}
					className="space-y-4"
				>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						{editable.map((field) => {
							const error = errors?.[field.name];

							return (
								<div key={field.name} className="space-y-1.5">
									<Label
										htmlFor={`project-info-${field.name}`}
										className="text-sm font-medium text-slate-900"
									>
										<Translate text={field.labelKey} />
									</Label>

									{field.kind === "phone" ? (
										<PhoneInput
											value={read(field.name)}
											onChange={(next) => set(field.name, next)}
											placeholder={t(field.labelKey)}
											hasError={Boolean(error)}
										/>
									) : field.kind === "select" ? (
										<SearchableSelect
											id={`project-info-${field.name}`}
											value={read(field.name)}
											onChange={(next) => set(field.name, next)}
											options={[...(field.options ?? [])]}
											allowCustom={false}
											hasError={Boolean(error)}
											placeholder={t(field.labelKey)}
											searchPlaceholder={t(localizationConstants.search)}
										/>
									) : (
										<Input
											id={`project-info-${field.name}`}
											type={field.kind === "date" ? "date" : "text"}
											value={read(field.name)}
											onChange={(event) =>
												set(field.name, event.target.value)
											}
											placeholder={t(field.labelKey)}
											aria-invalid={Boolean(error)}
											className={FIELD_CLASS}
										/>
									)}

									{error && (
										<p className="text-xs font-medium text-red-500">
											{error}
										</p>
									)}
								</div>
							);
						})}
					</div>

					<div className="flex flex-col-reverse items-stretch justify-end gap-2 pt-2 sm:flex-row sm:items-center sm:gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={isSaving}
							className="h-11 w-full cursor-pointer rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-900 shadow-none hover:bg-slate-50 sm:w-[120px]"
						>
							<Translate text={localizationConstants.closeButton} />
						</Button>
						<Button
							type="submit"
							disabled={isSaving}
							className="h-11 w-full cursor-pointer gap-2 rounded-lg bg-slate-900 text-sm font-medium text-white shadow-none hover:bg-slate-800 sm:w-[120px]"
						>
							<Save className="h-4 w-4" aria-hidden />
							<Translate text={localizationConstants.saveButton} />
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default ProjectInfoEditDialog;
