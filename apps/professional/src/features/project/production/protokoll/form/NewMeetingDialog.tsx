"use client";

import { ArrowRight } from "lucide-react";

import { Form } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { ProtocolProjectLine } from "../components/ProtocolProjectLine";
import { useMeetingPeople } from "../hooks/useMeetingPeople";
import type { NewMeetingInput } from "../types";
import { NewMeetingFields } from "./NewMeetingFields";
import { useNewMeetingForm } from "./useNewMeetingForm";

export interface NewMeetingDialogProps {
	projectId: string;
	projectNo: string;
	projectName: string;
	/** Stores the meeting and opens it; `false` when the store refused and the dialog should stay open. */
	onCreate: (input: NewMeetingInput) => boolean;
	onClose: () => void;
}

/**
 * "Nytt möte" — Skapa protokoll → Protokoll - Standard. Nästa stores the
 * meeting and opens its protocol, where the points are written; it carries an
 * arrow rather than the frame's send icon, since nothing is sent. The caller
 * mounts it only while open, so each opening starts empty.
 */
export function NewMeetingDialog({ projectId, projectNo, projectName, onCreate, onClose }: NewMeetingDialogProps) {
	const people = useMeetingPeople(projectId);
	const { form, submit, translateError } = useNewMeetingForm(onCreate);

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-slate-200 bg-white p-6 sm:max-w-2xl">
				<DialogHeader className="gap-1 text-left">
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.protocolNewMeetingTitle} />
					</DialogTitle>
					<DialogDescription className="text-sm text-slate-500">
						<Translate text={localizationConstants.projectProtocolCreateStandard} />
					</DialogDescription>
				</DialogHeader>
				<ProtocolProjectLine projectNo={projectNo} projectName={projectName} />

				<Form {...form}>
					<form onSubmit={submit} noValidate className="flex flex-col gap-6">
						<NewMeetingFields form={form} people={people} translateError={translateError} />

						<DialogFooter className="gap-2 sm:gap-3">
							<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer border-slate-200">
								<Translate text={localizationConstants.protocolClose} />
							</Button>
							<Button type="submit" className="cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800">
								<Translate text={localizationConstants.btnNext} />
								<ArrowRight className="h-4 w-4" aria-hidden />
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default NewMeetingDialog;
