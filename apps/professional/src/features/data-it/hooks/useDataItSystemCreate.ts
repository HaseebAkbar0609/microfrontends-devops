"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import {
	DATA_IT_SYSTEM_BASE_URL,
	SYSTEM_DETAIL_TAB_BASIC,
	SYSTEM_DETAIL_TAB_ASSIGNMENT,
	type SystemDetailTabId,
	SYSTEM_CATEGORY_TRANSLATION_MAP,
	DEFAULT_SYSTEM_ID_NUMERIC_FALLBACK,
	DEFAULT_NEW_SYSTEM_CATEGORY,
	DEFAULT_NEW_SYSTEM_STATUS,
} from "../constants/dataItSystem.constants";
import { AVAILABLE_SYSTEM_ASSIGNEES } from "../constants/dataItSystem.mock";
import { dataItSystemRepository } from "../utils/dataItSystemRepository";
import type {
	SystemCategory,
	SystemStatus,
	SystemDocument,
	SystemAssignee,
	SystemItem,
} from "../types/dataItSystem.types";

export interface SystemCreateFormState {
	systemId: string;
	program: string;
	category: SystemCategory;
	status: SystemStatus;
	pricePerMonth: number;
	email: string;
	password: string;
	description: string;
	documents: SystemDocument[];
	assignedUsers: SystemAssignee[];
}

