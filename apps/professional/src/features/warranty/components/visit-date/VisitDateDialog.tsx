"use client";

import { Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { InspectionDateItem } from "../../types/warranty.types";
import { useVisitDateForm } from "./useVisitDateForm";
import { VisitDateDocuments } from "./VisitDateDocuments";
import { VisitDateEmailFields } from "./VisitDateEmailFields";
import { VisitDatePickerField } from "./VisitDatePickerField";

export interface VisitDateDialogProps {
	isOpen: boolean;
	initialData?: InspectionDateItem | null;
	onClose: () => void;
	onSave: (dateItem: Omit<InspectionDateItem, "id">) => void;
}

/** Skapa / Redigera besöksdatum — the same dialog, titled by which one it is. */
export function VisitDateDialog({
	isOpen,
	initialData,
	onClose,
	onSave,
}: VisitDateDialogProps) {
	const t = useTranslate();
	const {
		form,
		emailArray,
		submit,
		attachedDocuments,
		removeDocument,
		fileInputRef,
		uploadedFileName,
		selectFile,
		openFilePicker,
		uploadSelectedFile,
		isUploading,
	} = useVisitDateForm({ isOpen, initialData, onSave, onClose });

	const {
		register,
		setValue,
		watch,
		formState: { errors },
	} = form;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="w-[calc(100vw-2rem)] sm:w-[619px] sm:max-w-[619px] max-h-[90vh] overflow-y-auto rounded-lg bg-white p-4 sm:p-7 border border-slate-200 shadow-xl gap-0 flex flex-col justify-between"
			>
				<DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
					<DialogTitle className="font-sans font-semibold text-2xl leading-[100%] tracking-[-0.6px] text-slate-900">
						<Translate
							text={
								initialData
									? localizationConstants.editVisitDateTitle
									: localizationConstants.createVisitDateTitle
							}
						/>
					</DialogTitle>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="h-8 w-8 p-1 text-slate-900 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer rounded-md"
						aria-label={t(localizationConstants.closeButton)}
					>
						<X className="h-5 w-5" />
					</Button>
				</DialogHeader>

				<form
					onSubmit={submit}
					className="space-y-4 pt-1 flex-1 flex flex-col justify-between"
				>
					<div className="space-y-4">
						<VisitDatePickerField
							value={watch("date")}
							onChange={(value) =>
								setValue("date", value, { shouldValidate: true })
							}
							error={errors.date?.message}
						/>

						<VisitDateEmailFields
							fields={emailArray.fields}
							register={register}
							errors={errors.emails}
							onAppend={() => emailArray.append({ value: "" })}
							onRemove={emailArray.remove}
						/>

						<div className="flex flex-col gap-1.5">
							<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.reminderRuleLabel} />
							</Label>
							<textarea
								placeholder={t(localizationConstants.reminderRuleLabel)}
								{...register("rule")}
								rows={4}
								className="w-full min-h-[96px] rounded-lg border border-slate-200 bg-white p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 resize-y font-normal"
							/>
						</div>

						<VisitDateDocuments
							fileInputRef={fileInputRef}
							uploadedFileName={uploadedFileName}
							attachedDocuments={attachedDocuments}
							isUploading={isUploading}
							onSelectFile={selectFile}
							onOpenPicker={openFilePicker}
							onUpload={uploadSelectedFile}
							onRemoveDocument={removeDocument}
						/>
					</div>

					<div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 sm:pt-6">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="w-full sm:w-[120px] h-11 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-medium text-sm cursor-pointer shadow-none"
						>
							<Translate text={localizationConstants.closeButton} />
						</Button>
						<Button
							type="submit"
							className="w-full sm:w-[120px] h-11 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm cursor-pointer flex items-center justify-center gap-2 shadow-none"
						>
							<Save className="h-4 w-4" aria-hidden />
							<span>
								<Translate text={localizationConstants.saveButton} />
							</span>
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default VisitDateDialog;
