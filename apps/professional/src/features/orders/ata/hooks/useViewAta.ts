"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { ATA_CONSTANTS, type ViewAtaSectionKey } from "../constants/ata.constants";
import type {
	ViewAtaDetailData,
	DetailedLineItem,
} from "../types/ata.types";
import {
	getAtaFullDetailAction,
	updateAtaFullAction,
	approveAtaAction,
	rejectAtaAction,
} from "@/api-actions/orders/ata";
import { MOCK_VIEW_ATA_DETAIL } from "../data/viewAta.mock";

export interface UseViewAtaProps {
	orderId: string;
	ataId: string;
	onApproved?: () => void;
	onSaved?: () => void;
	onCancel?: () => void;
}

export interface EditSectionModalState {
	isOpen: boolean;
	sectionKey: string | null;
	title: string;
	items: DetailedLineItem[];
}

export interface ConfirmDialogState {
	isOpen: boolean;
	type: "approve" | "reject" | "save" | null;
	title: string;
	description: string;
	onConfirm: () => Promise<void>;
}

export function useViewAta({
	orderId,
	ataId,
	onApproved,
	onSaved,
	onCancel,
}: UseViewAtaProps) {
	const t = useTranslate();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [isApproving, setIsApproving] = useState<boolean>(false);
	const [isRejecting, setIsRejecting] = useState<boolean>(false);
	const [ataData, setAtaData] = useState<ViewAtaDetailData>(() => ({
		...MOCK_VIEW_ATA_DETAIL,
		id: ataId || "1",
		orderId: orderId || ATA_CONSTANTS.DEFAULT_ORDER_ID,
		ataNumber: ataId === "1" ? "001" : ataId || "001",
	}));

	const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
		[ATA_CONSTANTS.VIEW_SECTIONS.ORDERER]: true,
		[ATA_CONSTANTS.VIEW_SECTIONS.GENERAL_INFO]: true,
		[ATA_CONSTANTS.VIEW_SECTIONS.STAFF]: true,
		[ATA_CONSTANTS.VIEW_SECTIONS.MATERIAL]: true,
		[ATA_CONSTANTS.VIEW_SECTIONS.MACHINES]: true,
		[ATA_CONSTANTS.VIEW_SECTIONS.UE]: true,
		[ATA_CONSTANTS.VIEW_SECTIONS.SUPPLIER_ATA]: true,
		[ATA_CONSTANTS.VIEW_SECTIONS.DOCUMENTS]: true,
	});

	const [editModal, setEditModal] = useState<EditSectionModalState>({
		isOpen: false,
		sectionKey: null,
		title: "",
		items: [],
	});

	const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
		isOpen: false,
		type: null,
		title: "",
		description: "",
		onConfirm: async () => {},
	});

	const loadData = useCallback(async () => {
		setIsLoading(true);
		try {
			const res = await getAtaFullDetailAction(orderId, ataId);
			if (res.success && res.data) {
				setAtaData(res.data);
			}
		} catch {
			// Gracefully keep fallback data
		} finally {
			setIsLoading(false);
		}
	}, [orderId, ataId]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const toggleSection = useCallback((sectionKey: ViewAtaSectionKey | string) => {
		setExpandedSections((prev) => ({
			...prev,
			[sectionKey]: !prev[sectionKey],
		}));
	}, []);

	const openEditSection = useCallback(
		(sectionKey: string, title: string, items: DetailedLineItem[]) => {
			setEditModal({
				isOpen: true,
				sectionKey,
				title,
				items: [...items],
			});
		},
		[]
	);

	const closeEditSection = useCallback(() => {
		setEditModal({
			isOpen: false,
			sectionKey: null,
			title: "",
			items: [],
		});
	}, []);

	const saveSectionLineItems = useCallback(
		(sectionKey: string, updatedItems: DetailedLineItem[]) => {
			setAtaData((prev) => {
				const next = { ...prev };
				if (sectionKey === ATA_CONSTANTS.VIEW_SECTIONS.STAFF) {
					next.staffItems = updatedItems;
					next.summary = {
						...next.summary,
						ownStaffCount: updatedItems.length,
					};
				} else if (sectionKey === ATA_CONSTANTS.VIEW_SECTIONS.MATERIAL) {
					next.materialItems = updatedItems;
					next.summary = {
						...next.summary,
						totalMaterial: updatedItems.reduce((acc, item) => acc + (item.amount || 0), 0),
					};
				} else if (sectionKey === ATA_CONSTANTS.VIEW_SECTIONS.MACHINES) {
					next.machineItems = updatedItems;
					next.summary = {
						...next.summary,
						totalMachines: updatedItems.reduce((acc, item) => acc + (item.amount || 0), 0),
					};
				} else if (sectionKey === ATA_CONSTANTS.VIEW_SECTIONS.UE) {
					next.ueItems = updatedItems;
					next.summary = {
						...next.summary,
						totalUe: updatedItems.reduce((acc, item) => acc + (item.amount || 0), 0),
					};
				} else if (sectionKey === ATA_CONSTANTS.VIEW_SECTIONS.SUPPLIER_ATA) {
					next.supplierAtaItems = updatedItems;
					next.summary = {
						...next.summary,
						totalAtaSupplier: updatedItems.reduce((acc, item) => acc + (item.amount || 0), 0),
					};
				}
				return next;
			});
			closeEditSection();
		},
		[closeEditSection]
	);

	const handleSelectLinkedAta = useCallback((value: string) => {
		setAtaData((prev) => ({
			...prev,
			linkedLevAta: value,
		}));
	}, []);

	const handleApproveConfirm = useCallback(() => {
		setConfirmDialog({
			isOpen: true,
			type: "approve",
			title: t(localizationConstants.viewAtaApproveConfirmTitle),
			description: t(localizationConstants.viewAtaApproveConfirmDesc),
			onConfirm: async () => {
				setIsApproving(true);
				try {
					const res = await approveAtaAction(orderId, ataId);
					if (res.success) {
						setAtaData((prev) => ({
							...prev,
							status: "approved",
						}));
						showToast("success", t(localizationConstants.viewAtaApproveSuccess));
						onApproved?.();
					} else {
						showToast("error", res.error || t(localizationConstants.createAtaSendFailed));
					}
				} catch {
					showToast("error", t(localizationConstants.createAtaSendFailed));
				} finally {
					setIsApproving(false);
					setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
				}
			},
		});
	}, [orderId, ataId, t, onApproved]);

	const handleRejectConfirm = useCallback(() => {
		setConfirmDialog({
			isOpen: true,
			type: "reject",
			title: t(localizationConstants.viewAtaRejectConfirmTitle),
			description: t(localizationConstants.viewAtaRejectConfirmDesc),
			onConfirm: async () => {
				setIsRejecting(true);
				try {
					const res = await rejectAtaAction(orderId, ataId);
					if (res.success) {
						setAtaData((prev) => ({
							...prev,
							status: "rejected",
						}));
						showToast("success", t(localizationConstants.viewAtaRejectSuccess));
					} else {
						showToast("error", res.error || t(localizationConstants.createAtaSaveFailed));
					}
				} catch {
					showToast("error", t(localizationConstants.createAtaSaveFailed));
				} finally {
					setIsRejecting(false);
					setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
				}
			},
		});
	}, [orderId, ataId, t]);

	const handleSaveAll = useCallback(async () => {
		setIsSaving(true);
		try {
			const res = await updateAtaFullAction(orderId, ataId, ataData);
			if (res.success) {
				showToast("success", t(localizationConstants.viewAtaSaveSuccess));
				onSaved?.();
			} else {
				showToast("error", res.error || t(localizationConstants.createAtaSaveFailed));
			}
		} catch {
			showToast("error", t(localizationConstants.createAtaSaveFailed));
		} finally {
			setIsSaving(false);
		}
	}, [orderId, ataId, ataData, t, onSaved]);

	const handleCloseConfirmDialog = useCallback(() => {
		setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
	}, []);

	return {
		isLoading,
		isSaving,
		isApproving,
		isRejecting,
		ataData,
		expandedSections,
		editModal,
		confirmDialog,
		toggleSection,
		openEditSection,
		closeEditSection,
		saveSectionLineItems,
		handleSelectLinkedAta,
		handleApproveConfirm,
		handleRejectConfirm,
		handleSaveAll,
		handleCloseConfirmDialog,
		handleCancel: onCancel,
	};
}
