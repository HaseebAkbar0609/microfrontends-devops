"use client";

import React, { useState, useRef } from "react";
import { X, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PROTOCOL_CONSTANTS } from "../constants/protocol.constants";
import type { CreateProtocolPayload } from "../types/protocol.types";

export interface UploadProtocolModalProps {
	isOpen: boolean;
	onClose: () => void;
	onUpload: (payload: CreateProtocolPayload) => void;
}

export function UploadProtocolModal({
	isOpen,
	onClose,
	onUpload,
}: UploadProtocolModalProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			setSelectedFile(files[0]);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			setSelectedFile(e.dataTransfer.files[0]);
		}
	};

	const handleSubmit = () => {
		if (!selectedFile) return;

		const today = new Date().toISOString().slice(0, 10);
		onUpload({
			date: today,
			type: PROTOCOL_CONSTANTS.DEFAULT_FALLBACK_TYPE,
			protocolName: selectedFile.name.replace(/\.[^/.]+$/, ""),
			documentName: selectedFile.name,
			templateType: PROTOCOL_CONSTANTS.TEMPLATE_TYPES.UPLOAD,
			file: selectedFile,
		});
		setSelectedFile(null);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="w-[calc(100vw-2rem)] sm:w-[500px] sm:max-w-[500px] rounded-lg bg-white p-4 sm:p-6 border border-slate-200 shadow-xl"
			>
				<DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-slate-100">
					<div className="flex items-center gap-2">
						<Upload className="h-5 w-5 text-slate-700" />
						<DialogTitle className="font-sans font-semibold text-lg sm:text-xl text-slate-900">
							<Translate text={localizationConstants.uploadProtocolTitle} />
						</DialogTitle>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="h-8 w-8 p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer"
						aria-label="Close modal"
					>
						<X className="h-5 w-5" />
					</Button>
				</DialogHeader>

				<div className="space-y-4 pt-4">
					<input
						type="file"
						ref={fileInputRef}
						onChange={handleFileSelect}
						accept={PROTOCOL_CONSTANTS.ALLOWED_FILE_TYPES}
						className="hidden"
					/>

					{/* Drag and drop zone */}
					<div
						onDragOver={(e) => {
							e.preventDefault();
							setIsDragging(true);
						}}
						onDragLeave={() => setIsDragging(false)}
						onDrop={handleDrop}
						onClick={() => fileInputRef.current?.click()}
						className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-3 ${
							isDragging
								? "border-slate-900 bg-slate-50"
								: "border-slate-300 hover:border-slate-400 bg-slate-50/50"
						}`}
					>
						{selectedFile ? (
							<div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs max-w-full">
								<CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
								<div className="text-left min-w-0 flex-1">
									<p className="text-sm font-medium text-slate-900 truncate">
										{selectedFile.name}
									</p>
									<p className="text-xs text-slate-500">
										{(selectedFile.size / 1024).toFixed(1)} KB
									</p>
								</div>
							</div>
						) : (
							<>
								<div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
									<Upload className="h-6 w-6" />
								</div>
								<div className="space-y-1">
									<p className="text-sm font-medium text-slate-900">
										<Translate text={localizationConstants.protocolUpload} />
									</p>
									<p className="text-xs text-slate-500">
										<Translate text={localizationConstants.allowedFileTypesHelp} />
									</p>
								</div>
							</>
						)}
					</div>

					{/* Footer buttons */}
					<div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="w-full sm:w-auto h-10 px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-sm cursor-pointer shadow-none"
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							type="button"
							onClick={handleSubmit}
							disabled={!selectedFile}
							className="w-full sm:w-auto h-10 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium cursor-pointer shadow-none"
						>
							<Translate text={localizationConstants.protocolUpload} />
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default UploadProtocolModal;
