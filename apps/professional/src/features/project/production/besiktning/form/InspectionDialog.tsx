"use client";

import { Save } from "lucide-react";

import { Form, FormDatePicker, FormSelect } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { INSPECTION_TYPE_LABELS, INSPECTION_TYPES } from "../projectInspection.config";
import { InspectionDocumentsField } from "./InspectionDocumentsField";
import { useInspectionForm, type UseInspectionFormOptions } from "./useInspectionForm";

/** Module constant: the six kinds, labelled in the reader's language when rendered. */
const TYPE_OPTIONS = INSPECTION_TYPES.map((value) => ({
	value,
	label: <Translate text={INSPECTION_TYPE_LABELS[value]} />,
}));

export type InspectionDialogProps = UseInspectionFormOptions;

/**
 * "Lägg till Besiktning" / "Redigera Besiktning", field for field as the
 * frames draw them: Datum (required), Typ, Besiktningsdatum and Dokument, with
 * Stäng and Spara. Mounted only while open, so each opening starts from the
 * inspection's own values.
 */
export function InspectionDialog(props: InspectionDialogProps) {
	const { form, isEdit, submit, translateError } = useInspectionForm(props);

	return (
		<Dialog open onOpenChange={(next) => !next && props.onClose()}>
			<DialogContent
				aria-describedby={undefined}
				className="max-h-[90dvh] w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-slate-200 bg-white p-6 sm:max-w-lg"
			>
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate
							text={
								isEdit
									? localizationConstants.editInspectionModalTitle
									: localizationConstants.addInspectionModalTitle
							}
						/>
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={submit} noValidate className="flex flex-col gap-4">
						<FormDatePicker
							control={form.control}
							name="date"
							label={
								<>
									<Translate text={localizationConstants.inspectionDateFieldLabel} />
									<span className="text-red-500" aria-hidden>
										*
									</span>
								</>
							}
							placeholder={localizationConstants.pickDatePlaceholder}
							translateError={translateError}
						/>
						<FormSelect
							control={form.control}
							name="type"
							label={localizationConstants.inspectionTypeFieldLabel}
							options={TYPE_OPTIONS}
							translateError={translateError}
						/>
						<FormDatePicker
							control={form.control}
							name="inspectionDate"
							label={localizationConstants.inspectionDateInspectFieldLabel}
							placeholder={localizationConstants.pickDatePlaceholder}
							translateError={translateError}
						/>
						<InspectionDocumentsField control={form.control} translateError={translateError} />

						<DialogFooter className="gap-2 sm:gap-3">
							<Button
								type="button"
								variant="outline"
								onClick={props.onClose}
								className="h-10 cursor-pointer border-slate-200 px-6 text-slate-900"
							>
								<Translate text={localizationConstants.buttonClose} />
							</Button>
							<Button
								type="submit"
								className="h-10 cursor-pointer gap-2 bg-[#111721] px-6 text-white hover:bg-slate-800"
							>
								<Save className="h-4 w-4" aria-hidden />
								<Translate text={localizationConstants.buttonSave} />
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default InspectionDialog;
