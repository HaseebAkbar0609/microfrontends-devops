"use client";

import { useCallback, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Eye, MoreHorizontal, Archive, Trash2 } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQueryParams } from "@/hooks/useQueryParams";
import { TablePagination } from "@/components/table/TablePagination";
import { Agreement, AgreementColumn, AgreementListTableProps } from "../types/agreement";
import { AGREEMENT_LIST_COLUMNS } from "../constants/agreementList";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { AGREEMENT_ROUTES } from "../constants/agreementDashboard";

const SortIconElement = ({
	field,
	sortBy,
	sortOrder,
}: {
	field: string;
	sortBy: string;
	sortOrder: string;
}) => {
	if (sortBy !== field)
		return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />;
	return sortOrder === "asc" ? (
		<ArrowUp className="ml-1 h-3.5 w-3.5 text-primary" />
	) : (
		<ArrowDown className="ml-1 h-3.5 w-3.5 text-primary" />
	);
};

function getStatusBadge(status: Agreement["status"]) {
	switch (status) {
		case "active":
			return (
				<Badge className="rounded-lg bg-emerald-500 text-white border-transparent font-semibold px-2.5 py-0.5 text-xs">
					<Translate text={localizationConstants.agreementOverviewStatusAktiv} />
				</Badge>
			);
		case "expired":
			return (
				<Badge className="rounded-lg bg-amber-400 text-white border-transparent font-semibold px-2.5 py-0.5 text-xs">
					<Translate text={localizationConstants.agreementOverviewStatusForfallna} />
				</Badge>
			);
		case "terminated":
			return (
				<Badge className="rounded-lg bg-slate-400 text-white border-transparent font-semibold px-2.5 py-0.5 text-xs">
					<Translate text={localizationConstants.agreementOverviewStatusAvslutade} />
				</Badge>
			);
		case "draft":
			return (
				<Badge className="rounded-lg bg-slate-200 text-slate-700 border-transparent font-semibold px-2.5 py-0.5 text-xs">
					<Translate text={localizationConstants.agreementOverviewStatusDraft} />
				</Badge>
			);
		case "sent":
			return (
				<Badge className="rounded-lg bg-blue-100 text-blue-700 border-transparent font-semibold px-2.5 py-0.5 text-xs">
					<Translate text={localizationConstants.agreementOverviewStatusSent} />
				</Badge>
			);
		default:
			return null;
	}
}

export interface AgreementOverviewTableProps extends AgreementListTableProps {
	onArchive?: (id: string) => void;
	onDelete?: (id: string) => void;
}

