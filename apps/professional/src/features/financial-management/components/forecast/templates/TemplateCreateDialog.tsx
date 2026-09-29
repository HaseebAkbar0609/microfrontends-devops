"use client";

import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useTemplateCreateForm } from "../../../hooks/useTemplateCreateForm";
import type { TemplateUploadInput } from "../../../types/forecastTemplates.types";
import { TemplateCreateFields } from "./TemplateCreateFields";

export interface TemplateCreateDialogProps {
	/** Stores the template, or refuses it; the dialog closes only on a yes. */
	onCreate: (input: TemplateUploadInput) => boolean;
	onClose: () => void;
}

/**
 * "Skapa ny": what the template is for, the file itself, what to call it and
 * an optional note. The caller mounts it only while open, so every opening
 * starts empty.
 */
export function TemplateCreateDialog({ onCreate, onClose }: TemplateCreateDialogProps) {
	const form = useTemplateCreateForm(onCreate, onClose);

	return (
		<Dialog open onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.forecastTemplatesCreateTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={form.submit} noValidate className="flex flex-col gap-4">
					<TemplateCreateFields form={form} />

					<DialogFooter className="gap-2 sm:gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="cursor-pointer border-slate-200"
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							type="submit"
							className="cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800"
						>
							<Save className="h-4 w-4" aria-hidden />
							<Translate text={localizationConstants.buttonSave} />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default TemplateCreateDialog;
