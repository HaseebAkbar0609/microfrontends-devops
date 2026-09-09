"use client";

import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Upload, X, CircleUser } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { CompetenceDocItem } from "@/features/personnel/types/createEmployee.types";

interface CompetenceUploadCardProps {
	uploadedTags: string[];
	onRemoveTag: (tag: string) => void;
	onAddDoc: (doc: Omit<CompetenceDocItem, "id">) => void;
}

export function CompetenceUploadCard({
	uploadedTags,
	onRemoveTag,
	onAddDoc,
}: CompetenceUploadCardProps) {
	const { t } = useTranslation();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			const isPdf = file.name.toLowerCase().endsWith(".pdf");
			onAddDoc({
				date: new Date().toISOString().split("T")[0],
				name: file.name.replace(/\.[^/.]+$/, ""),
				validity: "2027-01-01",
				fileName: file.name,
				fileType: isPdf ? "PDF" : "DOC",
			});
		}
	};

	return (
		<section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
			<div className="flex items-center gap-2.5 mb-2">
				<div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100/80 text-slate-700">
					<CircleUser className="w-5 h-5 text-slate-600" />
				</div>
				<h2 className="text-base font-semibold text-slate-900">
					{t(localizationConstants.sectionPersonalDocs)}
				</h2>
			</div>
			<p className="text-xs text-slate-500 mb-4 pl-10.5">
				{t(localizationConstants.uploadFilesSubtitle)}
			</p>

			<div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
				<div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
					{uploadedTags.map((tag) => (
						<span
							key={tag}
							className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-sm"
						>
							{tag}
							<button
								type="button"
								onClick={() => onRemoveTag(tag)}
								className="text-slate-400 hover:text-slate-700 focus:outline-none"
								aria-label={`${t(localizationConstants.btnCancel)} ${tag}`}
							>
								<X className="h-3.5 w-3.5" />
							</button>
						</span>
					))}
				</div>

				<input
					ref={fileInputRef}
					type="file"
					className="hidden"
					accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
					onChange={handleFileSelect}
				/>
				<Button
					type="button"
					variant="outline"
					onClick={() => fileInputRef.current?.click()}
					className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center gap-2 shrink-0"
				>
					<Upload className="h-3.5 w-3.5 text-slate-500" />
					{t(localizationConstants.uploadBtn)}
				</Button>
			</div>
		</section>
	);
}
