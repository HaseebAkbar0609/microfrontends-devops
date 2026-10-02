"use client";

import { useState } from "react";
import { Save } from "lucide-react";

import { RecordFilePicker } from "@/components/form/RecordFilePicker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ProtocolType } from "@/features/project/production/protokoll/types";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	PROTOCOL_FILE_ACCEPT,
	PROTOCOL_FILE_PICKER_COPY,
	PROTOCOL_FILE_RULES,
	PROTOCOL_TYPES,
	PROTOCOL_TYPE_LABELS,
} from "../../../constants/forecastProtocols.constants";
import type { ForecastProtocolUploadInput } from "../../../types/forecastProtocols.types";

export interface ProtocolUploadDialogProps {
	/** Stores the protocol, or refuses it; the dialog closes only on a yes. */
	onCreate: (input: ForecastProtocolUploadInput) => boolean;
	onClose: () => void;
}

/**
 * "Skapa protokoll": when the meeting was, what it was, and the minutes.
 *
 * The date is asked for rather than stamped — minutes are written up after the
 * meeting, so the day that matters is in the past. The caller mounts the
 * dialog only while it is open, so every opening starts empty.
 */
export function ProtocolUploadDialog({ onCreate, onClose }: ProtocolUploadDialogProps) {
	const t = useTranslate();
	const [date, setDate] = useState("");
	const [type, setType] = useState<ProtocolType | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [dateError, setDateError] = useState<TranslationKeys | null>(null);
	const [typeError, setTypeError] = useState<TranslationKeys | null>(null);
	const [fileError, setFileError] = useState<TranslationKeys | null>(null);

	const submit = (event: React.FormEvent) => {
		event.preventDefault();

		setDateError(date ? null : localizationConstants.projectProtocolDateRequired);
		setTypeError(type ? null : localizationConstants.projectProtocolTypeRequired);
		/* A refusal the picker already made says more than "upload a file". */
		if (!file) {
			setFileError((previous) => previous ?? localizationConstants.projectProtocolFileRequired);
		}
		if (!date || !type || !file) return;

		if (onCreate({ date, type, file })) onClose();
	};

	return (
		<Dialog open onOpenChange={(next) => !next && onClose()}>
			<DialogContent className="w-[calc(100vw-2rem)] rounded-lg border border-slate-200 bg-white p-6 sm:max-w-lg">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold text-slate-900">
						<Translate text={localizationConstants.projectProtocolNewTitle} />
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={submit} noValidate className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="protocol-date" className="text-sm font-medium text-slate-700">
							<Translate text={localizationConstants.projectProtocolColDate} />
							<span aria-hidden className="text-red-600">
								*
							</span>
						</Label>
						<Input
							id="protocol-date"
							type="date"
							value={date}
							onChange={(event) => {
								setDate(event.target.value);
								setDateError(null);
							}}
							className="h-10 border-slate-200"
						/>
						{dateError && (
							<p className="text-xs text-red-600">
								<Translate text={dateError} />
							</p>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						<Label htmlFor="protocol-type" className="text-sm font-medium text-slate-700">
							<Translate text={localizationConstants.projectProtocolColType} />
							<span aria-hidden className="text-red-600">
								*
							</span>
						</Label>
						<Select
							value={type ?? undefined}
							onValueChange={(next) => {
								setType(next as ProtocolType);
								setTypeError(null);
							}}
						>
							<SelectTrigger id="protocol-type" className="h-10 w-full cursor-pointer border-slate-200">
								<SelectValue placeholder={t(localizationConstants.projectProtocolTypePlaceholder)} />
							</SelectTrigger>
							<SelectContent className="bg-white">
								{PROTOCOL_TYPES.map((option) => (
									<SelectItem key={option} value={option} className="cursor-pointer">
										<Translate text={PROTOCOL_TYPE_LABELS[option]} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{typeError && (
							<p className="text-xs text-red-600">
								<Translate text={typeError} />
							</p>
						)}
					</div>

					<RecordFilePicker
						file={file}
						onChange={setFile}
						error={fileError}
						onError={setFileError}
						rules={PROTOCOL_FILE_RULES}
						accept={PROTOCOL_FILE_ACCEPT}
						copy={PROTOCOL_FILE_PICKER_COPY}
					/>

					<DialogFooter className="gap-2 sm:gap-3">
						<Button type="button" variant="outline" onClick={onClose} className="cursor-pointer border-slate-200">
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button type="submit" className="cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800">
							<Save className="h-4 w-4" aria-hidden />
							<Translate text={localizationConstants.buttonSave} />
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default ProtocolUploadDialog;
