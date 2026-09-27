"use client";

import React from "react";
import { ChevronDown, ChevronUp, Check, FileSpreadsheet, Eye, Trash2, RefreshCw } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ArticleImportMapping } from "../../../types/article.types";
import type { ParsedFileData } from "../../../hooks/useArticleImport";

interface ArticleImportMappingFormsProps {
	readonly file: File;
	readonly parsedData: ParsedFileData;
	readonly mapping: ArticleImportMapping;
	readonly basicInfoOpen: boolean;
	readonly measurementsOpen: boolean;
	readonly onToggleBasicInfo: () => void;
	readonly onToggleMeasurements: () => void;
	readonly onMappingChange: (field: string, col: string) => void;
	readonly onRemoveFile?: () => void;
	readonly onReupload?: () => void;
}

const BASIC_MAPPING_FIELDS = [
	{ key: "articleNr", label: "Artikelnummer", required: true },
	{ key: "benamning", label: "Namn", required: true },
	{ key: "enhet", label: "Enhet", required: true },
	{ key: "ean", label: "EAN", required: false },
	{ key: "leverantor", label: "Tillverkare / Leverantör", required: true },
	{ key: "supplierArticleNo", label: "Tillverkarens artikelnummer", required: false },
	{ key: "beteckning", label: "Beteckning", required: false },
	{ key: "modell", label: "Modell", required: false },
	{ key: "typAvArtikel", label: "Typ av artikel", required: true },
	{ key: "status", label: "Aktiv", required: false },
	{ key: "leverantorsnummer", label: "Leverantörsnummer", required: false },
];

const MEASUREMENT_MAPPING_FIELDS = [
	{ key: "vikt", label: "Vikt", required: false },
	{ key: "langd", label: "Längd", required: false },
	{ key: "bredd", label: "Bredd", required: false },
	{ key: "hojd", label: "Höjd", required: false },
	{ key: "material", label: "Material", required: false },
];

