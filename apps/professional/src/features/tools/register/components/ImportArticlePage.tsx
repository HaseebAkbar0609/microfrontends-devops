"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import {
	ArrowLeft,
	Upload,
	ChevronDown,
	ChevronUp,
	Check,
	Download,
	Image as ImageIcon,
	Eye,
	Loader2,
	X,
	ChevronsLeftRight,
	Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { importArticleAPIAction } from "../api/articleRegister";
import type { ArticleImportMapping, ArticleImportColumn } from "../types";

interface ParsedFileData {
	columns: string[];
	rows: Record<string, string>[];
	totalRows: number;
}

const MEASUREMENT_FIELDS = [
	{ key: "weight", labelKey: localizationConstants.weightLabel },
	{ key: "length", labelKey: localizationConstants.lengthLabel },
	{ key: "width", labelKey: localizationConstants.widthLabel },
	{ key: "height", labelKey: localizationConstants.heightLabel },
];

function parseCSV(text: string): ParsedFileData {
	const lines = text.split("\n").filter((line) => line.trim());
	if (lines.length === 0) return { columns: [], rows: [], totalRows: 0 };

	const delimiter = lines[0].includes(";") ? ";" : ",";
	const columns = lines[0].split(delimiter).map((col) => col.trim().replace(/^"|"$/g, ""));
	const rows: Record<string, string>[] = [];

	for (let i = 1; i < lines.length; i++) {
		const values = lines[i].split(delimiter).map((val) => val.trim().replace(/^"|"$/g, ""));
		const row: Record<string, string> = {};
		columns.forEach((col, idx) => {
			row[col] = values[idx] ?? "";
		});
		rows.push(row);
	}

	return { columns, rows, totalRows: rows.length };
}

function parseXLSX(workbook: XLSX.WorkBook): ParsedFileData {
	const firstSheetName = workbook.SheetNames[0];
	if (!firstSheetName) return { columns: [], rows: [], totalRows: 0 };

	const worksheet = workbook.Sheets[firstSheetName];
	const jsonData = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet);

	if (jsonData.length === 0) return { columns: [], rows: [], totalRows: 0 };

	const columns = Object.keys(jsonData[0] || {});
	const rows = jsonData.map((row: Record<string, string>) => {
		const normalizedRow: Record<string, string> = {};
		columns.forEach((col) => {
			normalizedRow[col] = String((row as Record<string, unknown>)[col] ?? "");
		});
		return normalizedRow;
	});

	return { columns, rows, totalRows: rows.length };
}

function getFileExtension(filename: string): string {
	return filename.split(".").pop()?.toLowerCase() ?? "";
}

