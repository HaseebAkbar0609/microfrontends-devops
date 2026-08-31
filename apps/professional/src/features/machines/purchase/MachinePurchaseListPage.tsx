"use client";

import Link from "next/link";
import {
	Plus,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Eye,
	Archive,
	Trash2,
	MoreVertical,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	ChevronDown,
	Search as SearchIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { MACHINE_PURCHASE_BASE_URL } from "@/features/machines/data/machineNav.config";
import { usePurchaseList } from "./hooks/usePurchaseList";
import type { PurchaseSortField } from "./types/purchase.types";
import { showToast } from "@/lib/toast";

const COLUMNS: {
	field: PurchaseSortField;
	labelKey: TranslationKeys;
	sortable?: boolean;
}[] = [
	{
		field: "number",
		labelKey: localizationConstants.machinePurchaseColNumber,
		sortable: true,
	},
	{
		field: "type",
		labelKey: localizationConstants.machinePurchaseColType,
		sortable: true,
	},
	{
		field: "brand",
		labelKey: localizationConstants.machinePurchaseColBrand,
		sortable: true,
	},
	{
		field: "designation",
		labelKey: localizationConstants.machinePurchaseColDesignation,
		sortable: true,
	},
	{
		field: "price",
		labelKey: localizationConstants.machinePurchaseColPrice,
		sortable: true,
	},
	{
		field: "supplier",
		labelKey: localizationConstants.machinePurchaseColSupplier,
		sortable: true,
	},
	{
		field: "address",
		labelKey: localizationConstants.machinePurchaseColAddress,
		sortable: true,
	},
	{
		field: "postalCode",
		labelKey: localizationConstants.machinePurchaseColPostalCode,
		sortable: true,
	},
	{
		field: "city",
		labelKey: localizationConstants.machinePurchaseColCity,
		sortable: true,
	},
	{
		field: "phone",
		labelKey: localizationConstants.machinePurchaseColPhone,
		sortable: true,
	},
	{
		field: "email",
		labelKey: localizationConstants.machinePurchaseColEmail,
		sortable: true,
	},
	{
		field: "file",
		labelKey: localizationConstants.machinePurchaseColFile,
		sortable: true,
	},
];

export function MachinePurchaseListPage() {
	const t = useTranslate();

	const {
		categoryFilter,
		setCategoryFilter,
		paginatedPurchases,
		totalPages,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		searchQuery,
		setSearchQuery,
		sortBy,
		sortOrder,
		handleSort,
		deletePurchase,
		archivePurchase,
	} = usePurchaseList();

	const renderSortIcon = (field: PurchaseSortField) => {
		if (sortBy !== field) {
			return <ArrowUpDown className="h-3.5 w-3.5 text-[#94A3B8]" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="h-3.5 w-3.5 text-[#0F172A]" />
		) : (
			<ArrowDown className="h-3.5 w-3.5 text-[#0F172A]" />
		);
	};

	return (
		<div className="flex flex-col min-h-screen bg-white">
			{/* Top Header with border line */}
			<div className="border-b border-slate-200 px-8 py-5">
				<h1 className="text-2xl font-bold text-slate-900 tracking-tight">
					<Translate text={localizationConstants.machinePurchaseTitle} />
				</h1>
				<nav
					className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5"
					aria-label="Breadcrumb"
				>
					<Link
						href="/dashboard"
						className="hover:text-slate-900 transition-colors"
					>
						<Translate text={localizationConstants.home} />
					</Link>
					<span>&gt;</span>
					<Link
						href="/module"
						className="hover:text-slate-900 transition-colors"
					>
						<Translate text={localizationConstants.moduleLabel} />
					</Link>
					<span>&gt;</span>
					<Link
						href="/module/production/machine"
						className="hover:text-slate-900 transition-colors"
					>
						<Translate text={localizationConstants.machine} />
					</Link>
					<span>&gt;</span>
					<span className="font-semibold text-slate-900">
						<Translate text={localizationConstants.machinePurchaseBreadcrumb} />
					</span>
				</nav>
			</div>

			<div className="px-8 py-6 space-y-5 max-w-[1600px] w-full">
				{/* Top Category Filter Section */}
				<div className="w-60 space-y-1.5">
					<label className="text-xs font-semibold text-slate-900">
						<Translate text={localizationConstants.machinePurchaseCategoryLabel} />
					</label>
					<Select
						value={categoryFilter}
						onValueChange={(val) => {
							setCategoryFilter(val);
							setCurrentPage(1);
						}}
					>
						<SelectTrigger className="h-10 text-sm font-medium rounded-lg border-slate-200 bg-white shadow-2xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="handmaskin">
								<Translate text={localizationConstants.machinePurchaseCategoryHand} />
							</SelectItem>
							<SelectItem value="tunga_maskiner">
								<Translate text={localizationConstants.machinePurchaseCategoryHeavy} />
							</SelectItem>
							<SelectItem value="fordon">
								<Translate text={localizationConstants.machinePurchaseCategoryVehicle} />
							</SelectItem>
							<SelectItem value="ovrigt">
								<Translate text={localizationConstants.machinePurchaseCategoryOther} />
							</SelectItem>
							<SelectItem value="all">
								<Translate text={localizationConstants.machinePurchaseCategoryAll} />
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Table Control Bar */}
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
					<div className="flex items-center gap-3 flex-1 max-w-md">
						{/* Search Input */}
						<div className="relative flex-1">
							<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setCurrentPage(1);
								}}
								placeholder={t(localizationConstants.search) || "Sök"}
								className="w-full h-10 pl-9 pr-4 text-sm rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-slate-400 shadow-2xs"
							/>
						</div>

						{/* Filter Dropdown Button with ChevronDown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="h-10 px-4 gap-2 rounded-lg border-slate-200 text-slate-900 bg-white hover:bg-slate-50 shadow-2xs font-medium text-sm cursor-pointer"
								>
									<Translate text={localizationConstants.filter} />
									<ChevronDown className="h-4 w-4 text-slate-500" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-48 p-1 bg-white border border-slate-200 shadow-md rounded-lg">
								<DropdownMenuItem onClick={() => setCategoryFilter("all")} className="text-xs cursor-pointer">
									<Translate text={localizationConstants.machinePurchaseCategoryAll} />
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setCategoryFilter("handmaskin")} className="text-xs cursor-pointer">
									<Translate text={localizationConstants.machinePurchaseCategoryHand} />
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setCategoryFilter("tunga_maskiner")} className="text-xs cursor-pointer">
									<Translate text={localizationConstants.machinePurchaseCategoryHeavy} />
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div className="flex items-center gap-2">
						<Button
							type="button"
							className="h-10 px-5 gap-2 rounded-lg bg-[#111721] text-white hover:bg-slate-800 text-sm font-medium shadow-2xs cursor-pointer"
						>
							<Plus className="h-4 w-4" />
							<span>
								<Translate text={localizationConstants.machinePurchaseNewButton} />
							</span>
						</Button>
					</div>
				</div>

				{/* Table Container - Clean layout directly on canvas matching Figma */}
				<div className="w-full overflow-x-auto">
					<Table className="w-full min-w-[1280px] border-collapse">
						<TableHeader>
							<TableRow className="border-b border-slate-200 bg-transparent hover:bg-transparent">
								{COLUMNS.map((col) => (
									<TableHead
										key={col.field}
										onClick={() => col.sortable && handleSort(col.field)}
										className="py-3.5 px-4 text-[13px] font-semibold text-[#64748B] select-none whitespace-nowrap cursor-pointer hover:text-[#0F172A] transition-colors"
									>
										<div className="flex items-center gap-1.5">
											<Translate text={col.labelKey} />
											{col.sortable && renderSortIcon(col.field)}
										</div>
									</TableHead>
								))}
								{/* Eye Column Header */}
								<TableHead className="w-[48px] min-w-[48px] py-3.5 px-2 text-center" />
								{/* 3-dots Column Header with plus icon for column customization */}
								<TableHead className="w-[48px] min-w-[48px] sticky right-0 bg-white py-3.5 px-2 text-center text-[#94A3B8]">
									<Plus className="h-4 w-4 mx-auto cursor-pointer hover:text-[#0F172A]" />
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedPurchases.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={COLUMNS.length + 2}
										className="py-16 text-center text-sm text-slate-500"
									>
										<Translate text={localizationConstants.noDataFound} />
									</TableCell>
								</TableRow>
							) : (
								paginatedPurchases.map((item) => (
									<TableRow
										key={item.id}
										className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC]/90 transition-colors group h-[56px]"
									>
										{/* Nummer: 01, 02... */}
										<TableCell className="px-4 py-3.5 text-[13px] font-normal text-[#64748B] whitespace-nowrap">
											{item.number}
										</TableCell>
										{/* Typ: Bormaskin */}
										<TableCell className="px-4 py-3.5 text-[13px] font-normal text-[#1E293B] whitespace-nowrap">
											{item.type}
										</TableCell>
										{/* Fabrikat: Hilti */}
										<TableCell className="px-4 py-3.5 text-[13px] font-medium text-[#1E293B] whitespace-nowrap">
											{item.brand}
										</TableCell>
										{/* Beteckning: H367829 */}
										<TableCell className="px-4 py-3.5 text-[13px] font-bold text-[#0F172A] whitespace-nowrap">
											{item.designation}
										</TableCell>
										{/* Pris: 4500 */}
										<TableCell className="px-4 py-3.5 text-[13px] font-bold text-[#0F172A] whitespace-nowrap">
											{item.price.toLocaleString("sv-SE")}
										</TableCell>
										{/* Leverantör: Hilti */}
										<TableCell className="px-4 py-3.5 text-[13px] font-medium text-[#1E293B] whitespace-nowrap">
											{item.supplier}
										</TableCell>
										{/* Address: Frejgatan (bold) */}
										<TableCell className="px-4 py-3.5 text-[13px] font-bold text-[#0F172A] whitespace-nowrap">
											{item.address}
										</TableCell>
										{/* Post nr: 11345 */}
										<TableCell className="px-4 py-3.5 text-[13px] font-medium text-[#1E293B] whitespace-nowrap">
											{item.postalCode}
										</TableCell>
										{/* Ort: Stockholm */}
										<TableCell className="px-4 py-3.5 text-[13px] font-medium text-[#1E293B] whitespace-nowrap">
											{item.city}
										</TableCell>
										{/* Telefon: 0855050 */}
										<TableCell className="px-4 py-3.5 text-[13px] font-medium text-[#1E293B] whitespace-nowrap">
											{item.phone}
										</TableCell>
										{/* Mail: info@hilti.com */}
										<TableCell className="px-4 py-3.5 text-[13px] font-medium text-[#1E293B] whitespace-nowrap">
											{item.email}
										</TableCell>
										{/* Fil: PDF Badge + filename.pdf */}
										<TableCell className="px-4 py-3.5 whitespace-nowrap">
											<div className="flex items-center gap-2.5">
												<PdfFileIcon className="h-7 w-[22px]" />
												<span className="text-[13px] font-normal text-[#334155]">
													{item.file}
												</span>
											</div>
										</TableCell>

										{/* Eye Action Column */}
										<TableCell className="px-2 py-3.5 text-center whitespace-nowrap">
											<Button
												asChild
												variant="ghost"
												size="icon"
												className="h-8 w-8 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-md cursor-pointer"
											>
												<Link
													href={`${MACHINE_PURCHASE_BASE_URL}/${encodeURIComponent(item.id)}`}
												>
													<Eye className="h-4 w-4" />
												</Link>
											</Button>
										</TableCell>

										{/* 3-dots Menu Column */}
										<TableCell className="px-2 py-3.5 text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] transition-colors whitespace-nowrap">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="icon"
														className="h-8 w-8 text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 rounded-md cursor-pointer"
													>
														<MoreVertical className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="end"
													className="w-36 border border-slate-200 bg-white shadow-lg rounded-lg p-1.5"
												>
													<DropdownMenuItem
														onClick={() => {
															archivePurchase(item.id);
															showToast(
																"success",
																t(localizationConstants.machinePurchaseArchiveSuccess)
															);
														}}
														className="flex items-center gap-2.5 cursor-pointer text-slate-700 hover:bg-slate-50 rounded-md px-2.5 py-1.5 text-xs font-medium"
													>
														<Archive className="h-4 w-4 text-slate-500" />
														<span>
															<Translate text={localizationConstants.machinePurchaseActionArchive} />
														</span>
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => {
															deletePurchase(item.id);
															showToast(
																"success",
																t(localizationConstants.machinePurchaseDeleteSuccess)
															);
														}}
														className="flex items-center gap-2.5 cursor-pointer text-red-600 hover:bg-red-50 rounded-md px-2.5 py-1.5 text-xs font-medium"
													>
														<Trash2 className="h-4 w-4" />
														<span>
															<Translate text={localizationConstants.machinePurchaseActionDelete} />
														</span>
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

				{/* Pagination Footer */}
				<div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 pb-6 border-t border-slate-200 bg-white text-xs text-slate-600">
					<div className="flex items-center gap-2">
						<span className="text-slate-500">
							<Translate text={localizationConstants.machinePurchaseRowsPerPage} />
						</span>
						<Select
							value={String(pageSize)}
							onValueChange={(val) => {
								setPageSize(Number(val));
								setCurrentPage(1);
							}}
						>
							<SelectTrigger className="h-8 w-16 text-xs rounded-md border-slate-200">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="25">25</SelectItem>
								<SelectItem value="50">50</SelectItem>
								<SelectItem value="100">100</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center gap-4">
						<span className="text-slate-500">
							Page {currentPage}{" "}
							<Translate text={localizationConstants.machinePurchasePageOf} />{" "}
							{totalPages}
						</span>

						<div className="flex items-center gap-1">
							<Button
								variant="ghost"
								size="icon"
								disabled={currentPage <= 1}
								onClick={() => setCurrentPage(1)}
								className="h-8 w-8 rounded-md text-slate-600 disabled:opacity-30 cursor-pointer"
							>
								<ChevronsLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								disabled={currentPage <= 1}
								onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
								className="h-8 w-8 rounded-md text-slate-600 disabled:opacity-30 cursor-pointer"
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								disabled={currentPage >= totalPages}
								onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
								className="h-8 w-8 rounded-md text-slate-600 disabled:opacity-30 cursor-pointer"
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								disabled={currentPage >= totalPages}
								onClick={() => setCurrentPage(totalPages)}
								className="h-8 w-8 rounded-md text-slate-600 disabled:opacity-30 cursor-pointer"
							>
								<ChevronsRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
