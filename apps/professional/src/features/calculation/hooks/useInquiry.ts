"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	getInquiriesAPIAction,
	getInquiryDetailAPIAction,
	getSupplierQuoteAPIAction,
	saveSupplierQuoteAPIAction,
	convertInquiryToCalculationAPIAction,
	declineInquiryAPIAction,
	addSupplierToInquiryAPIAction,
} from "../api/inquiryApi";
import type {
	ForfragnRow,
	ForfragnStatus,
	SupplierDocument,
	SupplierQuoteData,
} from "../types/forfragan";
import { sortItems } from "@/utils/tableSort";
import { useTableSort } from "@/hooks/useTableSort";

// ── Inquiries List Hook ──────────────────────────────────────────────────────

type SortField = keyof Pick<ForfragnRow, "kalkylNr" | "datum" | "forfragan" | "status">;

export function useInquiryList(calcId: string, initialRows: ForfragnRow[] = []) {
	const t = useTranslate();
	const router = useRouter();
	const queryClient = useQueryClient();

	const [search, setSearch] = useState("");
	const [filterStatus, setFilterStatus] = useState<ForfragnStatus | null>(null);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [declineTarget, setDeclineTarget] = useState<string | null>(null);
	const [declineReason, setDeclineReason] = useState("");

	const { sortField, sortDir, toggleSort } = useTableSort<SortField>();

	const { data: rows = initialRows, isLoading, isError } = useQuery({
		queryKey: ["calculation", calcId, "inquiries"],
		queryFn: () => getInquiriesAPIAction(calcId),
		initialData: initialRows.length > 0 ? initialRows : undefined,
	});

	const filtered = useMemo(() => {
		let result = rows;
		if (filterStatus) {
			result = result.filter((r) => r.status === filterStatus);
		}
		const q = search.toLowerCase().trim();
		if (q) {
			result = result.filter(
				(r) =>
					r.kalkylNr.toLowerCase().includes(q) ||
					r.forfragan.toLowerCase().includes(q) ||
					r.datum.includes(q),
			);
		}
		return result;
	}, [rows, search, filterStatus]);

	const sorted = useMemo(
		() => sortItems(filtered, sortField, sortDir, (r, f) => r[f as keyof ForfragnRow]),
		[filtered, sortField, sortDir],
	);

	const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
	const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

	const convertMutation = useMutation({
		mutationFn: (requestId: string) => convertInquiryToCalculationAPIAction(calcId, requestId),
		onSuccess: () => {
			showToast("success", t(localizationConstants.calcForfragnConvertedToast));
			queryClient.invalidateQueries({ queryKey: ["calculation", calcId, "inquiries"] });
			router.push(`/module/business/calculation/overview/${calcId}`);
		},
		onError: () => {
			showToast("error", t(localizationConstants.calcDetailSaveError));
		},
	});

	const declineMutation = useMutation({
		mutationFn: ({ requestId, reason }: { requestId: string; reason: string }) =>
			declineInquiryAPIAction(calcId, requestId, reason),
		onSuccess: () => {
			showToast("info", t(localizationConstants.calcForfragnDeclinedToast));
			setDeclineTarget(null);
			setDeclineReason("");
			queryClient.invalidateQueries({ queryKey: ["calculation", calcId, "inquiries"] });
		},
		onError: () => {
			showToast("error", t(localizationConstants.calcDetailSaveError));
		},
	});

	const handleConvert = useCallback(
		(requestId: string) => {
			convertMutation.mutate(requestId);
		},
		[convertMutation],
	);

	const handleConfirmDecline = useCallback(() => {
		if (!declineTarget || !declineReason.trim()) return;
		declineMutation.mutate({ requestId: declineTarget, reason: declineReason });
	}, [declineTarget, declineReason, declineMutation]);

	return {
		search,
		setSearch,
		filterStatus,
		setFilterStatus,
		page,
		setPage,
		pageSize,
		setPageSize,
		sortField,
		sortDir,
		toggleSort,
		paginated,
		totalCount: sorted.length,
		totalPages,
		isLoading,
		isError,
		declineTarget,
		setDeclineTarget,
		declineReason,
		setDeclineReason,
		handleConvert,
		handleConfirmDecline,
		isConverting: convertMutation.isPending,
		isDeclining: declineMutation.isPending,
	};
}

// ── Inquiry Detail Hook ──────────────────────────────────────────────────────