export function ImportArticlePage() {
	const router = useRouter();
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [parsedData, setParsedData] = useState<ParsedFileData | null>(null);
	const [mapping, setMapping] = useState<ArticleImportMapping>({});
	const [isDragging, setIsDragging] = useState(false);
	const [isImporting, setIsImporting] = useState(false);
	const [importResult, setImportResult] = useState<{
		success: boolean;
		successCount: number;
		failureCount: number;
	} | null>(null);
	const [basicInfoOpen, setBasicInfoOpen] = useState(true);
	const [measurementsOpen, setMeasurementsOpen] = useState(true);

	const handleFileSelect = useCallback(async (file: File) => {
		const ext = getFileExtension(file.name);
		if (ext !== "csv" && ext !== "xlsx" && ext !== "xls") {
			showToast("error", t(localizationConstants.invalidFileFormatError));
			return;
		}

		setSelectedFile(file);
		setImportResult(null);

		try {
			if (ext === "csv") {
				const text = await file.text();
				const parsed = parseCSV(text);
				setParsedData(parsed);
			} else {
				const arrayBuffer = await file.arrayBuffer();
				const workbook = XLSX.read(arrayBuffer, { type: "array" });
				const parsed = parseXLSX(workbook);
				setParsedData(parsed);
			}
		} catch {
			showToast("error", t(localizationConstants.fileParseError));
			setSelectedFile(null);
		}
	}, [t]);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
			const file = e.dataTransfer.files[0];
			if (file) handleFileSelect(file);
		},
		[handleFileSelect],
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) handleFileSelect(file);
		},
		[handleFileSelect],
	);

	const handleMappingChange = useCallback((field: string, value: string) => {
		setMapping((prev) => ({ ...prev, [field]: value }));
	}, []);

	const handleImport = useCallback(async () => {
		if (!selectedFile) return;

		setIsImporting(true);
		try {
			const result = await importArticleAPIAction(selectedFile, mapping);
			setImportResult({
				success: result.failureCount === 0,
				successCount: result.successCount,
				failureCount: result.failureCount,
			});

			if (result.failureCount === 0) {
				showToast("success", t(localizationConstants.importSuccessMessage));
				setTimeout(() => router.push("/tools/register"), 2000);
			} else {
				showToast("error", t(localizationConstants.importErrorMessage));
			}
		} catch {
			showToast("error", t(localizationConstants.importErrorMessage));
		} finally {
			setIsImporting(false);
		}
	}, [selectedFile, mapping, t, router]);

	const handleDownloadTemplate = useCallback(() => {
		const headers = [
			"Leverantör",
			"Artikel nr",
			"Benämning",
			"Pris",
			"Enhet",
			"EAN",
			"Tillverkare",
			"Tillverkarens artikelnr",
			"Modell",
			"Vikt",
			"Längd",
			"Bredd",
			"Höjd",
			"Material",
		];
		const csvContent = headers.join(",") + "\n";
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.download = "article_import_template.csv";
		link.click();
		URL.revokeObjectURL(link.href);
	}, []);

	const mappedColumns = useMemo((): ArticleImportColumn[] => {
		if (!parsedData) return [];

		return parsedData.columns.map((col) => ({
			fileColumn: col,
			fileValue: parsedData.rows[0]?.[col] ?? "",
			mappedField: Object.entries(mapping).find(([, val]) => val === col)?.[0],
		}));
	}, [parsedData, mapping]);

	return (
		<div className="flex flex-col flex-1 bg-slate-50">
			{/* Header */}
			<div className="mb-1 flex items-center gap-2 ml-0 px-3 sm:px-4 md:px-6 pt-6">
				<button
					type="button"
					onClick={() => router.push("/tools/register")}
					className="rounded-md p-1 hover:bg-slate-100 cursor-pointer"
				>
					<ArrowLeft className="h-5 w-5 text-slate-700" />
				</button>
				<h1 className="text-lg sm:text-xl font-semibold text-slate-900">
					<Translate text={localizationConstants.importFileTitle} />
				</h1>
			</div>

			{/* Main Content */}
			<div className="flex-1 px-3 sm:px-4 md:px-6 sm:ml-9 mt-4 pb-6">
				{!selectedFile ? (
					/* File Upload Zone */
					<div className="max-w-2xl mx-auto">
						<div className="mb-6">
							<h2 className="text-sm font-semibold text-slate-900 mb-1">
								<Translate text={localizationConstants.importInstructionsTitle} />
							</h2>
							<p className="text-sm text-slate-500">
								<Translate text={localizationConstants.importInstructionsText} />
							</p>
						</div>

						<div
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							onClick={() => fileInputRef.current?.click()}
							className={cn(
								"flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-12 cursor-pointer transition-all",
								isDragging
									? "border-[#FF8100] bg-orange-50"
									: "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50",
							)}
						>
							<div
								className={cn(
									"flex items-center justify-center w-14 h-14 rounded-full",
									isDragging ? "bg-orange-100" : "bg-slate-200",
								)}
							>
								<Upload
									className={cn(
										"h-6 w-6",
										isDragging ? "text-[#FF8100]" : "text-slate-500",
									)}
								/>
							</div>
							<div className="text-center">
								<p className="text-sm font-medium text-slate-700">
									<Translate text={localizationConstants.dropzoneText} />
								</p>
								<p className="text-xs text-slate-500 mt-1">
									<Translate text={localizationConstants.dropzoneSubtext} />
								</p>
							</div>
						</div>

						<input
							ref={fileInputRef}
							type="file"
							accept=".csv,.xlsx,.xls"
							className="sr-only"
							onChange={handleInputChange}
						/>

						<div className="mt-4 flex items-center gap-2">
							<Button
								variant="link"
								className="p-0 h-auto text-sm font-medium text-[#FF8100] hover:text-[#E67300]"
								onClick={handleDownloadTemplate}
							>
								<Download className="h-4 w-4 mr-1.5" />
								<Translate text={localizationConstants.downloadTemplateLabel} />
							</Button>
						</div>

						<p className="mt-3 text-xs text-slate-500">
							<Translate text={localizationConstants.supportedFormatsLabel} />
						</p>
					</div>
				) : (
					/* Column Mapping Interface */
					<div className="flex flex-col gap-6">
						{/* Import Result Banner */}
						{importResult && (
							<div
								className={cn(
									"flex items-center gap-3 rounded-lg px-4 py-3 text-sm",
									importResult.success
										? "bg-green-50 text-green-800 border border-green-200"
										: "bg-red-50 text-red-800 border border-red-200",
								)}
							>
								{importResult.success ? (
									<Check className="h-4 w-4 text-green-600 shrink-0" />
								) : (
									<X className="h-4 w-4 text-red-600 shrink-0" />
								)}
								<span>
									{importResult.successCount}{" "}
									<Translate text={localizationConstants.filesImportedSuccessfully} />
									{importResult.failureCount > 0 && (
										<>
											, {importResult.failureCount}{" "}
											<Translate text={localizationConstants.filesFailed} />
										</>
									)}
								</span>
							</div>
						)}

						{/* Two Column Layout */}
						<div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
							{/* Left Column - Your File */}
							<div className="w-full xl:w-[32%] min-w-0">
								<div className="rounded-lg border border-slate-200 bg-white">
									{/* Section Header */}
									<div className="flex items-center justify-between px-4 h-14 border-b border-slate-200">
										<h3
											className="text-sm font-medium truncate"
											style={{
												color: "#09090B",
												fontFamily: "Inter",
												fontSize: "14px",
												lineHeight: "20px",
												letterSpacing: "0%",
											}}
										>
											<Translate text={localizationConstants.yourFileSection} />
										</h3>
										<div className="flex items-center shrink-0 ml-2">
											<button
												type="button"
												className="inline-flex items-center gap-2 sm:gap-4 rounded-md border border-slate-200 bg-white px-3 sm:px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
											>
												{parsedData?.totalRows ?? 0}
												<ChevronsLeftRight
													className="h-4 w-4"
													style={{ color: "#737373" }}
												/>
											</button>
										</div>
									</div>

									{/* Instructions */}
									<div className="px-4 py-3 border-b border-slate-100">
										<p className="text-xs leading-relaxed" style={{ color: "#737373" }}>
											<Translate text={localizationConstants.importInstructionsText} />
										</p>
									</div>

									{/* Column Mapping Table */}
									<div className="overflow-x-auto">
										{/* Header Row */}
										<div className="mx-3">
											<table className="w-full text-sm">
												<thead>
													<tr style={{ backgroundColor: "#73737317", borderRadius: "4px" }}>
														<th
															className="py-2 pl-2 pr-6 text-left text-sm font-medium rounded-l-lg whitespace-nowrap xl:-ml-3"
															style={{
																color: "#09090B",
																fontFamily: "Inter",
																fontSize: "14px",
																lineHeight: "20px",
																letterSpacing: "0%",
															}}
														>
															<Translate text={localizationConstants.columnHeader} />
														</th>
														<th
															className="py-2 pl-2 text-left text-sm font-medium rounded-r-lg whitespace-nowrap xl:-ml-3"
															style={{
																color: "#09090B",
																fontFamily: "Inter",
																fontSize: "14px",
																lineHeight: "20px",
																letterSpacing: "0%",
															}}
														>
															<Translate text={localizationConstants.contentHeader} />
														</th>
													</tr>
												</thead>
											</table>
										</div>
										{/* Body Rows */}
										<div className="mx-3">
											<table className="w-full text-sm">
												<tbody>
													{mappedColumns.map((col) => {
														const isMapped = !!col.mappedField;
														return (
															<tr key={col.fileColumn}>
																<td
																	className="py-2.5 pl-2 pr-6 font-medium whitespace-nowrap"
																	style={{
																		color: "#09090B",
																		fontFamily: "Inter",
																		fontSize: "14px",
																		lineHeight: "20px",
																	}}
																>
																	{col.fileColumn}
																</td>
																<td className="py-2.5 pl-2 text-right">
																	<div className="relative inline-flex items-center">
																		<input
																			type="text"
																			readOnly
																			value={col.fileValue}
																			className={cn(
																				"h-9 min-h-9 w-full xl:min-w-30 xl:-ml-3 pl-3 pr-8 py-1.5 text-sm bg-white border rounded-(--radius-input,6px) focus:outline-none focus:ring-1 focus:ring-slate-300",
																				isMapped ? "border-green-500" : "border-slate-200",
																			)}
																			style={{ color: "#09090B" }}
																		/>
																		{isMapped && (
																			<Check className="absolute right-2 h-4 w-4 text-green-600 pointer-events-none" />
																		)}
																	</div>
																</td>
															</tr>
														);
													})}
												</tbody>
											</table>
										</div>
									</div>
								</div>

								{/* Files Section */}
								<div className="mt-6 rounded-lg border border-slate-200 bg-white">
									<div className="px-4 h-14 border-b border-slate-200 flex items-center">
										<h3
											className="text-sm font-medium"
											style={{
												color: "#09090B",
												fontFamily: "Inter",
												fontSize: "14px",
												lineHeight: "20px",
												letterSpacing: "0%",
											}}
										>
											<Translate text={localizationConstants.filesSection} />
										</h3>
									</div>
									<div className="p-4">
										<h4
											className="text-sm font-medium mb-3"
											style={{
												color: "#09090B",
												fontFamily: "Inter",
												fontSize: "14px",
												lineHeight: "20px",
												letterSpacing: "0%",
											}}
										>
											<Translate text={localizationConstants.documentLabel} />
										</h4>
										<div className="space-y-2">
											{["Imagenamn.png", "Imagenamn.png"].map((docName, idx) => (
												<div
													key={`${docName}-${idx}`}
													className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 hover:bg-slate-50 transition-colors"
												>
													<div className="flex items-center gap-2">
														<ImageIcon className="h-4 w-4" style={{ color: "#737373" }} />
														<span className="text-sm text-slate-700">{docName}</span>
													</div>
													<button
														type="button"
														className="inline-flex items-center justify-center p-1 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
														style={{ color: "#737373" }}
													>
														<Eye className="h-4 w-4" />
													</button>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>

							{/* Right Column - Mapping Fields */}
							<div className="w-full xl:w-[68%] min-w-0 space-y-6">
								{/* Basic Info Section */}
								<div className="rounded-lg border border-slate-200 bg-white">
									<button
										type="button"
										onClick={() => setBasicInfoOpen(!basicInfoOpen)}
										className="flex items-center justify-between w-full px-4 h-14 border-b border-slate-100 text-left cursor-pointer"
									>
										<h3 className="text-sm font-semibold text-slate-900">
											<Translate text={localizationConstants.basicInfoSection} />
										</h3>
										{basicInfoOpen ? (
											<ChevronUp className="h-4 w-4 text-slate-500" />
										) : (
											<ChevronDown className="h-4 w-4" style={{ color: "#737373" }} />
										)}
									</button>

									{basicInfoOpen && (
										<div className="px-4 pb-4 border-t border-slate-100 pt-4">
											{/* Row 1: Artikelnummer | Namn */}
											<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
												<div className="space-y-0.5">
													<label
														className="text-sm font-medium"
														style={{
															color: "#09090B",
															fontFamily: "Inter",
															fontSize: "14px",
															lineHeight: "20px",
															letterSpacing: "0%",
														}}
													>
														<Translate text={localizationConstants.articleNumberLabel} />
													</label>
													<Select
														value={mapping.articleNumber ?? ""}
														onValueChange={(value) =>
															handleMappingChange("articleNumber", value)
														}
													>
														<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-xs [&_svg]:text-[#737373] [&_svg]:opacity-100">
															<SelectValue placeholder={t(localizationConstants.placeholderSelect)} />
														</SelectTrigger>
														<SelectContent className="bg-white border-slate-200 shadow-md py-1">
															{parsedData?.columns.map((col) => (
																<SelectItem
																	key={col}
																	value={col}
																	className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer text-sm"
																>
																	{col}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
												<div className="space-y-0.5">
													<label
														className="text-sm font-medium"
														style={{
															color: "#09090B",
															fontFamily: "Inter",
															fontSize: "14px",
															lineHeight: "20px",
															letterSpacing: "0%",
														}}
													>
														<Translate text={localizationConstants.nameLabel} />
													</label>
													<Select
														value={mapping.name ?? ""}
														onValueChange={(value) => handleMappingChange("name", value)}
													>
														<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-xs [&_svg]:text-[#737373] [&_svg]:opacity-100">
															<SelectValue placeholder={t(localizationConstants.placeholderSelect)} />
														</SelectTrigger>
														<SelectContent className="bg-white border-slate-200 shadow-md py-1">
															{parsedData?.columns.map((col) => (
																<SelectItem
																	key={col}
																	value={col}
																	className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer text-sm"
																>
																	{col}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											</div>

											{/* Row 2: Enhet | EAN */}
											<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
												<div className="space-y-0.5">
													<label
														className="text-sm font-medium"
														style={{
															color: "#09090B",
															fontFamily: "Inter",
															fontSize: "14px",
															lineHeight: "20px",
															letterSpacing: "0%",
														}}
													>
														<Translate text={localizationConstants.unitLabel} />
													</label>
													<Select
														value={mapping.unit ?? ""}
														onValueChange={(value) => handleMappingChange("unit", value)}
													>
														<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-xs [&_svg]:text-[#737373] [&_svg]:opacity-100">
															<SelectValue placeholder={t(localizationConstants.placeholderSelect)} />
														</SelectTrigger>
														<SelectContent className="bg-white border-slate-200 shadow-md py-1">
															{parsedData?.columns.map((col) => (
																<SelectItem
																	key={col}
																	value={col}
																	className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer text-sm"
																>
																	{col}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
												<div className="space-y-0.5">
													<label
														className="text-sm font-medium"
														style={{
															color: "#09090B",
															fontFamily: "Inter",
															fontSize: "14px",
															lineHeight: "20px",
															letterSpacing: "0%",
														}}
													>
														<Translate text={localizationConstants.eanLabel} />
													</label>
													<Select
														value={mapping.ean ?? ""}
														onValueChange={(value) => handleMappingChange("ean", value)}
													>
														<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-xs [&_svg]:text-[#737373] [&_svg]:opacity-100">
															<SelectValue placeholder={t(localizationConstants.placeholderSelect)} />
														</SelectTrigger>
														<SelectContent className="bg-[#ffffff] border-slate-200 shadow-md py-1">
															{parsedData?.columns.map((col) => (
																<SelectItem
																	key={col}
																	value={col}
																	className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer text-sm"
																>
																	{col}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											</div>

											{/* Row 3: Tillverkare | Tillverkarens artikelnummer */}
											<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
												<div className="space-y-0.5">
													<label
														className="text-sm font-medium"
														style={{
															color: "#09090B",
															fontFamily: "Inter",
															fontSize: "14px",
															lineHeight: "20px",
															letterSpacing: "0%",
														}}
													>
														<Translate text={localizationConstants.manufacturerLabel} />
													</label>
													<Select
														value={mapping.manufacturer ?? ""}
														onValueChange={(value) =>
															handleMappingChange("manufacturer", value)
														}
													>
														<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-xs [&_svg]:text-[#737373] [&_svg]:opacity-100">
															<SelectValue placeholder={t(localizationConstants.placeholderSelect)} />
														</SelectTrigger>
														<SelectContent className="bg-white border-slate-200 shadow-md py-1">
															{parsedData?.columns.map((col) => (
																<SelectItem
																	key={col}
																	value={col}
																	className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer text-sm"
																>
																	{col}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
												<div className="space-y-0.5">
													<label
														className="text-sm font-medium"
														style={{
															color: "#09090B",
															fontFamily: "Inter",
															fontSize: "14px",
															lineHeight: "20px",
															letterSpacing: "0%",
														}}
													>
														<Translate
															text={localizationConstants.manufacturerArticleNumberLabel}
														/>
													</label>
													<Select
														value={mapping.manufacturerArticleNumber ?? ""}
														onValueChange={(value) =>
															handleMappingChange("manufacturerArticleNumber", value)
														}
													>
														<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-xs [&_svg]:text-[#737373] [&_svg]:opacity-100">
															<SelectValue placeholder={t(localizationConstants.placeholderSelect)} />
														</SelectTrigger>
														<SelectContent className="bg-white border-slate-200 shadow-md py-1">
															{parsedData?.columns.map((col) => (
																<SelectItem
																	key={col}
																	value={col}
																	className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer text-sm"
																>
																	{col}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											</div>

											{/* Row 4: Beteckning (half width) */}
											<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
												<div className="space-y-0.5">
													<label
														className="text-sm font-medium"
														style={{
															color: "#09090B",
															fontFamily: "Inter",
															fontSize: "14px",
															lineHeight: "20px",
															letterSpacing: "0%",
														}}
													>
														<Translate text={localizationConstants.descriptionLabel} />
													</label>
													<Select
														value={mapping.description ?? ""}
														onValueChange={(value) =>
															handleMappingChange("description", value)
														}
													>
														<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-xs [&_svg]:text-[#737373] [&_svg]:opacity-100">
															<SelectValue placeholder={t(localizationConstants.placeholderSelect)} />
														</SelectTrigger>
														<SelectContent className="bg-white border-slate-200 shadow-md py-1">
															{parsedData?.columns.map((col) => (
																<SelectItem
																	key={col}
																	value={col}
																	className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer text-sm"
																>
																	{col}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
												<div></div>
											</div>

											{/* Row 5: Modell (full width) */}
											<div className="mb-4">
												<div className="space-y-0.5">
													<label
														className="text-sm font-medium"
														style={{
															color: "#09090B",
															fontFamily: "Inter",
															fontSize: "14px",
															lineHeight: "20px",
															letterSpacing: "0%",
														}}
													>
														<Translate text={localizationConstants.modelLabel} />
													</label>
													<Select
														value={mapping.model ?? ""}
														onValueChange={(value) => handleMappingChange("model", value)}
													>
														<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-xs [&_svg]:text-[#737373] [&_svg]:opacity-100">
															<SelectValue placeholder={t(localizationConstants.placeholderSelect)} />
														</SelectTrigger>
														<SelectContent className="bg-white border-slate-200 shadow-md py-1">
															{parsedData?.columns.map((col) => (
																<SelectItem
																	key={col}
																	value={col}
																	className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer text-sm"
																>
																	{col}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											</div>

											{/* Row 6: Typ av artikel | Aktiv */}
											<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mb-4">
												<div className="space-y-0.5">
													<label
														className="text-sm font-medium"
														style={{
															color: "#09090B",
															fontFamily: "Inter",
															fontSize: "14px",
															lineHeight: "20px",
															letterSpacing: "0%",
														}}
													>
														<Translate text={localizationConstants.articleTypeLabel} />
													</label>
													<Select
														value={mapping.articleType ?? ""}
														onValueChange={(value) =>
															handleMappingChange("articleType", value)
														}
													>
														<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-xs [&_svg]:text-[#737373] [&_svg]:opacity-100">
															<SelectValue placeholder={t(localizationConstants.placeholderSelect)} />
														</SelectTrigger>
														<SelectContent className="bg-white border-slate-200 shadow-md py-1">
															{parsedData?.columns.map((col) => (
																<SelectItem
																	key={col}
																	value={col}
																	className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer text-sm"
																>
																	{col}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
												<div className="space-y-0.5">
													<label
														className="text-sm font-medium"
														style={{
															color: "#09090B",
															fontFamily: "Inter",
															fontSize: "14px",
															lineHeight: "20px",
															letterSpacing: "0%",
														}}
													>
														<Translate text={localizationConstants.activeLabel} />
													</label>
													<Select
														value={mapping.active ?? ""}
														onValueChange={(value) => handleMappingChange("active", value)}
													>
														<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-xs [&_svg]:text-[#737373] [&_svg]:opacity-100">
															<SelectValue placeholder={t(localizationConstants.placeholderSelect)} />
														</SelectTrigger>
														<SelectContent className="bg-white border-slate-200 shadow-md py-1">
															{parsedData?.columns.map((col) => (
																<SelectItem
																	key={col}
																	value={col}
																	className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer text-sm"
																>
																	{col}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											</div>

											{/* Row 7: Leverantörsnummer (full width) */}
											<div>
												<div className="space-y-0.5">
													<label
														className="text-sm font-medium"
														style={{
															color: "#09090B",
															fontFamily: "Inter",
															fontSize: "14px",
															lineHeight: "20px",
															letterSpacing: "0%",
														}}
													>
														<Translate text={localizationConstants.supplierNumberLabel} />
													</label>
													<Select
														value={mapping.supplierNumber ?? ""}
														onValueChange={(value) =>
															handleMappingChange("supplierNumber", value)
														}
													>
														<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-xs [&_svg]:text-[#737373] [&_svg]:opacity-100">
															<SelectValue placeholder={t(localizationConstants.placeholderSelect)} />
														</SelectTrigger>
														<SelectContent className="bg-white border-slate-200 shadow-md py-1">
															{parsedData?.columns.map((col) => (
																<SelectItem
																	key={col}
																	value={col}
																	className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer text-sm"
																>
																	{col}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											</div>
										</div>
									)}
								</div>

								{/* Measurements Section */}
								<div className="rounded-lg border border-slate-200 bg-white">
									<button
										type="button"
										onClick={() => setMeasurementsOpen(!measurementsOpen)}
										className="flex items-center justify-between w-full px-4 h-14 border-b border-slate-100 text-left cursor-pointer"
									>
										<h3 className="text-sm font-semibold text-slate-900">
											<Translate text={localizationConstants.measurementsSection} />
										</h3>
										{measurementsOpen ? (
											<ChevronUp className="h-4 w-4 text-slate-500" />
										) : (
											<ChevronDown className="h-4 w-4" style={{ color: "#737373" }} />
										)}
									</button>

									{measurementsOpen && (
										<div className="px-4 pb-4 border-t border-slate-100 pt-4">
											{/* Row 1: Vikt | Längd | Bredd | Höjd */}
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
												{MEASUREMENT_FIELDS.map((field) => (
													<div key={field.key} className="space-y-0.5">
														<label
															className="text-sm font-medium"
															style={{
																color: "#09090B",
																fontFamily: "Inter",
																fontSize: "14px",
																lineHeight: "20px",
																letterSpacing: "0%",
															}}
														>
															<Translate text={field.labelKey} />
														</label>
														<Select
															value={
																mapping[field.key as keyof ArticleImportMapping] ?? ""
															}
															onValueChange={(value) =>
																handleMappingChange(field.key, value)
															}
														>
															<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-xs [&_svg]:text-[#737373] [&_svg]:opacity-100">
																<SelectValue placeholder={t(localizationConstants.placeholderSelect)} />
															</SelectTrigger>
															<SelectContent className="bg-white border-slate-200 shadow-md py-1">
																{parsedData?.columns.map((col) => (
																	<SelectItem
																		key={col}
																		value={col}
																		className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer text-sm"
																	>
																		{col}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
													</div>
												))}
											</div>

											{/* Row 2: Material (partial width) */}
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
												<div className="space-y-0.5">
													<label
														className="text-sm font-medium"
														style={{
															color: "#09090B",
															fontFamily: "Inter",
															fontSize: "14px",
															lineHeight: "20px",
															letterSpacing: "0%",
														}}
													>
														<Translate text={localizationConstants.materialLabel} />
													</label>
													<Select
														value={mapping.material ?? ""}
														onValueChange={(value) =>
															handleMappingChange("material", value)
														}
													>
														<SelectTrigger className="h-9 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-xs [&_svg]:text-[#737373] [&_svg]:opacity-100">
															<SelectValue placeholder={t(localizationConstants.placeholderSelect)} />
														</SelectTrigger>
														<SelectContent className="bg-white border-slate-200 shadow-md py-1">
															{parsedData?.columns.map((col) => (
																<SelectItem
																	key={col}
																	value={col}
																	className="focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-100 data-[state=checked]:text-slate-900 cursor-pointer text-sm"
																>
																	{col}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Footer */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-3 border-t border-slate-200 bg-white">
				<Button
					variant="outline"
					onClick={() => router.push("/tools/register")}
					className="h-9 flex-1 sm:flex-none sm:min-w-30 px-8 border-slate-200 bg-white text-sm font-medium hover:bg-slate-50 cursor-pointer"
					style={{
						color: "#09090B",
						fontFamily: "Inter",
						fontSize: "14px",
						lineHeight: "20px",
						letterSpacing: "0%",
					}}
				>
					<Translate text={localizationConstants.cancelButtonLabel} />
				</Button>
				{selectedFile && (
					<Button
						onClick={handleImport}
						disabled={isImporting}
						className="h-9 flex-1 sm:flex-none sm:min-w-30 px-6 bg-[#111721] text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50 gap-2 cursor-pointer"
					>
						{isImporting ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<>
								<Translate text={localizationConstants.importButtonLabel} />
								<Save className="h-4 w-4" />
							</>
						)}
					</Button>
				)}
			</div>
		</div>
	);
}
