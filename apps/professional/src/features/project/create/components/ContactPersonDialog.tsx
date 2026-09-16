"use client";

import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

import { PhoneInput, SearchableSelect } from "@/components/form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ROLE_OPTIONS } from "../data/projectCreate.config";
import type { ProjectContactPerson } from "../types";

const FIELD_CLASS = "h-11 rounded-lg border-slate-200 text-sm shadow-none";

const EMPTY: ProjectContactPerson = {
	id: "",
	firstName: "",
	lastName: "",
	email: "",
	mobile: "",
	role: "",
};

export interface ContactPersonDialogProps {
	isOpen: boolean;
	/** The row being edited, or `null` to add a new one. */
	initialData: ProjectContactPerson | null;
	onClose: () => void;
	onSave: (contact: ProjectContactPerson) => void;
}

/** Redigera kontaktperson — the frame's Förnamn/Efternamn/Mail/Mobil/Roll form. */
export function ContactPersonDialog({
	isOpen,
	initialData,
	onClose,
	onSave,
}: ContactPersonDialogProps) {
	const t = useTranslate();
	const [draft, setDraft] = useState<ProjectContactPerson>(EMPTY);

	useEffect(() => {
		if (isOpen) setDraft(initialData ?? EMPTY);
	}, [initialData, isOpen]);

	const patch = (change: Partial<ProjectContactPerson>) =>
		setDraft((previous) => ({ ...previous, ...change }));

	const textField = (
		name: "firstName" | "lastName" | "email",
		labelKey: TranslationKeys,
	) => (
		<div className="space-y-1.5">
			<Label className="text-sm font-medium text-slate-900">
				<Translate text={labelKey} />
			</Label>
			<Input
				value={draft[name]}
				onChange={(event) => patch({ [name]: event.target.value })}
				placeholder={t(labelKey)}
				className={FIELD_CLASS}
			/>
		</div>
	);

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="flex w-[calc(100vw-2rem)] flex-col gap-0 rounded-lg border border-slate-200 bg-white p-4 shadow-xl sm:w-[480px] sm:max-w-[480px] sm:p-7"
			>
				<DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
					<DialogTitle className="text-2xl font-semibold tracking-[-0.6px] text-slate-900">
						<Translate
							text={
								localizationConstants.projectCreateEditContactTitle
							}
						/>
					</DialogTitle>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onClose}
						aria-label={t(localizationConstants.closeButton)}
						className="h-8 w-8 cursor-pointer rounded-md p-1 text-slate-900 hover:bg-slate-100"
					>
						<X className="h-5 w-5" />
					</Button>
				</DialogHeader>

				<div className="space-y-4">
					{textField("firstName", localizationConstants.orderFornamLabel)}
					{textField(
						"lastName",
						localizationConstants.orderEfternamnLabel,
					)}
					{textField("email", localizationConstants.orderMailLabel)}

					<div className="space-y-1.5">
						<Label className="text-sm font-medium text-slate-900">
							<Translate text={localizationConstants.orderMobilLabel} />
						</Label>
						<PhoneInput
							value={draft.mobile}
							onChange={(value) => patch({ mobile: value })}
							placeholder={t(localizationConstants.orderMobilLabel)}
						/>
					</div>

					<div className="space-y-1.5">
						<Label className="text-sm font-medium text-slate-900">
							<Translate text={localizationConstants.orderRollLabel} />
						</Label>
						<SearchableSelect
							value={draft.role}
							onChange={(value) => patch({ role: value })}
							options={ROLE_OPTIONS}
							allowCustom={false}
							placeholder={t(localizationConstants.orderRollLabel)}
							searchPlaceholder={t(localizationConstants.search)}
						/>
					</div>
				</div>

				<div className="flex flex-col-reverse items-stretch justify-end gap-2 pt-6 sm:flex-row sm:items-center sm:gap-3">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						className="h-11 w-full cursor-pointer rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-900 shadow-none hover:bg-slate-50 sm:w-[120px]"
					>
						<Translate text={localizationConstants.closeButton} />
					</Button>
					<Button
						type="button"
						onClick={() =>
							onSave({
								...draft,
								id: draft.id || `contact-${Date.now()}`,
							})
						}
						className="h-11 w-full cursor-pointer gap-2 rounded-lg bg-slate-900 text-sm font-medium text-white shadow-none hover:bg-slate-800 sm:w-[120px]"
					>
						<Save className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.saveButton} />
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default ContactPersonDialog;