export function useInquiryDetail(calcId: string, requestId: string) {
	const t = useTranslate();
	const queryClient = useQueryClient();

	const [activeTab, setActiveTab] = useState<"inbjudna" | "projektinformation" | "dokument">("inbjudna");
	const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
	const [newSupplierName, setNewSupplierName] = useState("");
	const [newSupplierAmount, setNewSupplierAmount] = useState("");
	const [uploadedFiles, setUploadedFiles] = useState<SupplierDocument[]>([]);
	const [gdprAccepted, setGdprAccepted] = useState(false);

	const { data, isLoading, isError } = useQuery({
		queryKey: ["calculation", calcId, "inquiry", requestId],
		queryFn: () => getInquiryDetailAPIAction(calcId, requestId),
	});

	const addSupplierMutation = useMutation({
		mutationFn: (supplier: { company: string; datum: string; amount: number }) =>
			addSupplierToInquiryAPIAction(calcId, requestId, supplier),
		onSuccess: (newSup) => {
			showToast("success", t(localizationConstants.calcForfragnSupplierAdded));
			setIsAddSupplierOpen(false);
			setNewSupplierName("");
			setNewSupplierAmount("");
			queryClient.setQueryData(
				["calculation", calcId, "inquiry", requestId],
				(old: ReturnType<typeof useInquiryDetail>["data"]) => {
					if (!old) return old;
					return {
						...old,
						inbjudna: [...old.inbjudna, newSup],
					};
				},
			);
		},
	});

	const handleAddSupplier = useCallback(() => {
		if (!newSupplierName.trim()) return;
		const today = new Date().toISOString().split("T")[0];
		addSupplierMutation.mutate({
			company: newSupplierName,
			datum: today,
			amount: Number(newSupplierAmount.replace(/\s+/g, "")) || 0,
		});
	}, [newSupplierName, newSupplierAmount, addSupplierMutation]);

	const handleUploadDocument = useCallback(
		(fileName: string) => {
			const newDoc: SupplierDocument = {
				id: `doc_${Date.now()}`,
				datum: new Date().toISOString().split("T")[0],
				namn: fileName,
				typ: "A500-12",
				fileType: fileName.endsWith(".pdf") ? "pdf" : fileName.endsWith(".doc") ? "doc" : "img",
			};
			setUploadedFiles((prev) => [...prev, newDoc]);
			showToast("success", t(localizationConstants.save));
		},
		[t],
	);

	const handleDeleteDocument = useCallback(
		(docId: string) => {
			setUploadedFiles((prev) => prev.filter((d) => d.id !== docId));
			showToast("info", t(localizationConstants.deleteConfirmationTitle));
		},
		[t],
	);

	return {
		data,
		isLoading,
		isError,
		activeTab,
		setActiveTab,
		isAddSupplierOpen,
		setIsAddSupplierOpen,
		newSupplierName,
		setNewSupplierName,
		newSupplierAmount,
		setNewSupplierAmount,
		handleAddSupplier,
		uploadedFiles: [...(data?.documents ?? []), ...uploadedFiles],
		handleUploadDocument,
		handleDeleteDocument,
		gdprAccepted,
		setGdprAccepted,
	};
}

// ── Supplier Quote Hook ──────────────────────────────────────────────────────

export function useSupplierQuote(calcId: string, requestId: string, supplierId: string) {
	const t = useTranslate();
	const router = useRouter();
	const queryClient = useQueryClient();

	const [offertPris, setOffertPris] = useState<string>("");
	const [kommentarer, setKommentarer] = useState<string>("");
	const [isFardig, setIsFardig] = useState<boolean>(true);
	const [gdprAccepted, setGdprAccepted] = useState(false);

	const { data, isLoading, isError } = useQuery({
		queryKey: ["calculation", calcId, "inquiry", requestId, "supplier", supplierId],
		queryFn: () => getSupplierQuoteAPIAction(calcId, requestId, supplierId),
		select: (quote) => {
			return quote;
		},
	});

	const saveMutation = useMutation({
		mutationFn: (payload: Partial<SupplierQuoteData>) =>
			saveSupplierQuoteAPIAction(calcId, requestId, supplierId, payload),
		onSuccess: () => {
			showToast("success", t(localizationConstants.save));
			queryClient.invalidateQueries({
				queryKey: ["calculation", calcId, "inquiry", requestId],
			});
			router.push(`/module/business/calculation/overview/${calcId}/forfragan/${requestId}`);
		},
		onError: () => {
			showToast("error", t(localizationConstants.calcDetailSaveError));
		},
	});

	const handleSave = useCallback(() => {
		const amount = Number(offertPris.replace(/\s+/g, "")) || data?.offertPris || 0;
		saveMutation.mutate({
			offertPris: amount,
			kommentarer: kommentarer || data?.kommentarer || "",
			isFardig,
		});
	}, [offertPris, kommentarer, isFardig, data, saveMutation]);

	return {
		data,
		isLoading,
		isError,
		offertPris: offertPris || (data?.offertPris ? String(data.offertPris) : ""),
		setOffertPris,
		kommentarer: kommentarer !== "" ? kommentarer : (data?.kommentarer ?? ""),
		setKommentarer,
		isFardig,
		setIsFardig,
		gdprAccepted,
		setGdprAccepted,
		handleSave,
		isSaving: saveMutation.isPending,
	};
}
