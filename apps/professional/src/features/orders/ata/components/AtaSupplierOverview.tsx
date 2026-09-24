"use client";

import React from "react";
import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	ChevronDown,
	MoreVertical,
	Printer,
	FileText,
	Eye,
} from "lucide-react";
import { Search } from "@/components/search/Search";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
import { TablePagination } from "@/components/table/TablePagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { ATA_CONSTANTS } from "../constants/ata.constants";
import { useSupplierAta } from "../hooks/useSupplierAta";
import type {
	AtaItem,
	SupplierGroupSortField,
	SupplierDetailSortField,
} from "../types/ata.types";

export interface AtaSupplierOverviewProps {
	orderId?: string;
	onViewDetail?: (ata: AtaItem) => void;
}

export function AtaSupplierOverview({
	orderId = ATA_CONSTANTS.DEFAULT_ORDER_ID,
	onViewDetail,
}: AtaSupplierOverviewProps) {
	const t = useTranslate();
	const {
		selectedSupplier,
		setSelectedSupplier,
		supplierOptions,
		isLoading,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		groupSortField,
		groupSortOrder,
		handleGroupSort,
		detailSortField,
		detailSortOrder,
		handleDetailSort,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		paginatedGroupRows,
		totalGroupPages,
		paginatedDetailRows,
		totalDetailPages,
		summary,
		handleSelectSupplier,
	} = useSupplierAta(orderId);

	const isAllView = selectedSupplier === ATA_CONSTANTS.ALL_SUPPLIERS_VALUE;

	const handlePrint = () => {
		if (typeof window !== "undefined") {
			window.print();
		}
	};

	const formatAmount = (num: number) => {
		return new Intl.NumberFormat("sv-SE").format(Math.round(num));
	};

	const renderGroupSortIcon = (field: SupplierGroupSortField) => {
		if (groupSortField !== field) {
			return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60 shrink-0 print:hidden ml-1" />;
		}
		return groupSortOrder === "asc" ? (
			<ArrowUp className="h-3.5 w-3.5 text-slate-900 shrink-0 print:hidden ml-1" />
		) : (
			<ArrowDown className="h-3.5 w-3.5 text-slate-900 shrink-0 print:hidden ml-1" />
		);
	};

	const renderDetailSortIcon = (field: SupplierDetailSortField) => {
		if (detailSortField !== field) {
			return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-60 shrink-0 print:hidden ml-1" />;
		}
		return detailSortOrder === "asc" ? (
			<ArrowUp className="h-3.5 w-3.5 text-slate-900 shrink-0 print:hidden ml-1" />
		) : (
			<ArrowDown className="h-3.5 w-3.5 text-slate-900 shrink-0 print:hidden ml-1" />
		);
	};

	const renderStatusBadge = (status: string) => {
		switch (status.toLowerCase()) {
			case "ok":
			case "approved":
				return (
					<Badge variant="success" className="px-2 py-0.5 rounded text-xs font-medium border border-emerald-100 shadow-none">
						<Translate text={localizationConstants.ataStatusOk} />
					</Badge>
				);
			case "redovisad":
				return (
					<Badge variant="info" className="px-2 py-0.5 rounded text-xs font-medium bg-sky-50 text-sky-600 border border-sky-100 shadow-none">
						<Translate text={localizationConstants.ataStatusAccounted} />
					</Badge>
				);
			case "forhandling":
			case "negotiation":
				return (
					<Badge variant="warning" className="px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100 shadow-none">
						<Translate text={localizationConstants.ataStatusNegotiation} />
					</Badge>
				);
			case "ej_granskad":
			case "not_reviewed":
				return (
					<Badge variant="destructive" className="px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-600 border border-rose-100 shadow-none">
						<Translate text={localizationConstants.ataSupplierStatusNotReviewed} />
					</Badge>
				);
			default:
				return (
					<Badge variant="category" className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 shadow-none">
						{status}
					</Badge>
				);
		}
	};

	const renderLinkedBadge = (linked?: string) => {
		if (!linked || linked.toLowerCase() === "nej") {
			return (
				<Badge variant="destructive" className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-600 text-white shadow-2xs hover:bg-rose-600">
					<Translate text={localizationConstants.ataSupplierLinkedNo} />
				</Badge>
			);
		}

		return (
			<Badge variant="default" className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-900 text-white shadow-2xs hover:bg-slate-900">
				{linked}
			</Badge>
		);
	};

	const renderAttestedLabel = (attested: string) => {
		switch (attested) {
			case "ja":
				return <Translate text={localizationConstants.ataAttestedYes} />;
			case "nej":
				return <Translate text={localizationConstants.ataAttestedNo} />;
			case "ej_klart":
			default:
				return <Translate text={localizationConstants.ataAttestedPending} />;
		}
	};

	return (
		<div className="space-y-4 w-full">
			{/* Top Bar: Search + Filter Dropdown + Print Icon */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto flex-1 sm:flex-initial">
					<Search
						value={searchQuery}
						onChange={setSearchQuery}
						placeholder={localizationConstants.search}
						className="h-10 w-full"
						wrapperClassName="w-full sm:w-[240px] md:w-[280px]"
					/>

					{/* Filter Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="h-10 px-3.5 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 shrink-0 shadow-none font-normal text-sm cursor-pointer justify-between sm:justify-center w-full sm:w-auto"
							>
								<span>{t(localizationConstants.filter)}</span>
								<ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="start" className="w-48 bg-white border-slate-200 shadow-md">
							<DropdownMenuItem
								onClick={() => setStatusFilter("all")}
								className={`cursor-pointer text-sm ${statusFilter === "all" ? "font-semibold text-slate-900" : "text-slate-600"}`}
							>
								<Translate text={localizationConstants.ataFilterAll} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setStatusFilter("ok")}
								className={`cursor-pointer text-sm ${statusFilter === "ok" ? "font-semibold text-slate-900" : "text-slate-600"}`}
							>
								<Translate text={localizationConstants.ataStatusOk} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setStatusFilter("redovisad")}
								className={`cursor-pointer text-sm ${statusFilter === "redovisad" ? "font-semibold text-slate-900" : "text-slate-600"}`}
							>
								<Translate text={localizationConstants.ataStatusAccounted} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setStatusFilter("forhandling")}
								className={`cursor-pointer text-sm ${statusFilter === "forhandling" ? "font-semibold text-slate-900" : "text-slate-600"}`}
							>
								<Translate text={localizationConstants.ataStatusNegotiation} />
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => setStatusFilter("ej_granskad")}
								className={`cursor-pointer text-sm ${statusFilter === "ej_granskad" ? "font-semibold text-slate-900" : "text-slate-600"}`}
							>
								<Translate text={localizationConstants.ataSupplierStatusNotReviewed} />
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Print button on Right */}
				<div className="flex items-center justify-end gap-2 self-end sm:self-center shrink-0">
					<Button
						variant="outline"
						size="icon"
						onClick={handlePrint}
						className="h-10 w-10 bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-none cursor-pointer"
						aria-label={t(localizationConstants.ataPrintLabel)}
						title={t(localizationConstants.ataPrintLabel)}
					>
						<Printer className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Supplier Selector & Summary Box Section */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 py-2">
				{/* Left: Vald leverantör/ UE Dropdown using shadcn Label + Select */}
				<div className="flex flex-col gap-1.5 w-full sm:w-auto min-w-[200px]">
					<Label htmlFor="supplier-select" className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900 mb-0">
						<Translate text={localizationConstants.ataSupplierSelectedSupplierLabel} />
					</Label>
					<div className="w-full sm:w-auto">
						<Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
							<SelectTrigger
								id="supplier-select"
								className="h-10 w-full sm:w-56 bg-white border-slate-200 text-sm font-normal text-slate-900 shadow-2xs hover:border-slate-300 focus-visible:ring-1 focus-visible:ring-slate-900 cursor-pointer"
							>
								<SelectValue placeholder={t(localizationConstants.ataSupplierAllSuppliers)} />
							</SelectTrigger>
							<SelectContent className="bg-white border-slate-200 shadow-md">
								<SelectItem value={ATA_CONSTANTS.ALL_SUPPLIERS_VALUE} className="cursor-pointer text-sm">
									{t(localizationConstants.ataSupplierAllSuppliers)}
								</SelectItem>
								{supplierOptions.map((sup) => (
									<SelectItem key={sup.id} value={sup.name} className="cursor-pointer text-sm">
										{sup.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Vertical divider */}
				<div className="hidden sm:block h-14 w-px bg-slate-200 mx-3 self-center" />

				{/* Middle Summary Card matching Figma */}
				<div className="bg-slate-100/90 rounded-lg px-4 py-3 grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-2.5 w-full sm:w-auto min-w-[210px] self-stretch sm:self-center">
					<span className="font-sans font-semibold text-sm leading-none tracking-normal text-slate-900">
						<Translate text={localizationConstants.ataSupplierTotalAta} />
					</span>
					<span className="font-sans font-semibold text-sm leading-none tracking-normal text-slate-600 text-left">
						{formatAmount(summary.totalAta)}
					</span>
					<span className="font-sans font-semibold text-sm leading-none tracking-normal text-slate-900">
						<Translate text={localizationConstants.ataSupplierCountAta} />
					</span>
					<span className="font-sans font-semibold text-sm leading-none tracking-normal text-slate-600 text-left">
						{summary.countAta}
					</span>
				</div>
			</div>

			{/* TABLE SECTION */}
			{isAllView ? (
				/* VIEW 1: Aggregated Table (All Suppliers) */
				<div className="w-full overflow-x-auto relative bg-white">
					<Table className="w-full table-auto border-collapse">
						<TableHeader className="bg-white">
							<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
								<TableHead
									onClick={() => handleGroupSort("supplierName")}
									className="px-4 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap"
								>
									<div className="flex items-center gap-1">
										<span><Translate text={localizationConstants.ataSupplierColCompanyName} /></span>
										{renderGroupSortIcon("supplierName")}
									</div>
								</TableHead>

								<TableHead
									onClick={() => handleGroupSort("totalAmount")}
									className="px-4 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap"
								>
									<div className="flex items-center gap-1">
										<span><Translate text={localizationConstants.ataSupplierColTotal} /></span>
										{renderGroupSortIcon("totalAmount")}
									</div>
								</TableHead>

								<TableHead
									onClick={() => handleGroupSort("totalCount")}
									className="px-4 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap"
								>
									<div className="flex items-center gap-1">
										<span><Translate text={localizationConstants.ataSupplierColCount} /></span>
										{renderGroupSortIcon("totalCount")}
									</div>
								</TableHead>

								<TableHead
									onClick={() => handleGroupSort("approvedCount")}
									className="px-4 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap"
								>
									<div className="flex items-center gap-1">
										<span><Translate text={localizationConstants.ataSupplierColApproved} /></span>
										{renderGroupSortIcon("approvedCount")}
									</div>
								</TableHead>

								<TableHead
									onClick={() => handleGroupSort("inReviewCount")}
									className="px-4 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap"
								>
									<div className="flex items-center gap-1">
										<span><Translate text={localizationConstants.ataSupplierColInReview} /></span>
										{renderGroupSortIcon("inReviewCount")}
									</div>
								</TableHead>

								<TableHead
									onClick={() => handleGroupSort("notApprovedCount")}
									className="px-4 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap"
								>
									<div className="flex items-center gap-1">
										<span><Translate text={localizationConstants.ataSupplierColNotApproved} /></span>
										{renderGroupSortIcon("notApprovedCount")}
									</div>
								</TableHead>

								{/* Action Columns */}
								<TableHead className="w-28 px-4 py-3 text-right" />
								<TableHead className="w-12 px-2 py-3 text-center border-l border-slate-200" />
							</TableRow>
						</TableHeader>

						<TableBody className="[&_tr:last-child]:border-0">
							{isLoading ? (
								Array.from({ length: 6 }).map((_, i) => (
									<TableRow key={`skeleton-group-${i}`} className="border-b border-slate-200">
										<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-28" /></TableCell>
										<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-20" /></TableCell>
										<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-12" /></TableCell>
										<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-12" /></TableCell>
										<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-12" /></TableCell>
										<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-12" /></TableCell>
										<TableCell className="px-4 py-3.5"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
										<TableCell className="w-12 px-2 py-3.5 border-l border-slate-200"><Skeleton className="h-8 w-8 mx-auto" /></TableCell>
									</TableRow>
								))
							) : paginatedGroupRows.length === 0 ? (
								<TableRow>
									<TableCell colSpan={8} className="h-32 text-center text-slate-500 text-sm">
										<Translate text={localizationConstants.noDataFound} />
									</TableCell>
								</TableRow>
							) : (
								paginatedGroupRows.map((group) => (
									<TableRow
										key={group.supplierId}
										className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors text-sm text-slate-900"
									>
										<TableCell className="px-4 py-3.5 font-sans font-semibold text-slate-900 whitespace-nowrap">
											{group.supplierName}
										</TableCell>

										<TableCell className="px-4 py-3.5 font-sans font-normal text-slate-900 whitespace-nowrap">
											{formatAmount(group.totalAmount)}
										</TableCell>

										<TableCell className="px-4 py-3.5 font-sans font-normal text-slate-900 whitespace-nowrap">
											{group.totalCount}
										</TableCell>

										<TableCell className="px-4 py-3.5 font-sans font-normal text-slate-900 whitespace-nowrap">
											{group.approvedCount}
										</TableCell>

										<TableCell className="px-4 py-3.5 font-sans font-normal text-slate-900 whitespace-nowrap">
											{group.inReviewCount}
										</TableCell>

										<TableCell className="px-4 py-3.5 font-sans font-normal text-slate-900 whitespace-nowrap">
											{group.notApprovedCount}
										</TableCell>

										{/* Actions: Visa detaljer button */}
										<TableCell className="px-4 py-3.5 whitespace-nowrap text-right">
											<Button
												type="button"
												variant="ghost"
												onClick={() => handleSelectSupplier(group.supplierName)}
												className="h-8 px-3 rounded bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-medium cursor-pointer shadow-none"
											>
												<Translate text={localizationConstants.ataSupplierViewDetails} />
											</Button>
										</TableCell>

										{/* Three dot menu with vertical line to its left */}
										<TableCell className="w-12 px-2 py-3.5 whitespace-nowrap text-center border-l border-slate-200">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer shadow-none mx-auto"
														aria-label={t(localizationConstants.actions)}
													>
														<MoreVertical className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-48 bg-white border-slate-200 shadow-md">
													<DropdownMenuItem
														onClick={() => handleSelectSupplier(group.supplierName)}
														className="gap-2 cursor-pointer text-slate-700 text-xs"
													>
														<Eye className="h-3.5 w-3.5" />
														<Translate text={localizationConstants.ataSupplierViewDetails} />
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={handlePrint}
														className="gap-2 cursor-pointer text-slate-700 text-xs"
													>
														<FileText className="h-3.5 w-3.5" />
														<Translate text={localizationConstants.ataSupplierDownloadDocs} />
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			) : (
				/* VIEW 2: Detailed Table (Specific Supplier Selected) */
				<div className="w-full overflow-x-auto relative bg-white">
					<Table className="w-full table-auto border-collapse">
						<TableHeader className="bg-white">
							<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
								<TableHead
									onClick={() => handleDetailSort("date")}
									className="px-4 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap"
								>
									<div className="flex items-center gap-1">
										<span><Translate text={localizationConstants.ataColDate} /></span>
										{renderDetailSortIcon("date")}
									</div>
								</TableHead>

								<TableHead
									onClick={() => handleDetailSort("ataNumber")}
									className="px-4 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap"
								>
									<div className="flex items-center gap-1">
										<span><Translate text={localizationConstants.ataColNumber} /></span>
										{renderDetailSortIcon("ataNumber")}
									</div>
								</TableHead>

								<TableHead
									onClick={() => handleDetailSort("linkedLevAta")}
									className="px-4 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap"
								>
									<div className="flex items-center gap-1">
										<span><Translate text={localizationConstants.ataSupplierColLinkedAta} /></span>
										{renderDetailSortIcon("linkedLevAta")}
									</div>
								</TableHead>

								<TableHead
									onClick={() => handleDetailSort("amount")}
									className="px-4 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap"
								>
									<div className="flex items-center gap-1">
										<span><Translate text={localizationConstants.ataColAmount} /></span>
										{renderDetailSortIcon("amount")}
									</div>
								</TableHead>

								<TableHead
									onClick={() => handleDetailSort("status")}
									className="px-4 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap"
								>
									<div className="flex items-center gap-1">
										<span><Translate text={localizationConstants.ataColStatus} /></span>
										{renderDetailSortIcon("status")}
									</div>
								</TableHead>

								<TableHead
									onClick={() => handleDetailSort("attested")}
									className="px-4 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap"
								>
									<div className="flex items-center gap-1">
										<span><Translate text={localizationConstants.ataSupplierColAttested} /></span>
										{renderDetailSortIcon("attested")}
									</div>
								</TableHead>

								<TableHead
									onClick={() => handleDetailSort("attestedDate")}
									className="px-4 py-3 font-sans text-sm font-medium text-slate-500 hover:text-slate-900 cursor-pointer select-none whitespace-nowrap"
								>
									<div className="flex items-center gap-1">
										<span><Translate text={localizationConstants.ataSupplierColAttestDate} /></span>
										{renderDetailSortIcon("attestedDate")}
									</div>
								</TableHead>

								{/* Action Columns */}
								<TableHead className="w-28 px-4 py-3 text-right" />
								<TableHead className="w-12 px-2 py-3 text-center border-l border-slate-200" />
							</TableRow>
						</TableHeader>

						<TableBody className="[&_tr:last-child]:border-0">
							{isLoading ? (
								Array.from({ length: 6 }).map((_, i) => (
									<TableRow key={`skeleton-detail-${i}`} className="border-b border-slate-200">
										<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-20" /></TableCell>
										<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-12" /></TableCell>
										<TableCell className="px-4 py-3.5"><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
										<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-20" /></TableCell>
										<TableCell className="px-4 py-3.5"><Skeleton className="h-5 w-16 rounded" /></TableCell>
										<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-12" /></TableCell>
										<TableCell className="px-4 py-3.5"><Skeleton className="h-4 w-20" /></TableCell>
										<TableCell className="px-4 py-3.5"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
										<TableCell className="w-12 px-2 py-3.5 border-l border-slate-200"><Skeleton className="h-8 w-8 mx-auto" /></TableCell>
									</TableRow>
								))
							) : paginatedDetailRows.length === 0 ? (
								<TableRow>
									<TableCell colSpan={9} className="h-32 text-center text-slate-500 text-sm">
										<Translate text={localizationConstants.noDataFound} />
									</TableCell>
								</TableRow>
							) : (
								paginatedDetailRows.map((item) => (
									<TableRow
										key={item.id}
										className="border-b border-slate-200 hover:bg-slate-50/60 transition-colors text-sm text-slate-900"
									>
										<TableCell className="px-4 py-3.5 font-sans font-normal text-slate-900 whitespace-nowrap">
											{item.date}
										</TableCell>

										<TableCell className="px-4 py-3.5 font-sans font-normal text-slate-900 whitespace-nowrap">
											{item.ataNumber}
										</TableCell>

										<TableCell className="px-4 py-3.5 whitespace-nowrap">
											{renderLinkedBadge(item.linkedLevAta)}
										</TableCell>

										<TableCell className="px-4 py-3.5 font-sans font-normal text-slate-900 whitespace-nowrap">
											{formatAmount(item.amount)}
										</TableCell>

										<TableCell className="px-4 py-3.5 whitespace-nowrap">
											{renderStatusBadge(item.status)}
										</TableCell>

										<TableCell className="px-4 py-3.5 font-sans font-normal text-slate-900 whitespace-nowrap">
											{renderAttestedLabel(item.attested)}
										</TableCell>

										<TableCell className="px-4 py-3.5 font-sans font-normal text-slate-900 whitespace-nowrap">
											{item.attestedDate || item.date}
										</TableCell>

										{/* Actions: Visa detaljer button */}
										<TableCell className="px-4 py-3.5 whitespace-nowrap text-right">
											<Button
												type="button"
												variant="ghost"
												onClick={() => showToast("info", t(localizationConstants.comingSoon))}
												className="h-8 px-3 rounded bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-medium cursor-pointer shadow-none"
											>
												<Translate text={localizationConstants.ataSupplierViewDetails} />
											</Button>
										</TableCell>

										{/* Three dot menu with vertical line to its left */}
										<TableCell className="w-12 px-2 py-3.5 whitespace-nowrap text-center border-l border-slate-200">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer shadow-none mx-auto"
														aria-label={t(localizationConstants.actions)}
													>
														<MoreVertical className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-48 bg-white border-slate-200 shadow-md">
													<DropdownMenuItem
														onClick={() => onViewDetail?.(item)}
														className="gap-2 cursor-pointer text-slate-700 text-xs"
													>
														<Eye className="h-3.5 w-3.5" />
														<Translate text={localizationConstants.ataSupplierViewDetails} />
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={handlePrint}
														className="gap-2 cursor-pointer text-slate-700 text-xs"
													>
														<FileText className="h-3.5 w-3.5" />
														<Translate text={localizationConstants.ataSupplierDownloadDocs} />
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			)}

			{/* Bottom Pagination */}
			<div className="pt-2">
				<TablePagination
					currentPage={currentPage}
					totalPages={isAllView ? totalGroupPages : totalDetailPages}
					pageSize={pageSize}
					onPageChange={setCurrentPage}
					onPageSizeChange={setPageSize}
				/>
			</div>
		</div>
	);
}

export default AtaSupplierOverview;
