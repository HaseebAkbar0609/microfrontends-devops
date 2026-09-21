"use client";

import { useRef, type ChangeEvent } from "react";
import { showToast } from "@/lib/toast";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { parseCompaniesCsv } from "../utils/salesCsv";
import { useSalesCompanies } from "./useSalesCompanies";

/**
 * Imports companies from a CSV picked through a hidden file input. Rows
 * without a name are skipped. `emptyToastKey`, when given, is shown for a file
 * that holds no companies.
 */
export function useCompanyCsvImport(emptyToastKey?: TranslationKeys) {
	const { addCompanies } = useSalesCompanies();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const t = useTranslate();

	const importFile = async (file: File) => {
		try {
			const rows = parseCompaniesCsv(await file.text()).filter((row) =>
				(row.name ?? "").trim(),
			);
			if (rows.length === 0) {
				if (emptyToastKey) showToast("error", t(emptyToastKey));
				return;
			}
			await addCompanies(rows);
			showToast("success", t(localizationConstants.salesCompaniesImportedToast));
		} catch {
			showToast("error", t(localizationConstants.salesCsvImportFailedToast));
		}
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) void importFile(file);
		// Cleared so picking the same file again still fires a change.
		event.target.value = "";
	};

	const openFilePicker = () => fileInputRef.current?.click();

	return { fileInputRef, handleFileChange, openFilePicker };
}
