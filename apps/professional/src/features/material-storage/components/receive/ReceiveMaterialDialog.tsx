"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { FormInput } from "@/components/form";
import { Form } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { MATERIAL_TEXT_LIMITS } from "../../constants/materialStorage.constants";
import { useReceiveMaterialForm } from "../../hooks/useReceiveMaterialForm";
import { useReceiveMaterialOptions } from "../../hooks/useReceiveMaterialOptions";
import type { ReceiveMaterialPreset } from "../../types/materialTransaction.types";
import { ReceiveBalanceSummary } from "./ReceiveBalanceSummary";
import { ReceiveMaterialFields } from "./ReceiveMaterialFields";
import { ReceiveMaterialFooter } from "./ReceiveMaterialFooter";

interface ReceiveMaterialDialogProps {
	open: boolean;
	preset: ReceiveMaterialPreset;
	onClose: () => void;
}

/**
 * "Ta in material" (TFS-1073). Mount it with a new key for every opening, so
 * the form starts clean from the preset.
 */
export function ReceiveMaterialDialog({ open, preset, onClose }: ReceiveMaterialDialogProps) {
	const t = useTranslate();
	const [confirmDiscard, setConfirmDiscard] = useState(false);
	const { depots, articles, suppliers } = useReceiveMaterialOptions();
	const { form, selectArticle, receive, saveDraft, isPending } = useReceiveMaterialForm({
		preset,
		articles,
		depots,
		onDone: onClose,
	});
	// Read during render: react-hook-form only tracks formState fields that render reads.
	const { isDirty } = form.formState;

	/** ✕, Avbryt, Escape and a click outside all end here. Typed input is not thrown away unasked. */
	const requestClose = () => {
		if (isPending) return;
		if (isDirty) setConfirmDiscard(true);
		else onClose();
	};

	return (
		<>
			<Dialog open={open} onOpenChange={(next) => !next && requestClose()}>
				<DialogContent
					showCloseButton={false}
					className="max-h-[calc(100vh-2rem)] gap-6 overflow-y-auto bg-white p-8 sm:max-w-[690px]"
				>
					<div className="flex items-start justify-between gap-4">
						<DialogHeader className="gap-1 text-left">
							<DialogTitle className="text-2xl font-semibold text-slate-900">
								<Translate text={localizationConstants.materialReceiveMaterial} />
							</DialogTitle>
							<DialogDescription className="text-sm text-slate-600">
								<Translate text={localizationConstants.materialReceiveSubtitle} />
							</DialogDescription>
						</DialogHeader>
						<button
							type="button"
							onClick={requestClose}
							aria-label={t(localizationConstants.materialCloseDialog)}
							className="cursor-pointer rounded-md p-1 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
						>
							<X className="h-5 w-5" aria-hidden />
						</button>
					</div>

					<Form {...form}>
						<form onSubmit={receive} noValidate className="grid gap-6">
							<ReceiveMaterialFields
								form={form}
								depots={depots}
								articles={articles}
								suppliers={suppliers}
								onSelectArticle={selectArticle}
							/>
							<ReceiveBalanceSummary control={form.control} articles={articles} />
							<FormInput
								control={form.control}
								name="comment"
								type="textarea"
								rows={3}
								label={localizationConstants.materialFieldComment}
								placeholder={localizationConstants.materialReceiveCommentPlaceholder}
								inputProps={{ maxLength: MATERIAL_TEXT_LIMITS.comment }}
							/>
							<ReceiveMaterialFooter
								control={form.control}
								articles={articles}
								isPending={isPending}
								onCancel={requestClose}
								onSaveDraft={() => void saveDraft()}
							/>
						</form>
					</Form>
				</DialogContent>
			</Dialog>

			<ConfirmActionDialog
				open={confirmDiscard}
				onOpenChange={setConfirmDiscard}
				title={localizationConstants.materialDiscardTitle}
				description={localizationConstants.materialDiscardDescription}
				confirmLabel={localizationConstants.materialDiscardConfirm}
				destructive
				onConfirm={() => {
					setConfirmDiscard(false);
					onClose();
				}}
			/>
		</>
	);
}
