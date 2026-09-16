"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { showToast } from "@/lib/toast";
import { emailRegex } from "@/lib/validation/contactSchema";
import {
	checkUploadedFile,
	extensionsFromAccept,
} from "@/lib/validation/fileUpload";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { WARRANTY_CONSTANTS } from "../../constants/warranty.constants";
import type {
	AttachedDocumentItem,
	InspectionDateItem,
} from "../../types/warranty.types";

const createVisitDateSchema = (dateRequired: string, emailInvalid: string) =>
	z.object({
		date: z.string().min(1, dateRequired),
		rule: z.string().optional(),
		/**
		 * The frame's "Påminnelse mail" with its "+ Lägg till fler mail"
		 * action. `emailRegex` already accepts an empty string, so a row the
		 * user has not filled in yet does not read as an error.
		 */
		emails: z.array(
			z.object({ value: z.string().trim().regex(emailRegex, emailInvalid) }),
		),
	});

export type VisitDateFormData = z.infer<
	ReturnType<typeof createVisitDateSchema>
>;

/** A stored `reminderEmail` is a comma-joined list; the form edits it as rows. */
function splitReminderEmails(value?: string): { value: string }[] {
	const rows = (value ?? "")
		.split(",")
		.map((entry) => entry.trim())
		.filter(Boolean)
		.map((entry) => ({ value: entry }));

	return rows.length > 0 ? rows : [{ value: "" }];
}

/** The extensions the picker's `accept` advertises, as a list the guard can use. */
const ALLOWED_EXTENSIONS = extensionsFromAccept(
	WARRANTY_CONSTANTS.ALLOWED_FILE_TYPES,
);

export interface UseVisitDateFormOptions {
	isOpen: boolean;
	initialData?: InspectionDateItem | null;
	onSave: (dateItem: Omit<InspectionDateItem, "id">) => void;
	onClose: () => void;
}

/**
 * Form, attachment and upload state for the visit-date dialog.
 *
 * Separated from the markup so the validation — which is the part with
 * consequences — is readable without scrolling past the layout.
 */
export function useVisitDateForm({
	isOpen,
	initialData,
	onSave,
	onClose,
}: UseVisitDateFormOptions) {
	const t = useTranslate();

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [attachedDocuments, setAttachedDocuments] = useState<
		AttachedDocumentItem[]
	>([]);
	const [uploadedFileName, setUploadedFileName] = useState("");
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	const visitDateSchema = useMemo(
		() =>
			createVisitDateSchema(
				t(localizationConstants.validationVisitDateRequired),
				t(localizationConstants.orderValidationEmailInvalid),
			),
		[t],
	);

	const form = useForm<VisitDateFormData>({
		resolver: zodResolver(visitDateSchema),
		defaultValues: {
			date: WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DATE,
			rule: "",
			emails: [{ value: "" }],
		},
	});

	const { control, reset, setValue } = form;

	const emailArray = useFieldArray({ control, name: "emails" });
	const { replace: replaceEmails } = emailArray;

	/**
	 * Reloads the form each time the dialog opens.
	 *
	 * A new visit date starts with no attachments. The two copies this was
	 * merged from seeded "Document 1.pdf" and "Document 2.pdf" here, which meant
	 * every record created through this dialog was saved carrying two documents
	 * that do not exist.
	 */
	useEffect(() => {
		if (!isOpen) return;

		if (initialData) {
			setValue("date", initialData.date || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DATE);
			setValue("rule", initialData.rule || "");
			replaceEmails(splitReminderEmails(initialData.reminderEmail));
			setAttachedDocuments(initialData.documents ?? []);
			setUploadedFileName(initialData.documentName ?? "");
		} else {
			reset({
				date: WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DATE,
				rule: "",
				emails: [{ value: "" }],
			});
			setAttachedDocuments([]);
			setUploadedFileName("");
		}

		setSelectedFile(null);
	}, [isOpen, initialData, replaceEmails, reset, setValue]);

	const removeDocument = useCallback((indexToRemove: number) => {
		setAttachedDocuments((previous) =>
			previous.filter((_, index) => index !== indexToRemove),
		);
	}, []);

	const openFilePicker = useCallback(() => fileInputRef.current?.click(), []);

	/**
	 * Re-checks the picked file against the same rules the `accept` attribute
	 * advertises, which the browser does not enforce.
	 */
	const selectFile = useCallback(
		(file: File | undefined) => {
			if (!file) return;

			const rejection = checkUploadedFile(file, {
				acceptExtensions: ALLOWED_EXTENSIONS,
				maxFileSizeBytes: WARRANTY_CONSTANTS.MAX_FILE_SIZE_BYTES,
			});

			if (rejection) {
				showToast(
					"error",
					t(
						rejection === "size"
							? localizationConstants.validationFileSizeLimit
							: localizationConstants.validationFileTypeInvalid,
					),
				);
				if (fileInputRef.current) fileInputRef.current.value = "";
				return;
			}

			setSelectedFile(file);
			setUploadedFileName(file.name);
		},
		[t],
	);

	const uploadSelectedFile = useCallback(() => {
		if (!selectedFile) {
			openFilePicker();
			return;
		}

		setIsUploading(true);
		try {
			const extension = selectedFile.name.split(".").pop()?.toLowerCase();
			const isImageType = (
				WARRANTY_CONSTANTS.SUPPORTED_IMAGE_EXTENSIONS as readonly string[]
			).includes(extension ?? "");

			setAttachedDocuments((previous) => [
				...previous,
				{
					id: `doc-${Date.now()}`,
					name: selectedFile.name,
					fileType: isImageType
						? (extension as AttachedDocumentItem["fileType"])
						: WARRANTY_CONSTANTS.DEFAULT_FILE_TYPE,
					fileSize: `${(selectedFile.size / 1024).toFixed(1)} KB`,
				},
			]);
			showToast("success", t(localizationConstants.toastFileUploaded));
			setSelectedFile(null);
			if (fileInputRef.current) fileInputRef.current.value = "";
		} catch (error) {
			console.error("[VisitDateDialog] Failed to upload file:", error);
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsUploading(false);
		}
	}, [openFilePicker, selectedFile, t]);

	const submit = form.handleSubmit((data) => {
		onSave({
			date: data.date,
			reminderEmail:
				data.emails
					.map((row) => row.value.trim())
					.filter(Boolean)
					.join(", ") || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_EMAIL,
			rule: data.rule || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_RULE,
			documentName:
				uploadedFileName || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DOCUMENT_NAME,
			fileType: WARRANTY_CONSTANTS.DEFAULT_FILE_TYPE,
			documents: attachedDocuments,
		});
		onClose();
	});

	return {
		form,
		emailArray,
		submit,
		attachedDocuments,
		removeDocument,
		fileInputRef,
		uploadedFileName,
		selectFile,
		openFilePicker,
		uploadSelectedFile,
		isUploading,
	};
}
