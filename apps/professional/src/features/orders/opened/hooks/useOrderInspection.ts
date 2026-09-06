"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	OrderInspectionItem,
	InspectionDocument,
	CreateInspectionInput,
} from "../types/orderInspection.types";
import {
	getOrderInspections,
	createOrderInspection,
	updateOrderInspection,
	deleteOrderInspection,
	uploadInspectionDocument,
} from "../api/orderInspection.api";
import { getMockInspections } from "../data/orderInspection.mock";

export function useOrderInspection(orderId?: string) {
	const t = useTranslate();
	const [inspections, setInspections] = useState<OrderInspectionItem[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchInspections = useCallback(async () => {
		if (!orderId) {
			setInspections(getMockInspections());
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError(null);
		try {
			const data = await getOrderInspections(orderId);
			if (data && data.length > 0) {
				setInspections(data);
			} else {
				setInspections(getMockInspections(orderId));
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : t(localizationConstants.inspectionActionFailed);
			setError(msg);
			setInspections(getMockInspections(orderId));
		} finally {
			setIsLoading(false);
		}
	}, [orderId, t]);

	useEffect(() => {
		fetchInspections();
	}, [fetchInspections]);

	const addInspection = async (
		newItem: CreateInspectionInput
	): Promise<OrderInspectionItem | null> => {
		if (!orderId) return null;
		try {
			const created = await createOrderInspection(orderId, newItem);
			setInspections((prev) => [created, ...prev]);
			toast.success(t(localizationConstants.inspectionCreatedSuccess));
			return created;
		} catch (err) {
			const msg = err instanceof Error ? err.message : t(localizationConstants.inspectionActionFailed);
			toast.error(msg);
			return null;
		}
	};

	const updateInspection = async (
		updatedItem: OrderInspectionItem
	): Promise<OrderInspectionItem | null> => {
		if (!orderId) return null;
		try {
			const saved = await updateOrderInspection(orderId, updatedItem);
			setInspections((prev) =>
				prev.map((item) => (item.id === saved.id ? saved : item))
			);
			toast.success(t(localizationConstants.inspectionUpdatedSuccess));
			return saved;
		} catch (err) {
			const msg = err instanceof Error ? err.message : t(localizationConstants.inspectionActionFailed);
			toast.error(msg);
			return null;
		}
	};

	const deleteInspection = async (inspectionId: string): Promise<boolean> => {
		if (!orderId) return false;
		try {
			await deleteOrderInspection(orderId, inspectionId);
			setInspections((prev) => prev.filter((item) => item.id !== inspectionId));
			toast.success(t(localizationConstants.inspectionDeletedSuccess));
			return true;
		} catch (err) {
			const msg = err instanceof Error ? err.message : t(localizationConstants.inspectionActionFailed);
			toast.error(msg);
			return false;
		}
	};

	const uploadDocument = async (file: File): Promise<InspectionDocument | null> => {
		try {
			return await uploadInspectionDocument(file);
		} catch (err) {
			const msg = err instanceof Error ? err.message : t(localizationConstants.inspectionActionFailed);
			toast.error(msg);
			return null;
		}
	};

	return {
		inspections,
		isLoading,
		error,
		addInspection,
		updateInspection,
		deleteInspection,
		uploadDocument,
		refresh: fetchInspections,
	};
}
