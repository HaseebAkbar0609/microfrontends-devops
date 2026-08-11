"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
	Plus,
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
import { useTranslation } from "react-i18next";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { MOCK_ORDERS } from "../data/orders.mock";
import { OrderStatusBadge, OrderTypeBadge } from "./OrderStatusBadge";
import type { OrderRow } from "../types/order.types";

type SortField =
	| "orderNo"
	| "orderName"
	| "customer"
	| "type"
	| "status"
	| "orderSum"
	| "projectManager"
	| "start"
	| "end";

export function OrderListTab() {
	const { t } = useTranslation();
	const [orders, setOrders] = useState<OrderRow[]>(MOCK_ORDERS);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [typeFilter, setTypeFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<SortField>("orderNo");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [pageSize, setPageSize] = useState<number>(10);
	const [currentPage, setCurrentPage] = useState<number>(1);

	const handleSort = (field: SortField) => {
		if (sortBy === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(field);
			setSortOrder("asc");
		}
	};

	const handleDeleteOrder = (orderId: string) => {
		setOrders((prev) => prev.filter((o) => o.id !== orderId));
	};

	const renderSortIcon = (field: SortField) => {
		if (sortBy !== field) {
			return (
				<ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50 shrink-0" />
			);
		}
		return sortOrder === "asc" ? (
			<ArrowUp className="ml-1 h-3.5 w-3.5 text-slate-900 shrink-0" />
		) : (
			<ArrowDown className="ml-1 h-3.5 w-3.5 text-slate-900 shrink-0" />
		);
	};

	const filteredAndSortedOrders = useMemo(() => {
		return orders
			.filter((order) => {
				const query = searchQuery.trim().toLowerCase();
				if (query) {
					const matchesOrderNo = order.orderNo.toLowerCase().includes(query);
					const matchesName = order.orderName.toLowerCase().includes(query);
					const matchesCustomer = order.customer.toLowerCase().includes(query);
					const matchesPM = order.projectManager.toLowerCase().includes(query);
					if (!matchesOrderNo && !matchesName && !matchesCustomer && !matchesPM) {
						return false;
					}
				}

				if (statusFilter !== "all" && order.status !== statusFilter) {
					return false;
				}

				if (typeFilter !== "all" && order.type !== typeFilter) {
					return false;
				}

				return true;
			})
			.sort((a, b) => {
				let valA = a[sortBy] || "";
				let valB = b[sortBy] || "";

				if (typeof valA === "string") valA = valA.toLowerCase();
				if (typeof valB === "string") valB = valB.toLowerCase();

				let comparison = 0;
				if (valA < valB) comparison = -1;
				if (valA > valB) comparison = 1;

				return sortOrder === "asc" ? comparison : -comparison;
			});
	}, [orders, searchQuery, statusFilter, typeFilter, sortBy, sortOrder]);

	const totalPages = Math.max(1, Math.ceil(filteredAndSortedOrders.length / pageSize));
	const paginatedOrders = useMemo(() => {
		const startIdx = (currentPage - 1) * pageSize;
		return filteredAndSortedOrders.slice(startIdx, startIdx + pageSize);
	}, [filteredAndSortedOrders, currentPage, pageSize]);

	return (
		<div className="flex flex-col gap-6">
			{/* Top Action & Search Bar */}
			<div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
				{/* Search & 2 Independent Filter Dropdowns */}
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
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

					{/* Dropdown 1: Status Filter */}
					<Select
						value={statusFilter}
						onValueChange={(val) => {
							setStatusFilter(val);
							setCurrentPage(1);
						}}
					>
						<SelectTrigger className="h-10 w-full sm:w-[150px] border-slate-200 bg-white text-xs font-normal text-slate-700 shadow-2xs cursor-pointer">
							<SelectValue placeholder={t(localizationConstants.filterAllStatuses)} />
						</SelectTrigger>
						<SelectContent className="bg-white">
							<SelectItem value="all"><Translate text={localizationConstants.filterAllStatuses} /></SelectItem>
							<SelectItem value="assigned"><Translate text={localizationConstants.statusAssigned} /></SelectItem>
							<SelectItem value="ongoing"><Translate text={localizationConstants.statusOngoing} /></SelectItem>
							<SelectItem value="completed"><Translate text={localizationConstants.statusCompleted} /></SelectItem>
							<SelectItem value="cancelled"><Translate text={localizationConstants.statusCancelled} /></SelectItem>
						</SelectContent>
					</Select>

					{/* Dropdown 2: Type Filter */}
					<Select
						value={typeFilter}
						onValueChange={(val) => {
							setTypeFilter(val);
							setCurrentPage(1);
						}}
					>
						<SelectTrigger className="h-10 w-full sm:w-[150px] border-slate-200 bg-white text-xs font-normal text-slate-700 shadow-2xs cursor-pointer">
							<SelectValue placeholder={t(localizationConstants.filterAllTypes)} />
						</SelectTrigger>
						<SelectContent className="bg-white">
							<SelectItem value="all"><Translate text={localizationConstants.filterAllTypes} /></SelectItem>
							<SelectItem value="ongoing"><Translate text={localizationConstants.typeOngoing} /></SelectItem>
							<SelectItem value="fixed_price"><Translate text={localizationConstants.typeFixedPrice} /></SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Create New Order Button */}
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto justify-start xl:justify-end">
					<Link href="/module/production/order/create">
						<Button
							className="h-10 w-full sm:w-auto gap-2 rounded-lg bg-[#111721] px-5 text-sm font-medium text-white shadow-2xs hover:bg-slate-800 justify-center cursor-pointer"
						>
							<Plus className="h-4 w-4" aria-hidden />
							<Translate text={localizationConstants.createOrderButton} />
						</Button>
					</Link>
				</div>
			</div>

			{/* Table without outer border container */}
			<div className="w-full overflow-x-auto relative bg-white">
				<Table className="w-full min-w-250 table-auto border-collapse">
					<TableHeader>
						<TableRow className="border-b border-slate-200 bg-white hover:bg-white">
							<TableHead
								className="py-3.5 px-4 text-xs font-semibold text-slate-600 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900"
								onClick={() => handleSort("orderNo")}
							>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.orderNumber} />
									{renderSortIcon("orderNo")}
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
								onClick={() => handleSort("type")}
							>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.orderType} />
									{renderSortIcon("type")}
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
							<TableHead
								className="py-3.5 px-4 text-xs font-semibold text-slate-600 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900"
								onClick={() => handleSort("orderSum")}
							>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.orderSum} />
									{renderSortIcon("orderSum")}
								</div>
							</TableHead>
							<TableHead
								className="py-3.5 px-4 text-xs font-semibold text-slate-600 transition-colors select-none whitespace-nowrap cursor-pointer hover:text-slate-900"
								onClick={() => handleSort("projectManager")}
							>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.orderProjectManager} />
									{renderSortIcon("projectManager")}
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
								onClick={() => handleSort("end")}
							>
								<div className="flex items-center gap-1">
									<Translate text={localizationConstants.orderEnd} />
									{renderSortIcon("end")}
								</div>
							</TableHead>
							{/* Separate non-sticky See Order button column */}
							<TableHead className="py-3.5 px-4 text-right whitespace-nowrap font-medium text-slate-600">
							</TableHead>
							{/* Sticky Actions column header */}
							<TableHead className="w-[60px] min-w-[60px] sticky right-0 bg-white shadow-[inset_1px_0_0_0_#e2e8f0] z-20 text-center py-3.5 px-2 text-xs font-semibold text-slate-600">
								<Translate text={localizationConstants.actionsHeader} />
							</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{paginatedOrders.map((order) => (
							<TableRow
								key={order.id}
								className="group border-b border-slate-100 transition-colors hover:bg-slate-50/60"
							>
								<TableCell className="px-4 py-3.5 text-sm font-normal text-slate-700 whitespace-nowrap">
									{order.orderNo}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm font-semibold text-slate-900 whitespace-nowrap">
									{order.orderName}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap">
									{order.customer}
								</TableCell>
								<TableCell className="px-4 py-3.5 whitespace-nowrap">
									<OrderTypeBadge type={order.type} />
								</TableCell>
								<TableCell className="px-4 py-3.5 whitespace-nowrap">
									<OrderStatusBadge status={order.status} />
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-900 whitespace-nowrap">
									{order.orderSum}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap">
									{order.projectManager}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap">
									{order.start}
								</TableCell>
								<TableCell className="px-4 py-3.5 text-sm text-slate-700 whitespace-nowrap">
									{order.end}
								</TableCell>
								{/* Separate non-sticky See Order column */}
								<TableCell className="px-4 py-3.5 text-right whitespace-nowrap">
									<Link href={`/module/production/order/${order.id}`}>
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
											<DropdownMenuItem asChild>
												<Link
													href={`/module/production/order/${order.id}`}
													className="flex items-center gap-2 cursor-pointer w-full text-slate-700 hover:bg-slate-50"
												>
													<Eye className="h-4 w-4 text-slate-500" />
													<span><Translate text={localizationConstants.actionView} /></span>
												</Link>
											</DropdownMenuItem>
											<DropdownMenuItem asChild>
												<Link
													href={`/module/production/order/${order.id}/edit`}
													className="flex items-center gap-2 cursor-pointer w-full text-slate-700 hover:bg-slate-50"
												>
													<Pencil className="h-4 w-4 text-slate-500" />
													<span><Translate text={localizationConstants.actionEdit} /></span>
												</Link>
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => handleDeleteOrder(order.id)}
												className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
											>
												<Trash2 className="h-4 w-4 text-red-500" />
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

			{/* Pagination Footer */}
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
