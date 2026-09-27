"use client";

import React, { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, UploadCloud, FileSpreadsheet, Check, RefreshCw, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/lib/toast";
import { casesRepository } from "../../../utils/casesRepository";
import { CASES_BASE_ROUTE } from "../../../constants/cases.constants";

interface ParsedCaseData {
	columns: string[];
	rows: Record<string, string>[];
	totalRows: number;
}

const CASE_MAPPING_FIELDS = [
	{ key: "title", label: "Titel / Rubrik", required: true },
	{ key: "category", label: "Kategori (info, billing, support, etc.)", required: true },
	{ key: "createdBy", label: "Skapad av (Namn)", required: false },
	{ key: "description", label: "Beskrivning / Anteckning", required: false },
	{ key: "date", label: "Datum (ÅÅÅÅ-MM-DD)", required: false },
];

export function ImportCasesPage() {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [parsedData, setParsedData] = useState<ParsedCaseData | null>(null);
	const [mapping, setMapping] = useState<Record<string, string>>({});
	const [isDragging, setIsDragging] = useState(false);
	const [isImporting, setIsImporting] = useState(false);

	const handleFileSelect = useCallback(async (file: File) => {
		const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
		if (ext !== "csv" && ext !== "xlsx" && ext !== "xls") {
			showToast("error", "Endast CSV- och Excel-filer stöds");
			return;
		}

		setSelectedFile(file);

		try {
			let columns: string[] = [];
			let rows: Record<string, string>[] = [];

			if (ext === "csv") {
				const text = await file.text();
				const lines = text.split(/\r?\n/).filter((l) => l.trim());
				if (lines.length > 0) {
					const delim = lines[0].includes(";") ? ";" : ",";
					columns = lines[0].split(delim).map((c) => c.trim().replace(/^"|"$/g, ""));
					for (let i = 1; i < lines.length; i++) {
						const vals = lines[i].split(delim).map((v) => v.trim().replace(/^"|"$/g, ""));
						const row: Record<string, string> = {};
						columns.forEach((col, idx) => {
							row[col] = vals[idx] ?? "";
						});
						rows.push(row);
					}
				}
			} else {
				const buffer = await file.arrayBuffer();
				const workbook = XLSX.read(buffer, { type: "array" });
				const firstSheet = workbook.SheetNames[0];
				if (firstSheet) {
					const json = XLSX.utils.sheet_to_json<Record<string, string>>(workbook.Sheets[firstSheet]);
					if (json.length > 0) {
						columns = Object.keys(json[0] || {});
						rows = json.map((r) => {
							const item: Record<string, string> = {};
							columns.forEach((col) => {
								item[col] = String((r as Record<string, unknown>)[col] ?? "");
							});
							return item;
						});
					}
				}
			}

			setParsedData({ columns, rows, totalRows: rows.length });

			// Auto match
			const initialMapping: Record<string, string> = {};
			columns.forEach((col) => {
				const norm = col.toLowerCase();
				if (norm.includes("titel") || norm.includes("rubrik") || norm.includes("title") || norm.includes("namn")) {
					if (!initialMapping.title) initialMapping.title = col;
				} else if (norm.includes("kategori") || norm.includes("category") || norm.includes("typ")) {
					if (!initialMapping.category) initialMapping.category = col;
				} else if (norm.includes("skapad") || norm.includes("av") || norm.includes("creator") || norm.includes("person")) {
					if (!initialMapping.createdBy) initialMapping.createdBy = col;
				} else if (norm.includes("beskrivning") || norm.includes("desc") || norm.includes("text")) {
					if (!initialMapping.description) initialMapping.description = col;
				} else if (norm.includes("datum") || norm.includes("date")) {
					if (!initialMapping.date) initialMapping.date = col;
				}
			});
			setMapping(initialMapping);
		} catch {
			showToast("error", "Kunde inte läsa in filen");
			setSelectedFile(null);
		}
	}, []);

	const handleImport = async () => {
		if (!selectedFile || !parsedData) return;

		setIsImporting(true);
		try {
			const result = casesRepository.importCases(parsedData.rows, mapping);
			if (result.successCount > 0) {
				showToast("success", `${result.successCount} ärenden har importerats!`);
				setTimeout(() => {
					router.push(CASES_BASE_ROUTE);
				}, 1000);
			} else {
				showToast("error", "Inga ärenden kunde importeras. Kontrollera kolumnmatchningen.");
			}
		} catch {
			showToast("error", "Ett fel uppstod vid import av ärenden.");
		} finally {
			setIsImporting(false);
		}
	};

	const handleDownloadTemplate = () => {
		const sampleData = [
			{
				"Titel": "Problem med skrivare på kontoret",
				"Kategori": "support",
				"Skapad av": "Anna Karlsson",
				"Beskrivning": "Skrivaren på våning 2 får pappersstopp kontinuerligt.",
				"Datum": "2026-02-15",
			},
			{
				"Titel": "Fakturaavvikelse Projekt Alfa",
				"Kategori": "billing",
				"Skapad av": "Erik Lind",
				"Beskrivning": "Underlag för mars månad stämmer ej med kontrakt.",
				"Datum": "2026-02-16",
			},
		];
		const ws = XLSX.utils.json_to_sheet(sampleData);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Ärenden");
		XLSX.writeFile(wb, "arenden_import_mall.xlsx");
	};

	const mappedValuesSet = new Set(Object.values(mapping).filter(Boolean));

	return (
		<div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
			{/* Top Bar */}
			<div className="flex items-center gap-3">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onClick={() => router.push(CASES_BASE_ROUTE)}
					className="h-8 w-8 shrink-0 cursor-pointer"
				>
					<ArrowLeft className="h-5 w-5 text-slate-700" />
				</Button>
				<h1 className="text-xl font-bold tracking-tight text-slate-900">
					Importera ärenden
				</h1>
			</div>

			{/* Dropzone */}
			{!selectedFile && (
				<div className="flex flex-col gap-4">
					<div
						onDragOver={(e) => {
							e.preventDefault();
							setIsDragging(true);
						}}
						onDragLeave={(e) => {
							e.preventDefault();
							setIsDragging(false);
						}}
						onDrop={(e) => {
							e.preventDefault();
							setIsDragging(false);
							const file = e.dataTransfer.files[0];
							if (file) handleFileSelect(file);
						}}
						onClick={() => fileInputRef.current?.click()}
						className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
							isDragging
								? "border-slate-900 bg-slate-50"
								: "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
						}`}
					>
						<input
							type="file"
							ref={fileInputRef}
							onChange={(e) => {
								const file = e.target.files?.[0];
								if (file) handleFileSelect(file);
							}}
							accept=".csv,.xlsx,.xls"
							className="hidden"
						/>

						<div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 mb-4">
							<UploadCloud className="h-6 w-6" />
						</div>

						<p className="text-sm font-semibold text-slate-900 text-center">
							Dra och släpp din ärendefil här, eller klicka för att bläddra
						</p>
						<p className="text-xs text-slate-500 text-center mt-1">
							Stödjer CSV- och Excel-filer (.xlsx, .xls, .csv)
						</p>
					</div>

					<div className="flex justify-end">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={handleDownloadTemplate}
							className="text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
						>
							Ladda ner exempelmall (.xlsx)
						</Button>
					</div>
				</div>
			)}

			{/* 2-Column Mapping View */}
			{selectedFile && parsedData && (
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
					{/* Left Column: Din fil */}
					<div className="lg:col-span-5 space-y-6">
						<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-4">
							<div className="flex items-center justify-between border-b border-slate-100 pb-3">
								<div>
									<h2 className="text-sm font-bold text-slate-900">Din fil</h2>
									<p className="text-[11px] text-slate-500 mt-0.5">
										Välj hur kolumnerna i filen matchar systemfälten.
									</p>
								</div>
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
									title="Välj en annan fil"
								>
									<RefreshCw className="h-4 w-4" />
								</button>
							</div>

							<div className="border border-slate-200 rounded-lg overflow-hidden max-h-[360px] overflow-y-auto">
								<table className="w-full text-left text-xs">
									<thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold sticky top-0">
										<tr>
											<th className="py-2.5 px-3">Kolumn</th>
											<th className="py-2.5 px-3">Innehåll</th>
											<th className="py-2.5 px-3 text-center w-12">Status</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-slate-100">
										{parsedData.columns.map((col) => {
											const sampleValue = parsedData.rows[0]?.[col] ?? "-";
											const isMapped = mappedValuesSet.has(col);
											return (
												<tr key={col} className="hover:bg-slate-50/50">
													<td className="py-2 px-3 font-medium text-slate-800">{col}</td>
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

						{/* Attached File Card */}
						<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-3">
							<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Dokument</h2>
							<div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
								<div className="flex items-center gap-2.5 min-w-0">
									<div className="h-8 w-8 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
										<FileSpreadsheet className="h-4 w-4" />
									</div>
									<div className="min-w-0">
										<p className="text-xs font-semibold text-slate-900 truncate">{selectedFile.name}</p>
										<p className="text-[11px] text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB • {parsedData.totalRows} rader</p>
									</div>
								</div>
								<div className="flex items-center gap-1 shrink-0">
									<button
										type="button"
										onClick={() => {
											setSelectedFile(null);
											setParsedData(null);
										}}
										className="p-1.5 rounded text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
										title="Ta bort fil"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column: Target Mapping */}
					<div className="lg:col-span-7 space-y-6">
						<div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-5">
							<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
								Koppla ärendeuppgifter
							</h2>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{CASE_MAPPING_FIELDS.map((field) => (
									<div key={field.key} className="flex flex-col gap-1.5">
										<label className="text-xs font-medium text-slate-700">
											{field.label} {field.required && <span className="text-red-500">*</span>}
										</label>
										<Select
											value={mapping[field.key] || "unmapped"}
											onValueChange={(val) =>
												setMapping((prev) => ({
													...prev,
													[field.key]: val === "unmapped" ? "" : val,
												}))
											}
										>
											<SelectTrigger className="h-10 text-xs border-slate-200 bg-white">
												<SelectValue placeholder="Välj kolumn" />
											</SelectTrigger>
											<SelectContent className="bg-white border-slate-200 shadow-md">
												<SelectItem value="unmapped" className="text-xs text-slate-400">
													Ingen koppling
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
						</div>
					</div>
				</div>
			)}

			{/* Actions Footer */}
			<div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
				<Button
					type="button"
					variant="outline"
					onClick={() => router.push(CASES_BASE_ROUTE)}
					className="border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
				>
					Avbryt
				</Button>

				<Button
					type="button"
					onClick={handleImport}
					disabled={!selectedFile || isImporting}
					className="bg-[#111721] hover:bg-slate-800 text-white cursor-pointer px-6"
				>
					{isImporting ? "Importerar..." : "Importera ärenden"}
				</Button>
			</div>
		</div>
	);
}

export default ImportCasesPage;
