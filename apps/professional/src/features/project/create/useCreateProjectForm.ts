"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { PendingUploadFile } from "@/components/form";
import { showToast } from "@/lib/toast";
import {
	checkUploadedFile,
	extensionsFromAccept,
} from "@/lib/validation/fileUpload";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { PROJECT_MODULE_BASE_URL } from "../data/projectNav.config";
import { createProjectApi } from "./api/projectCreateApi";
import { useProjectDocumentUploads } from "./useProjectDocumentUploads";
import { PROJECT_CREATE_CONSTANTS, type ProjectCreateStep } from "./constants";
import { createProjectSchema } from "./schema";
import type {
	CreateProjectFormData,
	ProjectContactPerson,
	ProjectDocumentItem,
} from "./types";

const ALLOWED_EXTENSIONS = extensionsFromAccept(
	PROJECT_CREATE_CONSTANTS.ALLOWED_FILE_TYPES,
);

/** Where Avbryt and a finished Skapa both land. */
const OVERVIEW_URL = `${PROJECT_MODULE_BASE_URL}/overview`;

/** Which fields each step owns, so `trigger` validates only that step. */
const STEP_FIELDS: Record<number, (keyof CreateProjectFormData)[]> = {
	1: ["customer", "contactPerson"],
	2: ["details"],
	3: [],
	4: ["organisation"],
	5: [],
};

const EMPTY_FORM: CreateProjectFormData = {
	customer: {
		customer: "",
		address: "",
		postalCode: "",
		city: "",
		email: "",
		phone: "",
		orgOrPersonalNo: "",
	},
	contactPerson: {
		firstName: "",
		lastName: "",
		email: "",
		mobile: "",
		role: "",
	},
	details: {
		projectNo: "",
		projectName: "",
		blockName: "",
		projectAddress: "",
		postalCode: "",
		city: "",
		linkedProjectNo: "",
		type: "",
		category: "",
		department: "",
		contractSum: "",
		offerNo: "",
		startDate: "",
		endDate: "",
	},
	documents: [],
	organisation: {
		contractorType: "",
		organizationName: "",
		address: "",
		postalCode: "",
		city: "",
		email: "",
		phone: "",
		contacts: [],
	},
};

function fileTypeOf(name: string): ProjectDocumentItem["fileType"] {
	const extension = name.split(".").pop()?.toLowerCase();
	if (extension === "jpeg") return "jpg";
	return extension === "png" || extension === "jpg" || extension === "doc"
		? extension
		: PROJECT_CREATE_CONSTANTS.DEFAULT_FILE_TYPE;
}

/**
 * Everything the Registrera nytt projekt wizard needs except layout.
 *
 * Attachments live here rather than inside the documents step: when that card
 * owned its own picker state in the complaint wizard, every file still sitting
 * in the picker was silently dropped on submit.
 *
 * Nothing here touches `localStorage`. The draft carries a customer's
 * organisation or personal number and a contract sum, which AGENTS.md rule 6
 * keeps out of browser storage.
 */
