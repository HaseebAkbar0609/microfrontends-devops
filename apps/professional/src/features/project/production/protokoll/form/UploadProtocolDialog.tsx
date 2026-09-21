"use client";

import { Save } from "lucide-react";

import { Form } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ProtocolProjectLine } from "../components/ProtocolProjectLine";
import { useMeetingPeople } from "../hooks/useMeetingPeople";
import type { UploadDetails } from "../types";
import { UploadProtocolFields } from "./UploadProtocolFields";
import { useUploadProtocolForm } from "./useUploadProtocolForm";

export interface UploadProtocolDialogProps {
	projectId: string;
	projectNo: string;
	projectName: string;
	/** Stores the details and the file; `false` when the store refused them and the dialog should stay open. */
	onSave: (details: UploadDetails, file: File) => boolean;
	onClose: () => void;
}

/**
 * "Nytt protokoll" — Skapa protokoll → Ladda upp: an existing protocol's file
 * and what it records. The frame subtitles it "Protokoll - Standard", copied
 * from Nytt möte; it names the menu item instead. Spara stores it and the list
 * turns to it. The caller mounts it only while open, so each opening starts
 * empty.
 */
export function UploadProtocolDialog({ projectId, projectNo, projectName, onSave, onClose }: UploadProtocolDialogProps) {
	const people = useMeetingPeople(projectId);
	const { form, submit, translateError } = useUploadProtocolForm(onSave, onClose);

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-slate-200 bg-white p-6 sm:max-w-2xl">
				<DialogHeader className="gap-1 text-left">
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.projectProtocolNewTitle} />
					</DialogTitle>
					<DialogDescription className="text-sm text-slate-500">
						<Translate text={localizationConstants.projectProtocolUpload} />
					</DialogDescription>
				</DialogHeader>
				<ProtocolProjectLine projectNo={projectNo} projectName={projectName} />

				<Form {...form}>
					<form onSubmit={submit} noValidate className="flex flex-col gap-6">
						<UploadProtocolFields form={form} people={people} translateError={translateError} />

						<DialogFooter className="gap-2 sm:gap-3">
							<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer border-slate-200">
								<Translate text={localizationConstants.protocolClose} />
							</Button>
							<Button type="submit" className="cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800">
								<Save className="h-4 w-4" aria-hidden />
								<Translate text={localizationConstants.btnSpara} />
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default UploadProtocolDialog;
