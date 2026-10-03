"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
	PersonalProcessItem,
	ProcessCategory,
	PersonalProcessFormData,
} from "../types/personalProcess.types";
import { INITIAL_PROCESS_LIST } from "../constants/personalProcess.mock";
import localizationConstants from "@/utils/translation/constants";

export function usePersonalProcess() {
	const [processes, setProcesses] = useState<PersonalProcessItem[]>(INITIAL_PROCESS_LIST);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<ProcessCategory>("onboarding");
	const [activeView, setActiveView] = useState<"list" | "form">("list");
	const [selectedProcess, setSelectedProcess] = useState<PersonalProcessItem | null>(null);
	const [processToDelete, setProcessToDelete] = useState<PersonalProcessItem | null>(null);
	const [previewDocName, setPreviewDocName] = useState<string | null>(null);

	const filteredProcesses = useMemo(() => {
		return processes.filter((proc) => {
			const matchesCategory =
				selectedCategory === "all" || proc.category === selectedCategory;
			const query = searchQuery.trim().toLowerCase();
			const matchesQuery =
				!query ||
				proc.title.toLowerCase().includes(query) ||
				proc.id.toLowerCase().includes(query) ||
				proc.date.toLowerCase().includes(query);
			return matchesCategory && matchesQuery;
		});
	}, [processes, selectedCategory, searchQuery]);

	const handleCreateNew = useCallback(() => {
		setSelectedProcess(null);
		setActiveView("form");
	}, []);

	const handleEditProcess = useCallback((proc: PersonalProcessItem) => {
		setSelectedProcess(proc);
		setActiveView("form");
	}, []);

	const handleBackToList = useCallback(() => {
		setActiveView("list");
		setSelectedProcess(null);
	}, []);

	const handleConfirmDelete = useCallback(() => {
		if (processToDelete) {
			setProcesses((prev) => prev.filter((p) => p.id !== processToDelete.id));
			toast.success(localizationConstants.processToastDeleted);
			setProcessToDelete(null);
		}
	}, [processToDelete]);

	const handleSaveProcess = useCallback((formData: PersonalProcessFormData) => {
		setProcesses((prev) => {
			const exists = prev.some((p) => p.id === formData.id);
			if (exists) {
				toast.success(localizationConstants.processToastUpdated);
				return prev.map((p) =>
					p.id === formData.id
						? {
								...p,
								title: formData.title,
								date: formData.date,
								category: formData.category,
								checklist: formData.checklist,
								documents: formData.documents,
						  }
						: p
				);
			} else {
				const newProcess: PersonalProcessItem = {
					id: formData.id,
					title: formData.title,
					date: formData.date,
					category: formData.category,
					status: "active",
					checklist: formData.checklist,
					documents: formData.documents,
				};
				toast.success(localizationConstants.processToastCreated);
				return [newProcess, ...prev];
			}
		});
		setActiveView("list");
		setSelectedProcess(null);
	}, []);

	const handlePreviewDoc = useCallback((docName: string) => {
		setPreviewDocName(docName);
	}, []);

	const handleClosePreviewDoc = useCallback(() => {
		setPreviewDocName(null);
	}, []);

	return {
		processes,
		filteredProcesses,
		searchQuery,
		setSearchQuery,
		selectedCategory,
		setSelectedCategory,
		activeView,
		selectedProcess,
		processToDelete,
		setProcessToDelete,
		previewDocName,
		handleCreateNew,
		handleEditProcess,
		handleBackToList,
		handleConfirmDelete,
		handleSaveProcess,
		handlePreviewDoc,
		handleClosePreviewDoc,
	};
}
