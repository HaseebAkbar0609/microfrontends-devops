"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PriceListBulkUpdateData, PriceListDetail } from "../types/priceLists.types";
import { priceListsRepository } from "../utils/priceListsRepository";

export function useBulkPriceUpdate() {
	const t = useTranslate();
	const [priceLists, setPriceLists] = useState<PriceListDetail[]>([]);
	const [selectedPriceListId, setSelectedPriceListId] = useState<string>("pl_001");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [formData, setFormData] = useState<PriceListBulkUpdateData>({
		baseCalculationOn: "Prislista A",
		updatePriceListId: "Prislista A",
		calculationType: "procent",
		rounding: "2decimal",
		direction: "increase",
		percentage: 5,
		indexValue: 100,
		sekAmount: 50,
	});

	const loadPriceLists = useCallback(() => {
		const all = priceListsRepository.getAll();
		setPriceLists(all);
		if (all.length > 0 && !selectedPriceListId) {
			setSelectedPriceListId(all[0].id);
		}
	}, [selectedPriceListId]);

	useEffect(() => {
		loadPriceLists();
		const unsubscribe = priceListsRepository.subscribe(loadPriceLists);
		return () => {
			unsubscribe();
		};
	}, [loadPriceLists]);

	const selectedPriceList = useMemo(() => {
		return priceLists.find(
			(pl) => pl.id === selectedPriceListId || pl.code === selectedPriceListId || pl.name === selectedPriceListId,
		) || priceLists[0] || null;
	}, [priceLists, selectedPriceListId]);

	const openModal = useCallback(() => {
		if (selectedPriceList) {
			setFormData((prev) => ({
				...prev,
				baseCalculationOn: selectedPriceList.name,
				updatePriceListId: selectedPriceList.name,
			}));
		}
		setIsModalOpen(true);
	}, [selectedPriceList]);

	const closeModal = useCallback(() => {
		setIsModalOpen(false);
	}, []);

	const updateFormField = useCallback(<K extends keyof PriceListBulkUpdateData>(
		field: K,
		value: PriceListBulkUpdateData[K],
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	}, []);

	const handleSaveBulkUpdate = useCallback(async () => {
		setIsSubmitting(true);
		try {
			const success = priceListsRepository.bulkUpdatePrices({
				...formData,
				updatePriceListId: selectedPriceList?.id || formData.updatePriceListId,
			});
			if (success) {
				showToast("success", t(localizationConstants.priceListUpdateSuccess));
				closeModal();
			} else {
				showToast("error", t(localizationConstants.priceListUpdateError));
			}
		} catch {
			showToast("error", t(localizationConstants.priceListUpdateError));
		} finally {
			setIsSubmitting(false);
		}
	}, [formData, selectedPriceList, closeModal, t]);

	return useMemo(
		() => ({
			priceLists,
			selectedPriceListId,
			setSelectedPriceListId,
			selectedPriceList,
			isModalOpen,
			openModal,
			closeModal,
			formData,
			updateFormField,
			handleSaveBulkUpdate,
			isSubmitting,
		}),
		[
			priceLists,
			selectedPriceListId,
			selectedPriceList,
			isModalOpen,
			openModal,
			closeModal,
			formData,
			updateFormField,
			handleSaveBulkUpdate,
			isSubmitting,
		],
	);
}
