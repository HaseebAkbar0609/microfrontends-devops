"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import {
	YEAR_END_BASE_ROUTE,
	DEFAULT_FISCAL_YEAR,
} from "../../../constants/yearEnd.constants";
import type {
	YearEndFormData,
	YearEndCategory,
	YearEndStatus,
	YearEndTabType,
} from "../../../types/yearEnd.types";
import { yearEndRepository } from "../../../utils/yearEndRepository";
import { YearEndCreateHeader } from "./YearEndCreateHeader";
import { YearEndBasicInfoCard } from "./YearEndBasicInfoCard";
import { YearEndFileUploadCard } from "./YearEndFileUploadCard";
import { YearEndStatusAndNotesCard } from "./YearEndStatusAndNotesCard";
import { YearEndFormActions } from "./YearEndFormActions";

interface CreateYearEndPageProps {
	initialTab?: YearEndTabType;
	initialYear?: number;
}

export function CreateYearEndPage({
	initialTab = "bokslut",
	initialYear = DEFAULT_FISCAL_YEAR,
}: CreateYearEndPageProps) {
	const router = useRouter();
	const { t } = useTranslation();

	const activeTab = initialTab;
	const [fiscalYear, setFiscalYear] = useState<number>(initialYear);
	const [category, setCategory] = useState<YearEndCategory>("Årsredovisning");
	const [name, setName] = useState<string>("");
	const [fileName, setFileName] = useState<string>("");
	const [fileType, setFileType] = useState<"PDF" | "DOC" | "DOCX" | "PNG" | "JPG" | "XLSX">("PDF");
	const [fileSize, setFileSize] = useState<string | undefined>(undefined);
	const [status, setStatus] = useState<YearEndStatus>("completed");
	const [notes, setNotes] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleFileChange = (file: File) => {
		const ext = (file.name.split(".").pop()?.toUpperCase() || "PDF") as
			| "PDF"
			| "DOC"
			| "DOCX"
			| "PNG"
			| "JPG"
			| "XLSX";
		setFileName(file.name);
		setFileType(ext);
		setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
	};

	const validate = () => {
		if (!name.trim()) {
			setErrorMessage(t(localizationConstants.valNameRequired));
			return false;
		}
		setErrorMessage("");
		return true;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;

		setIsSubmitting(true);
		try {
			const payload: YearEndFormData = {
				tab: activeTab,
				fiscalYear,
				category,
				name: name.trim(),
				fileName: fileName || (activeTab === "checklist" ? `${name.trim()}.pdf` : "Dokument.pdf"),
				fileType,
				fileSize,
				status,
				notes: notes.trim(),
			};

			yearEndRepository.create(payload);
			router.push(`${YEAR_END_BASE_ROUTE}?tab=${activeTab}&year=${fiscalYear}`);
		} catch (error) {
			console.error("Failed to create year-end document:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			<YearEndCreateHeader
				activeTab={activeTab}
				fiscalYear={fiscalYear}
			/>

			<div className="p-6 max-w-4xl mx-auto w-full space-y-6">
				<form onSubmit={handleSubmit} className="space-y-6">
					<YearEndBasicInfoCard
						tab={activeTab}
						category={category}
						onCategoryChange={setCategory}
						fiscalYear={fiscalYear}
						onFiscalYearChange={setFiscalYear}
						name={name}
						onNameChange={(val) => {
							setName(val);
							if (errorMessage) setErrorMessage("");
						}}
						errorMessage={errorMessage}
					/>

					<YearEndFileUploadCard
						fileName={fileName}
						fileType={fileType}
						fileSize={fileSize}
						onFileChange={handleFileChange}
					/>

					<YearEndStatusAndNotesCard
						status={status}
						onStatusChange={setStatus}
						notes={notes}
						onNotesChange={setNotes}
					/>

					<YearEndFormActions
						onCancel={() =>
							router.push(
								`${YEAR_END_BASE_ROUTE}?tab=${activeTab}&year=${fiscalYear}`,
							)
						}
						isSubmitting={isSubmitting}
					/>
				</form>
			</div>
		</div>
	);
}

export default CreateYearEndPage;
