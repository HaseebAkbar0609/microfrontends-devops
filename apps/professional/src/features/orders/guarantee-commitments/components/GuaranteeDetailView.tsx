"use client";

import React, { useState } from "react";
import {
	ArrowLeft,
	Plus,
	ArrowUpDown,
	MoreVertical,
	Pencil,
	Download,
	Trash2,
	Save,
	ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableHeader,
	TableBody,
	TableHead,
	TableRow,
	TableCell,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import type { GuaranteeRow, InspectionDateItem } from "../types/guaranteeCommitments.types";
import { CreateVisitDateModal } from "./CreateVisitDateModal";

export interface GuaranteeDetailViewProps {
	warranty: GuaranteeRow;
	inspectionDates: InspectionDateItem[];
	onBack: () => void;
	onAddInspectionDate: (item: Omit<InspectionDateItem, "id">) => void;
	onUpdateInspectionDate?: (id: string, item: Partial<InspectionDateItem>) => void;
	onDeleteInspectionDate?: (id: string) => void;
}

export function GuaranteeDetailView({
	warranty,
	inspectionDates,
	onBack,
	onAddInspectionDate,
	onUpdateInspectionDate,
	onDeleteInspectionDate,
}: GuaranteeDetailViewProps) {
	const t = useTranslate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<InspectionDateItem | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const handleOpenCreateModal = () => {
		setEditingItem(null);
		setIsModalOpen(true);
	};

	const handleOpenEditModal = (item: InspectionDateItem) => {
		setEditingItem(item);
		setIsModalOpen(true);
	};

	const handleSaveModal = (itemData: Omit<InspectionDateItem, "id">) => {
		try {
			if (editingItem && onUpdateInspectionDate) {
				onUpdateInspectionDate(editingItem.id, itemData);
				showToast("success", t(localizationConstants.toastVisitDateUpdated));
			} else {
				onAddInspectionDate(itemData);
				showToast("success", t(localizationConstants.toastVisitDateAdded));
			}
		} catch (error) {
			console.error("[GuaranteeDetailView] Failed to save visit date:", error);
			showToast("error", t(localizationConstants.genericError));
		} finally {
			setIsModalOpen(false);
			setEditingItem(null);
		}
	};

	const handleConfirmDelete = () => {
		if (deletingId && onDeleteInspectionDate) {
			try {
				onDeleteInspectionDate(deletingId);
				showToast("success", t(localizationConstants.toastVisitDateDeleted));
			} catch (error) {
				console.error("[GuaranteeDetailView] Failed to delete visit date:", error);
				showToast("error", t(localizationConstants.genericError));
			} finally {
				setDeletingId(null);
			}
		}
	};

	const handleSaveDetail = () => {
		showToast("success", t(localizationConstants.toastChangesSaved));
	};

	return (
		<div className="flex flex-col flex-1 min-h-[calc(100vh-140px)] -ml-4 sm:-ml-[3.25rem] -mr-4 sm:-mr-6 -mt-px px-3 sm:px-6 pt-5 sm:pt-7 pb-0 bg-slate-50 justify-between">
			<div className="space-y-4 w-full pb-8">
				{/* Back button & Page Title */}
				<div className="flex items-center gap-2 pb-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onBack}
						className="h-6 w-6 p-0 text-slate-900 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg cursor-pointer shrink-0 shadow-none"
						aria-label="Back to guarantee commitments list"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<h1 className="font-sans text-xl sm:text-2xl font-semibold leading-[100%] tracking-[-0.6px] text-slate-900">
						<Translate text={localizationConstants.viewDetailTitle} />
					</h1>
				</div>

				{/* Cards Container with left margin */}
				<div className="space-y-4 w-full pl-0 sm:pl-7">
					{/* Card 1: Garantiinformation */}
					<div className="overflow-hidden rounded-lg border border-slate-200 bg-white w-full shadow-2xs">
				{/* Header bar */}
				<div className="flex h-14 min-h-14 w-full items-center bg-slate-100 px-4 sm:px-6 font-sans font-medium text-sm leading-5 tracking-normal text-slate-900 border-b border-slate-200">
					<h2>
						<Translate text={localizationConstants.warrantyInfoSection} />
					</h2>
				</div>

				{/* 4-column key-value grid matching project standard */}
				<div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6 sm:gap-x-8 text-sm">
					{/* Column 1 */}
					<div className="space-y-4">
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.projectLabel} />
							</span>
							<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 wrap-break-word">
								{warranty.id === "5000-001" ? "2025-001" : warranty.orderNo}
							</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.warrantyResponsibleLabel} />
							</span>
							<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 wrap-break-word">
								{warranty.warrantyResponsible || "Kalle Svensson"}
							</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.mobileLabel} />
							</span>
							<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 wrap-break-word">
								{warranty.phone || "-"}
							</span>
						</div>
					</div>

					{/* Column 2 */}
					<div className="space-y-4">
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.colProjectName} />
							</span>
							<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 wrap-break-word">
								{warranty.id === "5000-001" ? "Ombyggnad villa" : warranty.orderName}
							</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderStart} />
							</span>
							<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 wrap-break-word">
								{warranty.id === "5000-001" ? "2025-09-01" : warranty.startDate}
							</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.mailLabel} />
							</span>
							<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 wrap-break-word">
								{warranty.email || "Ann@example.com"}
							</span>
						</div>
					</div>

					{/* Column 3 */}
					<div className="space-y-4">
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderCustomer} />
							</span>
							<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 wrap-break-word">
								{warranty.id === "5000-001" ? "Fastighetsbolaget AB" : warranty.customer}
							</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.colApproved} />
							</span>
							<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 wrap-break-word">
								{warranty.id === "5000-001" ? "2026-02-28" : warranty.approvedDate}
							</span>
						</div>
					</div>

					{/* Column 4 */}
					<div className="space-y-4">
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.contactPersonSection} />
							</span>
							<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 wrap-break-word">
								{warranty.contactPerson || "Stina Andersson"}
							</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.colWarrantyPeriod} />
							</span>
							<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 wrap-break-word">
								{warranty.warrantyPeriod} / {warranty.warrantyEndDate || "2030-09-01"}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Card 2: Besöksdatum */}
			<div className="overflow-hidden rounded-lg border border-slate-200 bg-white w-full shadow-2xs">
				{/* Header bar with + Lägg till button */}
				<div className="flex flex-col sm:flex-row gap-2.5 sm:gap-0 sm:h-14 sm:min-h-14 w-full sm:items-center justify-between bg-slate-100 p-3.5 sm:px-6 border-b border-slate-200">
					<h2 className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
						<Translate text={localizationConstants.visitDatesSection} />
					</h2>

					<Button
						type="button"
						onClick={handleOpenCreateModal}
						className="h-8 gap-1.5 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer shadow-none w-full sm:w-auto justify-center"
					>
						<Plus className="h-3.5 w-3.5" />
						<span><Translate text={localizationConstants.addVisitDateButton} /></span>
					</Button>
				</div>

				{/* Card Body with reduced padding and borderless table wrapper */}
				<div className="p-2 sm:p-3">
					<div className="w-full overflow-x-auto relative bg-white">
						<Table className="w-full min-w-[650px] table-auto border-collapse">
							<TableHeader>
								<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
									<TableHead className="py-3.5 px-4 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 whitespace-nowrap">
										<span className="flex items-center gap-1">
											<Translate text={localizationConstants.dateHeaderLabel} />
											<ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60" />
										</span>
									</TableHead>
									<TableHead className="py-3.5 px-4 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 whitespace-nowrap">
										<span className="flex items-center gap-1">
											<Translate text={localizationConstants.reminderEmailLabel} />
											<ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60" />
										</span>
									</TableHead>
									<TableHead className="py-3.5 px-4 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 whitespace-nowrap">
										<span className="flex items-center gap-1">
											<Translate text={localizationConstants.reminderRuleLabel} />
											<ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60" />
										</span>
									</TableHead>
									<TableHead className="py-3.5 px-4 font-sans text-sm font-medium leading-6 tracking-normal text-slate-500 whitespace-nowrap">
										<span className="flex items-center gap-1">
											<Translate text={localizationConstants.documentNameHeader} />
											<ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60" />
										</span>
									</TableHead>
									<TableHead className="w-12 px-4 py-3.5" />
								</TableRow>
							</TableHeader>
							<TableBody>
								{inspectionDates.map((item) => (
									<TableRow
										key={item.id}
										className="group border-b border-slate-100 last:border-b-0 transition-colors hover:bg-slate-50/60"
									>
										<TableCell className="px-4 py-3.5 font-sans font-normal text-sm leading-5 tracking-normal text-slate-900 whitespace-nowrap">
											{item.date}
										</TableCell>
										<TableCell className="px-4 py-3.5 font-sans font-normal text-sm leading-5 tracking-normal text-slate-900 whitespace-nowrap">
											{item.reminderEmail}
										</TableCell>
										<TableCell className="px-4 py-3.5 font-sans font-normal text-sm leading-5 tracking-normal text-slate-900 whitespace-nowrap">
											{item.rule}
										</TableCell>
										<TableCell className="px-4 py-3.5">
											<div className="flex items-center gap-3 min-w-0">
												<PdfFileIcon className="h-11 w-9 shrink-0" />
												<span className="font-sans font-normal text-sm leading-5 tracking-normal text-slate-900 truncate min-w-0">
													{item.documentName}
												</span>
											</div>
										</TableCell>
										<TableCell className="px-4 py-3.5 text-center whitespace-nowrap">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
														aria-label={t(localizationConstants.actions)}
													>
														<MoreVertical className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="end"
													className="w-36 border border-slate-200 bg-white shadow-md rounded-lg p-1"
												>
													<DropdownMenuItem
														onClick={() => handleOpenEditModal(item)}
														className="flex items-center gap-2 cursor-pointer w-full text-slate-700 hover:bg-slate-50 text-xs"
													>
														<Pencil className="h-4 w-4 text-slate-500" />
														<span><Translate text={localizationConstants.actionEdit} /></span>
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => showToast("info", t(localizationConstants.toastDownloadingFile))}
														className="flex items-center gap-2 cursor-pointer w-full text-slate-700 hover:bg-slate-50 text-xs"
													>
														<Download className="h-4 w-4 text-slate-500" />
														<span><Translate text={localizationConstants.downloadAction} /></span>
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => setDeletingId(item.id)}
														className="flex items-center gap-2 cursor-pointer w-full text-slate-700 hover:bg-slate-50 text-xs"
													>
														<Trash2 className="h-4 w-4 text-slate-500" />
														<span><Translate text={localizationConstants.actionDelete} /></span>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
			</div>
			</div>

			{/* Sticky Bottom Action Bar - full width and attached flush to bottom */}
			<div className="mt-auto sticky -bottom-4 z-20 -mx-3 sm:-mx-6 -mb-4 border-t border-slate-200 bg-white py-3 px-4 sm:px-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 shadow-md">
				<Button
					type="button"
					variant="outline"
					onClick={onBack}
					className="w-full sm:w-[140px] sm:min-w-[140px] h-[44px] px-4 py-2 rounded-lg border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-sans text-sm font-medium shadow-none cursor-pointer whitespace-nowrap"
				>
					<Translate text={localizationConstants.cancel} />
				</Button>

				<Button
					type="button"
					onClick={handleSaveDetail}
					className="w-full sm:w-[140px] sm:min-w-[140px] h-[44px] px-4 py-2 rounded-lg border border-transparent bg-zinc-100 hover:bg-zinc-200 text-slate-900 font-sans text-sm font-medium shadow-none cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap"
				>
					<Save className="h-4 w-4 text-slate-800 shrink-0" strokeWidth={1.75} />
					<span><Translate text={localizationConstants.saveButton} /></span>
				</Button>

				<Button
					type="button"
					onClick={() => showToast("info", t(localizationConstants.toastOpeningPreview))}
					className="w-full sm:w-auto sm:min-w-[185px] h-[44px] px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-sans text-sm font-medium shadow-none cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap"
				>
					<span><Translate text={localizationConstants.previewButton} /></span>
					<ArrowRight className="h-4 w-4 shrink-0" />
				</Button>
			</div>

			{/* Modal for Add / Edit visit date */}
			<CreateVisitDateModal
				isOpen={isModalOpen}
				initialData={editingItem}
				onClose={() => {
					setIsModalOpen(false);
					setEditingItem(null);
				}}
				onSave={handleSaveModal}
			/>

			{/* Delete Confirmation Alert Dialog */}
			<AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
				<AlertDialogContent className="w-[calc(100vw-2rem)] max-w-md bg-white border border-slate-200 shadow-xl rounded-xl p-5 sm:p-6">
					<AlertDialogHeader>
						<AlertDialogTitle className="font-sans text-lg font-semibold text-slate-900">
							<Translate text={localizationConstants.deleteVisitDateConfirmTitle} />
						</AlertDialogTitle>
						<AlertDialogDescription className="font-sans text-sm text-slate-500">
							<Translate text={localizationConstants.deleteVisitDateConfirmDesc} />
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-2">
						<AlertDialogCancel className="w-full sm:w-auto rounded-lg border-slate-200 hover:bg-slate-50 text-slate-900 text-sm">
							<Translate text={localizationConstants.cancel} />
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDelete}
							className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
						>
							<Translate text={localizationConstants.actionDelete} />
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

export default GuaranteeDetailView;
