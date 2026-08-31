"use client";

import { useEffect, useState } from "react";
import {
	getPurchaseById,
	updatePurchaseItem,
	subscribePurchases,
	INITIAL_PURCHASES,
} from "../data/purchase.mock";
import type { PurchaseDetail, PurchaseDocument } from "../types/purchase.types";

export type PurchaseDetailTab = "information" | "documents";

export function usePurchaseDetail(id: string) {
	const [detail, setDetail] = useState<PurchaseDetail>(() => {
		const found = getPurchaseById(id);
		if (found) return found;
		const first = INITIAL_PURCHASES[0];
		return {
			...first,
			id: id || first.id,
			additionalInfo: first.additionalInfo || "",
			documents: first.documents || [],
		};
	});
	const [activeTab, setActiveTab] = useState<PurchaseDetailTab>("information");
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		const found = getPurchaseById(id);
		if (found) {
			setDetail(found);
		}
	}, [id]);

	useEffect(() => {
		const unsubscribe = subscribePurchases(() => {
			const found = getPurchaseById(id);
			if (found) {
				setDetail(found);
			}
		});
		return unsubscribe;
	}, [id]);

	const addDocument = (doc: Omit<PurchaseDocument, "id">) => {
		const newDoc: PurchaseDocument = {
			...doc,
			id: `doc-${Date.now()}`,
		};
		const updatedDocs = [newDoc, ...(detail.documents || [])];
		setDetail((prev) => ({
			...prev,
			documents: updatedDocs,
		}));
		updatePurchaseItem(detail.id, { documents: updatedDocs });
	};

	const removeDocument = (docId: string) => {
		const updatedDocs = (detail.documents || []).filter((d) => d.id !== docId);
		setDetail((prev) => ({
			...prev,
			documents: updatedDocs,
		}));
		updatePurchaseItem(detail.id, { documents: updatedDocs });
	};

	const updateDetail = (updated: Partial<PurchaseDetail>) => {
		setDetail((prev) => ({ ...prev, ...updated }));
		updatePurchaseItem(detail.id, updated);
	};

	return {
		detail,
		activeTab,
		setActiveTab,
		isEditing,
		setIsEditing,
		addDocument,
		removeDocument,
		updateDetail,
	};
}
