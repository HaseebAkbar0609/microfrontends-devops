"use client";

import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Upload, X, Trash2, CircleUser } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { DocFileIcon } from "@/components/ui/DocFileIcon";
import { CompetenceDocItem } from "@/features/personnel/types/createEmployee.types";
import { AddCompetenceModal } from "../modals/AddCompetenceModal";

interface Step4KompetensProps {
	uploadedTags: string[];
	competenceDocs: CompetenceDocItem[];
	onRemoveTag: (tag: string) => void;
	onAddDoc: (doc: Omit<CompetenceDocItem, "id">) => void;
	onRemoveDoc: (id: string) => void;
}

export function Step4Kompetens({
	uploadedTags,
	competenceDocs,
	onRemoveTag,
	onAddDoc,
	onRemoveDoc,
}: Step4KompetensProps) {
	const { t } = useTranslation();
	const [isModalOpen, setIsModalOpen] = useState(false);
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
		<div className="space-y-6">
			{/* Top Action Button */}
			<div className="flex items-center justify-start">
				<Button
					type="button"
					onClick={() => setIsModalOpen(true)}
					className="bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-sm font-medium flex items-center gap-2"
				>
					<Plus className="h-4 w-4" />
					{t(localizationConstants.addCompetenceBtn)}
				</Button>
			</div>

			{/* Upload Box */}
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
					{/* Tag Container */}
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

					{/* Hidden Input & Upload Button */}
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

			{/* Specification Table */}
			<section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
				<div className="flex items-center gap-2.5 mb-5">
					<div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100/80 text-slate-700">
						<CircleUser className="w-5 h-5 text-slate-600" />
					</div>
					<h2 className="text-base font-semibold text-slate-900">
						{t(localizationConstants.tableSpecification)}
					</h2>
				</div>

				<div className="rounded-lg border border-slate-200 overflow-hidden">
					<Table>
						<TableHeader className="bg-slate-50">
							<TableRow className="border-b border-slate-200">
								<TableHead className="text-xs font-semibold text-slate-600 h-10 px-4">
									{t(localizationConstants.colDate)}
								</TableHead>
								<TableHead className="text-xs font-semibold text-slate-600 h-10 px-4">
									{t(localizationConstants.colDocName)}
								</TableHead>
								<TableHead className="text-xs font-semibold text-slate-600 h-10 px-4">
									{t(localizationConstants.colValidity)}
								</TableHead>
								<TableHead className="text-xs font-semibold text-slate-600 h-10 px-4">
									{t(localizationConstants.colFile)}
								</TableHead>
								<TableHead className="text-xs font-semibold text-slate-600 h-10 px-4 text-right">
									{t(localizationConstants.actionsMenuLabel)}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{competenceDocs.map((doc) => {
								const isDoc = doc.fileName?.toLowerCase().endsWith(".doc") || doc.fileName?.toLowerCase().endsWith(".docx");
								return (
									<TableRow key={doc.id} className="border-b border-slate-100 hover:bg-slate-50/60">
										<TableCell className="text-sm text-slate-700 px-4 py-3">
											{doc.date}
										</TableCell>
										<TableCell className="text-sm font-medium text-slate-900 px-4 py-3">
											{doc.name}
										</TableCell>
										<TableCell className="text-sm text-slate-700 px-4 py-3">
											{doc.validity}
										</TableCell>
										<TableCell className="px-4 py-3">
											<div className="flex items-center gap-2">
												{isDoc ? <DocFileIcon className="h-7 w-6" /> : <PdfFileIcon className="h-7 w-6" />}
												<span className="text-xs text-slate-600 truncate max-w-[150px]">
													{doc.fileName}
												</span>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-right">
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => onRemoveDoc(doc.id)}
												className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1.5 h-auto"
												aria-label={`${t(localizationConstants.btnCancel)} ${doc.name}`}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			</section>

			{/* Add Competence Modal */}
			<AddCompetenceModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onAdd={onAddDoc}
			/>
		</div>
	);
}