export function useDataItSystemCreate() {
	const t = useTranslate();
	const router = useRouter();

	// Generate clean initial ID: e.g. #5009
	const initialSystemId = useMemo(() => {
		const existing = dataItSystemRepository.getAll();
		const ids = existing
			.map((item) => parseInt(item.id.replace(/\D/g, ""), 10))
			.filter((n) => !isNaN(n));
		const maxId =
			ids.length > 0 ? Math.max(...ids) : DEFAULT_SYSTEM_ID_NUMERIC_FALLBACK;
		return `#${maxId + 1}`;
	}, []);

	const [form, setForm] = useState<SystemCreateFormState>({
		systemId: initialSystemId,
		program: "",
		category: DEFAULT_NEW_SYSTEM_CATEGORY,
		status: DEFAULT_NEW_SYSTEM_STATUS,
		pricePerMonth: 0,
		email: "",
		password: "",
		description: "",
		documents: [],
		assignedUsers: [],
	});

	// Staged files lifted to hook so they persist across tab switches
	const [stagedFiles, setStagedFiles] = useState<SystemDocument[]>([]);
	const [activeTab, setActiveTab] =
		useState<SystemDetailTabId>(SYSTEM_DETAIL_TAB_BASIC);
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const isDirty = useMemo(() => {
		return (
			form.program.trim() !== "" ||
			form.pricePerMonth !== 0 ||
			form.category !== DEFAULT_NEW_SYSTEM_CATEGORY ||
			form.status !== DEFAULT_NEW_SYSTEM_STATUS ||
			form.email.trim() !== "" ||
			form.password.trim() !== "" ||
			form.description.trim() !== "" ||
			form.documents.length > 0 ||
			stagedFiles.length > 0 ||
			form.assignedUsers.length > 0
		);
	}, [form, stagedFiles]);

	const updateField = useCallback(
		<K extends keyof SystemCreateFormState>(
			field: K,
			value: SystemCreateFormState[K],
		) => {
			setForm((prev) => ({ ...prev, [field]: value }));
			setErrors((prev) => {
				if (prev[field]) {
					const next = { ...prev };
					delete next[field];
					return next;
				}
				return prev;
			});
		},
		[],
	);

	const addDocument = useCallback((doc: SystemDocument) => {
		setForm((prev) => ({
			...prev,
			documents: [
				...prev.documents,
				{
					...doc,
					id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
				},
			],
		}));
	}, []);

	const removeDocument = useCallback(
		(id: string) => {
			setForm((prev) => ({
				...prev,
				documents: prev.documents.filter((d) => d.id !== id),
			}));
			showToast(
				"info",
				t(localizationConstants.dataItSystemCreateDocRemovedToast),
			);
		},
		[t],
	);

	const addStagedFiles = useCallback((docs: SystemDocument[]) => {
		setStagedFiles((prev) => [...prev, ...docs]);
	}, []);

	const removeStagedFile = useCallback((id: string) => {
		setStagedFiles((prev) => prev.filter((item) => item.id !== id));
	}, []);

	const commitStagedFiles = useCallback(() => {
		if (stagedFiles.length === 0) return;
		setForm((prev) => ({
			...prev,
			documents: [...prev.documents, ...stagedFiles],
		}));
		setStagedFiles([]);
	}, [stagedFiles]);

	const addAssigneeFromCandidate = useCallback((candidateId: string) => {
		const candidate = AVAILABLE_SYSTEM_ASSIGNEES.find(
			(item) => item.id === candidateId,
		);
		if (!candidate) return;
		setForm((prev) => {
			if (prev.assignedUsers.some((u) => u.name === candidate.name)) {
				return prev;
			}
			return {
				...prev,
				assignedUsers: [
					...prev.assignedUsers,
					{
						...candidate,
						id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
					},
				],
			};
		});
	}, []);

	const removeAssignee = useCallback(
		(id: string) => {
			setForm((prev) => ({
				...prev,
				assignedUsers: prev.assignedUsers.filter((u) => u.id !== id),
			}));
			showToast(
				"info",
				t(localizationConstants.dataItSystemCreateAssigneeRemovedToast),
			);
		},
		[t],
	);

	const validateBasicInfo = useCallback((): boolean => {
		const nextErrors: Record<string, string> = {};
		if (!form.program.trim()) {
			nextErrors.program = t(
				localizationConstants.dataItSystemValidationRequired,
			);
		}
		if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
			nextErrors.email = t(localizationConstants.dataItSystemValidationEmail);
		}
		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	}, [form, t]);

	const handleNext = useCallback(() => {
		if (validateBasicInfo()) {
			setActiveTab(SYSTEM_DETAIL_TAB_ASSIGNMENT);
		}
	}, [validateBasicInfo]);

	const handleSave = useCallback(() => {
		if (isSubmitting) return;

		if (!validateBasicInfo()) {
			setActiveTab(SYSTEM_DETAIL_TAB_BASIC);
			return;
		}

		setIsSubmitting(true);

		const rawId = form.systemId.trim();
		let cleanId = rawId.replace(/^#/, "").trim();
		const existingItems = dataItSystemRepository.getAll();

		// Prevent duplicate System-ID collision
		if (!cleanId || existingItems.some((item) => item.id === cleanId)) {
			const ids = existingItems
				.map((item) => parseInt(item.id.replace(/\D/g, ""), 10))
				.filter((n) => !isNaN(n));
			const maxId =
				ids.length > 0 ? Math.max(...ids) : DEFAULT_SYSTEM_ID_NUMERIC_FALLBACK;
			cleanId = String(maxId + 1);
		}
		const displaySystemId = `#${cleanId}`;

		// Automatically include any uncommitted staged files so user never loses them
		const finalDocuments = [...form.documents, ...stagedFiles];

		const newItem: SystemItem = {
			id: cleanId,
			systemId: displaySystemId,
			program: form.program.trim(),
			category: form.category,
			categoryLabel: t(SYSTEM_CATEGORY_TRANSLATION_MAP[form.category]),
			status: form.status,
			pricePerMonth: Math.max(0, Number(form.pricePerMonth) || 0),
			email: form.email.trim() || undefined,
			password: form.password.trim() || undefined,
			description: form.description.trim() || undefined,
			documents: finalDocuments,
			assignedUsers: form.assignedUsers,
		};

		dataItSystemRepository.create(newItem);
		showToast(
			"success",
			t(localizationConstants.dataItSystemToastCreated),
		);
		router.push(`${DATA_IT_SYSTEM_BASE_URL}/${encodeURIComponent(newItem.id)}`);
	}, [isSubmitting, form, stagedFiles, validateBasicInfo, t, router]);

	const handleCancel = useCallback(() => {
		if (isDirty) {
			setIsCancelDialogOpen(true);
		} else {
			router.push(DATA_IT_SYSTEM_BASE_URL);
		}
	}, [isDirty, router]);

	const confirmCancel = useCallback(() => {
		setIsCancelDialogOpen(false);
		router.push(DATA_IT_SYSTEM_BASE_URL);
	}, [router]);

	return {
		form,
		activeTab,
		setActiveTab,
		showPassword,
		togglePasswordVisibility: () => setShowPassword((p) => !p),
		errors,
		isDirty,
		isCancelDialogOpen,
		setIsCancelDialogOpen,
		isSubmitting,
		stagedFiles,
		addStagedFiles,
		removeStagedFile,
		commitStagedFiles,
		updateField,
		addDocument,
		removeDocument,
		addAssigneeFromCandidate,
		removeAssignee,
		handleNext,
		handleSave,
		handleCancel,
		confirmCancel,
	};
}
