"use client";

import React, { useState, useMemo } from "react";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTableSort } from "@/hooks/useTableSort";
import { sortItems } from "@/utils/tableSort";
import { useOrderInspection } from "../../hooks/useOrderInspection";
import type {
	OrderInspectionItem,
	InspectionSortField,
	CreateInspectionInput,
} from "../../types/orderInspection.types";
import { InspectionToolbar } from "./InspectionToolbar";
import { InspectionTable } from "./InspectionTable";
import { InspectionModal } from "./InspectionModal";
import { DeleteInspectionDialog } from "./DeleteInspectionDialog";

interface OrderInspectionViewProps {
	orderId?: string;
}

export function OrderInspectionView({ orderId }: OrderInspectionViewProps) {
	const t = useTranslate();
	const {
		inspections,
		isLoading,
		addInspection,
		updateInspection,
		deleteInspection,
		uploadDocument,
	} = useOrderInspection(orderId);

	const [searchQuery, setSearchQuery] = useState<string>("");
	const [filterType, setFilterType] = useState<string>("all");

	const { sortField, sortDir, toggleSort } = useTableSort<InspectionSortField>();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedInspection, setSelectedInspection] = useState<OrderInspectionItem | null>(null);
	const [deletingInspection, setDeletingInspection] = useState<OrderInspectionItem | null>(null);

	const filtered = useMemo(() => {
		let result = [...inspections];

		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase().trim();
			result = result.filter(
				(item) =>
					item.type.toLowerCase().includes(q) ||
					item.date.includes(q) ||
					item.inspectionDate.includes(q) ||
					item.documents.some((doc) => doc.fileName.toLowerCase().includes(q)) ||
					Boolean(item.comments && item.comments.toLowerCase().includes(q))
			);
		}

		if (filterType && filterType !== "all") {
			result = result.filter((item) => item.type === filterType);
		}

		return result;
	}, [inspections, searchQuery, filterType]);

	const sorted = useMemo(() => {
		return sortItems(filtered, sortField, sortDir, (item, field) => {
			if (field === "pdf") {
				return item.documents[0]?.fileName || "";
			}
			if (field === "date") return item.date;
			if (field === "type") return item.type;
			if (field === "inspectionDate") return item.inspectionDate;
			return "";
		});
	}, [filtered, sortField, sortDir]);

	const handleDownload = (fileName: string, url?: string) => {
		if (url && url !== "#") {
			window.open(url, "_blank");
			return;
		}
		const pdfLabel = t(localizationConstants.inspectionColPdf);
		const blob = new Blob([`${pdfLabel}: ${fileName}`], { type: "text/plain" });
		const blobUrl = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = blobUrl;
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(blobUrl);
	};

	const handleSaveInspection = async (item: OrderInspectionItem | CreateInspectionInput) => {
		if ("id" in item && item.id) {
			await updateInspection(item);
		} else {
			await addInspection(item);
		}
	};

	return (
		<div className="flex flex-col w-full space-y-4">
			{/* Top Toolbar: Search + Filter + Add Button */}
			<InspectionToolbar
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
				filterType={filterType}
				onFilterTypeChange={setFilterType}
				onOpenAdd={() => {
					setSelectedInspection(null);
					setIsModalOpen(true);
				}}
			/>

			{/* Main Inspection Table */}
			<InspectionTable
				items={sorted}
				isLoading={isLoading}
				sortField={sortField}
				sortDir={sortDir}
				onToggleSort={toggleSort}
				onEdit={(item) => {
					setSelectedInspection(item);
					setIsModalOpen(true);
				}}
				onDelete={(item) => setDeletingInspection(item)}
				onDownload={handleDownload}
			/>

			{/* Unified Add/Edit Inspection Modal */}
			<InspectionModal
				isOpen={isModalOpen}
				inspection={selectedInspection}
				onClose={() => {
					setIsModalOpen(false);
					setSelectedInspection(null);
				}}
				onSave={handleSaveInspection}
				onUploadDocument={uploadDocument}
			/>

			{/* Delete Confirmation Dialog */}
			<DeleteInspectionDialog
				inspection={deletingInspection}
				onClose={() => setDeletingInspection(null)}
				onConfirmDelete={async (id) => {
					await deleteInspection(id);
					setDeletingInspection(null);
				}}
			/>
		</div>
	);
}

export default OrderInspectionView;
