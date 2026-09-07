"use client";

import React, { useState } from "react";
import { useProtocols } from "./hooks/useProtocols";
import { ProtocolOverviewTable } from "./components/ProtocolOverviewTable";
import { CreateProtocolModal } from "./components/CreateProtocolModal";
import { UploadProtocolModal } from "./components/UploadProtocolModal";
import { PROTOCOL_CONSTANTS, type ProtocolTemplateType } from "./constants/protocol.constants";
import type { CreateProtocolPayload } from "./types/protocol.types";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export interface OrderProtocolOverviewPageProps {
	orderId?: string;
}

export function OrderProtocolOverviewPage({ orderId }: OrderProtocolOverviewPageProps) {
	const t = useTranslate();
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

	return (
		<div className="w-full">
			<ProtocolOverviewTable
				rows={paginatedRows}
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
			/>

			{/* Create Standard / Action Protocol Modal */}
			<CreateProtocolModal
				isOpen={isCreateOpen}
				templateType={createTemplateType}
				onClose={() => setIsCreateOpen(false)}
				onSave={handleSaveProtocol}
			/>

			{/* Upload Protocol Modal */}
			<UploadProtocolModal
				isOpen={isUploadOpen}
				onClose={() => setIsUploadOpen(false)}
				onUpload={handleUploadProtocol}
			/>
		</div>
	);
}

export default OrderProtocolOverviewPage;
