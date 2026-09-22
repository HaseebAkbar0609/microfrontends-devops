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
				setTimeout(() => {
					router.push(ARTICLE_OVERVIEW_BASE_ROUTE);
				}, 1500);
			} else {
				showToast("error", t(localizationConstants.importErrorMessage));
			}
		} catch {
			showToast("error", t(localizationConstants.importErrorMessage));
		} finally {
			setIsImporting(false);
		}
	}, [selectedFile, mapping, t, router]);

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
