"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Plus,
	ArrowUpDown,
	MoreVertical,
	Pencil,
	Download,
	Trash2,
	Info,
	Calendar1,
	ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { WARRANTY_CONSTANTS } from "../constants/warranty.constants";
import type { WarrantyRow, InspectionDateItem } from "../types/warranty.types";
import { CreateVisitDateModal } from "./CreateVisitDateModal";

export interface WarrantyDetailViewProps {
	warranty: WarrantyRow;
	inspectionDates: InspectionDateItem[];
	onBack?: () => void;
	onAddInspectionDate: (item: Omit<InspectionDateItem, "id">) => void;
	onUpdateInspectionDate?: (id: string, item: Partial<InspectionDateItem>) => void;
	onDeleteInspectionDate?: (id: string) => void;
}

export function WarrantyDetailView({
	warranty,
	inspectionDates,
	onBack,
	onAddInspectionDate,
	onUpdateInspectionDate,
	onDeleteInspectionDate,
}: WarrantyDetailViewProps) {
	const router = useRouter();
	const t = useTranslate();
	const [openSections, setOpenSections] = useState({
		info: true,
		dates: true,
	});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingItem, setEditingItem] = useState<InspectionDateItem | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const toggleSection = (key: keyof typeof openSections) => {
		setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const handleBack = () => {
		if (onBack) {
			onBack();
		} else {
			router.push("/module/production/order/warranty");
		}
	};

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
				showToast("success", localizationConstants.toastVisitDateUpdated);
			} else {
				onAddInspectionDate(itemData);
				showToast("success", localizationConstants.toastVisitDateAdded);
			}
		} catch (error) {
			console.error("[WarrantyDetailView] Failed to save visit date:", error);
			showToast("error", localizationConstants.genericError);
		} finally {
			setIsModalOpen(false);
			setEditingItem(null);
		}
	};

	const handleConfirmDelete = () => {
		if (deletingId && onDeleteInspectionDate) {
			try {
				onDeleteInspectionDate(deletingId);
				showToast("success", localizationConstants.toastVisitDateDeleted);
			} catch (error) {
				console.error("[WarrantyDetailView] Failed to delete visit date:", error);
				showToast("error", localizationConstants.genericError);
			} finally {
				setDeletingId(null);
			}
		}
	};

	return (
		<div className="flex h-full flex-col bg-slate-50 relative overflow-hidden font-sans antialiased text-slate-900">
			{/* Main Scrollable Content */}
			<div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 pb-8">
				<div className="w-full space-y-6">
					{/* Back button & Page Title matching prototype typography */}
					<div className="flex items-center gap-2 pb-1">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={handleBack}
							className="h-6 w-6 p-0 text-slate-900 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg cursor-pointer shrink-0 shadow-none"
							aria-label="Back to warranty list"
						>
							<ArrowLeft className="h-5 w-5 stroke-[2.5]" />
						</Button>
						<h1 className="font-sans text-2xl font-semibold leading-[100%] tracking-[-0.6px] text-slate-900">
							<Translate text={localizationConstants.viewDetailTitle} />
						</h1>
					</div>

					{/* Cards Container with left padding aligning under header text and preserving right space */}
					<div className="space-y-4 w-full pl-0 sm:pl-7">
						{/* Card 1: Garantiinformation */}
						<Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-none w-full gap-0 pb-0">
							{/* Header bar without background color */}
							<Button
								type="button"
								variant="ghost"
								onClick={() => toggleSection("info")}
								className="flex h-14 min-h-14 w-full cursor-pointer items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 text-left hover:bg-slate-50/50 rounded-none shadow-none font-normal"
							>
								<div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
									<Info className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />
									<h3 className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900 truncate">
										<Translate text={localizationConstants.warrantyInfoSection} />
									</h3>
								</div>
								<ChevronUp
									size={18}
									className={cn(
										"text-slate-500 transition-transform duration-200 shrink-0",
										!openSections.info && "rotate-180"
									)}
									aria-hidden={true}
								/>
							</Button>

							{/* 4-column key-value grid matching project standard */}
							{openSections.info && (
								<CardContent className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-6 sm:gap-x-8 text-sm">
									{/* Column 1 */}
									<div className="space-y-4">
										<div className="flex flex-col gap-1">
											<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.projectLabel} />
											</span>
											<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 break-words">
												{warranty.id === "w-5000-001" || warranty.id === "5000-001" ? "2025-001" : warranty.orderNo}
											</span>
										</div>
										<div className="flex flex-col gap-1">
											<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.warrantyResponsibleLabel} />
											</span>
											<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 break-words">
												{warranty.warrantyResponsible || WARRANTY_CONSTANTS.DEFAULT_RESPONSIBLE}
											</span>
										</div>
										<div className="flex flex-col gap-1">
											<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.mobilePhoneLabel} />
											</span>
											<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 break-words">
												{warranty.phone || WARRANTY_CONSTANTS.DEFAULT_PHONE}
											</span>
										</div>
									</div>

									{/* Column 2 */}
									<div className="space-y-4">
										<div className="flex flex-col gap-1">
											<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.colProjectName} />
											</span>
											<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 break-words">
												{warranty.id === "w-5000-001" || warranty.id === "5000-001" ? "Ombyggnad villa" : warranty.orderName}
											</span>
										</div>
										<div className="flex flex-col gap-1">
											<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.orderStart} />
											</span>
											<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 break-words">
												{warranty.startDate || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DATE}
											</span>
										</div>
										<div className="flex flex-col gap-1">
											<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.mailLabel} />
											</span>
											<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 break-words">
												{warranty.email || WARRANTY_CONSTANTS.DEFAULT_EMAIL}
											</span>
										</div>
									</div>

									{/* Column 3 */}
									<div className="space-y-4">
										<div className="flex flex-col gap-1">
											<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.orderCustomer} />
											</span>
											<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 break-words">
												{warranty.customer || WARRANTY_CONSTANTS.DEFAULT_CUSTOMER}
											</span>
										</div>
										<div className="flex flex-col gap-1">
											<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.colApproved} />
											</span>
											<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 break-words">
												{warranty.approvedDate || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_DATE}
											</span>
										</div>
									</div>

									{/* Column 4 */}
									<div className="space-y-4">
										<div className="flex flex-col gap-1">
											<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.contactPersonSection} />
											</span>
											<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 break-words">
												{warranty.contactPerson || WARRANTY_CONSTANTS.DEFAULT_CONTACT}
											</span>
										</div>
										<div className="flex flex-col gap-1">
											<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
												<Translate text={localizationConstants.colWarrantyPeriod} />
											</span>
											<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 break-words">
												{warranty.warrantyPeriod || WARRANTY_CONSTANTS.DEFAULT_WARRANTY_PERIOD} / {warranty.warrantyEndDate || WARRANTY_CONSTANTS.DEFAULT_FALLBACK_END_DATE}
											</span>
										</div>
									</div>
								</CardContent>
							)}
						</Card>

						{/* Card 2: Besöksdatum */}
						<Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-none w-full gap-0 pb-0">
							{/* Header bar with title on left and Add button aligned right */}
							<div className="flex h-14 min-h-14 w-full items-center justify-between bg-white px-4 sm:px-6 border-b border-slate-200">
								<div className="flex items-center gap-2 sm:gap-3 min-w-0">
									<Calendar1 className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />
									<h3 className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900 truncate">
										<Translate text={localizationConstants.visitDatesSection} />
									</h3>
								</div>

								<Button
									type="button"
									onClick={handleOpenCreateModal}
									className="h-8 gap-1.5 rounded-lg bg-slate-900 px-3.5 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer shadow-none shrink-0"
								>
									<Plus className="h-3.5 w-3.5" />
									<span><Translate text={localizationConstants.addVisitDateButton} /></span>
								</Button>
							</div>

							{/* Card Body with Table */}
							<CardContent className="p-2 sm:p-3">
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
																		className="h-8 w-8 text-slate-900 hover:text-black hover:bg-slate-100 rounded-lg cursor-pointer shadow-none"
																		aria-label={t(localizationConstants.actions)}
																	>
																		<MoreVertical className="h-4 w-4 text-slate-900" />
																	</Button>
																</DropdownMenuTrigger>
																<DropdownMenuContent
																	align="end"
																	className="w-36 border border-slate-200 bg-white shadow-md rounded-lg p-1"
																>
																	<DropdownMenuItem
																		onClick={() => handleOpenEditModal(item)}
																		className="flex items-center gap-2 cursor-pointer w-full text-slate-900 hover:bg-slate-50 focus:bg-slate-100 focus:text-slate-950 text-xs"
																	>
																		<Pencil className="h-4 w-4 text-slate-900" />
																		<span><Translate text={localizationConstants.actionEdit} /></span>
																	</DropdownMenuItem>
																	<DropdownMenuItem
																		onClick={() => showToast("info", localizationConstants.toastDownloadingFile)}
																		className="flex items-center gap-2 cursor-pointer w-full text-slate-900 hover:bg-slate-50 focus:bg-slate-100 focus:text-slate-950 text-xs"
																	>
																		<Download className="h-4 w-4 text-slate-900" />
																		<span><Translate text={localizationConstants.downloadAction} /></span>
																	</DropdownMenuItem>
																	<DropdownMenuItem
																		onClick={() => setDeletingId(item.id)}
																		className="flex items-center gap-2 cursor-pointer w-full text-slate-900 hover:bg-slate-50 focus:bg-slate-100 focus:text-slate-950 text-xs"
																	>
																		<Trash2 className="h-4 w-4 text-slate-900" />
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
								</CardContent>
						</Card>
					</div>
				</div>
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
						<AlertDialogCancel className="w-full sm:w-auto rounded-lg border-slate-200 hover:bg-slate-50 text-slate-900 text-sm cursor-pointer">
							<Translate text={localizationConstants.cancel} />
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDelete}
							className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm cursor-pointer"
						>
							<Translate text={localizationConstants.actionDelete} />
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}

export default WarrantyDetailView;
