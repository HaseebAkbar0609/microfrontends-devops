"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { ArticleImportMapping, ArticleImportColumn } from "../types/article.types";
import {
	importArticleAPIAction,
	downloadArticleImportTemplateAPIAction,
} from "../utils/articleRepository";
import { ARTICLE_OVERVIEW_BASE_ROUTE } from "../constants/article.constants";

export interface ParsedFileData {
	columns: string[];
	rows: Record<string, string>[];
	totalRows: number;
}

function getFileExtension(filename: string): string {
	return filename.split(".").pop()?.toLowerCase() ?? "";
}

function parseCSV(text: string): ParsedFileData {
	const lines = text.split(/\r?\n/).filter((line) => line.trim());
	if (lines.length === 0) return { columns: [], rows: [], totalRows: 0 };

	const delimiter = lines[0].includes(";") ? ";" : ",";
	const columns = lines[0]
		.split(delimiter)
		.map((col) => col.trim().replace(/^\uFEFF/, "").replace(/^"|"$/g, ""));
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

function autoMatchColumns(columns: string[]): ArticleImportMapping {
	const mapping: ArticleImportMapping = {};

	const rules: Record<string, string[]> = {
		articleNr: ["artikelnummer", "artikelnr", "artikel nr", "article no", "item no", "art nr", "id"],
		benamning: ["benämning", "beskrivning", "namn", "description", "name", "titel", "artikel"],
		ean: ["ean", "barcode", "streckkod", "ean-kod"],
		leverantor: ["leverantör", "supplier", "leverantor", "vendor"],
		supplierArticleNo: ["leverantörens artikelnr", "supplier article no", "lev artnr", "lev.artnr"],
		enhet: ["enhet", "unit", "måttenhet"],
		typAvArtikel: ["artikeltyp", "typ av artikel", "typ", "type"],
		lagerVara: ["lagervara", "stock item", "lagerartikel"],
		forsaljning: ["försäljningskonto", "försäljning", "sales account", "intäktskonto"],
		moms: ["moms", "vat", "momssats", "skatt"],
		priserA: ["pris a", "utpris", "pris", "price", "prislista a"],
		kalkylkostnad: ["kalkylkostnad", "inköpspris", "cost", "purchase price", "kostnad"],
		iLager: ["lager", "i lager", "stock", "saldo", "lagersaldo"],
		vikt: ["vikt", "weight"],
		langd: ["längd", "length"],
		bredd: ["bredd", "width"],
		hojd: ["höjd", "height"],
		material: ["material"],
	};

	columns.forEach((col) => {
		const normalized = col.toLowerCase().replace(/[^a-z0-9åäö]/g, "");
		Object.entries(rules).forEach(([targetField, keywords]) => {
			if (mapping[targetField]) return;
			for (const kw of keywords) {
				const normKw = kw.toLowerCase().replace(/[^a-z0-9åäö]/g, "");
				if (normalized === normKw || normalized.includes(normKw)) {
					mapping[targetField] = col;
					break;
				}
			}
		});
	});

	return mapping;
}

export function useArticleImport() {
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

	const handleFileSelect = useCallback(
		async (file: File) => {
			const ext = getFileExtension(file.name);
			if (ext !== "csv" && ext !== "xlsx" && ext !== "xls") {
				showToast("error", t(localizationConstants.invalidFileFormatError));
				return;
			}

			setSelectedFile(file);
			setImportResult(null);

			try {
				let parsed: ParsedFileData;
				if (ext === "csv") {
					const text = await file.text();
					parsed = parseCSV(text);
				} else {
					const arrayBuffer = await file.arrayBuffer();
					const workbook = XLSX.read(arrayBuffer, { type: "array" });
					parsed = parseXLSX(workbook);
				}
				setParsedData(parsed);
				setMapping(autoMatchColumns(parsed.columns));
			} catch {
				showToast("error", t(localizationConstants.fileParseError));
				setSelectedFile(null);
			}
		},
		[t],
	);

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
		if (!selectedFile || !parsedData) return;

		setIsImporting(true);
		try {
			const result = await importArticleAPIAction(selectedFile, mapping, parsedData.rows);
			setImportResult({
				success: result.successCount > 0,
				successCount: result.successCount,
				failureCount: result.failureCount,
			});

			if (result.successCount > 0) {
				showToast("success", `${result.successCount} ${t(localizationConstants.importSuccessArticlesCreated)}`);
				setTimeout(() => {
					router.push(ARTICLE_OVERVIEW_BASE_ROUTE);
				}, 1200);
			} else {
				showToast("error", t(localizationConstants.importErrorMessage));
			}
		} catch {
			showToast("error", t(localizationConstants.importErrorMessage));
		} finally {
			setIsImporting(false);
		}
	}, [selectedFile, parsedData, mapping, t, router]);

	const handleDownloadTemplate = useCallback(async () => {
		try {
			await downloadArticleImportTemplateAPIAction();
		} catch {
			showToast("error", t(localizationConstants.downloadTemplateErrorMessage));
		}
	}, [t]);

	const mappedColumns = useMemo((): ArticleImportColumn[] => {
		if (!parsedData) return [];
		return parsedData.columns.map((col) => ({
			fileColumn: col,
			fileValue: parsedData.rows[0]?.[col] ?? "",
			mappedField: Object.entries(mapping).find(([, val]) => val === col)?.[0],
		}));
	}, [parsedData, mapping]);

	const handleCancel = useCallback(() => {
		router.push(ARTICLE_OVERVIEW_BASE_ROUTE);
	}, [router]);

	return {
		selectedFile,
		parsedData,
		mapping,
		isDragging,
		isImporting,
		importResult,
		basicInfoOpen,
		measurementsOpen,
		fileInputRef,
		mappedColumns,
		setBasicInfoOpen,
		setMeasurementsOpen,
		handleFileSelect,
		handleDragOver,
		handleDragLeave,
		handleDrop,
		handleInputChange,
		handleMappingChange,
		handleImport,
		handleDownloadTemplate,
		handleCancel,
	};
}
