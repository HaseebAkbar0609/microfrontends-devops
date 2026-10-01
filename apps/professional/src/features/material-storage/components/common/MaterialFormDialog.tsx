"use client";

import { useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

interface MaterialFormDialogProps {
	open: boolean;
	title: TranslationKeys;
	description: TranslationKeys;
	/** Whether anything was typed: closing then asks before throwing it away. */
	isDirty: boolean;
	/** While saving, the dialog stays open. */
	isPending: boolean;
	onClose: () => void;
	/** Width and padding of this dialog's Figma frame. */
	className?: string;
	/** The form; its Avbryt button calls requestClose. */
	children: (requestClose: () => void) => ReactNode;
}

/** The frame the stock dialogs share: title, subtitle, ✕, and the "close without saving?" check. */
export function MaterialFormDialog({
	open,
	title,
	description,
	isDirty,
	isPending,
	onClose,
	className,
	children,
}: MaterialFormDialogProps) {
	const t = useTranslate();
	const [confirmDiscard, setConfirmDiscard] = useState(false);

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
					className={cn("max-h-[calc(100vh-2rem)] gap-6 overflow-y-auto bg-white", className)}
				>
					<div className="flex items-start justify-between gap-4">
						<DialogHeader className="gap-1 text-left">
							<DialogTitle className="text-2xl font-semibold text-slate-900">
								<Translate text={title} />
							</DialogTitle>
							<DialogDescription className="text-sm text-slate-600">
								<Translate text={description} />
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
					{children(requestClose)}
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
