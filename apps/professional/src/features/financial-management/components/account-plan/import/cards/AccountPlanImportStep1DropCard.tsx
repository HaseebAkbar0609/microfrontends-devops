"use client";

import React, { useRef } from "react";
import { Download, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface AccountPlanImportStep1DropCardProps {
	readonly onFileSelect: (file: File) => void;
}

export function AccountPlanImportStep1DropCard({
	onFileSelect,
}: AccountPlanImportStep1DropCardProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			onFileSelect(e.dataTransfer.files[0]);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			onFileSelect(e.target.files[0]);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-[460px] w-full">
			<div
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onClick={() => fileInputRef.current?.click()}
				className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs hover:border-slate-300 transition-all cursor-pointer flex flex-col items-center justify-center gap-4"
			>
				<input
					ref={fileInputRef}
					type="file"
					accept=".sie,.se,.csv,.xlsx,.xls,.txt"
					onChange={handleFileInputChange}
					className="hidden"
				/>

				<div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
					<Download className="h-8 w-8" />
				</div>

				<div className="flex flex-col gap-1">
					<h3 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.importAccountPlan} />
					</h3>
					<p className="text-xs text-slate-500">
						<Translate text={localizationConstants.importFileNow} />
					</p>
				</div>

				<Button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						fileInputRef.current?.click();
					}}
					className="mt-2 h-10 px-6 gap-2 rounded-lg bg-[#111721] text-white hover:bg-slate-800 text-xs font-medium cursor-pointer"
				>
					<Translate text={localizationConstants.importButtonText} />
					<Save className="h-4 w-4" />
				</Button>
			</div>
		</div>
	);
}
