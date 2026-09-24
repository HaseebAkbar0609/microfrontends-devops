"use client";

import React from "react";
import { UploadCloud } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Translate } from "@/utils/translation/translate";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";

interface BankDocumentUploadAreaProps {
	fileName: string;
	onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BankDocumentUploadArea({
	fileName,
	onFileSelect,
}: BankDocumentUploadAreaProps) {
	const { t } = useTranslation();

	return (
		<div>
			<Label className="text-xs font-semibold text-[#475569] mb-1 block">
				<Translate text={localizationConstants.colDocFileType} />
			</Label>
			<label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#CBD5E1] hover:border-[#0D9488] rounded-xl cursor-pointer bg-slate-50 transition-colors">
				<UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
				<span className="text-xs font-medium text-slate-600">
					{fileName || t(localizationConstants.uploadFilePlaceholder)}
				</span>
				<span className="text-[10px] text-slate-400 mt-0.5">
					<Translate text={localizationConstants.uploadFileFormatLimit} />
				</span>
				<input
					type="file"
					className="hidden"
					onChange={onFileSelect}
					accept=".pdf,.docx,.xlsx,.png,.jpg"
				/>
			</label>
		</div>
	);
}