export function AgreementOverviewTable({ data, totalItems, onArchive, onDelete }: AgreementOverviewTableProps) {
	const { query, changeQueries } = useQueryParams();
	const router = useRouter();

	const sortBy = query.get("sort_by") || "";
	const sortOrder = query.get("sort_order") || "";
	const page = Number(query.get("page") || "1");
	const pageSize = Number(query.get("page_size") || "10");

	const handleSort = useCallback(
		(field: string) => {
			if (field === "actions" || field === "actionsMenu") return;

			let nextOrder: string | null = "asc";
			if (sortBy === field) {
				if (sortOrder === "asc") nextOrder = "desc";
				else if (sortOrder === "desc") {
					nextOrder = null;
				}
			}

			changeQueries({
				sort_by: nextOrder ? field : null,
				sort_order: nextOrder,
			});
		},
		[sortBy, sortOrder, changeQueries],
	);

	const renderCell = useCallback(
		(agreement: Agreement, columnKey: AgreementColumn["field"]) => {
			switch (columnKey) {
				case "idNumber":
					return (
						<span className="text-slate-900">
							{agreement.idNumber}
						</span>
					);
				case "object":
					return (
						<span className="text-slate-900">
							{agreement.object}
						</span>
					);
				case "department":
					return (
						<span className="text-slate-900">
							{agreement.department}
						</span>
					);
				case "counterparty":
					return (
						<span className="text-slate-900">
							{agreement.counterparty}
						</span>
					);
				case "startDate":
				case "endDate":
					return (
						<span className="text-slate-900">
							{agreement[columnKey]}
						</span>
					);
				case "actionDate":
					return (
						<span className="text-slate-900">
							{agreement.actionDate}
						</span>
					);
				case "status":
					return getStatusBadge(agreement.status);
				case "actions":
					return (
						<button
							type="button"
							className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-500 cursor-pointer"
							aria-label={localizationConstants.agreementOverviewViewAriaLabel}
							onClick={() => router.push(AGREEMENT_ROUTES.detail(agreement.id))}
						>
							<Eye className="h-4 w-4" />
						</button>
					);
				case "actionsMenu":
					return (
						<div className="flex items-center justify-end">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button
										type="button"
										className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-500 cursor-pointer"
										aria-label={localizationConstants.agreementOverviewMoreActionsAriaLabel}
									>
										<MoreHorizontal className="h-4 w-4 rotate-90" />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-40">
									<DropdownMenuItem 
										className="cursor-pointer gap-2"
										onClick={() => onArchive?.(agreement.id)}
									>
										<Archive className="h-4 w-4" />
										<Translate text={localizationConstants.agreementOverviewActionArchive} />
									</DropdownMenuItem>
									<DropdownMenuItem 
										className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
										onClick={() => onDelete?.(agreement.id)}
									>
										<Trash2 className="h-4 w-4" />
										<Translate text={localizationConstants.agreementOverviewActionDelete} />
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				default:
					return null;
			}
		},
		[router, onArchive, onDelete],
	);

	const totalPages = useMemo(
		() => Math.ceil(totalItems / pageSize),
		[totalItems, pageSize],
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="w-full bg-white rounded-md overflow-hidden">
				<div className="overflow-x-auto">
					<Table className="table-auto w-full min-w-250">
						<TableHeader>
							<TableRow className="hover:bg-transparent border-b border-slate-200">
								{AGREEMENT_LIST_COLUMNS.map((col) => (
									<TableHead
										key={col.field}
										className={cn(
											"select-none text-slate-500 font-medium py-4 px-5 h-auto whitespace-nowrap",
											col.sortable && "cursor-pointer",
											col.field === "actions" && "cursor-default w-12.5 border-none",
											col.field === "actionsMenu" && "cursor-default w-12.5 sticky right-0 bg-white z-20 shadow-[inset_1px_0_0_0_#e2e8f0]",
										)}
										onClick={() => col.sortable && handleSort(col.field)}
									>
										<div
											className={cn(
												"flex items-center",
												col.field === "actionsMenu" && "justify-end",
											)}
										>
											{col.field !== "actionsMenu" && col.label && (
												<Translate text={col.label} />
											)}
											{col.sortable && (
												<SortIconElement
													field={col.field}
													sortBy={sortBy}
													sortOrder={sortOrder}
												/>
											)}
										</div>
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.map((agreement, index) => (
								<TableRow
									key={agreement.id}
									className={cn(
										"hover:bg-slate-50/50",
										index === data.length - 1 ? "border-b! border-slate-200!" : "border-b border-slate-200",
									)}
								>
									{AGREEMENT_LIST_COLUMNS.map((col) => (
										<TableCell
											key={`${agreement.id}-${col.field}`}
											className={cn(
												"py-3 px-5 border-none",
												col.field === "actions" && "w-12.5",
												col.field === "actionsMenu" && "w-12.5 sticky right-0 bg-white z-10 shadow-[inset_1px_0_0_0_#e2e8f0]",
											)}
										>
											{renderCell(agreement, col.field)}
										</TableCell>
									))}
								</TableRow>
							))}
							{data.length === 0 && (
								<TableRow className="border-none">
									<TableCell
										colSpan={AGREEMENT_LIST_COLUMNS.length}
										className="h-32 text-center text-slate-500 border-none"
									>
										<Translate
											text={localizationConstants.agreementOverviewNoData}
										/>
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			<TablePagination
				currentPage={page}
				totalPages={totalPages}
				pageSize={pageSize}
				onPageChange={(newPage) =>
					changeQueries({ page: String(newPage) })
				}
				onPageSizeChange={(newSize) =>
					changeQueries({ page: "1", page_size: String(newSize) })
				}
			/>
		</div>
	);
}
