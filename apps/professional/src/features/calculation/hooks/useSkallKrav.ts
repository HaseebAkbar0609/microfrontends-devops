"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import type { SkallKravDoc } from "../types/kalkyl";
import { DUMMY_SKALL_KRAV_LIST } from "../constants/skallKravMock";
import {
	getSkallKravListAPIAction,
	uploadSkallKravDocAPIAction,
	deleteSkallKravDocAPIAction,
} from "../api/skallKravApi";

export type SkallKravSortField = keyof Pick<SkallKravDoc, "datum" | "typ" | "filename">;

export function useSkallKrav() {
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);

	const [docs, setDocs] = useState<SkallKravDoc[]>(DUMMY_SKALL_KRAV_LIST);
	const [isLoading, setIsLoading] = useState(false);
	const [isUploading, setIsUploading] = useState(false);

	// Filters & Search
	const [search, setSearch] = useState("");
	const [filterTyp, setFilterTyp] = useState<string | null>(null);

	// Selected File for Upload
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	// Delete target state for modal
	const [deleteTarget, setDeleteTarget] = useState<SkallKravDoc | null>(null);

	// Sorting
	const { sortField, sortDir, toggleSort } = useTableSort<SkallKravSortField>();

	// Fetch Data
	const fetchDocs = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getSkallKravListAPIAction({
				search,
				typ: filterTyp ?? undefined,
			});
			if (res?.data && res.data.length > 0) {
				setDocs(res.data);
			}
		} catch {
			// Fallback to initial mock list
		} finally {
			setIsLoading(false);
		}
	}, [search, filterTyp]);

	useEffect(() => {
		void fetchDocs();
	}, [fetchDocs]);

	// Unique list of document types
	const allTypes = useMemo(() => {
		const set = new Set<string>();
		DUMMY_SKALL_KRAV_LIST.forEach((d) => set.add(d.typ));
		docs.forEach((d) => set.add(d.typ));
		return Array.from(set);
	}, [docs]);

	// Filter & Sort
	const filteredDocs = useMemo(() => {
		let result = docs;
		if (filterTyp) {
			result = result.filter((d) => d.typ.toLowerCase() === filterTyp.toLowerCase());
		}
		const q = search.trim().toLowerCase();
		if (!q) return result;
		return result.filter(
			(d) =>
				d.typ.toLowerCase().includes(q) ||
				d.filename.toLowerCase().includes(q) ||
				d.datum.includes(q),
		);
	}, [docs, search, filterTyp]);

	const sortedDocs = useMemo(() => {
		return sortItems(
			filteredDocs,
			sortField,
			sortDir,
			(item, field) => item[field as keyof SkallKravDoc] as string,
		);
	}, [filteredDocs, sortField, sortDir]);

	// Handle File Selection
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] ?? null;
		setSelectedFile(file);
	};

	// Handle File Upload
	const handleUpload = async () => {
		if (!selectedFile) return;
		setIsUploading(true);
		try {
			const res = await uploadSkallKravDocAPIAction(selectedFile);
			if (res.success && res.item) {
				setDocs((prev) => [res.item, ...prev]);
				setSelectedFile(null);
				if (fileInputRef.current) fileInputRef.current.value = "";
				showToast("success", t(localizationConstants.save));
			}
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsUploading(false);
		}
	};

	// Handle Delete Document
	const handleDelete = async (id: string) => {
		try {
			await deleteSkallKravDocAPIAction(id);
			setDocs((prev) => prev.filter((d) => d.id !== id));
			setDeleteTarget(null);
			showToast("info", t(localizationConstants.confirmRemove));
		} catch {
			showToast("error", t(localizationConstants.genericError));
		}
	};

	// Handle View / Open File
	const handleViewFile = (_doc?: SkallKravDoc) => {
		showToast("info", t(localizationConstants.comingSoon));
	};

	return {
		docs: sortedDocs,
		totalCount: sortedDocs.length,
		isLoading,
		isUploading,
		search,
		setSearch,
		filterTyp,
		setFilterTyp,
		allTypes,
		selectedFile,
		setSelectedFile,
		fileInputRef,
		deleteTarget,
		setDeleteTarget,
		sortField,
		sortDir,
		toggleSort,
		handleFileChange,
		handleUpload,
		handleDelete,
		handleViewFile,
		refetch: fetchDocs,
	};
}
