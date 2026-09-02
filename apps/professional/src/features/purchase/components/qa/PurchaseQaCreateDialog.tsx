"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { PurchaseQaDraft } from "../../hooks/usePurchaseQaBoard";

const TYPES: { value: string; label: TranslationKeys }[] = [
	{ value: "purchase", label: localizationConstants.purchaseQaTypePurchase },
	{ value: "order", label: localizationConstants.purchaseQaTypeOrder },
];

const SUBJECTS: { value: string; label: TranslationKeys }[] = [
	{ value: "delivery", label: localizationConstants.purchaseQaSubjectDelivery },
	{ value: "price", label: localizationConstants.purchaseQaSubjectPrice },
	{ value: "quality", label: localizationConstants.purchaseQaSubjectQuality },
];

const EMPTY_DRAFT: PurchaseQaDraft = {
	type: "purchase",
	subject: "",
	description: "",
};

export interface PurchaseQaCreateDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (draft: PurchaseQaDraft) => void;
}

/**
 * "Skapa ny fråga".
 *
 * Follows the calculation module's existing new-question dialog — type, a
 * subject select and a description, with Skicka disabled until there is
 * something to send.
 */
export function PurchaseQaCreateDialog({
	open,
	onOpenChange,
	onSubmit,
}: PurchaseQaCreateDialogProps) {
	const t = useTranslate();
	const [draft, setDraft] = useState<PurchaseQaDraft>(EMPTY_DRAFT);

	const close = () => {
		setDraft(EMPTY_DRAFT);
		onOpenChange(false);
	};

	const submit = () => {
		if (!draft.description.trim()) return;
		onSubmit({
			...draft,
			subject: draft.subject
				? t(
						SUBJECTS.find((item) => item.value === draft.subject)
							?.label ?? localizationConstants.purchaseQaFieldSubject,
					)
				: "",
		});
		close();
	};

	return (
		<Dialog open={open} onOpenChange={(next) => !next && close()}>
			<DialogContent className="max-w-lg rounded-lg bg-white p-6">
				<div className="flex items-center justify-between">
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate
							text={localizationConstants.purchaseQaCreateTitle}
						/>
					</DialogTitle>
					<button
						type="button"
						onClick={close}
						aria-label={t(localizationConstants.cancelButton)}
						className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-100"
					>
						<X className="h-4 w-4" aria-hidden />
					</button>
				</div>

				<div className="mt-4 flex flex-col gap-4">
					<fieldset className="flex flex-col gap-2">
						<legend className="mb-2 text-sm font-medium text-slate-900">
							<Translate
								text={localizationConstants.purchaseQaFieldType}
							/>
						</legend>
						<div className="flex gap-6">
							{TYPES.map((option) => (
								<label
									key={option.value}
									className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
								>
									<input
										type="radio"
										name="purchase-qa-type"
										value={option.value}
										checked={draft.type === option.value}
										onChange={() =>
											setDraft((previous) => ({
												...previous,
												type: option.value,
											}))
										}
										className="cursor-pointer accent-slate-900"
									/>
									<Translate text={option.label} />
								</label>
							))}
						</div>
					</fieldset>

					<div className="flex flex-col gap-2">
						<Label
							htmlFor="purchase-qa-subject"
							className="text-sm font-medium text-slate-900"
						>
							<Translate
								text={
									localizationConstants.purchaseQaFieldSubject
								}
							/>
						</Label>
						<Select
							value={draft.subject}
							onValueChange={(value) =>
								setDraft((previous) => ({
									...previous,
									subject: value,
								}))
							}
						>
							<SelectTrigger
								id="purchase-qa-subject"
								className="h-10 w-full cursor-pointer border-slate-200 bg-white text-sm text-slate-900 shadow-none"
							>
								<SelectValue
									placeholder={t(
										localizationConstants.purchaseQaSubjectPlaceholder,
									)}
								/>
							</SelectTrigger>
							<SelectContent className="bg-white">
								{SUBJECTS.map((option) => (
									<SelectItem
										key={option.value}
										value={option.value}
										className="cursor-pointer"
									>
										<Translate text={option.label} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-2">
						<Label
							htmlFor="purchase-qa-description"
							className="text-sm font-medium text-slate-900"
						>
							<Translate
								text={
									localizationConstants.purchaseQaFieldDescription
								}
							/>
						</Label>
						<Textarea
							id="purchase-qa-description"
							value={draft.description}
							onChange={(event) =>
								setDraft((previous) => ({
									...previous,
									description: event.target.value,
								}))
							}
							rows={4}
							className="resize-none rounded-md border-slate-200 text-sm shadow-none"
						/>
					</div>
				</div>

				<div className="mt-6 flex justify-end gap-3">
					<Button
						type="button"
						variant="outline"
						onClick={close}
						className="h-10 cursor-pointer border-slate-200 px-6 text-sm"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>
					<Button
						type="button"
						onClick={submit}
						disabled={!draft.description.trim()}
						className="h-10 cursor-pointer bg-[#111721] px-6 text-sm text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<Translate
							text={localizationConstants.purchaseComplaintQaSend}
						/>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default PurchaseQaCreateDialog;