export function ArticleImportMappingForms({
	file,
	parsedData,
	mapping,
	basicInfoOpen,
	measurementsOpen,
	onToggleBasicInfo,
	onToggleMeasurements,
	onMappingChange,
	onRemoveFile,
	onReupload,
}: ArticleImportMappingFormsProps) {
	const mappedValuesSet = new Set(Object.values(mapping).filter(Boolean));

	return (
		<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
			{/* Left Column: Din fil (Figma media_1790054133485) */}
			<div className="lg:col-span-5 space-y-6">
				{/* Card 1: Din fil preview with mapped checkmarks */}
				<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
					<div className="flex items-center justify-between border-b border-slate-100 pb-3">
						<div>
							<h2 className="text-sm font-bold text-slate-900">
								<Translate text={localizationConstants.yourFileSection} />
							</h2>
							<p className="text-[11px] text-slate-500 mt-0.5">
								<Translate text={localizationConstants.fileMappingSubtext} />
							</p>
						</div>
						{onReupload && (
							<button
								type="button"
								onClick={onReupload}
								className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
								title="Ladda upp ny fil"
							>
								<RefreshCw className="h-4 w-4" />
							</button>
						)}
					</div>

					<div className="border border-slate-200 rounded-lg overflow-hidden max-h-[380px] overflow-y-auto">
						<table className="w-full text-left text-xs">
							<thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold sticky top-0">
								<tr>
									<th className="py-2.5 px-3">
										<Translate text={localizationConstants.columnHeader} />
									</th>
									<th className="py-2.5 px-3">
										<Translate text={localizationConstants.contentHeader} />
									</th>
									<th className="py-2.5 px-3 text-center w-12">
										<Translate text={localizationConstants.statusHeader} />
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{parsedData.columns.map((col) => {
									const sampleValue = parsedData.rows[0]?.[col] ?? "-";
									const isMapped = mappedValuesSet.has(col);
									return (
										<tr key={col} className="hover:bg-slate-50/50">
											<td className="py-2 px-3 font-medium text-slate-800">
												{col}
											</td>
											<td className="py-2 px-3 text-slate-600 truncate max-w-[140px]" title={sampleValue}>
												{sampleValue}
											</td>
											<td className="py-2 px-3 text-center">
												{isMapped ? (
													<span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-100 text-emerald-700">
														<Check className="h-3.5 w-3.5" />
													</span>
												) : (
													<span className="text-slate-300 font-bold">•</span>
												)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>

				{/* Card 2: Filer / Dokument */}
				<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
					<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
						<Translate text={localizationConstants.filesHeader} />
					</h2>
					<div className="space-y-2">
						<span className="text-xs font-medium text-slate-600">
							<Translate text={localizationConstants.documentsTitle} />
						</span>
						<div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
							<div className="flex items-center gap-2.5 min-w-0">
								<div className="h-8 w-8 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
									<FileSpreadsheet className="h-4 w-4" />
								</div>
								<div className="min-w-0">
									<p className="text-xs font-semibold text-slate-900 truncate">{file.name}</p>
									<p className="text-[11px] text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
								</div>
							</div>
							<div className="flex items-center gap-1 shrink-0">
								<button
									type="button"
									className="p-1.5 rounded text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
									title="Förhandsgranska"
								>
									<Eye className="h-4 w-4" />
								</button>
								{onRemoveFile && (
									<button
										type="button"
										onClick={onRemoveFile}
										className="p-1.5 rounded text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
										title="Ta bort fil"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Right Column: Target System Field Mapping */}
			<div className="lg:col-span-7 space-y-6">
				{/* Section 1: Grunduppgifter */}
				<div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
					<button
						type="button"
						onClick={onToggleBasicInfo}
						className="w-full flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 cursor-pointer"
					>
						<span>
							<Translate text={localizationConstants.basicInfoSectionTitle} />
						</span>
						{basicInfoOpen ? (
							<ChevronUp className="h-4 w-4 text-slate-500" />
						) : (
							<ChevronDown className="h-4 w-4 text-slate-500" />
						)}
					</button>

					{basicInfoOpen && (
						<div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
							{BASIC_MAPPING_FIELDS.map((field) => (
								<div key={field.key} className="flex flex-col gap-1.5">
									<label className="text-xs font-medium text-slate-700">
										{field.label} {field.required && <span className="text-red-500">*</span>}
									</label>
									<Select
										value={mapping[field.key] || "unmapped"}
										onValueChange={(val) =>
											onMappingChange(field.key, val === "unmapped" ? "" : val)
										}
									>
										<SelectTrigger className="h-10 text-xs border-slate-200 bg-white">
											<SelectValue placeholder="Välj kolumn" />
										</SelectTrigger>
										<SelectContent className="bg-white border-slate-200 shadow-md">
											<SelectItem value="unmapped" className="text-xs text-slate-400">
												<Translate text={localizationConstants.customerDetailNone} />
											</SelectItem>
											{parsedData.columns.map((col) => (
												<SelectItem key={col} value={col} className="text-xs">
													{col}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							))}
						</div>
					)}
				</div>

				{/* Section 2: Mått */}
				<div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
					<button
						type="button"
						onClick={onToggleMeasurements}
						className="w-full flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200 font-bold text-sm text-slate-900 cursor-pointer"
					>
						<span>
							<Translate text={localizationConstants.measurementsSection} />
						</span>
						{measurementsOpen ? (
							<ChevronUp className="h-4 w-4 text-slate-500" />
						) : (
							<ChevronDown className="h-4 w-4 text-slate-500" />
						)}
					</button>

					{measurementsOpen && (
						<div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{MEASUREMENT_MAPPING_FIELDS.map((field) => (
								<div key={field.key} className="flex flex-col gap-1.5">
									<label className="text-xs font-medium text-slate-700">
										{field.label} {field.required && <span className="text-red-500">*</span>}
									</label>
									<Select
										value={mapping[field.key] || "unmapped"}
										onValueChange={(val) =>
											onMappingChange(field.key, val === "unmapped" ? "" : val)
										}
									>
										<SelectTrigger className="h-10 text-xs border-slate-200 bg-white">
											<SelectValue placeholder="Välj kolumn" />
										</SelectTrigger>
										<SelectContent className="bg-white border-slate-200 shadow-md">
											<SelectItem value="unmapped" className="text-xs text-slate-400">
												<Translate text={localizationConstants.customerDetailNone} />
											</SelectItem>
											{parsedData.columns.map((col) => (
												<SelectItem key={col} value={col} className="text-xs">
													{col}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
