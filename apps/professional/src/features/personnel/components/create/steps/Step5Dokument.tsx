"use client";

import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Upload, X, Trash2, Eye, CircleUser } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
import {
	EmployeeDocumentsForm,
	AttachedDocItem,
} from "@/features/personnel/types/createEmployee.types";
import {
	HANDBOOK_OPTIONS,
	POLICY_OPTIONS,
	JOB_DESCRIPTION_OPTIONS,
} from "@/features/personnel/constants/createEmployee.constants";

interface Step5DokumentProps {
	config: EmployeeDocumentsForm;
	uploadedTags: string[];
	attachedDocs: AttachedDocItem[];
	onUpdateConfig: (field: keyof EmployeeDocumentsForm, value: string) => void;
	onRemoveTag: (tag: string) => void;
	onAddDoc: (doc: Omit<AttachedDocItem, "id">) => void;
	onRemoveDoc: (id: string) => void;
}

export function Step5Dokument({
	config,
	uploadedTags,
	attachedDocs,
	onUpdateConfig,
	onRemoveTag,
	onAddDoc,
	onRemoveDoc,
}: Step5DokumentProps) {
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
				fileFormat: isPdf ? "PDF" : "DOC",
			});
		}
	};

	return (
		<div className="space-y-6">
			{/* Configurations & Upload Card */}
			<section className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-xs">
				<div className="flex items-center gap-2.5 mb-6">
					<div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100/80 text-slate-700">
						<CircleUser className="w-5 h-5 text-slate-600" />
					</div>
					<h2 className="text-base font-semibold text-slate-900">
						{t(localizationConstants.sectionPersonalDocs)}
					</h2>
				</div>

				{/* 3 Select dropdowns */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
					<div>
						<Label htmlFor="handbook" className="text-xs font-medium text-slate-600 mb-1.5 block">
							{t(localizationConstants.fieldHandbook)}
						</Label>
						<Select
							value={config.employeeHandbook}
							onValueChange={(val) => onUpdateConfig("employeeHandbook", val)}
						>
							<SelectTrigger id="handbook" className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm">
								<SelectValue placeholder={t(localizationConstants.fieldHandbook)} />
							</SelectTrigger>
							<SelectContent>
								{HANDBOOK_OPTIONS.map((item) => (
									<SelectItem key={item} value={item}>
										{item}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label htmlFor="policy" className="text-xs font-medium text-slate-600 mb-1.5 block">
							{t(localizationConstants.fieldPolicy)}
						</Label>
						<Select
							value={config.policy}
							onValueChange={(val) => onUpdateConfig("policy", val)}
						>
							<SelectTrigger id="policy" className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm">
								<SelectValue placeholder={t(localizationConstants.fieldPolicy)} />
							</SelectTrigger>
							<SelectContent>
								{POLICY_OPTIONS.map((item) => (
									<SelectItem key={item} value={item}>
										{item}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label htmlFor="jobDescription" className="text-xs font-medium text-slate-600 mb-1.5 block">
							{t(localizationConstants.fieldJobDescription)}
						</Label>
						<Select
							value={config.jobDescription}
							onValueChange={(val) => onUpdateConfig("jobDescription", val)}
						>
							<SelectTrigger id="jobDescription" className="h-10 bg-white border-slate-200 text-slate-900 rounded-lg text-sm">
								<SelectValue placeholder={t(localizationConstants.fieldJobDescription)} />
							</SelectTrigger>
							<SelectContent>
								{JOB_DESCRIPTION_OPTIONS.map((item) => (
									<SelectItem key={item} value={item}>
										{item}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Upload box */}
				<div className="pt-4 border-t border-slate-100">
					<Label className="text-xs font-medium text-slate-600 mb-1.5 block">
						{t(localizationConstants.uploadFilesLabel)}
					</Label>
					<p className="text-xs text-slate-500 mb-4">
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
				</div>
			</section>

			{/* Attached Documents Table */}
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
									{t(localizationConstants.colFile)}
								</TableHead>
								<TableHead className="text-xs font-semibold text-slate-600 h-10 px-4 text-center">
									{t(localizationConstants.btnViewFile)}
								</TableHead>
								<TableHead className="text-xs font-semibold text-slate-600 h-10 px-4 text-right">
									{t(localizationConstants.actionsMenuLabel)}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{attachedDocs.map((doc) => {
								const isDoc = doc.fileFormat?.toUpperCase() === "DOC";
								return (
									<TableRow key={doc.id} className="border-b border-slate-100 hover:bg-slate-50/60">
										<TableCell className="text-sm text-slate-700 px-4 py-3">
											{doc.date}
										</TableCell>
										<TableCell className="text-sm font-medium text-slate-900 px-4 py-3">
											{doc.name}
										</TableCell>
										<TableCell className="px-4 py-3">
											<div className="flex items-center gap-2">
												{isDoc ? <DocFileIcon className="h-7 w-6" /> : <PdfFileIcon className="h-7 w-6" />}
												<span className="text-xs font-medium text-slate-600">
													{doc.fileFormat}
												</span>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3 text-center">
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium inline-flex items-center gap-1.5"
												onClick={() => window.open(doc.fileUrl || "#", "_blank")}
											>
												<Eye className="h-3.5 w-3.5 text-slate-500" />
												{t(localizationConstants.btnViewFile)}
											</Button>
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
		</div>
	);
}
