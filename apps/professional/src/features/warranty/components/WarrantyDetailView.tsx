"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { InspectionDateItem, WarrantyRow } from "../types/warranty.types";
import { VisitDatesCard } from "./detail/VisitDatesCard";
import { WarrantyDetailFooter } from "./detail/WarrantyDetailFooter";
import { WarrantyInfoCard } from "./detail/WarrantyInfoCard";
import { VisitDateDialog } from "./visit-date/VisitDateDialog";

export interface WarrantyDetailViewProps {
	warranty: WarrantyRow;
	inspectionDates: InspectionDateItem[];
	onBack: () => void;
	onAddInspectionDate: (item: Omit<InspectionDateItem, "id">) => void;
	onUpdateInspectionDate?: (
		id: string,
		item: Partial<InspectionDateItem>,
	) => void;
	onDeleteInspectionDate?: (id: string) => void;
}

/**
 * One warranty record: Garantiinformation, Besöksdatum, and the actions on it.
 *
 * A shell — the two cards, the footer and the row menu each own their own
 * markup, so what is left here is the state the frames share between them: which
 * visit date is being edited, and which one is being deleted.
 */
export function WarrantyDetailView({
	warranty,
	inspectionDates,
	onBack,
	onAddInspectionDate,
	onUpdateInspectionDate,
	onDeleteInspectionDate,
}: WarrantyDetailViewProps) {
	const t = useTranslate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<InspectionDateItem | null>(
		null,
	);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const closeModal = () => {
		setIsModalOpen(false);
		setEditingItem(null);
	};

	const handleSaveModal = (itemData: Omit<InspectionDateItem, "id">) => {
		try {
			if (editingItem && onUpdateInspectionDate) {
				onUpdateInspectionDate(editingItem.id, itemData);
				showToast(
					"success",
					t(localizationConstants.toastVisitDateUpdated),
				);
			} else {
				onAddInspectionDate(itemData);
				showToast("success", t(localizationConstants.toastVisitDateAdded));
			}
		} catch (error) {
			console.error("[WarrantyDetailView] Failed to save visit date:", error);
			showToast("error", t(localizationConstants.genericError));
		} finally {
			closeModal();
		}
	};

	const handleConfirmDelete = () => {
		if (!deletingId || !onDeleteInspectionDate) return;

		try {
			onDeleteInspectionDate(deletingId);
			showToast("success", t(localizationConstants.toastVisitDateDeleted));
		} catch (error) {
			console.error(
				"[WarrantyDetailView] Failed to delete visit date:",
				error,
			);
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<div className="flex flex-col flex-1 min-h-[calc(100vh-140px)] -ml-4 sm:-ml-[3.25rem] -mr-4 sm:-mr-6 -mt-px px-3 sm:px-6 pt-5 sm:pt-7 pb-0 bg-slate-50 justify-between">
			<div className="space-y-4 w-full pb-8">
				<div className="flex items-center gap-2 pb-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onBack}
						className="h-6 w-6 p-0 text-slate-900 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg cursor-pointer shrink-0 shadow-none"
						aria-label={t(localizationConstants.goBackButton)}
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<h1 className="font-sans text-xl sm:text-2xl font-semibold leading-[100%] tracking-[-0.6px] text-slate-900">
						<Translate text={localizationConstants.viewDetailTitle} />
					</h1>
				</div>

				<div className="space-y-4 w-full pl-0 sm:pl-7">
					<WarrantyInfoCard warranty={warranty} />

					<VisitDatesCard
						inspectionDates={inspectionDates}
						onAdd={() => {
							setEditingItem(null);
							setIsModalOpen(true);
						}}
						onEdit={(item) => {
							setEditingItem(item);
							setIsModalOpen(true);
						}}
						onDownload={() =>
							showToast(
								"info",
								t(localizationConstants.toastDownloadingFile),
							)
						}
						onDelete={setDeletingId}
					/>
				</div>
			</div>

			<WarrantyDetailFooter
				onCancel={onBack}
				onSave={() =>
					showToast("success", t(localizationConstants.toastChangesSaved))
				}
				onPreview={() =>
					showToast("info", t(localizationConstants.toastOpeningPreview))
				}
			/>

			<VisitDateDialog
				isOpen={isModalOpen}
				initialData={editingItem}
				onClose={closeModal}
				onSave={handleSaveModal}
			/>

			<ConfirmActionDialog
				open={!!deletingId}
				onOpenChange={(open) => !open && setDeletingId(null)}
				title={localizationConstants.deleteVisitDateConfirmTitle}
				description={localizationConstants.deleteVisitDateConfirmDesc}
				confirmLabel={localizationConstants.actionDelete}
				destructive
				onConfirm={handleConfirmDelete}
			/>
		</div>
	);
}

export default WarrantyDetailView;
