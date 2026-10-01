"use client";

import { useState, useCallback, useEffect } from "react";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { KalkylDetailData, KalkylDocItem } from "../types/kalkyl";
import {
	getCalculationDetailAPIAction,
	updateCalculationDetailAPIAction,
	deleteCalculationDocumentAPIAction,
	emptyCalculationDetail,
} from "../api/calculationDetailApi";

export type DetailTab = "kontakt" | "projekt" | "dokument";

export function useCalculationDetail(initialId?: string, initialData?: KalkylDetailData) {
	const t = useTranslate();
	const calcId = initialId || "3001";

	const [data, setData] = useState<KalkylDetailData>(
		initialData || emptyCalculationDetail(),
	);
	const [activeTab, setActiveTab] = useState<DetailTab>("projekt");
	const [isLoading, setIsLoading] = useState(false);
	const [loadError, setLoadError] = useState(false);

	// Modals state
	const [deleteDocTarget, setDeleteDocTarget] = useState<KalkylDocItem | null>(null);
	const [isDeletingDoc, setIsDeletingDoc] = useState(false);

	// Fetch detail
	const fetchDetail = useCallback(async () => {
		setIsLoading(true);
		setLoadError(false);
		try {
			const res = await getCalculationDetailAPIAction(calcId);
			setData(res);
		} catch {
			setData(emptyCalculationDetail());
			setLoadError(true);
		} finally {
			setIsLoading(false);
		}
	}, [calcId]);

	useEffect(() => {
		fetchDetail();
	}, [fetchDetail]);

	// Update section handler
	const handleSaveData = async (updated: Partial<KalkylDetailData>) => {
		try {
			const result = await updateCalculationDetailAPIAction(calcId, updated);
			setData(result);
			showToast("success", t(localizationConstants.calcDetailSaveSuccess));
		} catch {
			showToast("error", t(localizationConstants.calcDetailSaveError));
		}
	};

	const handleDeleteDocument = async () => {
		if (!deleteDocTarget) return;
		setIsDeletingDoc(true);
		try {
			await deleteCalculationDocumentAPIAction(calcId, deleteDocTarget.id);
			setData((prev) => ({
				...prev,
				documents: prev.documents.filter((d) => d.id !== deleteDocTarget.id),
			}));
			showToast("success", t(localizationConstants.calcDetailDocDeleteSuccess));
			setDeleteDocTarget(null);
		} catch {
			showToast("error", t(localizationConstants.calcDetailDocDeleteError));
		} finally {
			setIsDeletingDoc(false);
		}
	};

	return {
		data,
		setData,
		activeTab,
		setActiveTab,
		isLoading,
		loadError,
		// Modals
		deleteDocTarget,
		setDeleteDocTarget,
		isDeletingDoc,
		// Actions
		handleSaveData,
		handleDeleteDocument,
		refresh: fetchDetail,
	};
}
