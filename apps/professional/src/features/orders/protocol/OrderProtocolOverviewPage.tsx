"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProtocols } from "./hooks/useProtocols";
import { ProtocolOverviewTable } from "./components/ProtocolOverviewTable";
import { CreateProtocolModal } from "./components/CreateProtocolModal";
import { UploadProtocolModal } from "./components/UploadProtocolModal";
import { ProtocolDetailView } from "./components/ProtocolDetailView";
import { ActionProtocolDetailView } from "./components/ActionProtocolDetailView";
import { EditProtocolView } from "./components/EditProtocolView";
import { PROTOCOL_CONSTANTS, type ProtocolTemplateType } from "./constants/protocol.constants";
import type { CreateProtocolPayload } from "./types/protocol.types";
import { getProtocolDetailAction } from "@/api-actions/orders/protocols";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export interface OrderProtocolOverviewPageProps {
	orderId?: string;
	onDetailModeChange?: (isOpen: boolean) => void;
}

export type ProtocolViewMode = "table" | "detail" | "edit";

export function OrderProtocolOverviewPage({ orderId, onDetailModeChange }: OrderProtocolOverviewPageProps) {
	const t = useTranslate();
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryProtocolId = searchParams?.get("protocolId") || null;
	const queryAction = searchParams?.get("action") || null;

	const {
		paginatedRows,
		sortField,
		sortOrder,
		handleSort,
		searchQuery,
		setSearchQuery,
		typeFilter,
		setTypeFilter,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		addProtocol,
		archiveProtocol,
		deleteProtocol,
		reload,
	} = useProtocols(orderId);

	const getBasePath = () => {
		if (orderId) return `/module/production/order/${orderId}/protocol`;
		if (typeof window !== "undefined" && window.location.pathname) {
			return window.location.pathname;
		}
		return "/module/production/order/protocol";
	};

	const initialViewMode: ProtocolViewMode =
		queryAction === "edit" ? "edit" : queryProtocolId ? "detail" : "table";

	const [viewMode, setViewMode] = useState<ProtocolViewMode>(initialViewMode);
	const [activeProtocolId, setActiveProtocolId] = useState<string | null>(
		queryProtocolId || (initialViewMode === "edit" ? "proto-1" : null)
	);
	const [activeProtocolType, setActiveProtocolType] = useState<ProtocolTemplateType | null>(null);

	useEffect(() => {
		if (queryAction === "edit") {
			setViewMode("edit");
			setActiveProtocolId((prev) => queryProtocolId || prev || "proto-1");
			onDetailModeChange?.(true);
		} else if (queryProtocolId) {
			setViewMode("detail");
			setActiveProtocolId(queryProtocolId);
			onDetailModeChange?.(true);
		}
	}, [queryProtocolId, queryAction, onDetailModeChange]);

	useEffect(() => {
		if (viewMode === "detail" && activeProtocolId && !activeProtocolType) {
			const found = paginatedRows.find((r) => r.id === activeProtocolId);
			if (found?.templateType) {
				setActiveProtocolType(found.templateType as ProtocolTemplateType);
			} else {
				const targetOrderId = orderId || PROTOCOL_CONSTANTS.DEFAULT_ORDER_ID;
				getProtocolDetailAction(targetOrderId, activeProtocolId).then((result) => {
					if (result.success && result.data?.templateType) {
						setActiveProtocolType(result.data.templateType as ProtocolTemplateType);
					}
				});
			}
		}
	}, [viewMode, activeProtocolId, activeProtocolType, paginatedRows, orderId]);

	const handleOpenDetail = (id: string) => {
		setActiveProtocolId(id);
		setViewMode("detail");
		onDetailModeChange?.(true);
		const found = paginatedRows.find((r) => r.id === id);
		setActiveProtocolType((found?.templateType as ProtocolTemplateType) || null);
		const basePath = getBasePath();
		router.push(`${basePath}?protocolId=${encodeURIComponent(id)}`);
	};

	const handleOpenEdit = (id: string) => {
		const targetId = id || activeProtocolId || paginatedRows[0]?.id || "proto-1";
		setActiveProtocolId(targetId);
		setViewMode("edit");
		onDetailModeChange?.(true);
		const basePath = getBasePath();
		router.push(`${basePath}?protocolId=${encodeURIComponent(targetId)}&action=edit`);
	};

	const handleBackToTable = () => {
		setViewMode("table");
		setActiveProtocolId(null);
		setActiveProtocolType(null);
		onDetailModeChange?.(false);
		const basePath = getBasePath();
		router.push(basePath);
	};

	const handleBackToDetail = () => {
		if (activeProtocolId) {
			setViewMode("detail");
			onDetailModeChange?.(true);
			const basePath = getBasePath();
			router.push(`${basePath}?protocolId=${encodeURIComponent(activeProtocolId)}`);
		} else {
			handleBackToTable();
		}
	};

	const handleSavedEdit = () => {
		reload();
		handleBackToDetail();
	};

	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [createTemplateType, setCreateTemplateType] = useState<ProtocolTemplateType>(
		PROTOCOL_CONSTANTS.TEMPLATE_TYPES.STANDARD
	);
	const [isUploadOpen, setIsUploadOpen] = useState(false);

	const handleOpenCreate = (templateType: ProtocolTemplateType) => {
		setCreateTemplateType(templateType);
		setIsCreateOpen(true);
	};

	const handleSaveProtocol = async (payload: CreateProtocolPayload) => {
		try {
			await addProtocol(payload);
			showToast("success", t(localizationConstants.toastProtocolCreated));
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsCreateOpen(false);
		}
	};

	const handleUploadProtocol = async (payload: CreateProtocolPayload) => {
		try {
			await addProtocol(payload);
			showToast("success", t(localizationConstants.toastProtocolCreated));
		} catch {
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsUploadOpen(false);
		}
	};

	if (viewMode === "edit" && activeProtocolId) {
		return (
			<EditProtocolView
				protocolId={activeProtocolId}
				orderId={orderId}
				onBack={handleBackToDetail}
				onSaved={handleSavedEdit}
			/>
		);
	}

	if (viewMode === "detail" && activeProtocolId) {
		if (activeProtocolType === PROTOCOL_CONSTANTS.TEMPLATE_TYPES.ACTION) {
			return (
				<ActionProtocolDetailView
					protocolId={activeProtocolId}
					orderId={orderId}
					onBack={handleBackToTable}
					onEditProtocol={(proto) => handleOpenEdit(proto.id || activeProtocolId)}
				/>
			);
		}
		return (
			<ProtocolDetailView
				protocolId={activeProtocolId}
				orderId={orderId}
				onBack={handleBackToTable}
				onEditProtocol={(proto) => handleOpenEdit(proto.id || activeProtocolId)}
			/>
		);
	}

	return (
		<div className="w-full">
			<ProtocolOverviewTable
				rows={paginatedRows}
				orderId={orderId}
				sortField={sortField}
				sortOrder={sortOrder}
				onSort={handleSort}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				typeFilter={typeFilter}
				onTypeFilterChange={setTypeFilter}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
				pageSize={pageSize}
				setPageSize={setPageSize}
				totalPages={totalPages}
				onOpenCreate={handleOpenCreate}
				onOpenUpload={() => setIsUploadOpen(true)}
				onArchive={archiveProtocol}
				onDelete={deleteProtocol}
				onViewDetail={handleOpenDetail}
				onEditProtocol={handleOpenEdit}
			/>

			{/* Create Standard / Action Protocol Modal */}
			<CreateProtocolModal
				isOpen={isCreateOpen}
				templateType={createTemplateType}
				orderId={orderId}
				onClose={() => setIsCreateOpen(false)}
				onSave={handleSaveProtocol}
			/>

			{/* Upload Protocol Modal */}
			<UploadProtocolModal
				isOpen={isUploadOpen}
				orderId={orderId}
				onClose={() => setIsUploadOpen(false)}
				onUpload={handleUploadProtocol}
			/>
		</div>
	);
}

export default OrderProtocolOverviewPage;
