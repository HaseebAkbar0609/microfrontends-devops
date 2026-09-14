"use client";

import { useId, useState } from "react";
import { Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type {
	QAThreadCreateDialogLabels,
	QAThreadDraft,
	QAThreadOption,
} from "./qaThread";
import { QAThreadSubjectField, QAThreadTypeField } from "./QAThreadDialogFields";

/* Existing importers reach these through the dialog. */
export type {
	QAThreadCreateDialogLabels,
	QAThreadDraft,
	QAThreadOption,
} from "./qaThread";

/** Long enough for any real question; stops a paste from growing without bound. */
export const QA_QUESTION_MAX_LENGTH = 2000;

export interface QAThreadCreateDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (draft: QAThreadDraft) => void;
	/** The Typ radios. The first is selected when the dialog opens. */
	typeOptions: QAThreadOption[];
	/** The select under Typ — Ämne on purchase, Funktion on a project. */
	subjectOptions: QAThreadOption[];
	labels: QAThreadCreateDialogLabels;
	/** Draws the send icon on Skicka, as the project frame does. */
	showSendIcon?: boolean;
	/** Width override; the default is the dialog's own `max-w-lg`. */
	contentClassName?: string;
}

/**
 * "Ny fråga": a type, a subject and a description, with Skicka disabled until
 * there is something to send.
 *
 * Lifted out of the purchase board so the project record's board uses the same
 * dialog. The calculation module's own copy is the origin of the shape.
 */
export function QAThreadCreateDialog({
	open,
	onOpenChange,
	onSubmit,
	typeOptions,
	subjectOptions,
	labels,
	showSendIcon = false,
	contentClassName,
}: QAThreadCreateDialogProps) {
	const t = useTranslate();
	const fieldId = useId();
	const emptyDraft: QAThreadDraft = {
		type: typeOptions[0]?.value ?? "",
		subject: "",
		description: "",
	};
	const [draft, setDraft] = useState<QAThreadDraft>(emptyDraft);
	const description = draft.description.trim();

	const close = () => {
		setDraft(emptyDraft);
		onOpenChange(false);
	};

	const submit = (event: React.FormEvent) => {
		event.preventDefault();
		if (!description) return;
		onSubmit({ ...draft, description });
		close();
	};

	return (
		<Dialog open={open} onOpenChange={(next) => !next && close()}>
			<DialogContent
				showCloseButton={false}
				className={cn("max-w-lg rounded-lg bg-white p-6", contentClassName)}
			>
				<div className="flex items-center justify-between">
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={labels.title} />
					</DialogTitle>
					<button
						type="button"
						onClick={close}
						aria-label={t(labels.cancel)}
						className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-slate-400 hover:bg-slate-100"
					>
						<X className="h-4 w-4" aria-hidden />
					</button>
				</div>

				{/* A real form, so Enter submits and the radio group is grouped
				    the way assistive tech expects. */}
				<form onSubmit={submit}>
					<div className="mt-4 flex flex-col gap-4">
						<QAThreadTypeField
							name={`${fieldId}-type`}
							legend={labels.type}
							options={typeOptions}
							value={draft.type}
							onChange={(type) =>
								setDraft((previous) => ({ ...previous, type }))
							}
						/>

						<QAThreadSubjectField
							id={`${fieldId}-subject`}
							label={labels.subject}
							placeholder={labels.subjectPlaceholder}
							options={subjectOptions}
							value={draft.subject}
							onChange={(subject) =>
								setDraft((previous) => ({ ...previous, subject }))
							}
						/>

						<div className="flex flex-col gap-2">
							<Label
								htmlFor={`${fieldId}-description`}
								className="text-sm font-medium text-slate-900"
							>
								<Translate text={labels.description} />
							</Label>
							<Textarea
								id={`${fieldId}-description`}
								value={draft.description}
								onChange={(event) =>
									setDraft((previous) => ({
										...previous,
										description: event.target.value,
									}))
								}
								placeholder={
									labels.descriptionPlaceholder
										? t(labels.descriptionPlaceholder)
										: undefined
								}
								maxLength={QA_QUESTION_MAX_LENGTH}
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
							<Translate text={labels.cancel} />
						</Button>
						<Button
							type="submit"
							disabled={!description}
							className="h-10 cursor-pointer gap-2 bg-[#111721] px-6 text-sm text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{showSendIcon && <Send className="h-4 w-4" aria-hidden />}
							<Translate text={labels.send} />
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default QAThreadCreateDialog;