export function useCreateProjectForm() {
	const t = useTranslate();
	const router = useRouter();
	const { registerFile, discardFile, prepareDocuments, hasPendingUploads } = useProjectDocumentUploads();

	const [currentStep, setCurrentStep] = useState<ProjectCreateStep>(1);
	const [documents, setDocuments] = useState<ProjectDocumentItem[]>([]);
	const [pendingFiles, setPendingFiles] = useState<PendingUploadFile[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [savedDraft, setSavedDraft] = useState<{ id: string; version: number } | null>(null);

	const form = useForm<CreateProjectFormData>({
		/* Every optional field carries `.default("")`, so the schema's input and
		   output types differ and the resolver would otherwise widen
		   `UseFormReturn`'s transformed-values argument past what the steps
		   accept. The runtime shape is the same either way. */
		resolver: zodResolver(createProjectSchema) as Resolver<CreateProjectFormData>,
		defaultValues: EMPTY_FORM,
		mode: "onTouched",
	});

	const validateStep = useCallback(
		(step: number) => form.trigger(STEP_FIELDS[step] ?? []),
		[form],
	);

	/**
	 * Re-checks each file against the rules the `accept` attribute only
	 * advertises — it filters the OS dialog and nothing else.
	 */
	const selectFiles = useCallback(
		(files: File[]) => {
			const accepted: PendingUploadFile[] = [];
			let rejectedSize = 0;
			let rejectedType = 0;

			for (const file of files) {
				const rejection = checkUploadedFile(file, {
					acceptExtensions: ALLOWED_EXTENSIONS,
					maxFileSizeBytes: PROJECT_CREATE_CONSTANTS.MAX_FILE_SIZE_BYTES,
				});

				if (rejection === "size") rejectedSize += 1;
				else if (rejection === "extension") rejectedType += 1;
				else accepted.push({ name: file.name, file });
			}

			if (rejectedSize > 0) {
				showToast("error", t(localizationConstants.validationFileSizeLimit));
			}
			if (rejectedType > 0) {
				/* The shared `validationFileTypeInvalid` message advertises DOC
				   and TXT, which this picker does not take. Reject with the same
				   wording the helper text under it promises. */
				showToast("error", t(localizationConstants.orderFileAllowedHelper));
			}

			if (accepted.length > 0) {
				setPendingFiles((previous) => [...new Map([...previous, ...accepted].map((entry) => [entry.name, entry])).values()]);
			}
		},
		[t],
	);

	const removePendingFile = useCallback((name: string) => {
		setPendingFiles((previous) =>
			previous.filter((entry) => entry.name !== name),
		);
	}, []);

	/** Moves whatever is in the picker into the attached-documents table. */
	const commitPendingFiles = useCallback((): ProjectDocumentItem[] => {
		if (pendingFiles.length === 0) return [];

		/* A click handler runs only on the client, so `new Date()` is safe
		   here — unlike in a mock evaluated while rendering. */
		const today = new Date().toISOString().slice(0, 10);

		const rows: ProjectDocumentItem[] = pendingFiles.map((entry) => {
			const id = crypto.randomUUID();
			registerFile(id, entry.file);
			return {
			id,
			date: today,
			documentName: entry.name.replace(/\.[^.]+$/, ""),
			fileName: entry.name,
			fileType: fileTypeOf(entry.name),
			fileSize: `${(entry.file.size / 1024).toFixed(1)} KB`,
			};
		});

		setDocuments((previous) => [...previous, ...rows]);
		setPendingFiles([]);
		return rows;
	}, [pendingFiles, registerFile]);

	/** Forward jumps validate intermediate steps; leaving Documents retains pending files. */
	const goToStep = useCallback(async (target: ProjectCreateStep) => {
		if (isSubmitting) return;
		if (target > currentStep) {
			for (let step = currentStep; step < target; step++) {
				if (!(await validateStep(step))) {
					setCurrentStep(step as ProjectCreateStep);
					return;
				}
			}
			if (currentStep <= 3 && target > 3) commitPendingFiles();
		}
		setCurrentStep(target);
	}, [commitPendingFiles, currentStep, isSubmitting, validateStep]);

	const goNext = useCallback(async () => {
		if (isSubmitting || currentStep >= PROJECT_CREATE_CONSTANTS.TOTAL_STEPS) return;
		if (!(await validateStep(currentStep))) return;
		if (currentStep === 3) commitPendingFiles();
		setCurrentStep((step) => (step + 1) as ProjectCreateStep);
	}, [commitPendingFiles, currentStep, isSubmitting, validateStep]);

	/**
	 * The name cell is free text that reaches the payload, so it is bounded
	 * here rather than trusting the input to stay reasonable.
	 */
	const renameDocument = useCallback((id: string, documentName: string) => {
		const bounded = documentName.slice(
			0,
			PROJECT_CREATE_CONSTANTS.MAX_DOCUMENT_NAME_LENGTH,
		);
		setDocuments((previous) =>
			previous.map((row) =>
				row.id === id ? { ...row, documentName: bounded } : row,
			),
		);
	}, []);

	const removeDocument = useCallback((id: string) => {
		discardFile(id);
		setDocuments((previous) => previous.filter((row) => row.id !== id));
	}, [discardFile]);

	const setContacts = useCallback(
		(contacts: ProjectContactPerson[]) =>
			form.setValue("organisation.contacts", contacts, {
				shouldDirty: true,
			}),
		[form],
	);

	/** Form values plus the state the hook keeps outside the form. */
	const collect = useCallback(
		(): CreateProjectFormData => ({
			...form.getValues(),
			documents: [...documents, ...commitPendingFiles()],
		}),
		[commitPendingFiles, documents, form],
	);

	const uploadPendingFiles = useCallback(async () => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const data = collect();
			setDocuments(await prepareDocuments(data.documents));
		} catch {
			showToast("error", t(localizationConstants.projectDocumentsUploadFailed));
		} finally {
			setIsSubmitting(false);
		}
	}, [collect, isSubmitting, prepareDocuments, t]);

	/**
	 * A draft is deliberately not validated — a half-filled project is the
	 * whole point of saving one.
	 */
	const saveDraft = useCallback(async () => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			const data = collect();
			data.documents = await prepareDocuments(data.documents);
			const saved = await createProjectApi(data, { isDraft: true, existing: savedDraft ?? undefined });
			setDocuments(saved.data.documents);
			setSavedDraft({ id: saved.id, version: saved.version });
			showToast("success", t(localizationConstants.projectCreateDraftToast));
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsSubmitting(false);
		}
	}, [collect, isSubmitting, prepareDocuments, savedDraft, t]);

	const submit = useCallback(async () => {
		if (isSubmitting) return;
		const valid = await form.trigger();

		if (!valid) {
			/* Land the user on the earliest step that still has an error. */
			const { errors } = form.formState;
			for (
				let step = 1;
				step <= PROJECT_CREATE_CONSTANTS.TOTAL_STEPS;
				step++
			) {
				const owns = STEP_FIELDS[step] ?? [];
				if (owns.some((field) => errors[field])) {
					setCurrentStep(step as ProjectCreateStep);
					return;
				}
			}
			return;
		}

		setIsSubmitting(true);
		try {
			const data = collect();
			data.documents = await prepareDocuments(data.documents);
			await createProjectApi(data, { isDraft: false, existing: savedDraft ?? undefined });
			showToast("success", t(localizationConstants.projectCreateSuccessToast));
			router.push(OVERVIEW_URL);
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsSubmitting(false);
		}
	}, [collect, form, isSubmitting, prepareDocuments, router, savedDraft, t]);

	const cancel = useCallback(
		() => { if (!isSubmitting) router.push(OVERVIEW_URL); },
		[isSubmitting, router],
	);

	return {
		form,
		currentStep,
		goToStep,
		goNext,
		documents,
		pendingFiles,
		hasPendingUploads: hasPendingUploads(documents),
		selectFiles,
		removePendingFile,
		commitPendingFiles,
		uploadPendingFiles,
		renameDocument,
		removeDocument,
		setContacts,
		saveDraft,
		submit,
		cancel,
		isSubmitting,
	};
}

export type CreateProjectForm = ReturnType<typeof useCreateProjectForm>;
