"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProtocols } from "./hooks/useProtocols";
import { ProtocolOverviewTable } from "./components/ProtocolOverviewTable";
import { CreateProtocolModal } from "./components/CreateProtocolModal";
import { UploadProtocolModal } from "./components/UploadProtocolModal";
import { ProtocolDetailView } from "./components/ProtocolDetailView";
import { PROTOCOL_CONSTANTS, type ProtocolTemplateType } from "./constants/protocol.constants";
import type { CreateProtocolPayload, ProtocolItem } from "./types/protocol.types";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export interface OrderProtocolOverviewPageProps {
	orderId?: string;
	onDetailModeChange?: (isOpen: boolean) => void;
}

export function OrderProtocolOverviewPage({ orderId, onDetailModeChange }: OrderProtocolOverviewPageProps) {
	const t = useTranslate();
	const router = useRouter();
	const searchParams = useSearchParams();
	const queryProtocolId = searchParams?.get("protocolId") || null;

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
	} = useProtocols(orderId);

	const [selectedProtocolId, setSelectedProtocolId] = useState<string | null>(queryProtocolId);

	useEffect(() => {
		setSelectedProtocolId(queryProtocolId);
		onDetailModeChange?.(!!queryProtocolId);
	}, [queryProtocolId, onDetailModeChange]);

	const handleSelectProtocol = (id: string | null) => {
		setSelectedProtocolId(id);
		onDetailModeChange?.(!!id);
		if (orderId) {
			const basePath = `/module/production/order/${orderId}/protocol`;
			if (id) {
				router.push(`${basePath}?protocolId=${encodeURIComponent(id)}`);
			} else {
				router.push(basePath);
			}
		}
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
		} catch (error) {
			console.error("[OrderProtocolOverviewPage] Failed to create protocol:", error);
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsCreateOpen(false);
		}
	};

	const handleUploadProtocol = async (payload: CreateProtocolPayload) => {
		try {
			await addProtocol(payload);
			showToast("success", t(localizationConstants.toastProtocolCreated));
		} catch (error) {
			console.error("[OrderProtocolOverviewPage] Failed to upload protocol:", error);
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsUploadOpen(false);
		}
	};

	const handleEditProtocolFromDetail = (_protocol: ProtocolItem) => {
		setIsCreateOpen(true);
	};

	if (selectedProtocolId) {
		return (
			<ProtocolDetailView
				protocolId={selectedProtocolId}
				orderId={orderId}
				onBack={() => handleSelectProtocol(null)}
				onEditProtocol={handleEditProtocolFromDetail}
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
				onViewDetail={(id) => handleSelectProtocol(id)}
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

