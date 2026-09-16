"use client";

import React, { useState, useMemo } from "react";
import {
	ChevronUp,
	CircleUser,
	Container,
	Wrench,
	Workflow,
	WalletCards,
	FileText,
	CircleFadingPlus,
	Sigma,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { DocFileIcon } from "@/components/ui/DocFileIcon";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import { ATA_CONSTANTS } from "../../constants/ata.constants";
import type { DetailedLineItem, AttachedDocument, CreateAtaSummary } from "../../types/ata.types";
import { formatAtaCurrency, formatAtaCount } from "../../utils/ata.utils";

export interface ViewAtaDetailedSectionsProps {
	staffItems: DetailedLineItem[];
	materialItems: DetailedLineItem[];
	machineItems: DetailedLineItem[];
	ueItems: DetailedLineItem[];
	supplierAtaItems: DetailedLineItem[];
	attachedDocs: AttachedDocument[];
	summary: CreateAtaSummary;
	expandedSections: Record<string, boolean>;
	onToggleSection: (key: string) => void;
	onOpenEditModal: (sectionKey: string, title: string, items: DetailedLineItem[]) => void;
}

interface LineItemsTableSectionProps {
	titleKey: (typeof localizationConstants)[keyof typeof localizationConstants];
	icon: React.ReactNode;
	sectionKey: string;
	secondColHeaderKey: "createAtaColPerson" | "createAtaColSupplier";
	sixthColHeaderKey: "createAtaColQuantity" | "createAtaColInvoice";
	items: DetailedLineItem[];
	totalLabelKey: (typeof localizationConstants)[keyof typeof localizationConstants];
	totalValue: string | number;
	secondaryTotalLabelKey?: (typeof localizationConstants)[keyof typeof localizationConstants];
	secondaryTotalValue?: string | number;
	isExpanded: boolean;
	onToggleExpand: () => void;
	onOpenEditModal: (sectionKey: string, title: string, items: DetailedLineItem[]) => void;
}

function LineItemsTableSection({
	titleKey,
	icon,
	sectionKey,
	secondColHeaderKey,
	sixthColHeaderKey,
	items,
	totalLabelKey,
	totalValue,
	secondaryTotalLabelKey,
	secondaryTotalValue,
	isExpanded,
	onToggleExpand,
	onOpenEditModal,
}: LineItemsTableSectionProps) {
	const t = useTranslate();
	const [sortField, setSortField] = useState<keyof DetailedLineItem | null>(null);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	const handleSort = (field: keyof DetailedLineItem) => {
		if (sortField === field) {
			setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setSortField(field);
			setSortOrder("asc");
		}
	};

	const sortedItems = useMemo(() => {
		if (!sortField) return items;
		return [...items].sort((a, b) => {
			const valA = a[sortField];
			const valB = b[sortField];
			if (valA === undefined || valA === null) return 1;
			if (valB === undefined || valB === null) return -1;
			if (typeof valA === "number" && typeof valB === "number") {
				return sortOrder === "asc" ? valA - valB : valB - valA;
			}
			const comp = String(valA).localeCompare(String(valB), "sv");
			return sortOrder === "asc" ? comp : -comp;
		});
	}, [items, sortField, sortOrder]);

	const renderSortIcon = (field: keyof DetailedLineItem) => {
		if (sortField !== field) {
			return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60 ml-1 shrink-0" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="h-3.5 w-3.5 text-slate-900 ml-1 shrink-0" />
		) : (
			<ArrowDown className="h-3.5 w-3.5 text-slate-900 ml-1 shrink-0" />
		);
	};

	return (
		<Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs w-full flex flex-col gap-0 pb-0">
			{/* Accordion Header */}
			<Button
				type="button"
				variant="ghost"
				onClick={onToggleExpand}
				className="flex h-14 min-h-14 w-full cursor-pointer items-center justify-between px-6 sm:px-8 py-0 text-left transition-colors hover:bg-slate-50 font-normal rounded-none shadow-none focus:outline-none"
				aria-expanded={isExpanded}
			>
				<div className="flex items-center gap-2.5 min-w-0">
					{icon}
					<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900 truncate">
						<Translate text={titleKey} />
					</span>
				</div>
				<ChevronUp
					size={18}
					className={cn(
						"text-zinc-500 transition-transform duration-200 shrink-0",
						!isExpanded && "rotate-180"
					)}
					aria-hidden={true}
				/>
			</Button>

			{/* Accordion Content */}
			{isExpanded && (
				<div className="p-4 flex flex-col gap-4 border-t border-slate-200">
					<div className="w-full overflow-x-auto">
						<Table className="w-full table-auto border-collapse">
							<TableHeader className="bg-white">
								<TableRow className="h-14 border-b border-slate-200 bg-white hover:bg-white">
									<TableHead
										onClick={() => handleSort("date")}
										className="h-14 px-3 py-0 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap align-middle"
									>
										<div className="flex items-center gap-1">
											<span>
												<Translate text={localizationConstants.createAtaColDate} />
											</span>
											{renderSortIcon("date")}
										</div>
									</TableHead>
									<TableHead
										onClick={() => handleSort("personOrSupplier")}
										className="h-14 px-3 py-0 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap align-middle"
									>
										<div className="flex items-center gap-1">
											<span>
												<Translate text={localizationConstants[secondColHeaderKey]} />
											</span>
											{renderSortIcon("personOrSupplier")}
										</div>
									</TableHead>
									<TableHead
										onClick={() => handleSort("team")}
										className="h-14 px-3 py-0 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap align-middle"
									>
										<div className="flex items-center gap-1">
											<span><Translate text={localizationConstants.createAtaColTeam} /></span>
											{renderSortIcon("team")}
										</div>
									</TableHead>
									<TableHead className="h-14 px-3 py-0 font-sans text-sm font-medium text-slate-500 whitespace-nowrap align-middle">
										<Translate text={localizationConstants.createAtaColDescription} />
									</TableHead>
									<TableHead
										onClick={() => handleSort("amount")}
										className="h-14 px-3 py-0 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap text-right align-middle"
									>
										<div className="flex items-center justify-end gap-1">
											<span><Translate text={localizationConstants.createAtaColAmount} /></span>
											{renderSortIcon("amount")}
										</div>
									</TableHead>
									<TableHead className="h-14 px-3 py-0 font-sans text-sm font-medium text-slate-500 whitespace-nowrap align-middle">
										<Translate text={localizationConstants[sixthColHeaderKey]} />
									</TableHead>
									<TableHead className="h-14 px-3 py-0 font-sans text-sm font-medium text-slate-500 whitespace-nowrap align-middle">
										<Translate text={localizationConstants.createAtaColUnit} />
									</TableHead>
									<TableHead className="h-14 px-3 py-0 font-sans text-sm font-medium text-slate-500 whitespace-nowrap align-middle">
										<Translate text={localizationConstants.createAtaColNetPrice} />
									</TableHead>
									<TableHead className="h-14 px-3 py-0 font-sans text-sm font-medium text-slate-500 whitespace-nowrap align-middle">
										<Translate text={localizationConstants.createAtaColNetSum} />
									</TableHead>
									<TableHead className="h-14 px-3 py-0 font-sans text-sm font-medium text-slate-500 whitespace-nowrap align-middle">
										<Translate text={localizationConstants.createAtaColPercentage} />
									</TableHead>
									<TableHead className="h-14 px-3 py-0 font-sans text-sm font-medium text-slate-500 whitespace-nowrap align-middle">
										<Translate text={localizationConstants.viewAtaColPricePerUnit} />
									</TableHead>
									<TableHead className="h-14 px-3 py-0 font-sans text-sm font-medium text-slate-500 whitespace-nowrap align-middle">
										<Translate text={localizationConstants.createAtaColN2} />
									</TableHead>
									<TableHead className="h-14 px-3 py-0 font-sans text-sm font-medium text-slate-500 whitespace-nowrap align-middle">
										<Translate text={localizationConstants.createAtaColActivity} />
									</TableHead>
									<TableHead className="h-14 px-3 py-0 font-sans text-sm font-medium text-slate-500 whitespace-nowrap align-middle">
										<Translate text={localizationConstants.createAtaColPosition} />
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-slate-200">
								{sortedItems.length === 0 ? (
									<TableRow className="border-b border-slate-200">
										<TableCell colSpan={14} className="h-20 text-center font-sans text-sm text-slate-400">
											<Translate text={localizationConstants.noDataFound} />
										</TableCell>
									</TableRow>
								) : (
									sortedItems.map((item) => (
										<TableRow
											key={item.id}
											className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors text-sm text-slate-900"
										>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.date}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm font-normal text-slate-900">
												{item.personOrSupplier}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.team}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.description || "-"}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap text-right font-sans text-sm text-slate-900">
												{formatAtaCurrency(item.amount)}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.quantityOrInvoice || "-"}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.unit || "-"}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.netPrice || "-"}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.netSum || "-"}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.percentage || "-"}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.contracted || "-"}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.n2 || "-"}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.activity || "-"}
											</TableCell>
											<TableCell className="px-3 py-2.5 whitespace-nowrap font-sans text-sm text-slate-900">
												{item.position || "-"}
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>

					{/* Section Footer Bar: Gray Sigma Box on Left, Black Button on Right */}
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
						<div
							className={cn(
								"w-[296px] flex flex-col justify-center gap-[4px] bg-slate-200 rounded-[8px] px-[12px] shrink-0",
								secondaryTotalLabelKey ? "h-[76px] py-[8px]" : "h-[44px] py-[6px]"
							)}
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 min-w-0 flex-1">
									<Sigma className="w-[20px] h-[20px] text-slate-700 shrink-0" strokeWidth={2} />
									<span className="font-sans font-medium text-base leading-6 text-slate-900 tracking-normal truncate">
										<Translate text={totalLabelKey} />
									</span>
								</div>
								<span className="w-[95px] text-left font-sans font-semibold text-lg leading-7 tracking-normal text-slate-900 shrink-0">
									{typeof totalValue === "number" ? formatAtaCurrency(totalValue) : totalValue}
								</span>
							</div>
							{secondaryTotalLabelKey && secondaryTotalValue !== undefined && (
								<>
									<div className="border-t border-slate-300/80 w-full" />
									<div className="flex items-center justify-between">
										<span className="font-sans font-medium text-sm leading-6 tracking-normal text-slate-500 pl-7 truncate flex-1 min-w-0">
											<Translate text={secondaryTotalLabelKey} />
										</span>
										<span className="w-[95px] text-left font-sans font-medium text-sm leading-6 tracking-normal text-slate-500 shrink-0">
											{typeof secondaryTotalValue === "number"
												? formatAtaCurrency(secondaryTotalValue)
												: secondaryTotalValue}
										</span>
									</div>
								</>
							)}
						</div>

						{/* Right: Black Action Button */}
						<Button
							type="button"
							onClick={() => onOpenEditModal(sectionKey, t(titleKey), items)}
							className="h-8.5 px-4 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium gap-1.5 shadow-none cursor-pointer self-end sm:self-center"
						>
							<CircleFadingPlus className="h-4 w-4 text-white" />
							<span><Translate text={localizationConstants.createAtaBtnChange} /></span>
						</Button>
					</div>
				</div>
			)}
		</Card>
	);
}

