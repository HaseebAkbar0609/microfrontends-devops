"use client";

import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	CSV_BYTE_ORDER_MARK,
	CSV_FILE_NAME_PREFIX,
} from "../constants/sales.constants";
import { useCompanyCsvImport } from "../hooks/useCompanyCsvImport";
import { useSalesCompanies } from "../hooks/useSalesCompanies";
import { toLocalDateKey } from "../utils/meetingBooker";
import { companiesToCsv } from "../utils/salesCsv";

/** CSV round-trip for the company list. */
export function CsvImportExportActions() {
	const { companies } = useSalesCompanies();
	const { fileInputRef, handleFileChange, openFilePicker } = useCompanyCsvImport();
	const t = useTranslate();

	const handleExport = () => {
		const blob = new Blob([CSV_BYTE_ORDER_MARK + companiesToCsv(companies)], {
			type: "text/csv;charset=utf-8",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${CSV_FILE_NAME_PREFIX}-${toLocalDateKey(new Date())}.csv`;
		link.click();
		URL.revokeObjectURL(url);
		showToast("success", t(localizationConstants.salesCsvExportedToast));
	};

	return (
		<div className="flex flex-wrap items-center gap-2">
			<input
				ref={fileInputRef}
				type="file"
				accept=".csv,text/csv"
				className="hidden"
				onChange={handleFileChange}
			/>
			<Button
				type="button"
				variant="outline"
				size="sm"
				className="h-10 cursor-pointer gap-2"
				onClick={openFilePicker}
			>
				<Upload className="h-4 w-4" />
				<Translate text={localizationConstants.salesImportCsvButton} />
			</Button>
			<Button
				type="button"
				variant="outline"
				size="sm"
				className="h-10 cursor-pointer gap-2"
				onClick={handleExport}
			>
				<Download className="h-4 w-4" />
				<Translate text={localizationConstants.salesExportCsvButton} />
			</Button>
		</div>
	);
}
