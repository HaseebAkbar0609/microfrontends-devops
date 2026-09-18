"use client";

import { useRef } from "react";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useSalesCompanies } from "../../hooks/useSalesCompanies";
import { parseCompaniesCsv } from "../../utils/salesCsv";

/** Import a call list from CSV, or add a single company by hand. */
export function MeetingBookerActions({ onAddCompany }: { onAddCompany: () => void }) {
	const { addCompanies } = useSalesCompanies();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const t = useTranslate();

	const handleImport = async (file: File) => {
		try {
			const rows = parseCompaniesCsv(await file.text()).filter((row) =>
				(row.name ?? "").trim(),
			);
			if (rows.length === 0) {
				showToast("error", t(localizationConstants.salesBookerCallListEmptyToast));
				return;
			}
			addCompanies(rows);
			showToast("success", t(localizationConstants.salesCompaniesImportedToast));
		} catch {
			showToast("error", t(localizationConstants.salesCsvImportFailedToast));
		}
	};

	return (
		<div className="flex flex-wrap items-center gap-3">
			<input
				ref={fileInputRef}
				type="file"
				accept=".csv,text/csv"
				className="hidden"
				onChange={(event) => {
					const file = event.target.files?.[0];
					if (file) void handleImport(file);
					event.target.value = "";
				}}
			/>
			<Button
				type="button"
				variant="outline"
				className="h-10 gap-2 active:scale-[0.98]"
				onClick={() => fileInputRef.current?.click()}
			>
				<Upload className="h-4 w-4" />
				<Translate text={localizationConstants.salesBookerImportButton} />
			</Button>
			<Button
				type="button"
				variant="primary"
				className="h-10 gap-2 active:scale-[0.98]"
				onClick={onAddCompany}
			>
				<Plus className="h-4 w-4" />
				<Translate text={localizationConstants.salesBookerAddCompanyButton} />
			</Button>
		</div>
	);
}