export function ViewAtaDetailedSections({
	staffItems,
	materialItems,
	machineItems,
	ueItems,
	supplierAtaItems,
	attachedDocs,
	summary,
	expandedSections,
	onToggleSection,
	onOpenEditModal,
}: ViewAtaDetailedSectionsProps) {
	const t = useTranslate();
	const [docSortField, setDocSortField] = useState<keyof AttachedDocument | null>(null);
	const [docSortOrder, setDocSortOrder] = useState<"asc" | "desc">("asc");

	const handleDocSort = (field: keyof AttachedDocument) => {
		if (docSortField === field) {
			setDocSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
		} else {
			setDocSortField(field);
			setDocSortOrder("asc");
		}
	};

	const sortedDocs = useMemo(() => {
		if (!docSortField) return attachedDocs;
		return [...attachedDocs].sort((a, b) => {
			const valA = a[docSortField] || "";
			const valB = b[docSortField] || "";
			const comp = String(valA).localeCompare(String(valB), "sv");
			return docSortOrder === "asc" ? comp : -comp;
		});
	}, [attachedDocs, docSortField, docSortOrder]);

	const renderDocSortIcon = (field: keyof AttachedDocument) => {
		if (docSortField !== field) {
			return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60 ml-1 shrink-0" />;
		}
		return docSortOrder === "asc" ? (
			<ArrowUp className="h-3.5 w-3.5 text-slate-900 ml-1 shrink-0" />
		) : (
			<ArrowDown className="h-3.5 w-3.5 text-slate-900 ml-1 shrink-0" />
		);
	};

	const handleViewDoc = (doc: AttachedDocument) => {
		if (doc.fileUrl || doc.url) {
			window.open(doc.fileUrl || doc.url, "_blank");
		} else {
			showToast("info", `${doc.fileName} (${doc.fileSize || "PDF"})`);
		}
	};

	const renderDocIcon = (fileType: string) => {
		if (fileType === "pdf") {
			return <PdfFileIcon className="h-11 w-9 shrink-0" />;
		}
		return <DocFileIcon className="h-11 w-9 shrink-0" />;
	};

	return (
		<div className="flex flex-col gap-4 mt-2 w-full">
			<h2 className="font-sans text-lg sm:text-xl font-semibold text-slate-900">
				<Translate text={localizationConstants.createAtaDetailedInfo} />
			</h2>

			{/* 1. Egen personal */}
			<LineItemsTableSection
				titleKey={localizationConstants.createAtaOwnStaff}
				icon={<CircleUser className="size-6 text-slate-700 shrink-0" />}
				sectionKey={ATA_CONSTANTS.VIEW_SECTIONS.STAFF}
				secondColHeaderKey="createAtaColPerson"
				sixthColHeaderKey="createAtaColQuantity"
				items={staffItems}
				totalLabelKey={localizationConstants.viewAtaTotalStaff}
				totalValue={formatAtaCount(summary.ownStaffCount)}
				isExpanded={!!expandedSections[ATA_CONSTANTS.VIEW_SECTIONS.STAFF]}
				onToggleExpand={() => onToggleSection(ATA_CONSTANTS.VIEW_SECTIONS.STAFF)}
				onOpenEditModal={onOpenEditModal}
			/>

			{/* 2. Material */}
			<LineItemsTableSection
				titleKey={localizationConstants.viewAtaTotalMaterial}
				icon={<Container className="size-6 text-slate-700 shrink-0" />}
				sectionKey={ATA_CONSTANTS.VIEW_SECTIONS.MATERIAL}
				secondColHeaderKey="createAtaColSupplier"
				sixthColHeaderKey="createAtaColInvoice"
				items={materialItems}
				totalLabelKey={localizationConstants.viewAtaTotalMaterial}
				totalValue={summary.totalMaterial}
				secondaryTotalLabelKey={localizationConstants.viewAtaProfitFee}
				secondaryTotalValue={summary.totalMaterial * (1 + ATA_CONSTANTS.VAT_RATE)}
				isExpanded={!!expandedSections[ATA_CONSTANTS.VIEW_SECTIONS.MATERIAL]}
				onToggleExpand={() => onToggleSection(ATA_CONSTANTS.VIEW_SECTIONS.MATERIAL)}
				onOpenEditModal={onOpenEditModal}
			/>

			{/* 3. Maskiner */}
			<LineItemsTableSection
				titleKey={localizationConstants.viewAtaTotalMachines}
				icon={<Wrench className="size-6 text-slate-700 shrink-0" />}
				sectionKey={ATA_CONSTANTS.VIEW_SECTIONS.MACHINES}
				secondColHeaderKey="createAtaColSupplier"
				sixthColHeaderKey="createAtaColInvoice"
				items={machineItems}
				totalLabelKey={localizationConstants.viewAtaTotalMachines}
				totalValue={summary.totalMachines}
				secondaryTotalLabelKey={localizationConstants.viewAtaProfitFee}
				secondaryTotalValue={summary.totalMachines * (1 + ATA_CONSTANTS.VAT_RATE)}
				isExpanded={!!expandedSections[ATA_CONSTANTS.VIEW_SECTIONS.MACHINES]}
				onToggleExpand={() => onToggleSection(ATA_CONSTANTS.VIEW_SECTIONS.MACHINES)}
				onOpenEditModal={onOpenEditModal}
			/>

			{/* 4. UE */}
			<LineItemsTableSection
				titleKey={localizationConstants.viewAtaTotalUe}
				icon={<Workflow className="size-6 text-slate-700 shrink-0" />}
				sectionKey={ATA_CONSTANTS.VIEW_SECTIONS.UE}
				secondColHeaderKey="createAtaColSupplier"
				sixthColHeaderKey="createAtaColInvoice"
				items={ueItems}
				totalLabelKey={localizationConstants.viewAtaTotalUe}
				totalValue={summary.totalUe}
				secondaryTotalLabelKey={localizationConstants.viewAtaProfitFee}
				secondaryTotalValue={summary.totalUe * (1 + ATA_CONSTANTS.VAT_RATE)}
				isExpanded={!!expandedSections[ATA_CONSTANTS.VIEW_SECTIONS.UE]}
				onToggleExpand={() => onToggleSection(ATA_CONSTANTS.VIEW_SECTIONS.UE)}
				onOpenEditModal={onOpenEditModal}
			/>

			{/* 5. ÄTA leverantör */}
			<LineItemsTableSection
				titleKey={localizationConstants.viewAtaTotalSupplierAta}
				icon={<WalletCards className="size-6 text-slate-700 shrink-0" />}
				sectionKey={ATA_CONSTANTS.VIEW_SECTIONS.SUPPLIER_ATA}
				secondColHeaderKey="createAtaColSupplier"
				sixthColHeaderKey="createAtaColInvoice"
				items={supplierAtaItems}
				totalLabelKey={localizationConstants.viewAtaTotalSupplierAta}
				totalValue={summary.totalAtaSupplier}
				secondaryTotalLabelKey={localizationConstants.viewAtaProfitFee}
				secondaryTotalValue={summary.totalAtaSupplier * (1 + ATA_CONSTANTS.VAT_RATE)}
				isExpanded={!!expandedSections[ATA_CONSTANTS.VIEW_SECTIONS.SUPPLIER_ATA]}
				onToggleExpand={() => onToggleSection(ATA_CONSTANTS.VIEW_SECTIONS.SUPPLIER_ATA)}
				onOpenEditModal={onOpenEditModal}
			/>

			{/* 6. Dokument */}
			<Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs w-full flex flex-col gap-0 pb-0">
				<Button
					type="button"
					variant="ghost"
					onClick={() => onToggleSection(ATA_CONSTANTS.VIEW_SECTIONS.DOCUMENTS)}
					className="flex h-14 min-h-14 w-full cursor-pointer items-center justify-between px-6 sm:px-8 py-0 text-left transition-colors hover:bg-slate-50 font-normal rounded-none shadow-none focus:outline-none"
					aria-expanded={!!expandedSections[ATA_CONSTANTS.VIEW_SECTIONS.DOCUMENTS]}
				>
					<div className="flex items-center gap-2.5 min-w-0">
						<FileText className="size-6 text-slate-700 shrink-0" />
						<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900 truncate">
							<Translate text={localizationConstants.createAtaDocuments} />
						</span>
					</div>
					<ChevronUp
						size={18}
						className={cn(
							"text-zinc-500 transition-transform duration-200 shrink-0",
							!expandedSections[ATA_CONSTANTS.VIEW_SECTIONS.DOCUMENTS] && "rotate-180"
						)}
					/>
				</Button>

				{expandedSections[ATA_CONSTANTS.VIEW_SECTIONS.DOCUMENTS] && (
					<div className="p-4 flex flex-col gap-4 border-t border-slate-200">
						<div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
							<div className="flex h-9 items-center bg-slate-200 px-4 border-b border-slate-200">
								<h3 className="text-sm font-semibold text-slate-900">
									<Translate text={localizationConstants.viewAtaAttachedInvoicesDocs} />
								</h3>
							</div>
							<Table className="w-full table-auto border-collapse">
								<TableHeader className="bg-white">
									<TableRow className="h-14 border-b border-slate-200 bg-white hover:bg-white">
										<TableHead
											onClick={() => handleDocSort("date")}
											className="h-14 px-4 py-0 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap w-36 align-middle"
										>
											<div className="flex items-center gap-1">
												<span>
													<Translate text={localizationConstants.createAtaColDate} />
												</span>
												{renderDocSortIcon("date")}
											</div>
										</TableHead>
										<TableHead
											onClick={() => handleDocSort("referenceNumber")}
											className="h-14 px-4 py-0 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap align-middle"
										>
											<div className="flex items-center gap-1">
												<span>
													<Translate text={localizationConstants.viewAtaDocName} />
												</span>
												{renderDocSortIcon("referenceNumber")}
											</div>
										</TableHead>
										<TableHead
											onClick={() => handleDocSort("fileName")}
											className="h-14 px-4 py-0 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap align-middle"
										>
											<div className="flex items-center gap-1">
												<span>
													<Translate text={localizationConstants.viewAtaDocFile} />
												</span>
												{renderDocSortIcon("fileName")}
											</div>
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody className="[&_tr:last-child]:border-b [&_tr:last-child]:border-slate-200">
									{sortedDocs.length === 0 ? (
										<TableRow className="border-b border-slate-200">
											<TableCell colSpan={3} className="h-16 text-center font-sans text-sm text-slate-400">
												<Translate text={localizationConstants.viewAtaNoDocuments} />
											</TableCell>
										</TableRow>
									) : (
										sortedDocs.map((doc) => (
											<TableRow
												key={doc.id}
												className="border-b border-slate-200 hover:bg-slate-50/50 transition-colors font-sans text-sm text-slate-900"
											>
												<TableCell className="px-4 py-3 whitespace-nowrap font-sans text-sm text-slate-900">
													{doc.date}
												</TableCell>
												<TableCell className="px-4 py-3 whitespace-nowrap font-sans text-sm font-normal text-slate-900">
													<Input
														type="text"
														defaultValue={doc.referenceNumber}
														aria-label={t(localizationConstants.viewAtaDocName)}
														className="h-8 px-2.5 border border-slate-200 rounded font-sans text-sm text-slate-900 bg-transparent focus:bg-white shadow-none max-w-xs"
													/>
												</TableCell>
												<TableCell className="px-4 py-3 whitespace-nowrap font-sans text-sm text-slate-900">
													<div className="flex items-center justify-between gap-4 max-w-md">
														<div className="flex items-center gap-2">
															{renderDocIcon(doc.fileType)}
															<span className="text-slate-900 font-sans text-sm font-normal">
																{doc.fileName}
															</span>
														</div>
														<Button
															type="button"
															variant="outline"
															size="sm"
															onClick={() => handleViewDoc(doc)}
															className="h-8 px-4 text-xs rounded-md border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-medium cursor-pointer shadow-none shrink-0"
														>
															<Translate text={localizationConstants.viewAtaBtnViewDoc} />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
					</div>
				)}
			</Card>
		</div>
	);
}

export default ViewAtaDetailedSections;
