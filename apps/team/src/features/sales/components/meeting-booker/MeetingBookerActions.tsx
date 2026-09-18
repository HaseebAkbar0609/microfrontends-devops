"use client";

import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useCompanyCsvImport } from "../../hooks/useCompanyCsvImport";

/** Import a call list from CSV, or add a single company by hand. */
export function MeetingBookerActions({ onAddCompany }: { onAddCompany: () => void }) {
	const { fileInputRef, handleFileChange, openFilePicker } = useCompanyCsvImport(
		localizationConstants.salesBookerCallListEmptyToast,
	);

	return (
		<div className="flex flex-wrap items-center gap-3">
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
				className="h-10 gap-2 active:scale-[0.98]"
				onClick={openFilePicker}
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
