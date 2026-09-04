"use client";

import Link from "next/link";
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	Eye,
	MoreVertical,
	Plus,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { PermissionGate } from "@/components/common/PermissionGate";
import { Search } from "@/components/search/Search";
import { TablePagination } from "@/components/table/TablePagination";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { PURCHASE_MODULE_BASE_URL } from "../data/purchaseNav.config";
import {
	usePurchaseSuppliers,
	type PurchaseSupplierSortField,
} from "../hooks/usePurchaseSuppliers";

const TH_CLASS =
	"py-3.5 px-4 text-xs font-semibold text-slate-600 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900";

const COLUMNS: {
	field: PurchaseSupplierSortField;
	label: TranslationKeys;
}[] = [
	{ field: "name", label: localizationConstants.purchaseSupplierColName },
	{ field: "orderer", label: localizationConstants.purchaseColOrderer },
	{ field: "postalCode", label: localizationConstants.orderPostNrLabel },
	{ field: "city", label: localizationConstants.orderCityLabel },
	{ field: "email", label: localizationConstants.orderMailLabel },
	{ field: "phone", label: localizationConstants.orderTelefonLabel },
];

export interface PurchaseSupplierListTabProps {
	/** Opens the price-list tab for a supplier. */
	onOpenPriceList?: (supplierId: string) => void;
}

export function PurchaseSupplierListTab({
	onOpenPriceList,
}: PurchaseSupplierListTabProps) {
	const { t } = useTranslation();
	const {
		paginatedSuppliers,
		totalPages,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		sortBy,
		sortOrder,
		handleSort,
	} = usePurchaseSuppliers();

	const renderSortIcon = (field: PurchaseSupplierSortField) => {
		if (sortBy !== field) {
			return (
				<ArrowUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
			);
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="ml-1 h-3.5 w-3.5 shrink-0 text-slate-900" />
		) : (
			<ArrowDown className="ml-1 h-3.5 w-3.5 shrink-0 text-slate-900" />
		);
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
				<div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center xl:w-auto">
					<Search
						value={searchQuery}
						onChange={(value) => {
							setSearchQuery(value);
							setCurrentPage(1);
						}}
						placeholder={localizationConstants.search}
						className="h-10 w-full"
						wrapperClassName="w-full sm:w-[240px] md:w-[260px] lg:w-[300px]"
					/>

					<Select
						value={statusFilter}
						onValueChange={(value) => {
							setStatusFilter(value);
							setCurrentPage(1);
						}}
					>
						<SelectTrigger className="h-10 w-full cursor-pointer border-slate-200 bg-white text-xs font-normal text-slate-700 shadow-2xs sm:w-[150px]">
							<SelectValue
								placeholder={t(
									localizationConstants.purchaseFilterLabel,
								)}
							/>
						</SelectTrigger>
						<SelectContent className="bg-white">
							<SelectItem value="all">
								<Translate
									text={localizationConstants.allStatus}
								/>
							</SelectItem>
							<SelectItem value="active">
								<Translate
									text={localizationConstants.activeStatus}
								/>
							</SelectItem>
							<SelectItem value="inactive">
								<Translate
									text={localizationConstants.inactiveStatus}
								/>
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<PermissionGate permission="CREATE_PURCHASE">
					<div className="flex w-full justify-start xl:w-auto xl:justify-end">
						<Link href="/tools/register/create-supplier">
							<Button className="h-10 w-full cursor-pointer justify-center gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 sm:w-auto">
								<Plus className="h-4 w-4" aria-hidden />
								<Translate
									text={
										localizationConstants.purchaseSupplierAdd
									}
								/>
							</Button>
						</Link>
					</div>
				</PermissionGate>
			</div>

			<div className="relative w-full overflow-x-auto bg-white">
				<Table className="w-full min-w-250 table-auto border-collapse">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
							{COLUMNS.map((column) => (
								<TableHead
									key={column.field}
									className={TH_CLASS}
									onClick={() => handleSort(column.field)}
								>
									<div className="flex items-center gap-1">
										<Translate text={column.label} />
										{renderSortIcon(column.field)}
									</div>
								</TableHead>
							))}
							<TableHead className="px-4 py-3.5 text-right font-medium whitespace-nowrap text-slate-600" />
							<TableHead className="sticky right-0 z-20 w-[60px] min-w-[60px] bg-white px-2 py-3.5 text-center text-xs font-semibold text-slate-600 shadow-[inset_1px_0_0_0_#e2e8f0]">
								<Translate
									text={localizationConstants.actionsHeader}
								/>
							</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{paginatedSuppliers.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={COLUMNS.length + 2}
									className="py-12 text-center text-sm text-slate-500"
								>
									<Translate
										text={
											localizationConstants.purchaseSupplierNoneFound
										}
									/>
								</TableCell>
							</TableRow>
						) : (
							paginatedSuppliers.map((supplier) => (
								<TableRow
									key={supplier.id}
									className="group border-b border-slate-100 transition-colors hover:bg-slate-50/60"
								>
									<TableCell className="px-4 py-3.5 text-sm font-semibold whitespace-nowrap text-slate-900">
										<Link
											href={`${PURCHASE_MODULE_BASE_URL}/suppliers/${encodeURIComponent(supplier.id)}`}
											className="hover:underline"
										>
											{supplier.name}
										</Link>
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm whitespace-nowrap text-slate-700">
										{supplier.orderer}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm whitespace-nowrap text-slate-700">
										{supplier.postalCode}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm whitespace-nowrap text-slate-700">
										{supplier.city}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm whitespace-nowrap text-slate-700">
										{supplier.email}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm whitespace-nowrap text-slate-700">
										{supplier.phone}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-right whitespace-nowrap">
										<Button
											type="button"
											size="sm"
											onClick={() =>
												onOpenPriceList?.(supplier.id)
											}
											className="h-8 cursor-pointer rounded-md bg-green-600 px-3 text-xs font-medium text-white shadow-2xs hover:bg-green-700"
										>
											<Translate
												text={
													localizationConstants.purchaseSupplierOpenPriceList
												}
											/>
										</Button>
									</TableCell>
									<TableCell className="sticky right-0 z-10 w-[50px] min-w-[50px] bg-white px-2 py-3.5 text-center shadow-[inset_1px_0_0_0_#e2e8f0] transition-colors group-hover:bg-slate-50">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 cursor-pointer rounded-md text-slate-500 hover:text-slate-900"
													aria-label={t(
														localizationConstants.actionsHeader,
													)}
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent
												align="end"
												className="w-40 rounded-md border border-slate-200 bg-white p-1 shadow-md"
											>
												<DropdownMenuItem asChild>
													<Link
														href={`${PURCHASE_MODULE_BASE_URL}/suppliers/${encodeURIComponent(supplier.id)}`}
														className="flex w-full cursor-pointer items-center gap-2 text-slate-700 hover:bg-slate-50"
													>
														<Eye className="h-4 w-4 text-slate-500" />
														<span>
															<Translate
																text={
																	localizationConstants.purchaseSupplierSeeDetails
																}
															/>
														</span>
													</Link>
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

			<TablePagination
				currentPage={currentPage}
				totalPages={totalPages}
				pageSize={pageSize}
				onPageChange={setCurrentPage}
				onPageSizeChange={(size) => {
					setPageSize(size);
					setCurrentPage(1);
				}}
			/>
		</div>
	);
}

export default PurchaseSupplierListTab;
