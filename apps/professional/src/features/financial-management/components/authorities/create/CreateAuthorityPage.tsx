"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import { ECONOMY_AUTHORITIES_BASE_URL } from "../../../constants/authorities.constants";
import type {
	AuthorityFormData,
	AuthorityCategory,
	AuthorityStatus,
	AuthorityFileType,
} from "../../../types/authorities.types";
import { authoritiesRepository } from "../../../utils/authoritiesRepository";
import { AuthorityCreateHeader } from "./AuthorityCreateHeader";
import { AuthorityBasicInfoCard } from "./AuthorityBasicInfoCard";
import { AuthorityFileUploadCard } from "./AuthorityFileUploadCard";
import { AuthorityStatusNotesCard } from "./AuthorityStatusNotesCard";
import { AuthorityFormActions } from "./AuthorityFormActions";

export function CreateAuthorityPage() {
	const router = useRouter();
	const { t } = useTranslation();

	const [authorityName, setAuthorityName] = useState("Skatteverket");
	const [category, setCategory] = useState<AuthorityCategory>("Govt Docs");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [documentName, setDocumentName] = useState("");
	const [referenceNumber, setReferenceNumber] = useState("");
	const [responsiblePerson, setResponsiblePerson] = useState("");

	const [fileName, setFileName] = useState("");
	const [fileType, setFileType] = useState<AuthorityFileType>("PDF");
	const [fileSize, setFileSize] = useState<string | undefined>(undefined);

	const [status, setStatus] = useState<AuthorityStatus>("pending");
	const [notes, setNotes] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleFileChange = (file: File) => {
		const ext = (file.name.split(".").pop()?.toUpperCase() || "PDF") as AuthorityFileType;
		setFileName(file.name);
		setFileType(ext);
		setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
	};

	const validate = () => {
		if (!documentName.trim()) {
			setErrorMessage(t(localizationConstants.validationDocumentNameRequired));
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
			const payload: AuthorityFormData = {
				authorityName,
				category,
				date,
				documentName: documentName.trim(),
				subject: documentName.trim(),
				referenceNumber: referenceNumber.trim(),
				responsiblePerson: responsiblePerson.trim(),
				fileName: fileName || `${documentName.trim()}.pdf`,
				fileType,
				fileSize,
				status,
				notes: notes.trim(),
			};

			authoritiesRepository.create(payload);
			router.push(ECONOMY_AUTHORITIES_BASE_URL);
		} catch (error) {
			console.error("Failed to create authority case:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			<AuthorityCreateHeader />

			<div className="p-6 max-w-4xl mx-auto w-full space-y-6">
				<form onSubmit={handleSubmit} className="space-y-6">
					<AuthorityBasicInfoCard
						authorityName={authorityName}
						onAuthorityNameChange={setAuthorityName}
						category={category}
						onCategoryChange={setCategory}
						date={date}
						onDateChange={setDate}
						documentName={documentName}
						onDocumentNameChange={(val) => {
							setDocumentName(val);
							if (errorMessage) setErrorMessage("");
						}}
						referenceNumber={referenceNumber}
						onReferenceNumberChange={setReferenceNumber}
						responsiblePerson={responsiblePerson}
						onResponsiblePersonChange={setResponsiblePerson}
						errorMessage={errorMessage}
					/>

					<AuthorityFileUploadCard
						fileName={fileName}
						fileType={fileType}
						fileSize={fileSize}
						onFileChange={handleFileChange}
					/>

					<AuthorityStatusNotesCard
						status={status}
						onStatusChange={setStatus}
						notes={notes}
						onNotesChange={setNotes}
					/>

					<AuthorityFormActions
						onCancel={() => router.push(ECONOMY_AUTHORITIES_BASE_URL)}
						isSubmitting={isSubmitting}
					/>
				</form>
			</div>
		</div>
	);
}

export default CreateAuthorityPage;
