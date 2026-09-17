"use client";

import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Save, X } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogClose,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface CreateConfirmModalProps {
	open: boolean;
	onClose: () => void;
	onSave: () => void;
	role: string;
	setRole: Dispatch<SetStateAction<string>>;
	clarification: string;
	setClarification: Dispatch<SetStateAction<string>>;
	fileName: string;
	setFileName: Dispatch<SetStateAction<string>>;
}

export default function CreateConfirmModal({
	open,
	onClose,
	onSave,
	role,
	setRole,
	clarification,
	setClarification,
	fileName,
	setFileName,
}: CreateConfirmModalProps) {
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [roleError, setRoleError] = useState("");

	const hasFileSelected = Boolean(selectedFile) || Boolean(fileName);

	const handleSave = () => {
		if (!role.trim()) {
			setRoleError(t(localizationConstants.orderDagbokValidationErrorRole));
			return;
		}
		setRoleError("");
		onSave();
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			setFileName(file.name);
		}
	};

	const handleUploadClick = () => {
		if (hasFileSelected) {
			setSelectedFile(null);
			setFileName("");
			if (fileInputRef.current) fileInputRef.current.value = "";
		} else {
			fileInputRef.current?.click();
		}
	};

	return (
		<Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="w-[95vw] sm:max-w-[580px] md:max-w-[619px] max-h-[90vh] overflow-y-auto bg-white border border-slate-200 p-4 sm:p-6 gap-4 rounded-lg shadow-xl"
			>
				<DialogHeader className="flex flex-row items-center justify-between pb-1">
					<DialogTitle className="font-sans text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
						<Translate text={localizationConstants.orderDagbokConfirmTitle} />
					</DialogTitle>
					<DialogDescription className="sr-only">
						{t(localizationConstants.orderDagbokConfirmTitle)}
					</DialogDescription>
					<DialogClose asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-8 w-8 rounded-md text-slate-900 hover:bg-slate-100 cursor-pointer"
						>
							<X className="h-5 w-5 text-slate-900" />
						</Button>
					</DialogClose>
				</DialogHeader>

				<div className="flex flex-col gap-4.5 mt-1">
					{/* Roll */}
					<div className="flex flex-col gap-1.5">
						<label className="font-sans text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.orderDagbokRole} />
						</label>
						<Input
							type="text"
							value={role}
							onChange={(e) => { setRole(e.target.value); setRoleError(""); }}
							placeholder={t(localizationConstants.orderDagbokConfirmPlaceholderRole)}
							className={`h-10 bg-white text-slate-900 text-sm rounded-md focus-visible:border-slate-900 ${roleError ? "border-red-500 focus-visible:border-red-500" : "border-slate-200"}`}
						/>
						{roleError && (
							<p className="text-xs text-red-500">{roleError}</p>
						)}
					</div>

					{/* Förtydligande */}
					<div className="flex flex-col gap-1.5">
						<label className="font-sans text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.orderDagbokConfirmClarification} />
						</label>
						<Input
							type="text"
							value={clarification}
							onChange={(e) => setClarification(e.target.value)}
							placeholder={t(localizationConstants.orderDagbokConfirmPlaceholderClarification)}
							className="h-10 bg-white border-slate-200 text-slate-900 text-sm rounded-md focus-visible:border-slate-900"
						/>
					</div>

					{/* Underskrift / File Upload */}
					<div className="flex flex-col gap-1.5">
						<label className="font-sans text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.orderDagbokConfirmSignature} />
						</label>
						<div className="flex flex-col gap-1.5 w-full min-w-0">
							<Input
								ref={fileInputRef}
								type="file"
								accept=".png,.jpg,.jpeg,.pdf"
								className="hidden"
								onChange={handleFileSelect}
							/>
							<div className="flex flex-row items-center gap-2 w-full min-w-0 flex-nowrap">
								<Input
									type="text"
									readOnly
									value={fileName || ""}
									placeholder={t(localizationConstants.orderDagbokConfirmUpload)}
									onClick={() => fileInputRef.current?.click()}
									className="h-10 bg-white border-slate-200 text-slate-900 text-sm cursor-pointer truncate flex-1 min-w-0 focus-visible:border-slate-900 rounded-md"
								/>
								<Button
									type="button"
									onClick={handleUploadClick}
									className={`h-10 px-5 shrink-0 whitespace-nowrap font-medium text-sm rounded-md shadow-none flex items-center justify-center gap-1.5 transition-colors ${
										hasFileSelected
											? "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
											: "bg-slate-400 hover:bg-slate-500 text-white cursor-pointer"
									}`}
								>
									<span>{t(localizationConstants.orderDagbokConfirmUpload)}</span>
								</Button>
							</div>
							<span className="text-xs text-slate-500 font-normal">
								<Translate text={localizationConstants.orderDagbokConfirmUploadHint} />
							</span>
						</div>
					</div>
				</div>

				<DialogFooter className="flex flex-row items-center justify-end gap-4 pt-3 mt-1 border-t border-slate-100 flex-nowrap">
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						className="w-30 h-10 min-w-20 px-3 py-2 rounded-md border-slate-200 text-slate-700 bg-transparent hover:bg-slate-50 cursor-pointer font-medium text-sm shadow-none shrink-0 whitespace-nowrap"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>
					<Button
						type="button"
						onClick={handleSave}
						className="w-30 h-10 min-w-20 px-3 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 cursor-pointer font-medium text-sm flex items-center justify-center gap-2 shadow-none shrink-0 whitespace-nowrap"
					>
						<Save className="h-4 w-4" />
						<Translate text={localizationConstants.saveButton} />
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
