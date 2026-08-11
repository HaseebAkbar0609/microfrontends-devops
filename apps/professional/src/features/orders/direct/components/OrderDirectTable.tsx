"use client";

import Link from "next/link";
import {
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Eye,
	Pencil,
	Trash2,
	MoreVertical,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Plus,
} from "lucide-react";

import { Search } from "@/components/search/Search";
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
	DropdownMenuSeparator,
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
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useDirectOrders, type DirectOrderSortField } from "../hooks/useDirectOrders";
import { PermissionGate } from "@/components/common/PermissionGate";
import type { DirectOrderRow } from "../types/directOrder.types";

import { useTranslation } from "react-i18next";

export interface OrderDirectTableProps {
	onOpenCreateModal: () => void;
}

export function OrderDirectTable({ onOpenCreateModal }: OrderDirectTableProps) {
	const { t } = useTranslation();
	const {
		paginatedOrders,
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
		deleteDirectOrder,
	} = useDirectOrders();

	const renderSortIcon = (field: DirectOrderSortField) => {
		if (sortBy !== field) {
			return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50 shrink-0" />;
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="ml-1 h-3.5 w-3.5 text-slate-900 shrink-0" />
		) : (
			<ArrowDown className="ml-1 h-3.5 w-3.5 text-slate-900 shrink-0" />
		);
	};

	const renderStatusBadge = (status: DirectOrderRow["status"]) => {
		if (status === "pending") {
			return (
				<span className="inline-flex items-center rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20 ring-inset">
					<Translate text={localizationConstants.statusPending} />
				</span>
			);
		}
		if (status === "opened") {
			return (
				<span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
					<Translate text={localizationConstants.statusOpened} />
				</span>
			);
		}
		return (
			<span className="inline-flex items-center rounded-md bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-500/10 ring-inset">
				{status}
			</span>
		);
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Top Toolbar matching screenshot: Search + Single Filter dropdown */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3 w-full sm:w-auto">
					<Search
						value={searchQuery}
						onChange={(val) => {
							setSearchQuery(val);
							setCurrentPage(1);
						}}
						placeholder={localizationConstants.search}
						className="h-10 w-full"
						wrapperClassName="w-full sm:w-[240px] md:w-[260px] lg:w-[300px]"
					/>

					{/* Single Filter Dropdown matching screenshot */}
					<Select
						value={statusFilter}
						onValueChange={(val) => {
							setStatusFilter(val);
							setCurrentPage(1);
						}}
					>
						<SelectTrigger className="h-10 w-[120px] border-slate-200 bg-white text-xs font-normal text-slate-700 shadow-2xs cursor-pointer">
							<SelectValue placeholder={t(localizationConstants.filterAllStatuses) || "Filter"} />
						</SelectTrigger>
						<SelectContent className="bg-white">
							<SelectItem value="all">
								<Translate text={localizationConstants.filterAllStatuses} />
							</SelectItem>
							<SelectItem value="pending">
								<Translate text={localizationConstants.statusPending} />
							</SelectItem>
							<SelectItem value="opened">
								<Translate text={localizationConstants.statusOpened} />
							</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Create Direct Order button */}
				<PermissionGate permission="CREATE_ORDER">
					<Button
						onClick={onOpenCreateModal}
						className="h-10 gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 cursor-pointer"
					>
						<Plus className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.createDirectOrder} />
					</Button>
				</PermissionGate>
			</div>

			{/* Table without outer border container */}
			<div className="w-full overflow-x-auto relative bg-white">
				<Table className="w-full min-w-200 table-auto border-collapse">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
							<TableHead
								className="py-3.5 px-4 text-xs font-semibold text-slate-600 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900"
								onClick={() => handleSort("serialNo")}
							>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.serialNoHeader} />
									{renderSortIcon("serialNo")}
								</div>
							</TableHead>
							<TableHead
								className="py-3.5 px-4 text-xs font-semibold text-slate-600 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900"
								onClick={() => handleSort("orderName")}
							>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.orderName} />
									{renderSortIcon("orderName")}
								</div>
							</TableHead>
							<TableHead
								className="py-3.5 px-4 text-xs font-semibold text-slate-600 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900"
								onClick={() => handleSort("customer")}
							>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.orderCustomer} />
									{renderSortIcon("customer")}
								</div>
							</TableHead>
							<TableHead
								className="py-3.5 px-4 text-xs font-semibold text-slate-600 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900"
								onClick={() => handleSort("start")}
							>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.orderStart} />
									{renderSortIcon("start")}
								</div>
							</TableHead>
							<TableHead
								className="py-3.5 px-4 text-xs font-semibold text-slate-600 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900"
								onClick={() => handleSort("status")}
							>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.statusLabel} />
									{renderSortIcon("status")}
								</div>
							</TableHead>
							{/* Header cell without '+' icon */}
							<TableHead className="w-10 text-center py-3.5 px-2 text-xs font-semibold text-slate-600" />
							{/* Non-sticky See Order column */}
							<TableHead className="py-3.5 px-4 text-right whitespace-nowrap font-medium text-slate-600">
							</TableHead>
							{/* Action menu column */}
							<TableHead className="w-[50px] min-w-[50px] sticky right-0 bg-white shadow-[inset_1px_0_0_0_#e2e8f0] z-20 text-center py-3.5 px-2" />
						</TableRow>
					</TableHeader>

					<TableBody>
						{paginatedOrders.length === 0 ? (
							<TableRow>
								<TableCell colSpan={8} className="py-12 text-center text-sm text-slate-500">
									<Translate text={localizationConstants.noOrdersFound} />
								</TableCell>
							</TableRow>
						) : (
							paginatedOrders.map((order) => (
								<TableRow
									key={order.id}
									className="group border-b border-slate-100 transition-colors hover:bg-slate-50/60"
								>
									<TableCell className="px-4 py-3.5 text-sm font-normal text-slate-700 whitespace-nowrap">
										{order.serialNo}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm font-semibold text-slate-900 whitespace-nowrap">
										{order.orderName}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap">
										{order.customer}
									</TableCell>
									<TableCell className="px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap">
										{order.start}
									</TableCell>
									<TableCell className="px-4 py-3.5 whitespace-nowrap">
										{renderStatusBadge(order.status)}
									</TableCell>
									<TableCell className="px-2 py-3.5 text-center text-slate-400 text-xs">
									</TableCell>

									{/* Separate non-sticky See Order column */}
									<TableCell className="px-4 py-3.5 text-right whitespace-nowrap">
										<Link href={`/module/production/order/${encodeURIComponent(order.id)}`}>
											<Button
												variant="outline"
												size="sm"
												className="h-8 border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-md cursor-pointer shadow-2xs"
											>
												<Translate text={localizationConstants.seeOrderButton} />
											</Button>
										</Link>
									</TableCell>

									{/* Sticky Action dropdown menu column */}
									<TableCell className="w-[50px] min-w-[50px] sticky right-0 bg-white shadow-[inset_1px_0_0_0_#e2e8f0] transition-colors group-hover:bg-slate-50 z-10 text-center py-3.5 px-2">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 text-slate-500 hover:text-slate-900 rounded-md cursor-pointer"
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end" className="w-36 border border-slate-200 bg-white shadow-md rounded-md p-1">
												<PermissionGate permission="VIEW_ORDERS">
													<DropdownMenuItem asChild>
														<Link
															href={`/module/production/order/${encodeURIComponent(order.id)}`}
															className="flex items-center gap-2 cursor-pointer w-full text-slate-700 hover:bg-slate-50"
														>
															<Eye className="h-4 w-4 text-slate-500" />
															<span><Translate text={localizationConstants.actionView} /></span>
														</Link>
													</DropdownMenuItem>
												</PermissionGate>
												<PermissionGate permission="EDIT_ORDER">
													<DropdownMenuItem asChild>
														<Link
															href={`/module/production/order/${encodeURIComponent(order.id)}/edit`}
															className="flex items-center gap-2 cursor-pointer w-full text-slate-700 hover:bg-slate-50"
														>
															<Pencil className="h-4 w-4 text-slate-500" />
															<span><Translate text={localizationConstants.actionEdit} /></span>
														</Link>
													</DropdownMenuItem>
												</PermissionGate>
												<PermissionGate permission="DELETE_ORDER">
													<DropdownMenuSeparator />
													<DropdownMenuItem
														onClick={() => deleteDirectOrder(order.id)}
														className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
													>
														<Trash2 className="h-4 w-4 text-red-500" />
														<span><Translate text={localizationConstants.actionDelete} /></span>
													</DropdownMenuItem>
												</PermissionGate>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination Footer matching screenshot */}
			<div className="flex items-center justify-center sm:justify-end gap-6 py-2 px-1 text-sm text-slate-600 flex-wrap">
				<div className="flex items-center gap-2">
					<span className="text-sm font-medium text-slate-700">
						<Translate text={localizationConstants.rowsPerPage} />
					</span>
					<Select
						value={String(pageSize)}
						onValueChange={(val) => {
							setPageSize(Number(val));
							setCurrentPage(1);
						}}
					>
						<SelectTrigger className="h-9 w-18 border-slate-200 bg-transparent text-sm font-medium text-slate-700 hover:bg-slate-50 focus:ring-0">
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="bg-white">
							{[5, 10, 20, 30, 50].map((size) => (
								<SelectItem key={size} value={String(size)}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="text-sm font-medium text-slate-700 select-none flex items-center gap-1">
					<span><Translate text={localizationConstants.pageLabel} /></span>
					<span>{currentPage}</span>
					<span><Translate text={localizationConstants.ofLabel} /></span>
					<span>{totalPages}</span>
				</div>

				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="icon"
						className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
						disabled={currentPage <= 1}
						onClick={() => setCurrentPage(1)}
					>
						<ChevronsLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
						disabled={currentPage <= 1}
						onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
						disabled={currentPage >= totalPages}
						onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-9 w-9 rounded-md border border-slate-200 bg-transparent text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
						disabled={currentPage >= totalPages}
						onClick={() => setCurrentPage(totalPages)}
					>
						<ChevronsRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
