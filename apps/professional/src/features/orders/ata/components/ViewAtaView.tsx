"use client";

import React from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ATA_CONSTANTS } from "../constants/ata.constants";
import { useViewAta } from "../hooks/useViewAta";
import { ViewAtaInfoCards } from "./view/ViewAtaInfoCards";
import { ViewAtaSummarySidebar } from "./view/ViewAtaSummarySidebar";
import { ViewAtaDetailedSections } from "./view/ViewAtaDetailedSections";
import {
	ViewAtaEditLineItemsModal,
	ViewAtaConfirmDialog,
} from "./view/ViewAtaModals";

export interface ViewAtaViewProps {
	orderId?: string;
	ataId?: string;
	onBack: () => void;
	onSaved?: () => void;
}

export function ViewAtaView({
	orderId = ATA_CONSTANTS.DEFAULT_ORDER_ID,
	ataId = "1",
	onBack,
	onSaved,
}: ViewAtaViewProps) {
	const t = useTranslate();
	const {
		isLoading,
		isSaving,
		isApproving,
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
		handleSaveAll,
		handleCloseConfirmDialog,
		handleCancel,
	} = useViewAta({
		orderId,
		ataId,
		onSaved,
		onCancel: onBack,
	});

	if (isLoading) {
		return (
			<div className="flex flex-col flex-1 min-h-[calc(100vh-140px)] -ml-4 sm:-ml-[3.25rem] -mr-4 sm:-mr-6 -mt-px -mb-4 px-3 sm:px-6 pt-5 sm:pt-7 pb-0 bg-slate-50 justify-between font-sans">
				<div className="space-y-4 w-full pb-8 animate-pulse">
					<div className="flex items-center gap-2 pb-2">
						<Skeleton className="h-7 w-7 rounded-md" />
						<Skeleton className="h-8 w-48 rounded" />
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
						<div className="lg:col-span-8 space-y-4">
							<Skeleton className="h-44 w-full rounded-lg" />
							<Skeleton className="h-64 w-full rounded-lg" />
						</div>
						<div className="lg:col-span-4">
							<Skeleton className="h-96 w-full rounded-lg" />
						</div>
					</div>
					<Skeleton className="h-80 w-full rounded-lg" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col flex-1 min-h-[calc(100vh-140px)] -ml-4 sm:-ml-[3.25rem] -mr-4 sm:-mr-6 -mt-px -mb-4 px-3 sm:px-6 pt-5 sm:pt-7 pb-0 bg-slate-50 justify-between font-sans">
			<div className="space-y-4 w-full pb-8">
				{/* Top Header matching Figma: Back arrow + Title */}
				<div className="flex items-center gap-1.5 sm:gap-2 w-full pb-3">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onBack}
						className="size-7 rounded-md text-slate-900 hover:bg-slate-200/60 cursor-pointer p-0 shrink-0"
						aria-label={t(localizationConstants.goBackButton)}
					>
						<ArrowLeft className="size-5" />
					</Button>
					<h1 className="font-sans font-semibold text-xl sm:text-2xl leading-8 text-slate-900">
						<Translate text={localizationConstants.viewAtaTitle} />
					</h1>
				</div>

				{/* Top 2-Column Section: Info Cards + Detailed Information (Left) and Floating Sidebar (Right) */}
				<div className="w-full flex flex-col lg:flex-row gap-6 items-start pl-0 sm:pl-7">
					{/* Left Column: Beställare, ÄTA Information, and Detaljerad information Tables */}
					<div className="flex-1 min-w-0 w-full flex flex-col gap-6 order-2 lg:order-1">
						<ViewAtaInfoCards
							ordererInfo={ataData.ordererInfo}
							generalInfo={ataData.generalInfo}
							isOrdererExpanded={!!expandedSections[ATA_CONSTANTS.VIEW_SECTIONS.ORDERER]}
							isGeneralExpanded={!!expandedSections[ATA_CONSTANTS.VIEW_SECTIONS.GENERAL_INFO]}
							onToggleOrderer={() => toggleSection(ATA_CONSTANTS.VIEW_SECTIONS.ORDERER)}
							onToggleGeneral={() => toggleSection(ATA_CONSTANTS.VIEW_SECTIONS.GENERAL_INFO)}
						/>

						{/* Detaljerad information (5 Tables + 1 Document Card) matching width with top cards */}
						<ViewAtaDetailedSections
							staffItems={ataData.staffItems}
							materialItems={ataData.materialItems}
							machineItems={ataData.machineItems}
							ueItems={ataData.ueItems}
							supplierAtaItems={ataData.supplierAtaItems}
							attachedDocs={ataData.attachedDocs}
							summary={ataData.summary}
							expandedSections={expandedSections}
							onToggleSection={toggleSection}
							onOpenEditModal={openEditSection}
						/>
					</div>

					{/* Right Column: Floating Sidebar Summary Card */}
					<div className="w-full lg:w-[333px] shrink-0 flex flex-col order-1 lg:order-2">
						<ViewAtaSummarySidebar
							ataNumber={ataData.ataNumber}
							summary={ataData.summary}
							activeBadge={ataData.activeBadge}
							tagBadges={ataData.tagBadges}
							linkedLevAta={ataData.linkedLevAta}
							linkedAtaOptions={ataData.linkedAtaOptions}
							onLinkedAtaChange={handleSelectLinkedAta}
							onApprove={handleApproveConfirm}
							isApproving={isApproving}
						/>
					</div>
				</div>
			</div>

			{/* Sticky Bottom Action Bar matching CreateAtaView */}
			<div className="mt-auto sticky -bottom-4 -mx-3 sm:-mx-6 -mb-4 px-4 sm:px-6 py-3 bg-white border-t border-slate-200 z-30 flex flex-wrap sm:flex-nowrap items-center justify-end gap-2.5 sm:gap-3 shadow-md">
				<Button
					type="button"
					variant="ghost"
					onClick={onBack}
					className="flex-1 sm:flex-none sm:min-w-[120px] h-10 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-slate-900 text-sm font-medium border-0 cursor-pointer shadow-none gap-2 flex items-center justify-center shrink-0"
				>
					<ArrowLeft className="h-4 w-4" />
					<Translate text={localizationConstants.viewAtaBtnBackTo} />
				</Button>

				<Button
					type="button"
					variant="outline"
					onClick={handleCancel || onBack}
					className="flex-1 sm:flex-none sm:min-w-[120px] h-10 px-6 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 text-sm font-medium cursor-pointer shadow-none flex items-center justify-center shrink-0"
				>
					<Translate text={localizationConstants.viewAtaBtnCancel} />
				</Button>

				<Button
					type="button"
					onClick={handleSaveAll}
					disabled={isSaving}
					className="flex-1 sm:flex-none sm:min-w-[140px] h-10 px-5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium gap-2 shadow-none cursor-pointer flex items-center justify-center shrink-0"
				>
					<Save className="h-4 w-4 text-white" />
					<Translate text={localizationConstants.viewAtaBtnSave} />
				</Button>
			</div>

			{/* Modals */}
			<ViewAtaEditLineItemsModal
				isOpen={editModal.isOpen}
				sectionTitle={editModal.title}
				items={editModal.items}
				onItemsChange={(updated) => {
					openEditSection(editModal.sectionKey || "", editModal.title, updated);
				}}
				onSave={() => {
					if (editModal.sectionKey) {
						saveSectionLineItems(editModal.sectionKey, editModal.items);
					}
				}}
				onClose={closeEditSection}
			/>

			<ViewAtaConfirmDialog
				isOpen={confirmDialog.isOpen}
				title={confirmDialog.title}
				description={confirmDialog.description}
				onConfirm={confirmDialog.onConfirm}
				onClose={handleCloseConfirmDialog}
			/>
		</div>
	);
}

export default ViewAtaView;
