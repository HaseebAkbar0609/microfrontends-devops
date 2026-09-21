"use client";

import { Save } from "lucide-react";

import { Form, FormInput } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { ProjectPerson } from "../../hooks/useProjectPeople";
import { MeetingPersonSelect } from "../form/fields/MeetingPersonSelect";
import { PROTOCOL_FIELD_MAX_LENGTH, PROTOCOL_NOTE_MAX_LENGTH, PROTOCOL_POINT_NR_MAX_LENGTH } from "../projectProtocol.config";
import type { MeetingPoint } from "../types";
import type { PointValues } from "./meetingPointSchema";
import { useMeetingPointForm } from "./useMeetingPointForm";

const M = localizationConstants;

export interface MeetingPointDialogProps {
	/** The point to edit; omit to add one. */
	point?: MeetingPoint;
	/** Nr a new point starts with. */
	nextNr: string;
	people: ProjectPerson[];
	onSave: (values: PointValues) => void;
	onClose: () => void;
}

/**
 * "Skapa ny mötespunkt" / "Redigera punkt": Nr, Ansvarig, Rubrik, Beskrivning
 * and Beslut. The point joins the protocol's unsaved changes; the page's Spara
 * stores them. Mounted only while open, so it starts from the point each time.
 */
export function MeetingPointDialog({ point, nextNr, people, onSave, onClose }: MeetingPointDialogProps) {
	const { form, submit, translateError } = useMeetingPointForm(point, nextNr, onSave);
	const { control } = form;

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-slate-200 bg-white p-6 sm:max-w-lg">
				<DialogHeader className="gap-1 text-left">
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={point ? M.protocolEditPointTitle : M.protocolNewPointTitle} />
					</DialogTitle>
					<DialogDescription className="text-sm text-slate-500">
						<Translate text={M.projectProtocolCreateStandard} />
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={submit} noValidate className="flex flex-col gap-4">
						<FormInput
							control={control}
							name="nr"
							label={M.protocolPointColNr}
							required
							inputProps={{ maxLength: PROTOCOL_POINT_NR_MAX_LENGTH }}
							translateError={translateError}
						/>
						<MeetingPersonSelect
							control={control}
							name="responsible"
							labelKey={M.protocolFieldResponsible}
							people={people}
							translateError={translateError}
						/>
						<FormInput
							control={control}
							name="title"
							label={M.protocolFieldTitle}
							required
							inputProps={{ maxLength: PROTOCOL_FIELD_MAX_LENGTH }}
							translateError={translateError}
						/>
						<FormInput
							control={control}
							name="description"
							type="textarea"
							label={M.protocolPointDescription}
							inputClassName="min-h-20 resize-y"
							inputProps={{ maxLength: PROTOCOL_NOTE_MAX_LENGTH }}
							translateError={translateError}
						/>
						<FormInput
							control={control}
							name="decision"
							type="textarea"
							label={M.protocolPointColDecision}
							inputClassName="min-h-20 resize-y"
							inputProps={{ maxLength: PROTOCOL_NOTE_MAX_LENGTH }}
							translateError={translateError}
						/>

						<DialogFooter className="gap-2 sm:gap-3">
							<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer border-slate-200">
								<Translate text={M.btnAvbryt} />
							</Button>
							<Button type="submit" className="cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800">
								<Save className="h-4 w-4" aria-hidden />
								<Translate text={M.btnSpara} />
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default MeetingPointDialog;
