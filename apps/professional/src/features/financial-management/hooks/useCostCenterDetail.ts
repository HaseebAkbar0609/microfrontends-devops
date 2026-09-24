"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CostCenterItem } from "../types/costCenters.types";
import {
	getCostCenterDetailAPIAction,
	updateCostCenterAPIAction,
} from "../utils/costCentersRepository";

export function useCostCenterDetail(id: string) {
	const t = useTranslate();
	const [costCenter, setCostCenter] = useState<CostCenterItem | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const [isEditing, setIsEditing] = useState(false);
	const [editData, setEditData] = useState<{
		kod: string;
		benamning: string;
		anteckningar: string;
	}>({
		kod: "",
		benamning: "",
		anteckningar: "",
	});

	const fetchDetail = useCallback(async () => {
		if (!id) return;
		setIsLoading(true);
		try {
			const data = await getCostCenterDetailAPIAction(id);
			if (data) {
				setCostCenter(data);
				setEditData({
					kod: data.kod,
					benamning: data.benamning,
					anteckningar: data.anteckningar,
				});
			}
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchDetail();
	}, [fetchDetail]);

	const startEdit = useCallback(() => {
		if (!costCenter) return;
		setEditData({
			kod: costCenter.kod,
			benamning: costCenter.benamning,
			anteckningar: costCenter.anteckningar,
		});
		setIsEditing(true);
	}, [costCenter]);

	const cancelEdit = useCallback(() => {
		if (!costCenter) return;
		setEditData({
			kod: costCenter.kod,
			benamning: costCenter.benamning,
			anteckningar: costCenter.anteckningar,
		});
		setIsEditing(false);
	}, [costCenter]);

	const saveEdit = useCallback(async () => {
		if (!costCenter) return;
		try {
			const updated = await updateCostCenterAPIAction(costCenter.id, editData);
			if (updated) {
				setCostCenter(updated);
				showToast("success", t(localizationConstants.costCenterUpdatedSuccess));
				setIsEditing(false);
			}
		} catch {
			showToast("error", "Kunde inte uppdatera kostnadsställe");
		}
	}, [costCenter, editData, t]);

	return useMemo(
		() => ({
			costCenter,
			isLoading,
			isEditing,
			editData,
			setEditData,
			startEdit,
			cancelEdit,
			saveEdit,
			refresh: fetchDetail,
		}),
		[
			costCenter,
			isLoading,
			isEditing,
			editData,
			startEdit,
			cancelEdit,
			saveEdit,
			fetchDetail,
		],
	);
}
